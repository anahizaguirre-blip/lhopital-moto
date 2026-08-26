'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product, HedonCrossSell, ProductVariant } from '@/lib/types';
import { cloudinaryUrl, hedonGallery, extractBasePath } from '@/lib/cloudinary';
import { CrossSellHedon } from './CrossSellHedon';

interface ProductDetailProps {
  product: Product;
  hedonCrossSells: HedonCrossSell[];
}

const TALLA_ORDEN = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const COLECCION_LABELS: Record<string, string> = {
  coleccion_2026_arte_proteccion: 'Coleccion 2026 · El arte de la proteccion',
  coleccion_2026_psilo_debut:     'Coleccion debut Psilo Explorer 2026',
  coleccion_lejano_oeste:         'Coleccion Lejano Oeste',
  clasico_permanente:             'Clasico Hedon',
};

const CLOUDINARY_BASE = 'https://res.cloudinary.com/lhopital-moto/image/upload';
const TALLAS_GUIDE_URL = `${CLOUDINARY_BASE}/hedon-tallas`;

// Cuantos thumbnails mostrar a la vez
const THUMB_VISIBLE = 4;

export function ProductDetail({ product, hedonCrossSells }: ProductDetailProps) {
  const basePath    = extractBasePath(product.imagen_principal);
  const gallery     = basePath ? hedonGallery(basePath) : null;
  const interiorUrl = product.foto_interior
    ? cloudinaryUrl(product.foto_interior, 'detail')
    : null;
  const headmostUrl = product.foto_headmost
    ? cloudinaryUrl(product.foto_headmost, 'detail')
    : null;

  const vistas = gallery
    ? [
        { key: 'front',        label: 'Frente',       url: gallery.front },
        { key: 'threeQuarter', label: 'Tres cuartos', url: gallery.threeQuarter },
        { key: 'side',         label: 'Lado',         url: gallery.side },
        { key: 'back',         label: 'Atras',        url: gallery.back },
        ...(headmostUrl
          ? [{ key: 'headmost', label: 'Vista superior', url: headmostUrl }]
          : []),
        ...(interiorUrl
          ? [{ key: 'interior', label: 'Interior', url: interiorUrl }]
          : []),
      ]
    : [];

  const [vistaActiva, setVistaActiva] = useState(0);

  // Zoom hover
  const imgContainerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom]       = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = imgContainerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setZoomPos({
      x: ((e.clientX - rect.left)  / rect.width)  * 100,
      y: ((e.clientY - rect.top)   / rect.height) * 100,
    });
  };

  const irAnterior  = () => setVistaActiva((v) => (v === 0 ? vistas.length - 1 : v - 1));
  const irSiguiente = () => setVistaActiva((v) => (v === vistas.length - 1 ? 0 : v + 1));

  // Calcula que 4 thumbnails mostrar, centrados en vistaActiva
  // Siempre mostramos THUMB_VISIBLE indices consecutivos con el activo
  // lo mas centrado posible dentro del rango valido
  const thumbStart = useMemo(() => {
    if (vistas.length <= THUMB_VISIBLE) return 0;
    // Queremos el activo en posicion 1 (0-indexed) del bloque de 4
    const ideal = vistaActiva - 1;
    const max   = vistas.length - THUMB_VISIBLE;
    return Math.max(0, Math.min(ideal, max));
  }, [vistaActiva, vistas.length]);

  const thumbsVisibles = vistas.slice(thumbStart, thumbStart + THUMB_VISIBLE);

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
    ? COLECCION_LABELS[product.coleccion_id]
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

  // Genera la URL del thumbnail para cada vista
  const thumbUrl = (v: typeof vistas[0]) => {
    if (v.key === 'interior' && product.foto_interior) {
      return cloudinaryUrl(product.foto_interior, 'thumbnail');
    }
    if (v.key === 'headmost' && product.foto_headmost) {
      return cloudinaryUrl(product.foto_headmost, 'thumbnail');
    }
    const suffix =
      v.key === 'threeQuarter' ? 'three-quarter' :
      v.key === 'side'         ? 'side'          :
      v.key === 'back'         ? 'back'          :
      'front';
    return cloudinaryUrl(`${basePath}-${suffix}`, 'thumbnail');
  };

  return (
    <>
      <section className="pb-12">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">

          {/* COLUMNA IZQUIERDA — Carrusel */}
          <div>
            {/* Imagen principal con flechas + zoom */}
            <div
              ref={imgContainerRef}
              className="relative aspect-square bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] overflow-hidden mb-4 cursor-zoom-in select-none"
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={handleMouseMove}
            >
              {vistas.length > 0 ? (
                <Image
                  src={vistas[vistaActiva].url}
                  alt={`${product.nombre} — ${vistas[vistaActiva].label}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-200"
                  style={
                    zoom
                      ? {
                          transform: 'scale(2.2)',
                          transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                        }
                      : undefined
                  }
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-cormorant italic text-[#F4F1EC]/25">Foto pendiente</span>
                </div>
              )}

              {/* Flechas */}
              {vistas.length > 1 && (
                <>
                  <button
                    onClick={irAnterior}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 transition text-[#F4F1EC] text-2xl font-light"
                    aria-label="Foto anterior"
                  >
                    ‹
                  </button>
                  <button
                    onClick={irSiguiente}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 transition text-[#F4F1EC] text-2xl font-light"
                    aria-label="Foto siguiente"
                  >
                    ›
                  </button>
                </>
              )}

              {/* Puntitos */}
              {vistas.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
                  {vistas.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setVistaActiva(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === vistaActiva
                          ? 'bg-[#C9A961] w-4'
                          : 'bg-[#F4F1EC]/30 hover:bg-[#F4F1EC]/60 w-1.5'
                      }`}
                      aria-label={vistas[idx].label}
                    />
                  ))}
                </div>
              )}

              {/* SKU */}
              <div className="absolute bottom-4 right-4 font-mono text-[10px] tracking-[0.15em] text-[#F4F1EC]/40 uppercase z-10">
                / {product.sku_padre.replace('-ECE', '')}
              </div>
            </div>

            {/* Thumbnails sincronizados — siempre 4, siguen al activo */}
            {vistas.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {thumbsVisibles.map((v) => {
                  const realIdx = vistas.indexOf(v);
                  return (
                    <button
                      key={v.key}
                      onClick={() => setVistaActiva(realIdx)}
                      className={`relative aspect-square bg-[#1a1a1a] overflow-hidden border transition ${
                        vistaActiva === realIdx
                          ? 'border-[#C9A961]'
                          : 'border-transparent hover:border-[#F4F1EC]/25'
                      }`}
                      title={v.label}
                    >
                      <Image
                        src={thumbUrl(v)}
                        alt={v.label}
                        fill
                        sizes="(max-width: 1024px) 25vw, 150px"
                        className="object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

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

      <CrossSellHedon
        items={hedonCrossSells}
        nombreCasco={product.familia ?? 'Hedon'}
      />
    </>
  );
}
