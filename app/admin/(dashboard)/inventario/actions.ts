'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { createSupabaseAuthServer } from '@/lib/supabase/auth-server';
import { isAllowedAdminEmail } from '@/lib/admin-auth';

export interface AjusteState {
  ok?: string;
  error?: string;
}

const MOTIVOS = {
  recepcion: { tipo: 'recepcion_embarque', texto: 'Llegó mercancía' },
  conteo: { tipo: 'ajuste_manual', texto: 'Ajuste por conteo físico' },
  dano: { tipo: 'baja_por_daño', texto: 'Baja por daño' },
} as const;

/**
 * Fija el stock de una variante y lo registra en stock_movements.
 * Si alguien vendió entre que se abrió la página y se guardó, no pisa ese
 * cambio: pide recargar.
 */
export async function ajustarStock(_prev: AjusteState, formData: FormData): Promise<AjusteState> {
  const auth = await createSupabaseAuthServer();
  const {
    data: { user },
  } = await auth.auth.getUser();
  if (!user || !isAllowedAdminEmail(user.email)) return { error: 'Sin permiso.' };

  const variantId = String(formData.get('variant_id') ?? '');
  const anterior = Number(formData.get('stock_anterior'));
  const nuevo = Number(formData.get('stock_nuevo'));
  const motivo = String(formData.get('motivo') ?? '') as keyof typeof MOTIVOS;

  if (!variantId || !Number.isInteger(nuevo) || nuevo < 0 || nuevo > 9999) {
    return { error: 'Escribe una cantidad entera entre 0 y 9999.' };
  }
  if (!MOTIVOS[motivo]) return { error: 'Elige un motivo.' };
  if (nuevo === anterior) return { error: 'Es la misma cantidad.' };

  const supabase = createSupabaseAdmin();

  // Solo actualiza si el stock sigue siendo el que se vio en pantalla
  const { data: actualizada, error } = await supabase
    .from('product_variants')
    .update({ stock_actual: nuevo, updated_at: new Date().toISOString() })
    .eq('id', variantId)
    .eq('stock_actual', anterior)
    .select('sku_variante')
    .maybeSingle();

  if (error) {
    console.error('[admin/inventario]', error.message);
    return { error: 'No se pudo guardar. Intenta de nuevo.' };
  }
  if (!actualizada) return { error: 'El stock cambió mientras tanto (quizá hubo una venta). Recarga la página.' };

  // Las Tees también viven en la tabla `tees` (la que lee /tienda/tees)
  await supabase.from('tees').update({ stock: nuevo, updated_at: new Date().toISOString() }).eq('sku_variante', actualizada.sku_variante);

  const { error: errMov } = await supabase.from('stock_movements').insert({
    variant_id: variantId,
    tipo: MOTIVOS[motivo].tipo,
    cantidad: nuevo - anterior,
    stock_anterior: anterior,
    stock_nuevo: nuevo,
    usuario_id: user.id,
    notas: `${MOTIVOS[motivo].texto} · admin (${user.email})`,
  });
  if (errMov) console.error('[admin/inventario] historial', errMov.message);

  revalidatePath('/admin/inventario');
  return { ok: `Guardado: ${anterior} → ${nuevo}` };
}
