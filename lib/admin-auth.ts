/**
 * Whitelist de acceso a /admin — dos personas por ahora (Anahí + JCC),
 * no amerita un sistema de roles todavía.
 */

export function getAdminAllowedEmails(): string[] {
  return (process.env.ADMIN_ALLOWED_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getAdminAllowedEmails().includes(email.trim().toLowerCase());
}
