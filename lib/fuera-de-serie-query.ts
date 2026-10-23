import { createSupabaseServer } from '@/lib/supabase/server';
import type { Product } from '@/lib/types';
import { SELECT_PIEZA_UNICA, estadoPieza } from '@/lib/fuera-de-serie';

/** Todas las piezas Fuera de Serie visibles, vendidas incluidas. */
export async function getPiezasUnicas(): Promise<Product[]> {
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from('products')
    .select(SELECT_PIEZA_UNICA)
    .eq('marca', 'hedon')
    .eq('pieza_unica', true)
    .eq('visible_publico', true)
    .order('familia', { ascending: true });
  if (error) console.error('Error cargando piezas Fuera de Serie:', error);
  return (data as Product[]) || [];
}

export function contarDisponibles(piezas: Product[]): number {
  return piezas.filter((p) => estadoPieza(p) !== 'vendida').length;
}
