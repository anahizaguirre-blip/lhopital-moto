import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { getOrderDetail } from '@/lib/orders-query';
import { getResend, EMAIL_FROM, EMAIL_COPIA_INTERNA } from '@/lib/resend';
import { PedidoConfirmadoEmail } from '@/emails/pedido-confirmado';

/**
 * Recibe el Database Webhook de Supabase sobre INSERT/UPDATE de `orders`.
 * Solo envía el correo de confirmación cuando el pedido *pasa a* pagada
 * (no en cada UPDATE posterior, como al capturar la guía de envío).
 *
 * Configurar en Supabase Studio → Database → Webhooks:
 *   tabla: orders · eventos: INSERT, UPDATE
 *   URL: <dominio>/api/webhooks/pedido-confirmado
 *   header: x-webhook-secret = SUPABASE_DB_WEBHOOK_SECRET
 */

interface SupabaseWebhookPayload {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: { id: string; estado: string } & Record<string, unknown>;
  old_record: ({ estado: string } & Record<string, unknown>) | null;
}

export async function POST(request: Request) {
  const secret = request.headers.get('x-webhook-secret');
  if (!secret || secret !== process.env.SUPABASE_DB_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  const payload = (await request.json()) as SupabaseWebhookPayload;
  const { type, record, old_record } = payload;

  const seAcabaDeConfirmar =
    record?.estado === 'pagada' && (type === 'INSERT' || old_record?.estado !== 'pagada');

  if (!seAcabaDeConfirmar) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const supabase = createSupabaseAdmin();
  const order = await getOrderDetail(supabase, record.id);

  if (!order) {
    return NextResponse.json({ ok: false, error: 'orden no encontrada' }, { status: 200 });
  }

  if (!order.email_cliente) {
    return NextResponse.json({ ok: false, error: 'orden sin email de cliente' }, { status: 200 });
  }

  const { data, error } = await getResend().emails.send({
    from: EMAIL_FROM,
    to: order.email_cliente,
    cc: EMAIL_COPIA_INTERNA,
    subject: `Tu pedido ${order.numero_orden} está confirmado`,
    react: <PedidoConfirmadoEmail order={order} />,
  });

  if (error) {
    // El SDK de Resend no truena en fallos de la API (dominio sin
    // verificar, límite de la cuenta, etc.) — devuelve { error } — así
    // que hay que revisarlo explícitamente en vez de asumir éxito.
    console.error('[webhooks/pedido-confirmado] Resend:', error);
    return NextResponse.json({ ok: false, error: error.message }, { status: 200 });
  }

  return NextResponse.json({ ok: true, id: data?.id });
}
