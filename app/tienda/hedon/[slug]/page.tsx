/**
 * Ficha individual de producto Hedon
 * URL: /tienda/hedon/[slug]
 *
 * Renderiza ProductDetail para cascos o ProductDetailAccesorio para accesorios
 * según la categoría del producto.
 */

import { createSupabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/app/components/tienda/ProductDetail';
import { ProductDetailAccesorio } from '@/app/components/tienda/ProductDetailAccesorio';
import type { Product, CrossSell, HedonCrossSell } from '@/lib/types';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

const CATEGORIAS_ACCESORIO = ['add_on_dual', 'add_on_simple'];

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createSupabaseServer();
  const { data: product } = await supabase
    .from('products')
    .select('nombre, familia, color, frase_corta')
    .eq('slug', slug)
    .single();

  if (!product) return { title: 'Producto no encontrado' };

  return {
    title: `${product.nombre} · Tienda Hedon · Lhopital-moto`,
    description:
      product.frase_corta ||
      `${product.familia} ${product.color} — Accesorio Hedon premium en Lhopital-moto.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createSupabaseServer();

  const { data: product, error } = await supabase
    .from('products')
    .select(`*, variants:product_variants(*), collection:collections(*)`)
    .eq('slug', slug)
    .eq('visible_publico', true)
    .single();

  if (error || !product) notFound();

  const productData = product as Product;
  const esAccesorio = CATEGORIAS_ACCESORIO.includes(productData.categoria);

  // Cross-sells legacy — Moto II
  const { data: crossSells } = await supabase
    .from('cross_sells')
    .select(`*, suggested_product:products!cross_sells_suggested_product_id_fkey(*)`)
    .eq('product_id', productData.id)
    .eq('activo', true)
    .order('prioridad');

  // Cross-sells Hedon — solo para cascos
  let hedonCrossSellsData: HedonCrossSell[] = [];

  if (!esAccesorio) {
    const { data: hedonRaw } = await supabase
      .from('hedon_cross_sell')
      .select('id, sku_casco, sku_accesorio, mensaje, tiene_foto, fotos, orden')
      .eq('sku_casco', productData.sku_padre)
      .order('orden');

    if (hedonRaw && hedonRaw.length > 0) {
      const skus = hedonRaw.map((r) => r.sku_accesorio);

      const { data: accesorios } = await supabase
        .from('products')
        .select('id, sku_padre, nombre, slug, precio_base, familia')
        .in('sku_padre', skus)
        .eq('visible_publico', true);

      const map = new Map((accesorios || []).map((a) => [a.sku_padre, a]));

      hedonCrossSellsData = hedonRaw.map((row) => ({
        ...row,
        accesorio: map.get(row.sku_accesorio) ?? undefined,
      }));
    }
  }

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

      {/* Renderizado condicional según tipo de producto */}
      {esAccesorio ? (
        <ProductDetailAccesorio product={productData} />
      ) : (
        <ProductDetail
          product={productData}
          crossSells={(crossSells as CrossSell[]) || []}
          hedonCrossSells={hedonCrossSellsData}
        />
      )}

      <footer className="py-12 px-6 text-center text-[10px] tracking-[0.2em] uppercase text-[#F4F1EC]/35 border-t border-[#F4F1EC]/8 mt-24">
        Lhopital-moto · We are the standard
      </footer>

    </main>
  );
}
