/**
 * POST /api/webhooks/mercadopago — evento "Order (Mercado Pago)".
 *
 * 1. Valida x-signature (401 si no cuadra; no se guarda nada).
 * 2. Registra el evento en mp_webhook_events (x-request-id único →
 *    un reintento repetido responde 200 sin hacer nada más).
 * 3. No confía en el cuerpo: consulta GET /v1/orders/{id} a MP.
 * 4. Busca la orden por external_reference y verifica que el monto pagado
 *    sea igual a orders.total.
 * 5. processed/accredited → confirmarPago · canceled/failed → liberar_stock
 *    (expired → cancelada) · refunded → reembolsada (el stock lo decide el admin).
 * Responde rápido; ante un error devuelve 500 para que MP reintente.
 */

import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { mpWebhookSecret } from '@/lib/mp-config';
import { firmaValida } from '@/lib/mp-webhook';
import { clasificarOrden, obtenerOrden } from '@/lib/mp-orders';
import { confirmarPago } from '@/lib/pedidos-pago';
import { getResend, EMAIL_FROM, EMAIL_COPIA_INTERNA } from '@/lib/resend';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const url = new URL(req.url);
  const dataIdQuery = url.searchParams.get('data.id');
  const requestId = req.headers.get('x-request-id');
  const firma = req.headers.get('x-signature');

  const secret = mpWebhookSecret();
  if (!secret) {
    console.error('[webhook mp] falta MP_WEBHOOK_SECRET');
    return NextResponse.json({ error: 'not configured' }, { status: 500 });
  }

  const raw = await req.text();
  let body: { type?: string; action?: string; data?: { id?: string } } = {};
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    // cuerpo inválido: la firma decide igual
  }
  const dataId = dataIdQuery ?? body.data?.id ?? null;

  // 1. Firma
  if (!firmaValida({ secret, header: firma, requestId, dataId })) {
    return NextResponse.json({ error: 'invalid signature' }, { status: 401 });
  }

  const supabase = createSupabaseAdmin();
  const tipo = url.searchParams.get('type') ?? body.type ?? null;

  // 2. Registro / deduplicación
  const { data: evento, error: errEvento } = await supabase
    .from('mp_webhook_events')
    .insert({
      request_id: requestId ?? `${dataId}:${firma}`,
      mp_order_id: dataId,
      action: body.action ?? tipo,
      payload: body,
    })
    .select('id')
    .single();

  if (errEvento) {
    if (errEvento.code === '23505') return NextResponse.json({ ok: true, duplicado: true });
    console.error('[webhook mp] registro', errEvento.message);
    return NextResponse.json({ error: 'db' }, { status: 500 });
  }

  const cerrarEvento = (error: string | null = null) =>
    supabase
      .from('mp_webhook_events')
      .update({ processed_at: new Date().toISOString(), error })
      .eq('id', evento.id);

  try {
    if (tipo !== 'order' || !dataId) {
      await cerrarEvento('ignorado: no es evento de order');
      return NextResponse.json({ ok: true, ignorado: true });
    }

    // 3. Fuente de verdad: la API de MP
    const mpOrden = await obtenerOrden(dataId);
    if (!mpOrden) {
      // Order inexistente en MP (p. ej. "Simular notificación" del panel)
      await cerrarEvento(`order ${dataId} no existe en Mercado Pago`);
      return NextResponse.json({ ok: true, sinOrden: true });
    }

    // 4. Nuestra orden
    const ordenId = mpOrden.external_reference;
    const { data: orden } = ordenId
      ? await supabase.from('orders').select('id, numero_orden, estado, total, mp_order_id').eq('id', ordenId).maybeSingle()
      : { data: null };

    if (!orden) {
      await cerrarEvento(`orden no encontrada (external_reference=${ordenId ?? '—'})`);
      return NextResponse.json({ ok: true });
    }

    const pago = mpOrden.transactions?.payments?.[0];
    const { resultado, detalle } = clasificarOrden(mpOrden);
    const esUltimoIntento = !orden.mp_order_id || orden.mp_order_id === mpOrden.id;

    // 5. Estado
    if (resultado === 'approved') {
      const pagado = Number(mpOrden.total_paid_amount ?? pago?.paid_amount ?? mpOrden.total_amount);
      if (Math.abs(pagado - Number(orden.total)) > 0.009) {
        const msg = `monto pagado ${pagado} ≠ total ${orden.total}`;
        await cerrarEvento(msg);
        await avisoInterno(
          `Revisar pedido #${orden.numero_orden}: monto no coincide`,
          `Mercado Pago reporta ${pagado} MXN pagados (order ${mpOrden.id}), pero el pedido #${orden.numero_orden} es por ${orden.total} MXN. No se confirmó automáticamente.`
        );
        return NextResponse.json({ ok: true });
      }

      await confirmarPago(orden.id, {
        orderId: mpOrden.id,
        paymentId: pago?.id,
        status: mpOrden.status,
        statusDetail: detalle,
      });
    } else if (mpOrden.status === 'refunded') {
      await supabase
        .from('orders')
        .update({ estado: 'reembolsada', mp_status: 'refunded', mp_status_detail: detalle, updated_at: new Date().toISOString() })
        .eq('id', orden.id)
        .eq('estado', 'pagada');
    } else if (resultado === 'rejected' && esUltimoIntento && orden.estado === 'pago_pendiente') {
      // canceled / failed / expired del intento vigente
      await supabase.rpc('liberar_stock', { p_order_id: orden.id });
      await supabase
        .from('orders')
        .update({
          mp_status: mpOrden.status,
          mp_status_detail: detalle,
          ...(detalle === 'expired' ? { estado: 'cancelada' } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq('id', orden.id)
        .eq('estado', 'pago_pendiente');
    }
    // pending (processing / action_required): nada; llegará otro aviso.

    await cerrarEvento();
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[webhook mp]', dataId, msg);
    await cerrarEvento(msg);
    // Se permite que MP reintente: libera el request_id para no tomarlo como duplicado.
    await supabase.from('mp_webhook_events').update({ request_id: `${requestId}:fallo:${Date.now()}` }).eq('id', evento.id);
    return NextResponse.json({ error: 'processing' }, { status: 500 });
  }
}

async function avisoInterno(asunto: string, texto: string) {
  try {
    await getResend().emails.send({ from: EMAIL_FROM, to: EMAIL_COPIA_INTERNA, subject: asunto, text: texto });
  } catch (e) {
    console.error('[webhook mp] aviso interno', e instanceof Error ? e.message : e);
  }
}
