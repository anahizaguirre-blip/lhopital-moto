'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseAdmin } from '@/lib/supabase/admin';

export interface DiaBloqueadoState {
  error?: string;
}

export async function agregarDiaBloqueado(
  _prevState: DiaBloqueadoState,
  formData: FormData
): Promise<DiaBloqueadoState> {
  const fecha = String(formData.get('fecha') ?? '').trim();
  const motivo = String(formData.get('motivo') ?? '').trim() || null;

  if (!fecha) {
    return { error: 'Elige una fecha.' };
  }

  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from('showroom_dias_bloqueados').insert({ fecha, motivo });

  if (error) {
    if (error.code === '23505') {
      return { error: 'Esa fecha ya está bloqueada.' };
    }
    console.error('[admin/citas/bloqueados] agregar:', error);
    return { error: 'No se pudo bloquear la fecha.' };
  }

  revalidatePath('/admin/citas/bloqueados');
  return {};
}

export async function quitarDiaBloqueado(id: string): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from('showroom_dias_bloqueados').delete().eq('id', id);
  if (error) console.error('[admin/citas/bloqueados] quitar:', error);
  revalidatePath('/admin/citas/bloqueados');
}
