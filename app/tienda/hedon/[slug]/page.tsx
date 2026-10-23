import { createSupabaseServer } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/app/components/tienda/ProductDetail';
import { ProductDetailAccesorio } from '@/app/components/tienda/ProductDetailAccesorio';
import type { Product, HedonCrossSell } from '@/lib/types';
import Link from 'next/link';
import Footer from '@/app/components/Footer';
import { extractBasePath } from '@/lib/cloudinary';
import { FUERA_DE_SERIE_HREF } from '@/lib/fuera-de-serie';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;
const CATEGORIAS_ACCESORIO = ['add_on_dual', 'add_on_simple'];

const CLOUDINARY_BASE = 'https://res.cloudinary.com/lhopital-moto/image/upload';
const VISTAS = [
  { key: 'front', suffix: 'front' },
  { key: 'threeQuarter', suffix: 'three-quarter' },
  { key: 'side', suffix: 'side' },
  { key: 'back', suffix: 'back' },
];

async function vistasExistentes(imagenPrincipal: string | null): Promise<string[]> {
  const base = extractBasePath(imagenPrincipal);
  if (!base) return [];
  const checks = await Promise.all(
    VISTAS.map(async (v) => {
      try {
        const res = await fetch(`${CLOUDINARY_BASE}/${base}-${v.suffix}`, {
          method: 'HEAD',
          next: { revalidate: 3600 },
        });
        return res.ok ? v.key : null;
      } catch {
        return v.key; // ante un error de red, mejor intentar mostrarla
      }
    })
  );
  return checks.filter((k): k is string => k !== null);
}

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
    description: product.frase_corta || `${product.familia} ${product.color} — Accesorio Hedon premium en Lhopital-moto.`,
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

  const esPiezaUnica = productData.pieza_unica === true;

  let hedonCrossSellsData: HedonCrossSell[] = [];
  let vistasDisponibles: string[] | undefined;
  let hayPiezaFueraDeSerie = false;

  if (esPiezaUnica) {
    // Algunas piezas no tienen las 4 vistas (p.ej. falta el frente del DGR):
    // se omiten las que no existen en Cloudinary en vez de mostrar una rota.
    vistasDisponibles = await vistasExistentes(productData.imagen_principal);
  } else if (!esAccesorio && productData.familia) {
    // Aviso discreto en el PDP normal: ¿hay una pieza única disponible del
    // mismo modelo? Siempre por query, nunca a mano.
    const { data: piezas } = await supabase
      .from('products')
      .select('id, variants:product_variants!inner(stock_actual)')
      .eq('pieza_unica', true)
      .eq('visible_publico', true)
      .eq('familia', productData.familia)
      .gt('variants.stock_actual', 0)
      .limit(1);
    hayPiezaFueraDeSerie = (piezas?.length ?? 0) > 0;
  }

  if (!esAccesorio && !esPiezaUnica) {
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

      {/* Breadcrumb — patrón storytelling */}
      <nav className="pt-32 pb-6">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-[11px] tracking-[0.1em] text-[#F4F1EC]/45 font-mono">
            <Link href="/tienda" className="hover:text-[#C9A961] transition">/ Tienda</Link>
            {' · '}
            <Link href="/tienda/hedon" className="hover:text-[#C9A961] transition">Hedon</Link>
            {' · '}
            {esPiezaUnica && (
              <>
                <Link href={FUERA_DE_SERIE_HREF} className="hover:text-[#C9A961] transition">Fuera de Serie</Link>
                {' · '}
              </>
            )}
            <span className="text-[#F4F1EC]/70">{productData.familia}</span>
            {' · '}
            <span className="text-[#F4F1EC]">{productData.color}</span>
          </div>
        </div>
      </nav>

      {esAccesorio ? (
        <ProductDetailAccesorio product={productData} />
      ) : (
        <ProductDetail
          product={productData}
          hedonCrossSells={hedonCrossSellsData}
          vistasDisponibles={vistasDisponibles}
          hayPiezaFueraDeSerie={hayPiezaFueraDeSerie}
        />
      )}

      <Footer bg="dark" />

    </main>
  );
}
