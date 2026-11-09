'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { getOrderDetail } from '@/lib/orders-query';
import { getResend, EMAIL_FROM } from '@/lib/resend';
import { PedidoEnviadoEmail } from '@/emails/pedido-enviado';
import { PedidoListoRecogerEmail } from '@/emails/pedido-listo-recoger';

export interface CapturarEnvioState {
  error?: string;
  success?: boolean;
  avisoCorreo?: string;
}

export async function capturarEnvio(
  orderId: string,
  _prevState: CapturarEnvioState,
  formData: FormData
): Promise<CapturarEnvioState> {
  const paqueteria = String(formData.get('paqueteria') ?? '').trim();
  const numeroGuia = String(formData.get('numero_guia') ?? '').trim();
  const urlRastreo = String(formData.get('url_rastreo') ?? '').trim();

  if (!paqueteria || !numeroGuia) {
    return { error: 'Paquetería y número de guía son obligatorios.' };
  }

  const supabase = createSupabaseAdmin();

  const { error } = await supabase
    .from('orders')
    .update({
      paqueteria,
      numero_guia: numeroGuia,
      url_rastreo: urlRastreo || null,
      fecha_envio: new Date().toISOString(),
      estado: 'enviada',
    })
    .eq('id', orderId);

  if (error) {
    console.error('[admin/pedidos/[id]] update orders:', error.message);
    return { error: 'No se pudo guardar. Intenta de nuevo.' };
  }

  const order = await getOrderDetail(supabase, orderId);

  let avisoCorreo: string | undefined;

  if (order?.email_cliente) {
    try {
      // El SDK de Resend no truena en fallos de la API (dominio sin
      // verificar, límite de la cuenta, etc.) — devuelve { error } — así
      // que hay que revisarlo explícitamente en vez de asumir éxito.
      const { error: resendError } = await getResend().emails.send({
        from: EMAIL_FROM,
        to: order.email_cliente,
        subject: `Tu pedido ${order.numero_orden} va en camino`,
        react: <PedidoEnviadoEmail order={order} />,
      });
      if (resendError) {
        console.error('[admin/pedidos/[id]] Resend:', resendError);
        avisoCorreo = 'Se guardó la guía, pero no se pudo enviar el correo de rastreo.';
      }
    } catch (err) {
      // La guía ya se guardó — que Resend no esté configurado (o falle)
      // todavía no debe tirar la captura del admin.
      console.error('[admin/pedidos/[id]] envío de correo de rastreo:', err);
      avisoCorreo = 'Se guardó la guía, pero no se pudo enviar el correo de rastreo.';
    }
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath('/admin/pedidos');

  return { success: true, avisoCorreo };
}

// ── Cambio de estado manual (preparando / entregada) ────────────────────
// Flujo: pagada → preparando → (envío: se captura la guía → enviada) → entregada.
// Recolección en showroom: pagada → preparando → (aviso "listo para recoger") → entregada.

export interface CambiarEstadoState {
  error?: string;
  success?: boolean;
}

const SIGUIENTE: Record<string, { envio: string[]; recoleccion: string[] }> = {
  pagada: { envio: ['preparando'], recoleccion: ['preparando'] },
  preparando: { envio: [], recoleccion: ['entregada'] },
  enviada: { envio: ['entregada'], recoleccion: ['entregada'] },
};

export async function cambiarEstado(
  orderId: string,
  _prevState: CambiarEstadoState,
  formData: FormData
): Promise<CambiarEstadoState> {
  const nuevo = String(formData.get('estado') ?? '');
  const supabase = createSupabaseAdmin();

  const { data: actual, error: errorLectura } = await supabase
    .from('orders')
    .select('estado, metodo_entrega')
    .eq('id', orderId)
    .single();
  if (errorLectura || !actual) return { error: 'No se encontró el pedido.' };

  const tipo = actual.metodo_entrega === 'recoleccion' ? 'recoleccion' : 'envio';
  const permitidos = SIGUIENTE[actual.estado as string]?.[tipo] ?? [];
  if (!permitidos.includes(nuevo)) {
    return { error: `No se puede pasar de "${actual.estado}" a "${nuevo}".` };
  }

  // .eq('estado', …) evita pisar un cambio hecho al mismo tiempo por otra persona.
  const { data: actualizado, error } = await supabase
    .from('orders')
    .update({
      estado: nuevo,
      ...(nuevo === 'entregada' ? { fecha_entrega_real: new Date().toISOString() } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .eq('estado', actual.estado)
    .select('id');

  if (error) {
    console.error('[admin/pedidos/[id]] cambiar estado:', error.message);
    return { error: 'No se pudo guardar. Intenta de nuevo.' };
  }
  if (!actualizado?.length) return { error: 'El pedido cambió mientras tanto. Recarga la página.' };

  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath('/admin/pedidos');
  return { success: true };
}

// ── Aviso "listo para recoger" (solo recolección en showroom) ───────────
// No hay estado propio en la base: el pedido sigue en "preparando" y la fecha
// del aviso se guarda en fecha_envio (en recolección no se usa para otra cosa).

export async function avisarListoRecoger(
  orderId: string,
  _prevState: CambiarEstadoState,
  _formData: FormData
): Promise<CambiarEstadoState> {
  const supabase = createSupabaseAdmin();
  const order = await getOrderDetail(supabase, orderId);
  if (!order) return { error: 'No se encontró el pedido.' };
  if (order.metodo_entrega !== 'recoleccion') return { error: 'Este pedido no es de recolección en showroom.' };
  if (order.estado !== 'pagada' && order.estado !== 'preparando') {
    return { error: `El pedido está "${order.estado}"; solo se avisa cuando está pagado o preparándose.` };
  }
  if (!order.email_cliente) return { error: 'El pedido no tiene correo del cliente.' };

  const ahora = new Date();
  try {
    const { error: resendError } = await getResend().emails.send({
      from: EMAIL_FROM,
      to: order.email_cliente,
      subject: `Tu pedido Lhopital #${order.numero_orden} está listo para recoger`,
      react: <PedidoListoRecogerEmail order={order} avisadoEn={ahora} />,
    });
    if (resendError) {
      console.error('[admin/pedidos/[id]] Resend listo para recoger:', resendError);
      return { error: 'No se pudo enviar el correo. Intenta de nuevo.' };
    }
  } catch (err) {
    console.error('[admin/pedidos/[id]] envío listo para recoger:', err);
    return { error: 'No se pudo enviar el correo. Intenta de nuevo.' };
  }

  const { error } = await supabase
    .from('orders')
    .update({ estado: 'preparando', fecha_envio: ahora.toISOString(), updated_at: ahora.toISOString() })
    .eq('id', orderId);
  if (error) {
    console.error('[admin/pedidos/[id]] guardar aviso listo:', error.message);
    return { error: 'El correo se envió, pero no se pudo guardar la fecha del aviso.' };
  }

  revalidatePath(`/admin/pedidos/${orderId}`);
  revalidatePath('/admin/pedidos');
  return { success: true };
}
