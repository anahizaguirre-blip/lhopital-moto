/**
 * Texto legible de la certificación de un casco. En el Excel llega como
 * "ECE 22.06", "ECEDOT", "ECE 22.06 DOT", "DOT"…
 */
export function formatearCertificacion(cert: string | null | undefined): string | null {
  if (!cert) return null;
  const c = cert.toUpperCase();
  const ece = c.includes('ECE');
  const dot = c.includes('DOT');
  if (ece && dot) return 'ECE 22.06 · DOT';
  if (dot) return 'DOT';
  if (ece) return 'ECE 22.06';
  return cert;
}

/** Aclaración corta para la ficha técnica. */
export function detalleCertificacion(cert: string | null | undefined): string | null {
  if (!cert) return null;
  const c = cert.toUpperCase();
  const ece = c.includes('ECE');
  const dot = c.includes('DOT');
  if (ece && dot) return 'Doble certificación: europea y de EE.UU.';
  if (dot) return 'Certificación de EE.UU.';
  if (ece) return 'Certificación europea';
  return null;
}
