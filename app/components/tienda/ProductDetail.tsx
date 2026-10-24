'use client';

import { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, HedonCrossSell, ProductVariant } from '@/lib/types';
import { GaleriaCasco } from './GaleriaCasco';
import { CrossSellHedon } from './CrossSellHedon';
import { SelloMotivo, SelloVendida, AvisoElectrico, TextoDGR } from './fuera-de-serie/Sellos';
import {
  FUERA_DE_SERIE_HREF,
  estadoPieza,
  precioPieza,
  variantePieza,
  notaExtra,
  formatMXN,
  vistasPieza,
} from '@/lib/fuera-de-serie';

interface ProductDetailProps {
  product: Product;
  hedonCrossSells: HedonCrossSell[];
  /** Solo pieza única: vistas que sí existen en Cloudinary. */
  vistasDisponibles?: string[];
  /** PDP normal: hay una pieza Fuera de Serie disponible del mismo modelo. */
  hayPiezaFueraDeSerie?: boolean;
}

const TALLA_ORDEN = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COLECCION_LABELS: Record<string, string> = {
  coleccion_2026_arte_proteccion: 'Coleccion 2026 · El arte de la proteccion',
  coleccion_2026_psilo_debut:     'Coleccion debut Psilo Explorer 2026',
  coleccion_lejano_oeste:         'Coleccion Lejano Oeste',
  clasico_permanente:             'Clasico Hedon',
  edicion_limitada:               'DGR 2026',
};

const CLOUDINARY_BASE = 'https://res.cloudinary.com/lhopital-moto/image/upload';
const TALLAS_GUIDE_URL = `${CLOUDINARY_BASE}/hedon-tallas`;

