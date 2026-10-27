/**
 * Configuración de Mercado Pago — solo servidor.
 *
 * Acepta los nombres del brief (NEXT_PUBLIC_MP_PUBLIC_KEY, MP_ACCESS_TOKEN)
 * y los de .env.local de pruebas (MP_PUBLIC_KEY_TEST, MP_ACCESS_TOKEN_TEST).
 * La public key se pasa al cliente como prop desde el servidor.
 */

export function mpPublicKey(): string | null {
  return (
    process.env.NEXT_PUBLIC_MP_PUBLIC_KEY ||
    process.env.MP_PUBLIC_KEY ||
    process.env.MP_PUBLIC_KEY_TEST ||
    null
  );
}

export function mpAccessToken(): string | null {
  return process.env.MP_ACCESS_TOKEN || process.env.MP_ACCESS_TOKEN_TEST || null;
}

export function mpWebhookSecret(): string | null {
  return process.env.MP_WEBHOOK_SECRET || null;
}

/** D1: pago de contado por defecto. Los MSI se activan en la cuenta de MP. */
export function mpMaxInstallments(): number {
  const n = parseInt(process.env.MP_MAX_INSTALLMENTS ?? '1', 10);
  return Number.isFinite(n) && n >= 1 ? Math.min(n, 24) : 1;
}
