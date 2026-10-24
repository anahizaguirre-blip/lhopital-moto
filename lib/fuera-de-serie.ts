/**
 * Fuera de Serie — piezas Hedon únicas (stock 1, sin bajo pedido, sin
 * personalización). Lógica compartida entre /tienda/hedon/fuera-de-serie
 * y el PDP en modo pieza única.
 */

import type { MotivoUnico, Product, ProductVariant } from '@/lib/types';

export const FUERA_DE_SERIE_HREF = '/tienda/hedon/fuera-de-serie';

// Columnas que necesitan la página y los avisos
export const SELECT_PIEZA_UNICA = `*, variants:product_variants(*), collection:collections(*)`;

export const SELLO_MOTIVO: Record<MotivoUnico, { sello: string; micro?: string }> = {
  dot: {
    sello: 'Especificación EE.UU. · DOT',
    micro: 'Certificación del Departamento de Transporte de Estados Unidos.',
  },
  electrico: { sello: 'Movilidad eléctrica · NTA 8776' },
  edicion_limitada: { sello: 'Edición limitada · DGR 2026' },
};

// Aviso obligatorio para el Edenist (NTA 8776)
export const AVISO_ELECTRICO_INTRO =
  'Diseñado para bicicletas eléctricas rápidas (hasta 45 km/h). ';
export const AVISO_ELECTRICO_FUERTE = 'No está certificado para uso en motocicleta.';

export type EstadoPieza = 'disponible' | 'precio_por_definir' | 'vendida';

/** La pieza tiene una sola variante; es la que manda en stock y precio. */
export function variantePieza(p: Product): ProductVariant | null {
  return p.variants?.[0] ?? null;
}

export function precioPieza(p: Product): number | null {
  const v = variantePieza(p);
  const precio = v?.precio ?? p.precio_base;
  return precio && precio > 0 ? precio : null;
}

export function estadoPieza(p: Product): EstadoPieza {
  const v = variantePieza(p);
  if (!v || v.stock_actual < 1) return 'vendida';
  if (precioPieza(p) === null) return 'precio_por_definir';
  return 'disponible';
}

/** Línea extra por pieza (solo Hedonist Ash hoy). */
export function notaExtra(p: Product): string | null {
  return p.familia === 'Hedonist' && p.color === 'Ash' ? 'Color descontinuado.' : null;
}

/**
 * Orden de la galería por pieza. DGR 2026: tres cuartos primero; el archivo
 * "-front" en realidad es una vista trasera en tres cuartos, así que va
 * segundo y con su etiqueta real.
 */
export function vistasPieza(p: Product): { orden: string[]; etiquetas?: Record<string, string> } | undefined {
  if (p.motivo_unico === 'edicion_limitada') {
    return {
      orden: ['threeQuarter', 'front', 'side', 'back'],
      etiquetas: { front: 'Tres cuartos trasera' },
    };
  }
  return undefined;
}

export const formatMXN = (n: number) => `$${n.toLocaleString('es-MX')}`;
