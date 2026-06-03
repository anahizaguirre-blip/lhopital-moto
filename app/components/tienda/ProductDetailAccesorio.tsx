'use client';

/**
 * Ficha de detalle para accesorios Hedon.
 * - Una sola foto (imagen_principal directo, sin galería de vistas)
 * - Sin selector de talla — accesorios son unitalla
 * - Stock y estado tomados de la primera variante
 * - Compatible con: Viseras, Visores, Tornillos CNC
 */

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { cloudinaryUrl } from '@/lib/cloudinary';

interface ProductDetailAccesorioProps {
  product: Product;
}

export function ProductDetailAccesorio({ product }: ProductDetailAccesorioProps) {
  const [cantidad, setCantidad] = useState(1);

  // Accesorios tienen una sola variante (unitalla)
  const variante = product.variants?.[0] ?? null;
  const enStock = variante && variante.stock_actual > 0;
  const esBajoPedido = variante?.estado === 'bajo_pedido';

  const handleAgregarCarrito = () => {
    if (!variante) return;
    alert(
      `[PLACEHOLDER]\n\nProducto: ${product.nombre}\nCantidad: ${cantidad}\nSKU: ${variante.sku_variante}\n\nEl carrito se conecta en el siguiente paso.`
    );
  };

  return (
    <section className="px-6 md:px-12 lg:px-24 pb-12">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

        {/* COLUMNA IZQUIERDA — Foto única */}
        <div>
          <div className="relative aspect-square bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] overflow-hidden">
            {product.imagen_principal ? (
              <Image
                src={cloudinaryUrl(product.imagen_principal, 'detail')}
                alt={product.nombre}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-8"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-cormorant italic text-[#F4F1EC]/25">Foto pendiente</span>
              </div>
            )}

            {/* SKU */}
            <div className="absolute bottom-4 right-4 font-mono text-[10px] tracking-[0.15em] text-[#F4F1EC]/40 uppercase">
              / {product.sku_padre}
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA — Info y compra */}
        <div className="lg:pt-4">

          {/* Eyebrow familia */}
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-block w-6 h-px bg-[#C9A961]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
              {product.familia}
            </span>
          </div>

          {/* Nombre */}
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1] mb-2">
            {product.color}.
          </h1>

          {/* Frase corta */}
          {product.frase_corta && (
            <p className="font-cormorant italic text-lg text-[#C9A961] mb-5">
              {product.frase_corta}
            </p>
          )}

          {/* Compatible con */}
          {product.descripcion_corta && (
            <div className="flex items-center gap-2 mb-6">
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#F4F1EC]/45">
                Compatible con
              </span>
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#F4F1EC]/70">
                {product.descripcion_corta}
              </span>
            </div>
          )}

          {/* Precio */}
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-3xl font-bold">
              ${product.precio_base.toLocaleString('es-MX')}
            </span>
            <span className="text-[10px] tracking-[0.15em] uppercase text-[#F4F1EC]/45">
              MXN
            </span>
          </div>

          {/* Banner bajo pedido */}
          {!enStock && esBajoPedido && (
            <div className="bg-[#3871BD]/10 border border-[#558CD2]/40 p-4 mb-6 flex gap-3 items-start">
              <div className="text-[#9DC5F0] text-lg mt-0.5">⏳</div>
              <div>
                <div className="font-medium text-[#9DC5F0] mb-1">Bajo pedido</div>
                <p className="text-[12px] text-[#9DC5F0]/80 leading-relaxed">
                  Lo traemos en 3 semanas a 90 días. Pagas hoy, te apartamos uno.
                </p>
              </div>
            </div>
          )}

          {/* Stock disponible */}
          {enStock && (
            <div className="mb-6 text-[11px] tracking-[0.05em] text-[#F4F1EC]/55">
              {variante!.stock_actual} en stock · envío en 24-72h
            </div>
          )}

          {/* Cantidad */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#F4F1EC]/55">
              Cantidad
            </span>
            <div className="flex border border-[#F4F1EC]/20">
              <button
                onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                className="w-10 h-10 hover:bg-[#F4F1EC]/5 transition"
              >
                −
              </button>
              <div className="w-12 h-10 flex items-center justify-center border-x border-[#F4F1EC]/20">
                {cantidad}
              </div>
              <button
                onClick={() => setCantidad((c) => c + 1)}
                className="w-10 h-10 hover:bg-[#F4F1EC]/5 transition"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA principal */}
          <button
            onClick={handleAgregarCarrito}
            disabled={!variante}
            className="w-full bg-[#F4F1EC] text-[#0A0A0A] py-4 text-sm font-bold tracking-[0.1em] uppercase hover:opacity-85 transition disabled:opacity-40 mb-3"
          >
            {enStock ? 'Agregar al carrito' : 'Reservar bajo pedido'} — ${(product.precio_base * cantidad).toLocaleString('es-MX')}
          </button>

          {/* CTA secundario */}
          <button className="w-full bg-transparent border border-[#F4F1EC]/35 text-[#F4F1EC] py-3 text-xs font-medium tracking-[0.05em] uppercase hover:border-[#F4F1EC]/60 transition">
            Avísame de novedades
          </button>

          {/* Ficha técnica */}
          <div className="mt-10 pt-8 border-t border-[#F4F1EC]/8">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961] mb-4">
              Ficha técnica
            </div>
            <dl className="space-y-3 text-sm">
              {product.certificacion && (
                <div className="flex justify-between border-b border-[#F4F1EC]/8 pb-3">
                  <dt className="text-[#F4F1EC]/55">Certificación</dt>
                  <dd>{product.certificacion}</dd>
                </div>
              )}
              {product.material && (
                <div className="flex justify-between border-b border-[#F4F1EC]/8 pb-3">
                  <dt className="text-[#F4F1EC]/55">Material</dt>
                  <dd>{product.material}</dd>
                </div>
              )}
              {product.peso_g && (
                <div className="flex justify-between border-b border-[#F4F1EC]/8 pb-3">
                  <dt className="text-[#F4F1EC]/55">Peso</dt>
                  <dd>{product.peso_g} g</dd>
                </div>
              )}
              <div className="flex justify-between border-b border-[#F4F1EC]/8 pb-3">
                <dt className="text-[#F4F1EC]/55">Garantía</dt>
                <dd>{product.garantia_meses} meses</dd>
              </div>
            </dl>
          </div>

        </div>
      </div>
    </section>
  );
}
