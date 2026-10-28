/**
 * URL pública del sitio para links absolutos (correos).
 * Prioridad: NEXT_PUBLIC_SITE_URL → dominio de producción que asigna
 * Vercel (cambia solo cuando se conecte lhopital.mx) → vercel.app.
 */
export function urlSitio(): string {
  const explicita = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicita) return explicita.replace(/\/$/, '');
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod}`;
  return 'https://lhopital-moto.vercel.app';
}
