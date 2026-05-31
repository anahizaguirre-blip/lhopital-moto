/**
 * Ficha individual de producto Hedon
 * URL: /tienda/hedon/[slug]  ej. /tienda/hedon/hedonist-macadamia
 *
 * Server Component que carga producto + variantes + colección + cross-sells.
 */

import { createSupabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/app/components/tienda/ProductDetail';
import type { Product, CrossSell } from '@/lib/types';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createSupabaseServer();
  const { data: product } = await supabase
    .from('products')
    .select('nombre, familia, color, frase_corta')
    .eq('slug', slug)
    .single();

  if (!product) {
    return { title: 'Producto no encontrado' };
  }

  return {
    title: `${product.nombre} · Tienda Hedon · Lhopital-moto`,
    description: product.frase_corta || `${product.familia} ${product.color} — Casco Hedon premium en Lhopital-moto.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createSupabaseServer();

  // Cargar producto con todo lo necesario
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      *,
      variants:product_variants(*),
      collection:collections(*)
    `)
    .eq('slug', slug)
    .eq('visible_publico', true)
    .single();

  if (error || !product) {
    notFound();
  }

  // Cargar cross-sells para este producto
  const { data: crossSells } = await supabase
    .from('cross_sells')
    .select(`
      *,
      suggested_product:products!cross_sells_suggested_product_id_fkey(*)
    `)
    .eq('product_id', product.id)
    .eq('activo', true)
    .order('prioridad');

  const productData = product as Product;
  const crossSellsData = (crossSells as CrossSell[]) || [];

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F1EC]">

      {/* Breadcrumb */}
      <nav className="px-6 md:px-12 lg:px-24 pt-32 pb-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-[11px] tracking-[0.1em] text-[#F4F1EC]/45 font-mono">
            <Link href="/tienda" className="hover:text-[#C9A961] transition">/ Tienda</Link>
            {' · '}
            <Link href="/tienda/hedon" className="hover:text-[#C9A961] transition">Hedon</Link>
            {' · '}
            <span className="text-[#F4F1EC]/70">{productData.familia}</span>
            {' · '}
            <span className="text-[#F4F1EC]">{productData.color}</span>
          </div>
        </div>
      </nav>

      {/* Ficha de detalle (Client Component) */}
      <ProductDetail product={productData} crossSells={crossSellsData} />

      {/* Footer mínimo */}
      <footer className="py-12 px-6 text-center text-[10px] tracking-[0.2em] uppercase text-[#F4F1EC]/35 border-t border-[#F4F1EC]/8 mt-24">
        Lhopital-moto · We are the standard
      </footer>

    </main>
  );
}
