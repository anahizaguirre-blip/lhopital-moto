import { extractBasePath } from '@/lib/cloudinary';

/**
 * Solo servidor. Revisa qué vistas estándar (frente, tres cuartos, lado,
 * atrás) existen en Cloudinary para un casco, para no mostrar fotos rotas
 * cuando falta alguna (p.ej. el frente del Hedonist DGR 2026).
 */
const CLOUDINARY_BASE = 'https://res.cloudinary.com/lhopital-moto/image/upload';
const VISTAS = [
  { key: 'front', suffix: 'front' },
  { key: 'threeQuarter', suffix: 'three-quarter' },
  { key: 'side', suffix: 'side' },
  { key: 'back', suffix: 'back' },
];

export async function vistasExistentes(imagenPrincipal: string | null): Promise<string[]> {
  const base = extractBasePath(imagenPrincipal);
  if (!base) return [];
  const checks = await Promise.all(
    VISTAS.map(async (v) => {
      try {
        const res = await fetch(`${CLOUDINARY_BASE}/${base}-${v.suffix}`, {
          method: 'HEAD',
          next: { revalidate: 3600 },
        });
        return res.ok ? v.key : null;
      } catch {
        return v.key; // ante un error de red, mejor intentar mostrarla
      }
    })
  );
  return checks.filter((k): k is string => k !== null);
}
