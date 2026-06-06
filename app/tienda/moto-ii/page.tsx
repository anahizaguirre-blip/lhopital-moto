/**
 * Página índice de la Tienda Moto II
 * URL: /tienda/moto-ii
 *
 * Server Component que carga dispositivos y accesorios Moto II desde Supabase.
 * Arquitectura distinta a Hedon: no hay PDPs por color.
 * El selector de color y el cross-sell viven en esta misma página.
 */

import { createSupabaseServer } from '@/lib/supabase/server';
import type { Product } from '@/lib/types';
import { TiendaMotoII } from '@/app/components/motoii/tienda/TiendaMotoII';

export const metadata = {
  title: 'Tienda Moto II · Lhopital-moto',
  description:
    'Beeline Moto II — el navegador satelital más usado de Reino Unido, ahora en México. Dispositivos y accesorios oficiales.',
};

export const revalidate = 60;

export default async function TiendaMotoIIPage() {
  const supabase = createSupabaseServer();

  // Cargar dispositivos (los 3 colores del Moto II)
  const { data: dispositivos, error: errorDispositivos } = await supabase
    .from('products')
    .select(`
      *,
      variants:product_variants(*)
    `)
    .eq('marca', 'moto_ii')
    .eq('visible_publico', true)
    .eq('categoria', 'estrella')
    .order('precio_base', { ascending: true });

  if (errorDispositivos) {
    console.error('Error cargando dispositivos Moto II:', errorDispositivos);
  }

  // Cargar accesorios (montajes, carry case) y adaptador V1
  const { data: accesorios, error: errorAccesorios } = await supabase
    .from('products')
    .select(`
      *,
      variants:product_variants(*)
    `)
    .eq('marca', 'moto_ii')
    .eq('visible_publico', true)
    .in('categoria', ['add_on_simple', 'rescate_transicion'])
    .order('precio_base', { ascending: true });

  if (errorAccesorios) {
    console.error('Error cargando accesorios Moto II:', errorAccesorios);
  }

  const dispositivoList = (dispositivos as Product[]) || [];
  const accesorioList = (accesorios as Product[]) || [];

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F1EC]">
      <TiendaMotoII
        dispositivos={dispositivoList}
        accesorios={accesorioList}
      />
    </main>
  );
}
