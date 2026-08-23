import { Suspense } from 'react';
import { createSupabaseServer } from '@/lib/supabase/server';
import type { Product } from '@/lib/types';
import { PersonalizaGrid } from '@/app/components/tienda/PersonalizaGrid';
import Link from 'next/link';

export const metadata = {
  title: 'Personaliza tu Hedon · Lhopital-moto',
  description: 'Viseras, visores y tornillos CNC para tu casco Hedon. Accesorios originales de Reino Unido.',
};

export const revalidate = 60;

const CATEGORIAS_ACCESORIO = ['add_on_dual', 'add_on_simple'];

export default async function PersonalizaPage() {
  const supabase = createSupabaseServer();

  const { data: products, error } = await supabase
    .from('products')
    .select(`*, variants:product_variants(*), collection:collections(*)`)
    .eq('marca', 'hedon')
    .eq('visible_publico', true)
    .in('categoria', CATEGORIAS_ACCESORIO)
    .order('familia', { ascending: true });

  if (error) console.error('Error cargando accesorios Hedon:', error);

  const productList = (products as Product[]) || [];

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F1EC]">

      {/* Hero — patrón storytelling: px en el div interior junto al max-w */}
      <section className="pt-32 pb-16">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-block w-6 h-px bg-[#C9A961]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
              Tienda · Hedon · Accesorios
            </span>
          </div>
          <h1 className="font-cormorant text-5xl md:text-7xl font-medium italic text-[#F4F1EC] leading-[0.95] mb-6">
            Personaliza<br />
            <span className="text-[#C9A961]">tu Hedon.</span>
          </h1>
          <p className="text-[#F4F1EC]/60 text-base md:text-lg max-w-2xl leading-relaxed">
            El casco correcto es solo el inicio. Viseras, visores y tornillos CNC
            para hacerlo completamente tuyo.
          </p>
          <Link
            href="/tienda/hedon"
            className="inline-block mt-8 text-xs tracking-[0.15em] uppercase text-[#C9A961] border-b border-[#C9A961]/40 pb-1 hover:border-[#C9A961] transition"
          >
            ← Volver a cascos
          </Link>
        </div>
      </section>

      <Suspense fallback={null}>
        <PersonalizaGrid products={productList} />
      </Suspense>

      <footer className="py-12 px-6 text-center text-[10px] tracking-[0.2em] uppercase text-[#F4F1EC]/35 border-t border-[#F4F1EC]/8">
        Lhopital-moto · We are the standard
      </footer>

    </main>
  );
}