export function ProductDetail({
  product,
  hedonCrossSells,
  vistasDisponibles,
  hayPiezaFueraDeSerie = false,
}: ProductDetailProps) {
  const esPiezaUnica = product.pieza_unica === true;
  const estadoUnica  = esPiezaUnica ? estadoPieza(product) : null;
  const vendida      = estadoUnica === 'vendida';
  // Variantes
  const variantesOrdenadas = useMemo(() => {
    if (!product.variants) return [];
    return [...product.variants].sort(
      (a, b) =>
        TALLA_ORDEN.indexOf(a.talla || '') - TALLA_ORDEN.indexOf(b.talla || '')
    );
  }, [product.variants]);

  const [varianteSel, setVarianteSel] = useState<ProductVariant | null>(() => {
    const conStock = variantesOrdenadas.find((v) => v.stock_actual > 0);
    return conStock || variantesOrdenadas[0] || null;
  });

  const [cantidad, setCantidad]             = useState(1);
  const [guiaTallasOpen, setGuiaTallasOpen] = useState(false);

  const etiquetaColeccion = product.coleccion_id
    ? COLECCION_LABELS[product.coleccion_id] ?? product.collection?.etiqueta_visible ?? null
    : null;

  const enStock      = varianteSel && varianteSel.stock_actual > 0;
  const esBajoPedido = varianteSel?.estado === 'bajo_pedido';

  const hedonModeloHref = product.familia
    ? `/tienda/hedon?modelo=${encodeURIComponent(product.familia)}`
    : '/tienda/hedon';

  const handleAgregarCarrito = () => {
    if (!varianteSel) return;
    alert(
      `[PLACEHOLDER]\n\nProducto: ${product.nombre}\nTalla: ${varianteSel.talla}\nCantidad: ${cantidad}\nSKU: ${varianteSel.sku_variante}\n\nEl carrito se conecta en el siguiente paso.`
    );
  };

  return (
    <>
      <section className="pb-12">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* COLUMNA IZQUIERDA — Carrusel */}
          <GaleriaCasco
            product={product}
            vistasDisponibles={vistasDisponibles}
            apagada={vendida}
            vistasPersonalizadas={esPiezaUnica ? vistasPieza(product) : undefined}
          />

          {/* COLUMNA DERECHA — Info y compra */}
          <div className="lg:pt-4">
            <div className="mb-3 flex items-center gap-2">
              <span className="inline-block w-6 h-px bg-[#C9A961]" />
              <Link
                href={hedonModeloHref}
                className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961] hover:underline"
              >
                {product.familia}
              </Link>
            </div>

            <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1] mb-2">
              {product.color}.
            </h1>

            {product.frase_corta && (
              <p className="font-cormorant italic text-lg text-[#C9A961] mb-5">
                {product.frase_corta}
              </p>
            )}

            {etiquetaColeccion && (
              <div className="inline-block bg-[#C9A961]/10 border border-[#C9A961]/30 text-[#C9A961] px-3 py-1.5 text-[10px] tracking-[0.15em] uppercase mb-6">
                {etiquetaColeccion}
              </div>
            )}

            {esPiezaUnica ? (
              <BloquePiezaUnica product={product} />
            ) : (
            <>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-3xl font-bold">
                ${product.precio_base.toLocaleString('es-MX')}
              </span>
              <span className="text-[10px] tracking-[0.15em] uppercase text-[#F4F1EC]/45">
                MXN
              </span>
            </div>

            {!enStock && esBajoPedido && (
              <div className="bg-[#3871BD]/10 border border-[#558CD2]/40 p-4 mb-6 flex gap-3 items-start">
                <div className="text-[#9DC5F0] text-lg mt-0.5">⏳</div>
                <div>
                  <div className="font-medium text-[#9DC5F0] mb-1">Bajo pedido</div>
                  <p className="text-[12px] text-[#9DC5F0]/80 leading-relaxed">
                    Lo traemos en 3 semanas a 90 dias. Pagas hoy, te apartamos uno.
                  </p>
                </div>
              </div>
            )}

            {/* Selector de talla */}
            <div className="mb-6">
              <div className="flex justify-between mb-3">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#F4F1EC]/55">
                  Elige tu talla
                </span>
                <button
                  onClick={() => setGuiaTallasOpen(!guiaTallasOpen)}
                  className="text-[11px] text-[#C9A961] hover:underline"
                >
                  {guiaTallasOpen ? 'Cerrar guia' : '¿Cual es mi talla?'}
                </button>
              </div>

              {guiaTallasOpen && (
                <div className="mb-4 border border-[#F4F1EC]/10 overflow-hidden">
                  <div className="relative w-full" style={{ aspectRatio: '3/2' }}>
                    <Image
                      src={TALLAS_GUIDE_URL}
                      alt="Guia de tallas Hedon"
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain bg-[#1a1a1a]"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-6 gap-2">
                {variantesOrdenadas.map((v) => {
                  const isActive   = varianteSel?.id === v.id;
                  const tieneStock = v.stock_actual > 0;
                  return (
                    <button
                      key={v.id}
                      onClick={() => setVarianteSel(v)}
                      className={`relative py-3 text-sm font-medium border transition ${
                        isActive
                          ? 'border-[#C9A961] bg-[#C9A961]/5 text-[#C9A961]'
                          : tieneStock
                          ? 'border-[#F4F1EC]/20 text-[#F4F1EC] hover:border-[#F4F1EC]/40'
                          : 'border-[#F4F1EC]/10 text-[#F4F1EC]/40'
                      }`}
                    >
                      {v.talla}
                      {tieneStock && (
                        <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>

              {varianteSel && (
                <div className="mt-3 text-[11px] tracking-[0.05em] text-[#F4F1EC]/55">
                  {varianteSel.stock_actual > 0
                    ? 'En stock · envio en 24-72h'
                    : 'Bajo pedido · llegada 3 semanas a 90 dias'}
                </div>
              )}

              {hayPiezaFueraDeSerie && (
                <Link
                  href={FUERA_DE_SERIE_HREF}
                  className="mt-3 inline-block text-[11px] tracking-[0.05em] text-[#C9A961]/80 hover:text-[#C9A961] border-b border-[#C9A961]/30 hover:border-[#C9A961] pb-0.5 transition"
                >
                  Existe una pieza Fuera de Serie de este modelo →
                </Link>
              )}
            </div>

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

            <button
              onClick={handleAgregarCarrito}
              disabled={!varianteSel}
              className="w-full bg-[#F4F1EC] text-[#0A0A0A] py-4 text-sm font-bold tracking-[0.1em] uppercase hover:opacity-85 transition disabled:opacity-40 mb-3"
            >
              {enStock ? 'Agregar al carrito' : 'Reservar bajo pedido'} — ${(product.precio_base * cantidad).toLocaleString('es-MX')}
            </button>

            <button className="w-full bg-transparent border border-[#F4F1EC]/35 text-[#F4F1EC] py-3 text-xs font-medium tracking-[0.05em] uppercase hover:border-[#F4F1EC]/60 transition">
              Avisame de novedades
            </button>
            </>
            )}

            <div className="mt-10 pt-8 border-t border-[#F4F1EC]/8">
              <div className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961] mb-4">
                Ficha tecnica
              </div>
              <dl className="space-y-3 text-sm">
                {product.certificacion && (
                  <div className="flex justify-between border-b border-[#F4F1EC]/8 pb-3">
                    <dt className="text-[#F4F1EC]/55">Certificacion</dt>
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
                  <dt className="text-[#F4F1EC]/55">Garantia</dt>
                  <dd>{product.garantia_meses} meses</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {esPiezaUnica && product.motivo_unico === 'edicion_limitada' && (
        <section className="pt-16 border-t border-[#F4F1EC]/8">
          <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
            <TextoDGR />
          </div>
        </section>
      )}

      {!esPiezaUnica && (
        <CrossSellHedon
          items={hedonCrossSells}
          nombreCasco={product.familia ?? 'Hedon'}
        />
      )}
    </>
  );
}

/**
 * Columna de compra en modo pieza única: talla fija, sin selector de color,
 * sin personalización ni bajo pedido, cantidad fija en 1.
 */
function BloquePiezaUnica({ product }: { product: Product }) {
  const variante = variantePieza(product);
  const estado   = estadoPieza(product);
  const precio   = precioPieza(product);
  const nota     = notaExtra(product);
  const esElectrico = product.motivo_unico === 'electrico';

  const handleAgregar = () => {
    if (!variante) return;
    // TODO(fuera-de-serie): al conectar checkout + Mercado Pago, descontar el
    // stock de forma atómica ANTES de cobrar:
    //   UPDATE product_variants SET stock_actual = stock_actual - 1
    //   WHERE sku_variante = $1 AND stock_actual >= 1 RETURNING id;
    // Sin fila → no cobrar y mostrar "Esta pieza acaba de encontrar dueño."
    // Pago fallido/cancelado → restaurar stock. Registrar en stock_movements.
    alert(
      `[PLACEHOLDER]\n\nProducto: ${product.nombre}\nTalla: ${variante.talla}\nCantidad: 1\nSKU: ${variante.sku_variante}\n\nEl carrito se conecta en el siguiente paso.`
    );
  };

  return (
    <div>
      <div className="mb-5 space-y-3">
        {estado === 'vendida' ? (
          <SelloVendida />
        ) : (
          product.motivo_unico && <SelloMotivo motivo={product.motivo_unico} />
        )}
        {nota && <p className="text-[12px] text-[#F4F1EC]/60">{nota}</p>}
      </div>

      <div className="flex items-baseline gap-2 mb-6">
        {estado === 'vendida' ? (
          <span className="text-xl text-[#F4F1EC]/45">Pieza vendida</span>
        ) : precio !== null ? (
          <>
            <span className="text-3xl font-bold">{formatMXN(precio)}</span>
            <span className="text-[10px] tracking-[0.15em] uppercase text-[#F4F1EC]/45">MXN</span>
          </>
        ) : (
          <span className="text-xl text-[#F4F1EC]/75">Precio por confirmar</span>
        )}
      </div>

      <dl className="grid grid-cols-3 border-y border-[#F4F1EC]/10 mb-6 text-center">
        <div className="py-4">
          <dt className="text-[10px] tracking-[0.3em] uppercase text-[#F4F1EC]/55 mb-1">Talla</dt>
          <dd className="text-lg font-medium">{variante?.talla ?? '—'}</dd>
        </div>
        <div className="py-4 border-x border-[#F4F1EC]/10">
          <dt className="text-[10px] tracking-[0.3em] uppercase text-[#F4F1EC]/55 mb-1">Cantidad</dt>
          <dd className="text-lg font-medium">1</dd>
        </div>
        <div className="py-4">
          <dt className="text-[10px] tracking-[0.3em] uppercase text-[#F4F1EC]/55 mb-1">Piezas</dt>
          <dd className="text-lg font-medium">Única</dd>
        </div>
      </dl>

      {esElectrico && <AvisoElectrico className="mb-4" />}

      {estado === 'disponible' && (
        <button
          onClick={handleAgregar}
          className="w-full bg-[#F4F1EC] text-[#0A0A0A] py-4 text-sm font-bold tracking-[0.1em] uppercase hover:opacity-85 transition mb-3"
        >
          Agregar al carrito — {formatMXN(precio!)}
        </button>
      )}

      {estado === 'precio_por_definir' && (
        <Link
          href="/citas"
          className="block w-full text-center bg-[#C9A961] text-[#0A0A0A] py-4 text-sm font-bold tracking-[0.1em] uppercase hover:opacity-85 transition mb-3"
        >
          Agenda una cita en showroom
        </Link>
      )}

      <Link
        href={FUERA_DE_SERIE_HREF}
        className="inline-block mt-2 text-xs tracking-[0.15em] uppercase text-[#C9A961] border-b border-[#C9A961]/40 pb-1 hover:border-[#C9A961] transition"
      >
        ← Volver a Fuera de Serie
      </Link>
    </div>
  );
}
