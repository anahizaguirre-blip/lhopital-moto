'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { getOrderDetail } from '@/lib/orders-query';
import { getResend, EMAIL_FROM } from '@/lib/resend';
import { PedidoEnviadoEmail } from '@/emails/pedido-enviado';

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
