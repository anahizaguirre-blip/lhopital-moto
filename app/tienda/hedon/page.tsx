/**
 * Página índice de la Tienda Hedon
 * URL: /tienda/hedon
 *
 * Server Component que carga todos los cascos Hedon disponibles desde Supabase
 * y los renderiza en un grid filtrable.
 */

import { createSupabaseServer } from '@/lib/supabase/server';
import type { Product, Collection } from '@/lib/types';
import { ProductGrid } from '@/app/components/tienda/ProductGrid';
import Link from 'next/link';

export const metadata = {
  title: 'Tienda Hedon · Lhopital-moto',
  description: 'Cascos Hedon de Reino Unido, curados por Lhopital-moto. Hedonist, Epicurist 2.0, Heroine Racer 2.0 y Psilo Explorer.',
};

// Revalida cada 60 segundos para que cambios de stock se reflejen sin redeploy
export const revalidate = 60;

export default async function TiendaHedonPage() {
  const supabase = createSupabaseServer();

  // Cargar todos los productos Hedon visibles
  const { data: products, error: productsError } = await supabase
    .from('products')
    .select(`
      *,
      variants:product_variants(*),
      collection:collections(*)
    `)
    .eq('marca', 'hedon')
    .eq('visible_publico', true)
    //.in('familia', ['Hedonist', 'Epicurist 2.0', 'Heroine Racer 2.0', 'Psilo Explorer'])
    .in('categoria', ['estrella'])
    .order('categoria', { ascending: true })
    .order('familia', { ascending: true });

  if (productsError) {
    console.error('Error cargando productos Hedon:', productsError);
  }

  // Cargar colecciones activas para los filtros
  const { data: collections } = await supabase
    .from('collections')
    .select('*')
    .eq('activa', true)
    .order('orden_display');

  const productList = (products as Product[]) || [];
  const collectionList = (collections as Collection[]) || [];

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F1EC]">

      {/* Hero de la tienda Hedon */}
      <section className="px-6 sm:px-10 lg:px-16 pt-32 pb-16">
        <div className="max-w-[1440px] mx-auto">

          {/* Tag editorial */}
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-block w-6 h-px bg-[#C9A961]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
              Tienda · Hedon
            </span>
          </div>

          {/* Título principal con Cormorant italic */}
          <h1 className="font-cormorant text-5xl md:text-7xl font-medium italic text-[#F4F1EC] leading-[0.95] mb-6">
            Cuatro modelos. <br/>
            <span className="text-[#C9A961]">Una sola obsesión.</span>
          </h1>

          <p className="text-[#F4F1EC]/60 text-base md:text-lg max-w-2xl leading-relaxed">
            La protección como arte. Hedonist, Epicurist 2.0, Heroine Racer 2.0 y el nuevo
            Psilo Explorer — el debut de Hedon en aventura.
          </p>

          {/* Link discreto a la página editorial */}
          <Link
            href="/hedon"
            className="inline-block mt-8 text-xs tracking-[0.15em] uppercase text-[#C9A961] border-b border-[#C9A961]/40 pb-1 hover:border-[#C9A961] transition"
          >
            Conoce la marca →
          </Link>

        </div>
      </section>

      {/* Grid de productos */}
      <ProductGrid products={productList} collections={collectionList} />

      {/* Footer mínimo */}
      <footer className="py-12 px-6 text-center text-[10px] tracking-[0.2em] uppercase text-[#F4F1EC]/35 border-t border-[#F4F1EC]/8">
        Lhopital-moto · We are the standard
      </footer>

    </main>
  );
}
