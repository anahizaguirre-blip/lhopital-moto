/**
 * POST /api/pagos/procesar — cobra una orden con la API de Orders de MP.
 *
 * 1. Valida cuerpo (zod) y cookie de la orden; la orden debe estar en
 *    `pago_pendiente`.
 * 2. iniciar_intento_pago: suma un intento y bloquea un segundo envío
 *    simultáneo. Idempotency key = `${orderId}-${intento}`.
 * 3. reservar_stock: si algo ya se vendió, 409 y NO se cobra.
 * 4. Cobra el total de la orden guardado en Supabase (nunca el del cliente).
 * 5. Aprobado → confirmarPago · Rechazado → liberar_stock · Pendiente →
 *    se queda reservado y el webhook lo cierra.
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { esUuid, nombreCookieOrden, verificarFirmaOrden } from '@/lib/orden-acceso';
import { crearOrdenTarjeta, mensajeRechazo } from '@/lib/mp-orders';
import { mpMaxInstallments } from '@/lib/mp-config';
import { confirmarPago } from '@/lib/pedidos-pago';
import { getResend, EMAIL_FROM, EMAIL_COPIA_INTERNA } from '@/lib/resend';

export const dynamic = 'force-dynamic';

const Body = z.object({
  orderId: z.string().refine(esUuid, 'Orden inválida'),
  token: z.string().min(16).max(200),
  payment_method_id: z.string().min(2).max(40),
  payment_type: z.enum(['credit_card', 'debit_card']).catch('credit_card'),
  installments: z.coerce.number().int().min(1).max(24).catch(1),
  payer: z.object({ email: z.string().email().max(160) }).partial().optional(),
  last4: z.string().regex(/^\d{4}$/).optional().catch(undefined),
});

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return json({ error: 'Datos de pago incompletos. Intenta de nuevo.' }, 400);
  const datos = parsed.data;
  const { orderId } = datos;

  const jar = await cookies();
  if (!verificarFirmaOrden(orderId, jar.get(nombreCookieOrden(orderId))?.value)) {
    return json({ error: 'No pudimos verificar tu pedido. Vuelve a abrirlo desde el checkout.' }, 403);
  }

  const supabase = createSupabaseAdmin();
  const { data: orden } = await supabase
    .from('orders')
    .select('id, estado, total, email_invitado, customers(email)')
    .eq('id', orderId)
    .maybeSingle();

  if (!orden) return json({ error: 'No encontramos tu pedido.' }, 404);
  if (orden.estado === 'pagada') return json({ result: 'approved' });
  if (orden.estado !== 'pago_pendiente') return json({ error: 'Este pedido ya no se puede pagar.' }, 409);

  // 2. Intento + candado anti doble envío
  const { data: intento, error: errIntento } = await supabase.rpc('iniciar_intento_pago', { p_order_id: orderId });
  if (errIntento) {
    if (errIntento.message.includes('EN_PROCESO')) {
      return json({ error: 'Ya estamos procesando tu pago. Espera unos segundos.' }, 409);
    }
    console.error('[pagos] iniciar_intento', errIntento.message);
    return json({ error: 'No pudimos iniciar el pago. Intenta de nuevo.' }, 500);
  }

  const terminar = () => supabase.rpc('terminar_intento_pago', { p_order_id: orderId });

  // 3. Apartar stock antes de cobrar
  const { error: errReserva } = await supabase.rpc('reservar_stock', { p_order_id: orderId });
  if (errReserva) {
    await terminar();
    const m = errReserva.message.match(/SIN_STOCK:([^\s"]+)/);
    if (m) {
      const skus = m[1].split(',');
      const { data: items } = await supabase
        .from('order_items')
        .select('sku_snapshot, nombre_snapshot')
        .eq('order_id', orderId)
        .in('sku_snapshot', skus);
      return json(
        {
          error: `Esta pieza se acaba de vender: ${(items ?? []).map((i) => i.nombre_snapshot).join(', ') || skus.join(', ')}. No se hizo ningún cargo.`,
          agotado: skus,
        },
        409
      );
    }
    console.error('[pagos] reservar_stock', errReserva.message);
    return json({ error: 'No pudimos apartar tu pedido. Intenta de nuevo.' }, 500);
  }

  // 4. Cobro por el total guardado en Supabase
  const cliente = orden.customers as unknown as { email: string | null } | null;
  const email = datos.payer?.email || orden.email_invitado || cliente?.email || '';

  let mp;
  try {
    mp = await crearOrdenTarjeta({
      ordenId: orderId,
      total: Number(orden.total),
      email,
      cardToken: datos.token,
      paymentMethodId: datos.payment_method_id,
      paymentType: datos.payment_type,
      installments: Math.min(datos.installments, mpMaxInstallments()),
      idempotencyKey: `${orderId}-${intento}`,
    });
  } catch (e) {
    // Sin respuesta de MP: no sabemos si se cobró. Se deja reservado; el
    // webhook confirma si sí entró y el cron de abandonados libera si no.
    console.error('[pagos] MP sin respuesta', orderId, e instanceof Error ? e.message : e);
    await terminar();
    return json({ result: 'pending' });
  }

  console.info('[pagos]', orderId, 'intento', intento, '→', mp.httpStatus, mp.orden?.id, mp.orden?.status, mp.detalle);

  await supabase
    .from('orders')
    .update({
      mp_order_id: mp.orden?.id ?? null,
      mp_payment_id: mp.pago?.id ?? null,
      mp_status: mp.orden?.status ?? `http_${mp.httpStatus}`,
      mp_status_detail: mp.detalle,
      tarjeta_ultimos4: datos.last4 ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId);

  // 5. Resultado
  if (mp.resultado === 'approved') {
    try {
      await confirmarPago(orderId, {
        orderId: mp.orden?.id,
        paymentId: mp.pago?.id,
        status: mp.orden?.status,
        statusDetail: mp.detalle,
      });
    } catch (e) {
      // El cobro sí entró: el webhook reintentará la confirmación.
      console.error('[pagos] confirmarPago', orderId, e instanceof Error ? e.message : e);
    }
    return json({ result: 'approved' });
  }

  if (mp.resultado === 'pending') {
    await terminar();
    return json({ result: 'pending' });
  }

  await supabase.rpc('liberar_stock', { p_order_id: orderId });
  await terminar();

  // 401/403 sin order: Mercado Pago no autorizó la llamada (credenciales o
  // cuenta), no fue el banco. Mensaje honesto al cliente + aviso interno.
  if (!mp.orden && (mp.httpStatus === 401 || mp.httpStatus === 403)) {
    console.error('[pagos] MP no autorizó la llamada', orderId, mp.httpStatus);
    await avisoInterno(
      'Pago bloqueado por Mercado Pago (revisar credenciales)',
      `Mercado Pago respondió ${mp.httpStatus} al intentar cobrar el pedido ${orderId}. No se hizo cargo. Revisa las credenciales de producción y el tipo de integración de la app en Mercado Pago.`
    );
    return json({
      result: 'rejected',
      reason: 'No pudimos procesar el pago en este momento. No se hizo ningún cargo. Intenta más tarde o escríbenos a contacto@lhopital.mx.',
    });
  }

  return json({ result: 'rejected', reason: mensajeRechazo(mp.detalle) });
}

async function avisoInterno(asunto: string, texto: string) {
  try {
    await getResend().emails.send({ from: EMAIL_FROM, to: EMAIL_COPIA_INTERNA, subject: asunto, text: texto });
  } catch (e) {
    console.error('[pagos] aviso interno', e instanceof Error ? e.message : e);
  }
}
