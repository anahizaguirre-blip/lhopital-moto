import { NextResponse } from 'next/server';
import { enviarCorreosConfirmacion } from '@/lib/pedidos-pago';

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

  // Mismo envío idempotente que usa el cobro con Mercado Pago: si ya se
  // mandó (correo_confirmacion_at), no se repite.
  const resultado = await enviarCorreosConfirmacion(record.id);
  return NextResponse.json({ ok: resultado !== 'error', resultado });
}
