/**
 * Resuelve líneas del carrito contra Supabase: nombre, precio, foto y
 * disponibilidad salen de aquí, nunca del navegador. Lo usan /api/carrito
 * (vista del carrito) y el checkout (precios finales de la orden).
 *
 * Solo servidor.
 */

import type { SupabaseClient } from '@supabase/supabase-js';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { esCasco, reglaVenta, type Disponibilidad } from '@/lib/venta';

const CLOUD = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'lhopital-moto'}/image/upload`;

export interface LineaResuelta {
  sku: string;
  variantId: string;
  nombre: string;
  /** "Talla M", "Fuera de Serie · Talla XL", color, etc. */
  detalle: string | null;
  marca: string;
  esCasco: boolean;
  piezaUnica: boolean;
  precio: number;
  imagen: string;
  href: string;
  disponibilidad: Disponibilidad;
  maxCantidad: number;
}

interface FilaVariante {
  id: string;
  sku_variante: string;
  talla: string | null;
  color_variante: string | null;
  precio: number | null;
  estado: string;
  stock_actual: number | null;
  visible_publico: boolean | null;
  products: {
    nombre: string;
    slug: string;
    marca: string;
    categoria: string;
    precio_base: number;
    imagen_principal: string | null;
    pieza_unica: boolean | null;
    visible_publico: boolean | null;
  } | null;
}

function hrefProducto(marca: string, slug: string): string {
  if (marca === 'hedon') return `/tienda/hedon/${slug}`;
  if (marca === 'moto_ii') return '/tienda/moto-ii';
  if (marca === 'tees') return '/tienda/tees';
  return '/tienda';
}

function imagenProducto(marca: string, imagen: string | null): string {
  // En algunos productos Moto II el campo trae varias fotos separadas por coma.
  const id = imagen?.split(',')[0]?.trim() || null;
  if (marca === 'moto_ii' && id) return `${CLOUD}/w_200,h_200,c_pad,b_white,f_auto,q_auto/${id}`;
  return cloudinaryUrl(id, 'thumbnail');
}

/** Devuelve las líneas encontradas, en el orden de `skus`. Los SKU desconocidos se omiten. */
export async function resolverSkus(
  supabase: SupabaseClient,
  skus: string[]
): Promise<Map<string, LineaResuelta>> {
  const unicos = [...new Set(skus)].slice(0, 100);
  const resultado = new Map<string, LineaResuelta>();
  if (unicos.length === 0) return resultado;

  const { data, error } = await supabase
    .from('product_variants')
    .select(
      'id, sku_variante, talla, color_variante, precio, estado, stock_actual, visible_publico, products!inner(nombre, slug, marca, categoria, precio_base, imagen_principal, pieza_unica, visible_publico)'
    )
    .in('sku_variante', unicos);

  if (error) throw new Error(`No se pudo leer el catálogo: ${error.message}`);

  for (const fila of (data ?? []) as unknown as FilaVariante[]) {
    const p = fila.products;
    if (!p) continue;
    const precio = Number(fila.precio ?? p.precio_base);
    const piezaUnica = p.pieza_unica === true;
    const regla = reglaVenta({
      marca: p.marca,
      categoria: p.categoria,
      pieza_unica: piezaUnica,
      estado: fila.estado,
      stock_actual: fila.stock_actual,
      precio,
      visible: p.visible_publico !== false && fila.visible_publico !== false,
    });

    const detalle = [
      piezaUnica ? 'Fuera de Serie' : null,
      fila.talla ? `Talla ${fila.talla}` : null,
      fila.color_variante,
    ]
      .filter(Boolean)
      .join(' · ');

    resultado.set(fila.sku_variante, {
      sku: fila.sku_variante,
      variantId: fila.id,
      nombre: p.nombre,
      detalle: detalle || null,
      marca: p.marca,
      esCasco: esCasco(p.marca, p.categoria),
      piezaUnica,
      precio,
      imagen: imagenProducto(p.marca, p.imagen_principal),
      href: hrefProducto(p.marca, p.slug),
      disponibilidad: regla.disponibilidad,
      maxCantidad: regla.maxCantidad,
    });
  }

  return resultado;
}
