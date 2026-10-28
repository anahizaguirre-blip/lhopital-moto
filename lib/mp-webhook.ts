/**
 * Validación de `x-signature` de los webhooks de Mercado Pago.
 * Misma lógica que el SDK oficial (mercadopago 3.6, utils/webhook):
 *   manifest = "id:<data.id>;request-id:<x-request-id>;ts:<ts>;"
 *   (se omite cada par cuyo valor falte) · HMAC-SHA256 hex · comparación
 *   en tiempo constante contra v1.
 *
 * Solo servidor.
 */

import { createHmac, timingSafeEqual } from 'node:crypto';

export function parsearFirma(header: string | null): { ts?: string; v1?: string } {
  const out: { ts?: string; v1?: string } = {};
  for (const parte of (header ?? '').split(',')) {
    const i = parte.indexOf('=');
    if (i === -1) continue;
    const k = parte.slice(0, i).trim().toLowerCase();
    const v = parte.slice(i + 1).trim();
    if (k === 'ts') out.ts = v;
    if (k === 'v1') out.v1 = v;
  }
  return out;
}

export function manifiesto(dataId: string | null, requestId: string | null, ts: string): string {
  const partes: string[] = [];
  if (dataId) partes.push(`id:${dataId}`);
  if (requestId) partes.push(`request-id:${requestId}`);
  partes.push(`ts:${ts}`);
  return partes.join(';') + ';';
}

function hmac(secret: string, texto: string): string {
  return createHmac('sha256', secret).update(texto).digest('hex');
}

function iguales(a: string, b: string): boolean {
  const A = Buffer.from(a);
  const B = Buffer.from(b);
  return A.length === B.length && timingSafeEqual(A, B);
}

export function firmaValida(params: {
  secret: string;
  header: string | null;
  requestId: string | null;
  dataId: string | null;
}): boolean {
  const { ts, v1 } = parsearFirma(params.header);
  if (!ts || !v1) return false;
  const candidatos = [params.dataId];
  // Docs antiguas pedían data.id en minúsculas; el SDK actual usa el valor tal cual.
  if (params.dataId && params.dataId !== params.dataId.toLowerCase()) candidatos.push(params.dataId.toLowerCase());
  return candidatos.some((id) => iguales(hmac(params.secret, manifiesto(id ?? null, params.requestId, ts)), v1));
}

/** Para pruebas locales: genera un header x-signature válido. */
export function firmarParaPrueba(secret: string, dataId: string, requestId: string, ts: string): string {
  return `ts=${ts},v1=${hmac(secret, manifiesto(dataId, requestId, ts))}`;
}
