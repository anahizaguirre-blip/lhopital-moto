/**
 * Página de contenido de marca
 * URL: /guias/[slug]
 *
 * Server Component que carga un artículo desde `contenido` por slug.
 * Los bloques 'sku_card' con `sku` hacen join contra products/product_variants
 * para traer imagen_principal, precio y el link en vivo hacia la tienda.
 */

import { createSupabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Contenido, ContenidoSkuCardProducto, Product } from '@/lib/types';
import { GuiaBody } from '@/app/components/guias/GuiaBody';
import { cloudinaryEditorialUrl } from '@/lib/cloudinary';
import Image from 'next/image';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

async function getContenido(slug: string) {
  const supabase = createSupabaseServer();
  const { data, error } = await supabase
    .from('contenido')
    .select('*')
    .eq('slug', slug)
    .eq('visible_publico', true)
    .single();

  if (error || !data) return null;
  return data as Contenido;
}

async function getProductosPorSku(skus: string[]): Promise<Record<string, ContenidoSkuCardProducto>> {
  if (skus.length === 0) return {};
  const supabase = createSupabaseServer();
  const { data } = await supabase
    .from('products')
    .select('sku_padre, nombre, slug, marca, precio_base, imagen_principal, variants:product_variants(precio)')
    .in('sku_padre', skus)
    .eq('visible_publico', true);

  const productos = (data as unknown as (Product & { variants: { precio: number | null }[] })[]) || [];
  const map: Record<string, ContenidoSkuCardProducto> = {};
  for (const p of productos) {
    map[p.sku_padre] = {
      sku_padre: p.sku_padre,
      nombre: p.nombre,
      slug: p.slug,
      marca: p.marca as ContenidoSkuCardProducto['marca'],
      precio_base: p.precio_base,
      imagen_principal: p.imagen_principal,
      precio: p.variants?.[0]?.precio ?? null,
    };
  }
  return map;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const contenido = await getContenido(slug);
  if (!contenido) return { title: 'Contenido no encontrado' };
  return {
    title: `${contenido.titulo} · Lhopital-moto`,
    description: contenido.titulo,
  };
}

export default async function GuiaPage({ params }: PageProps) {
  const { slug } = await params;
  const contenido = await getContenido(slug);
  if (!contenido) notFound();

  const skus = contenido.cuerpo
    .filter((b) => b.tipo === 'sku_card' && b.contenido.sku)
    .map((b) => (b as { tipo: 'sku_card'; contenido: { sku: string } }).contenido.sku);

  const productosPorSku = await getProductosPorSku(skus);

  const tiendaSlug = contenido.marca.replace(/_/g, '-');

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F1EC]">

      {/* Breadcrumb */}
      <nav className="pt-32 pb-6">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-[11px] tracking-[0.1em] text-[#F4F1EC]/45 font-mono">
            <Link href="/tienda" className="hover:text-[#C9A961] transition">/ Tienda</Link>
            {' · '}
            <Link href={`/tienda/${tiendaSlug}`} className="hover:text-[#C9A961] transition capitalize">
              {tiendaSlug.replace('-', ' ')}
            </Link>
            {' · '}
            <span className="text-[#F4F1EC]">Guía</span>
          </div>
        </div>
      </nav>

      {/* Portada */}
      <header className="pb-16">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-3xl mx-auto text-center mb-10">
            <h1 className="font-sora font-bold text-[30px] md:text-[42px] text-[#F4F1EC] leading-tight tracking-[-0.02em]">
              {contenido.titulo}
            </h1>
          </div>
          {contenido.imagen_portada && (
            <div className="max-w-3xl mx-auto">
              <div className="relative w-full bg-[#111] border border-[rgba(244,241,236,0.08)]">
                <Image
                  src={cloudinaryEditorialUrl(contenido.imagen_portada)}
                  alt={contenido.titulo}
                  width={1600}
                  height={1067}
                  className="w-full h-auto"
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Cuerpo */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pb-20">
        <GuiaBody
          cuerpo={contenido.cuerpo}
          marca={contenido.marca}
          productosPorSku={productosPorSku}
        />
      </div>

      <footer className="py-12 px-6 text-center text-[10px] tracking-[0.2em] uppercase text-[#F4F1EC]/35 border-t border-[#F4F1EC]/8">
        Lhopital-moto · We are the standard
      </footer>

    </main>
  );
}
