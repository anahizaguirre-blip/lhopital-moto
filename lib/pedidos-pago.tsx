/**
 * Confirmación de pago y correos — compartido por /api/pagos/procesar,
 * el webhook de Mercado Pago y el webhook de base de datos.
 *
 * Solo servidor.
 */

import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { getOrderDetail } from '@/lib/orders-query';
import { getResend, EMAIL_FROM, EMAIL_COPIA_INTERNA } from '@/lib/resend';
import { PedidoConfirmadoEmail } from '@/emails/pedido-confirmado';

/**
 * Idempotente: la base solo pasa la orden a `pagada` si seguía en
 * `pago_pendiente`, y convierte la reserva de stock en venta (sin volver
 * a descontar). Los correos se mandan una sola vez.
 */
export async function confirmarPago(
  orderId: string,
  mp: { orderId?: string | null; paymentId?: string | null; status?: string | null; statusDetail?: string | null }
): Promise<{ confirmadaAhora: boolean }> {
  const supabase = createSupabaseAdmin();
  const { data, error } = await supabase.rpc('confirmar_pago_db', {
    p_order_id: orderId,
    p_mp_order_id: mp.orderId ?? null,
    p_mp_payment_id: mp.paymentId ?? null,
    p_mp_status: mp.status ?? null,
    p_mp_status_detail: mp.statusDetail ?? null,
  });
  if (error) throw new Error(`confirmar_pago_db: ${error.message}`);

  // Aunque ya estuviera confirmada, intenta el correo por si falló antes.
  await enviarCorreosConfirmacion(orderId);
  return { confirmadaAhora: data === true };
}

/**
 * Manda la confirmación al cliente (con copia interna) una sola vez:
 * reclama `correo_confirmacion_at` de forma atómica; si otro proceso ya lo
 * reclamó, no hace nada. Si Resend falla, libera el reclamo para reintentar.
 */
export async function enviarCorreosConfirmacion(orderId: string): Promise<'enviado' | 'ya_enviado' | 'error'> {
  const supabase = createSupabaseAdmin();

  const { data: reclamo } = await supabase
    .from('orders')
    .update({ correo_confirmacion_at: new Date().toISOString() })
    .eq('id', orderId)
    .eq('estado', 'pagada')
    .is('correo_confirmacion_at', null)
    .select('id')
    .maybeSingle();

  if (!reclamo) return 'ya_enviado';

  const liberar = () =>
    supabase.from('orders').update({ correo_confirmacion_at: null }).eq('id', orderId);

  try {
    const order = await getOrderDetail(supabase, orderId);
    if (!order?.email_cliente) {
      await liberar();
      return 'error';
    }

    const { error } = await getResend().emails.send({
      from: EMAIL_FROM,
      to: order.email_cliente,
      cc: EMAIL_COPIA_INTERNA,
      subject: `Tu pedido Lhopital #${order.numero_orden} está confirmado`,
      react: <PedidoConfirmadoEmail order={order} />,
    });

    if (error) {
      console.error('[correo confirmación] Resend:', error.message);
      await liberar();
      return 'error';
    }
    return 'enviado';
  } catch (e) {
    console.error('[correo confirmación]', e instanceof Error ? e.message : e);
    await liberar();
    return 'error';
  }
}
