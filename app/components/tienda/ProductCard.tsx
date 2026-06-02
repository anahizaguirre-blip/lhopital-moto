/**
 * Card de producto individual en el grid.
 *
 * Muestra: foto principal, etiqueta de colección, nombre, precio "desde", estado.
 * Click → lleva a la ficha individual o a /personaliza según categoría.
 */

import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { cloudinaryUrl, cloudinaryAccesorioUrl } from '@/lib/cloudinary';

interface ProductCardProps {
  product: Product;
}

const COLECCION_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  coleccion_2026_arte_proteccion: {
    bg: 'bg-[#C9A961]/15',
    text: 'text-[#C9A961]',
    label: 'Colección 2026',
  },
  coleccion_2026_psilo_debut: {
    bg: 'bg-[#C9A961]/15',
    text: 'text-[#C9A961]',
    label: 'Debut Psilo 2026',
  },
  coleccion_lejano_oeste: {
    bg: 'bg-[#A85A2C]/15',
    text: 'text-[#D89060]',
    label: 'Lejano Oeste',
  },
  clasico_permanente: {
    bg: 'bg-[#F4F1EC]/8',
    text: 'text-[#F4F1EC]/70',
    label: 'Clásico Hedon',
  },
};

const CATEGORIAS_ACCESORIO = ['add_on_dual', 'add_on_simple'];

function getHref(product: Product): string {
  if (CATEGORIAS_ACCESORIO.includes(product.categoria)) {
    return '/tienda/hedon/personaliza';
  }
  return `/tienda/hedon/${product.slug}`;
}

export function ProductCard({ product }: ProductCardProps) {
  const tieneStock = product.variants?.some((v) => v.stock_actual > 0) ?? false;
  const todasBajoPedido = product.variants?.every((v) => v.estado === 'bajo_pedido') ?? false;

  const colStyle = product.coleccion_id
    ? COLECCION_STYLES[product.coleccion_id]
    : null;

  const esAccesorio = CATEGORIAS_ACCESORIO.includes(product.categoria);

  const imageUrl = esAccesorio
    ? cloudinaryAccesorioUrl(product.imagen_principal)
    : cloudinaryUrl(product.imagen_principal, 'card');

  return (
    <Link href={getHref(product)} className="group block">

      {/* Contenedor de imagen */}
      <div className="relative aspect-square bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] overflow-hidden mb-4">
        <Image
          src={imageUrl}
          alt={product.nombre}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-opacity duration-300 group-hover:opacity-90"
          unoptimized={esAccesorio}
        />

        {/* Badge colección */}
        {colStyle && (
          <div className={`absolute top-3 left-3 ${colStyle.bg} ${colStyle.text} px-2.5 py-1 text-[9px] tracking-[0.15em] uppercase`}>
            {colStyle.label}
          </div>
        )}

        {/* Badge accesorio */}
        {esAccesorio ? (
          <div className="absolute top-3 left-3 bg-[#C9A961]/10 text-[#C9A961] px-2.5 py-1 text-[9px] tracking-[0.15em] uppercase">
            Accesorio
          </div>
        ) : (
          <>
            {!tieneStock && todasBajoPedido && (
              <div className="absolute top-3 right-3 bg-[#3871BD]/15 text-[#9DC5F0] border border-[#558CD2]/40 px-2.5 py-1 text-[9px] tracking-[0.15em] uppercase">
                Bajo pedido
              </div>
            )}
            {tieneStock && (
              <div className="absolute top-3 right-3 bg-[#2D7A4F]/15 text-[#7ECB9A] border border-[#7ECB9A]/30 px-2.5 py-1 text-[9px] tracking-[0.15em] uppercase">
                En stock
              </div>
            )}
          </>
        )}

        {/* SKU */}
        <div className="absolute bottom-3 right-3 font-mono text-[9px] tracking-[0.15em] text-[#F4F1EC]/40 uppercase">
          / {product.sku_padre.replace('-ECE', '')}
        </div>
      </div>

      {/* Info del producto */}
      <div>
        <div className="text-[10px] tracking-[0.2em] uppercase text-[#F4F1EC]/45 mb-1.5">
          {esAccesorio ? 'Accesorio Hedon' : product.familia}
        </div>

        <h3 className="text-lg font-medium leading-tight mb-2 text-[#F4F1EC] group-hover:text-[#C9A961] transition-colors">
          {esAccesorio ? product.nombre : product.color}.
        </h3>

        {product.frase_corta && (
          <p className="font-cormorant italic text-sm text-[#F4F1EC]/55 leading-relaxed mb-3 line-clamp-2">
            {product.frase_corta}
          </p>
        )}

        <div className="flex items-baseline gap-2 mt-3">
          <span className="text-base font-semibold text-[#F4F1EC]">
            ${product.precio_base.toLocaleString('es-MX')}
          </span>
          <span className="text-[10px] tracking-[0.1em] uppercase text-[#F4F1EC]/40">
            MXN
          </span>
        </div>
      </div>
    </Link>
  );
}