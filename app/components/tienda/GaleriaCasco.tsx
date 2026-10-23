'use client';

import { useState, useMemo, useRef } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';
import { cloudinaryUrl, hedonGallery, extractBasePath, cascoEncuadradoUrl } from '@/lib/cloudinary';

type ProductoGaleria = Pick<
  Product,
  'nombre' | 'sku_padre' | 'imagen_principal' | 'foto_interior' | 'foto_headmost'
>;

interface GaleriaCascoProps {
  product: ProductoGaleria;
  /** Vistas que sí existen en Cloudinary; sin este dato se muestran las 4. */
  vistasDisponibles?: string[];
  /** Pieza vendida: foto en escala de grises. */
  apagada?: boolean;
  priority?: boolean;
  /**
   * Vistas estándar con encuadre uniforme (solo el casco, centrado, mismo
   * zoom). La vista interior y la superior se dejan con su foto original.
   */
  encuadreUniforme?: boolean;
}

// Cuantos thumbnails mostrar a la vez
const THUMB_VISIBLE = 4;

/**
 * Carrusel de vistas de un casco Hedon (frente → tres cuartos → lado → atrás
 * + vista superior / interior), con flechas, puntitos, zoom y thumbnails.
 */
export function GaleriaCasco({
  product,
  vistasDisponibles,
  apagada = false,
  priority = true,
  encuadreUniforme = false,
}: GaleriaCascoProps) {
  const basePath    = extractBasePath(product.imagen_principal);
  const gallery     = basePath
    ? encuadreUniforme
      ? {
          front:        cascoEncuadradoUrl(`${basePath}-front`),
          threeQuarter: cascoEncuadradoUrl(`${basePath}-three-quarter`),
          side:         cascoEncuadradoUrl(`${basePath}-side`),
          back:         cascoEncuadradoUrl(`${basePath}-back`),
        }
      : hedonGallery(basePath)
    : null;
  const interiorUrl = product.foto_interior
    ? cloudinaryUrl(product.foto_interior, 'detail')
    : null;
  const headmostUrl = product.foto_headmost
    ? cloudinaryUrl(product.foto_headmost, 'detail')
    : null;

  const vistas = (gallery
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
    : []
  ).filter(
    (v) =>
      !vistasDisponibles ||
      v.key === 'interior' ||
      v.key === 'headmost' ||
      vistasDisponibles.includes(v.key)
  );

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
  const thumbStart = useMemo(() => {
    if (vistas.length <= THUMB_VISIBLE) return 0;
    const ideal = vistaActiva - 1;
    const max   = vistas.length - THUMB_VISIBLE;
    return Math.max(0, Math.min(ideal, max));
  }, [vistaActiva, vistas.length]);

  const thumbsVisibles = vistas.slice(thumbStart, thumbStart + THUMB_VISIBLE);

  // Genera la URL del thumbnail para cada vista
  const thumbUrl = (v: typeof vistas[0]) => {
    if (v.key === 'interior' && product.foto_interior) {
      return cloudinaryUrl(product.foto_interior, 'thumbnail');
    }
    if (v.key === 'headmost' && product.foto_headmost) {
      return cloudinaryUrl(product.foto_headmost, 'thumbnail');
    }
    // Con encuadre uniforme el thumbnail reusa la misma imagen (ya en caché)
    if (encuadreUniforme) return v.url;
    const suffix =
      v.key === 'threeQuarter' ? 'three-quarter' :
      v.key === 'side'         ? 'side'          :
      v.key === 'back'         ? 'back'          :
      'front';
    return cloudinaryUrl(`${basePath}-${suffix}`, 'thumbnail');
  };

  return (
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
            priority={priority}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className={`object-cover transition-transform duration-200 ${apagada ? 'grayscale opacity-60' : ''}`}
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
                  className={`object-cover ${apagada ? 'grayscale' : ''}`}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
