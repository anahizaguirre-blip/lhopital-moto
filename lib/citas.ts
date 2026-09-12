/**
 * Constantes y lógica de disponibilidad compartidas entre el formulario
 * público (/citas) y el panel admin (/admin/citas).
 */

import type { SupabaseClient } from '@supabase/supabase-js';

export const MARCAS_INTERES = ['Moto II', 'Hedon', 'Tees'] as const;
export type MarcaInteres = (typeof MARCAS_INTERES)[number];

export const MODELOS_HEDON = ['Psilo Explorer', 'Heroine Racer', 'Hedonist', 'Epicurist 2.0'] as const;

// El brief no especifica el set de tallas para cascos Hedon — se usan tallas
// estándar de letra. Ajustar aquí si Anahí quiere otro criterio.
export const TALLAS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'] as const;

export type Bloque = 'manana' | 'tarde';

export const BLOQUES: Record<Bloque, { label: string; hora: string }> = {
  manana: { label: 'Mañana (11:00–14:00)', hora: '11:00' },
  tarde: { label: 'Tarde (16:00–19:00)', hora: '16:00' },
};

export type EstadoCita = 'pendiente' | 'confirmada' | 'cancelada';

// Horizonte del calendario que se ofrece en el formulario público.
export const VENTANA_DIAS = 60;

export function esDomingo(fecha: Date): boolean {
  return fecha.getUTCDay() === 0;
}

export function toISODate(fecha: Date): string {
  return fecha.toISOString().slice(0, 10);
}

/**
 * Formatea una fecha "sin hora" (columna `date`, ej. "2026-09-15") de forma
 * segura ante timezone: `new Date(iso)` interpreta ese string como medianoche
 * UTC, y formatearlo con la zona local del servidor puede mostrar el día
 * anterior si esa zona va detrás de UTC. Construir el Date a partir de sus
 * componentes locales evita el corrimiento.
 */
export function formatFechaSolo(fechaISO: string): string {
  const [y, m, d] = fechaISO.split('-').map(Number);
  return new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }).format(
    new Date(y, m - 1, d)
  );
}

export type DisponibilidadPorFecha = Record<string, { manana: boolean; tarde: boolean }>;

/**
 * Calcula, para el rango [desde, hasta], qué fechas están bloqueadas por
 * completo y qué bloques siguen libres en las que no lo están.
 *
 * Un bloque deja de estar disponible si ya existe una cita en estado
 * 'pendiente' o 'confirmada' para esa fecha+bloque — una solicitud pendiente
 * ya reserva el horario, para que dos personas no pidan el mismo bloque
 * mientras se revisa la primera (sección 3 del brief).
 */
export async function getDisponibilidad(
  supabase: SupabaseClient,
  desde: Date,
  hasta: Date
): Promise<{ bloqueadas: Set<string>; disponibilidad: DisponibilidadPorFecha }> {
  const desdeISO = toISODate(desde);
  const hastaISO = toISODate(hasta);

  const [{ data: diasBloqueados }, { data: citasActivas }] = await Promise.all([
    supabase
      .from('showroom_dias_bloqueados')
      .select('fecha')
      .gte('fecha', desdeISO)
      .lte('fecha', hastaISO),
    supabase
      .from('citas_showroom')
      .select('fecha, bloque')
      .in('estado', ['pendiente', 'confirmada'])
      .gte('fecha', desdeISO)
      .lte('fecha', hastaISO),
  ]);

  const bloqueadas = new Set<string>((diasBloqueados ?? []).map((d) => d.fecha as string));

  const disponibilidad: DisponibilidadPorFecha = {};
  for (let d = new Date(desde); d <= hasta; d.setUTCDate(d.getUTCDate() + 1)) {
    const iso = toISODate(d);
    if (esDomingo(d) || bloqueadas.has(iso)) continue;
    disponibilidad[iso] = { manana: true, tarde: true };
  }

  for (const cita of citasActivas ?? []) {
    const fila = disponibilidad[cita.fecha as string];
    if (fila) fila[cita.bloque as Bloque] = false;
  }

  return { bloqueadas, disponibilidad };
}
