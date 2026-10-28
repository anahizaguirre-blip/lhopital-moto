/**
 * Acceso a una orden solo para quien la creó: al enviar el checkout se
 * guarda una cookie httpOnly con una firma HMAC del id de la orden; las
 * páginas de pago/confirmación y /api/pagos la verifican.
 *
 * Solo servidor.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

const DIAS = 14;

function secreto(): string {
  const base = process.env.ORDER_TOKEN_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base) throw new Error('Falta ORDER_TOKEN_SECRET');
  // Derivado con etiqueta propia: no se usa la service key tal cual.
  return createHmac('sha256', base).update('lhopital:orden-acceso:v1').digest('hex');
}

export function nombreCookieOrden(orderId: string): string {
  return `lh_orden_${orderId.replace(/-/g, '').slice(0, 16)}`;
}

export function firmarOrden(orderId: string): string {
  return createHmac('sha256', secreto()).update(orderId).digest('base64url');
}

export function verificarFirmaOrden(orderId: string, firma: string | undefined | null): boolean {
  if (!firma) return false;
  const esperada = Buffer.from(firmarOrden(orderId));
  const recibida = Buffer.from(firma);
  return esperada.length === recibida.length && timingSafeEqual(esperada, recibida);
}

export const OPCIONES_COOKIE_ORDEN = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: DIAS * 24 * 60 * 60,
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const esUuid = (v: unknown): v is string => typeof v === 'string' && UUID.test(v);
