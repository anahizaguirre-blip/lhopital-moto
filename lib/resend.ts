import { Resend } from 'resend';

/**
 * El SDK de Resend valida la key en el constructor y truena de inmediato
 * si falta — por eso se crea perezosamente (dentro de un try/catch en el
 * caller) en vez de una sola vez a nivel de módulo. RESEND_API_KEY sigue
 * pendiente de Anahí, así que esto es el estado normal por ahora.
 */
export function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

export const EMAIL_FROM = 'Lhopital Moto <ordenes@lhopital.mx>';
export const EMAIL_COPIA_INTERNA = ['ordenes@lhopital.mx'];
