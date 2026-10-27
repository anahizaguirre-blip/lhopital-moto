/**
 * Reglas de venta online — compartidas por PDPs, carrito y checkout.
 *
 * - Cascos Hedon (no pieza única): se venden en stock y también bajo
 *   pedido con stock 0 (entrega hasta 90 días).
 * - Todo lo demás (accesorios Hedon, Moto II, Tees): solo existencias.
 *   Moto II y Tees no se resurten.
 * - Fuera de Serie: máximo 1 pieza, solo si hay stock y precio.
 *
 * El cliente usa esto para UX; el servidor lo vuelve a aplicar con datos
 * frescos de Supabase antes de crear la orden.
 */

export type Disponibilidad = 'en_stock' | 'bajo_pedido' | 'no_disponible';

/** Tope por línea para cascos bajo pedido (no hay stock que limite). */
export const MAX_BAJO_PEDIDO = 5;

export interface DatosVenta {
  marca: string;
  categoria: string;
  pieza_unica?: boolean | null;
  estado: string;
  stock_actual: number | null;
  precio: number | null;
  visible?: boolean;
}

export interface ReglaVenta {
  disponibilidad: Disponibilidad;
  maxCantidad: number;
}

export function esCasco(marca: string, categoria: string): boolean {
  return marca === 'hedon' && categoria === 'estrella';
}

export function reglaVenta(d: DatosVenta): ReglaVenta {
  const noDisponible = { disponibilidad: 'no_disponible', maxCantidad: 0 } as const;
  if (d.visible === false || !d.precio || d.precio <= 0) return noDisponible;

  const stock = Math.max(0, d.stock_actual ?? 0);
  if (stock > 0) {
    return { disponibilidad: 'en_stock', maxCantidad: d.pieza_unica ? 1 : stock };
  }

  if (esCasco(d.marca, d.categoria) && !d.pieza_unica && d.estado === 'bajo_pedido') {
    return { disponibilidad: 'bajo_pedido', maxCantidad: MAX_BAJO_PEDIDO };
  }

  return noDisponible;
}

export const ETIQUETA_DISPONIBILIDAD: Record<Disponibilidad, string> = {
  en_stock: 'En stock',
  bajo_pedido: 'Bajo pedido · entrega hasta 90 días',
  no_disponible: 'Sin existencias',
};

/** $12,345 MXN */
export function formatoMXN(n: number): string {
  return `$${Math.round(n).toLocaleString('es-MX')} MXN`;
}

// ─── Envío ────────────────────────────────────────────────────────────────

export type MetodoEntrega = 'envio' | 'recoleccion';

export const COSTO_ENVIO_CASCO = 400;
export const COSTO_ENVIO_SIN_CASCO = 200;

/**
 * Costo por pedido (Políticas de entrega 2026-10-26):
 * recolección $0 · envío con ≥1 casco $400 · envío sin casco $200.
 * El checkout lo calcula en el servidor; el cliente solo lo muestra.
 */
export function costoEnvio(metodo: MetodoEntrega, lineas: { esCasco: boolean }[]): number {
  if (metodo === 'recoleccion') return 0;
  return lineas.some((l) => l.esCasco) ? COSTO_ENVIO_CASCO : COSTO_ENVIO_SIN_CASCO;
}

export const SHOWROOM = {
  direccion:
    'Pedro Sainz de Baranda 139, Edificio T, Locación 25, Col. Los Cipreses, Coyoacán, C.P. 04830, CDMX',
  horario: 'Lunes a sábado 11:00–19:00, previa cita',
  aviso:
    'Te avisaremos por correo cuando tu pedido esté listo. Tienes 10 días naturales para recogerlo.',
} as const;
