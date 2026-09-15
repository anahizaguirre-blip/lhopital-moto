'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseAdmin } from '@/lib/supabase/admin';

export interface DiaBloqueadoState {
  error?: string;
}

const MAX_DIAS_RANGO = 60;

export async function agregarDiaBloqueado(
  _prevState: DiaBloqueadoState,
  formData: FormData
): Promise<DiaBloqueadoState> {
  const desde = String(formData.get('desde') ?? '').trim();
  const hasta = String(formData.get('hasta') ?? desde).trim();
  const motivo = String(formData.get('motivo') ?? '').trim() || null;

  if (!desde) {
    return { error: 'Elige al menos la fecha de inicio.' };
  }
  if (hasta < desde) {
    return { error: 'La fecha final no puede ser antes de la inicial.' };
  }

  const fechas: string[] = [];
  const cursor = new Date(`${desde}T00:00:00Z`);
  const fin = new Date(`${hasta}T00:00:00Z`);
  while (cursor <= fin) {
    fechas.push(cursor.toISOString().slice(0, 10));
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  if (fechas.length > MAX_DIAS_RANGO) {
    return { error: `Ese rango es de ${fechas.length} días — el máximo es ${MAX_DIAS_RANGO}.` };
  }

  const supabase = createSupabaseAdmin();
  // upsert (no insert) porque un rango puede traslaparse con fechas que ya
  // estaban bloqueadas individualmente — en vez de tronar por el choque del
  // unique constraint, simplemente actualiza el motivo de esas fechas.
  const { error } = await supabase
    .from('showroom_dias_bloqueados')
    .upsert(
      fechas.map((fecha) => ({ fecha, motivo })),
      { onConflict: 'fecha' }
    );

  if (error) {
    console.error('[admin/citas/bloqueados] agregar:', error);
    return { error: 'No se pudo bloquear el rango.' };
  }

  revalidatePath('/admin/citas/bloqueados');
  return {};
}

export async function quitarDiasBloqueados(ids: string[]): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from('showroom_dias_bloqueados').delete().in('id', ids);
  if (error) console.error('[admin/citas/bloqueados] quitar:', error);
  revalidatePath('/admin/citas/bloqueados');
}
