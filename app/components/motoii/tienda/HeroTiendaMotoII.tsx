'use client';

/**
 * HeroMotoII.tsx
 * Hero de la tienda Moto II.
 *
 * Responsabilidades:
 * - Galería de 14 fotos por color (efecto rotación al cambiar)
 * - Selector de acabado: Black / Gun Metal / Silver
 * - Precio dinámico según color seleccionado
 * - Botón "Agregar al carrito" (emite evento hacia TiendaMotoII)
 * - Badge "En camino" si estado === 'en_camino'
 *
 * Props:
 *   dispositivos  — array de Product con variants[] desde Supabase
 *   onColorChange — callback para sincronizar SelectorMontaje con el precio base
 */

import { useState, useCallback } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';

// ─── Constantes ────────────────────────────────────────────────────────────────

const CLOUD = 'https://res.cloudinary.com/lhopital-moto/image/upload';

// Orden de presentación deseado: frontal con pantalla → 3/4 frontal → lateral → trasera → bottom.
// No todos los sufijos están subidos a Cloudinary para los 3 acabados — cada
// color solo lista aquí las fotos que realmente existen (verificado contra
// Cloudinary), para no mostrar miniaturas rotas.
const FOTOS_POR_SKU: Record<string, string[]> = {
  'CHR_BLD3.0_BLK': [
    'front-map', 'front-hour', 'front-logo',
    'tq-front-map', 'tq-front-logo',
    'side', 'tq-back', 'tq-side', 'back', 'bottom',
  ],
  'CHR_BLD3.0_GMG': [
    'front-map', 'front-hour', 'front-logo',
    'tq-front-map', 'tq-front-logo', 'tq-map',
    'side', 'tq-back', 'back', 'bottom',
  ],
  'CHR_BLD3.0_SVR': [
    'front-map', 'front-hour', 'front-logo',
    'tq-front-map', 'tq-front-logo', 'tq-map',
    'side', 'tq-back', 'tq-side', 'back', 'bottom',
  ],
};

// Configuración de cada acabado — datos que complementan lo que viene de Supabase
const ACABADOS_CONFIG: Record<string, {
  label: string;
  numero: string;
  swatchBg: string;
  swatchBorder: string;
  material: string;
  peso: string;
  prefix: string; // prefijo del public_id en Cloudinary
}> = {
  'CHR_BLD3.0_BLK': {
    label: 'Black',
    numero: '/ 01',
    swatchBg: '#0A0A0A',
    swatchBorder: 'rgba(244,241,236,0.4)',
    material: 'Carcasa de plástico',
    peso: '40 g',
    prefix: 'motoii-blk',
  },
  'CHR_BLD3.0_GMG': {
    label: 'Gun Metal',
    numero: '/ 02',
    swatchBg: '#6E7378',
    swatchBorder: 'transparent',
    material: 'Aluminio anodizado oxford',
    peso: '60 g',
    prefix: 'motoii-gmg',
  },
  'CHR_BLD3.0_SVR': {
    label: 'Silver Metal',
    numero: '/ 03',
    swatchBg: '#B8B8B8',
    swatchBorder: 'transparent',
    material: 'Aluminio anodizado silver',
    peso: '60 g',
    prefix: 'motoii-svr',
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatMXN(n: number) {
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
}

function cloudUrl(publicId: string, w = 800) {
  return `${CLOUD}/f_auto,q_auto,w_${w}/${publicId}`;
}

// ─── Tipos ─────────────────────────────────────────────────────────────────────

interface HeroMotoIIProps {
  dispositivos: Product[];
  onColorChange?: (sku: string, precioBase: number) => void;
}

// ─── Componente ────────────────────────────────────────────────────────────────

export function HeroTiendaMotoII({ dispositivos, onColorChange }: HeroMotoIIProps) {
  // Ordenar: BLK primero (más barato), luego GMG y SVR
  const ordenados = [...dispositivos].sort((a, b) => a.precio_base - b.precio_base);

  const [skuActivo, setSkuActivo] = useState<string>(
    ordenados[0]?.sku_padre ?? 'CHR_BLD3.0_GMG'
  );
  const [fotoIndex, setFotoIndex] = useState(0);

  const dispositivoActivo = ordenados.find(d => d.sku_padre === skuActivo) ?? ordenados[0];
  const configActivo = ACABADOS_CONFIG[skuActivo] ?? ACABADOS_CONFIG['CHR_BLD3.0_GMG'];

  const varianteActiva = dispositivoActivo?.variants?.[0];
  const enCamino = varianteActiva?.estado === 'en_camino';
  const precio = varianteActiva?.precio ?? dispositivoActivo?.precio_base ?? 0;

  // Fotos del color activo — solo las que están realmente subidas a Cloudinary
  const sufijosActivos = FOTOS_POR_SKU[skuActivo] ?? [];
  const fotos = sufijosActivos.map(sufijo =>
    cloudUrl(`${configActivo.prefix}-${sufijo}`)
  );

  const handleColorChange = useCallback((sku: string) => {
    setSkuActivo(sku);
    setFotoIndex(0); // reset a la foto principal al cambiar color
    const d = ordenados.find(x => x.sku_padre === sku);
    const p = d?.variants?.[0]?.precio ?? d?.precio_base ?? 0;
    onColorChange?.(sku, p);
  }, [ordenados, onColorChange]);

  const irFotoAnterior = useCallback(() => {
    setFotoIndex(i => (i === 0 ? fotos.length - 1 : i - 1));
  }, [fotos.length]);

  const irFotoSiguiente = useCallback(() => {
    setFotoIndex(i => (i === fotos.length - 1 ? 0 : i + 1));
  }, [fotos.length]);

  return (
    <section className="bg-[#0A0A0A] pt-24 pb-0">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* Breadcrumb */}
        <div className="mb-6 text-[11px] tracking-[0.05em] text-[#F4F1EC]/40">
          / Tienda &nbsp;·&nbsp; Moto II
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

          {/* ── Columna izquierda: Galería ── */}
          <div className="flex flex-col gap-4">

            {/* Foto principal */}
            <div className="relative aspect-square bg-[#111] overflow-hidden">
              <Image
                src={fotos[fotoIndex]}
                alt={`Beeline Moto II ${configActivo.label} - vista ${fotoIndex + 1}`}
                fill
                className="object-contain p-8 transition-opacity duration-300"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority={fotoIndex === 0}
              />

              {/* Badge estado */}
              {enCamino && (
                <div className="absolute top-4 left-4">
                  <span className="text-[9px] tracking-[0.2em] uppercase px-3 py-1.5 bg-[rgba(56,113,189,0.15)] border border-[rgba(85,140,210,0.4)] text-[#9DC5F0]">
                    En camino
                  </span>
                </div>
              )}

              {/* Flechas de navegación */}
              {fotos.length > 1 && (
                <>
                  <button
                    onClick={irFotoAnterior}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 transition text-[#F4F1EC] text-2xl font-light"
                    aria-label="Foto anterior"
                  >
                    ‹
                  </button>
                  <button
                    onClick={irFotoSiguiente}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center bg-black/50 hover:bg-black/80 transition text-[#F4F1EC] text-2xl font-light"
                    aria-label="Foto siguiente"
                  >
                    ›
                  </button>
                </>
              )}

              {/* SKU discreto */}
              <div className="absolute bottom-4 right-4 font-mono text-[10px] text-[#F4F1EC]/30 tracking-[0.15em]">
                / {skuActivo.replace('CHR_', '')}
              </div>
            </div>

            {/* Miniaturas — una sola fila, con scroll horizontal si no caben */}
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {fotos.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setFotoIndex(i)}
                  className={`
                    relative aspect-square w-16 flex-shrink-0 bg-[#111] overflow-hidden transition-all duration-150
                    ${fotoIndex === i
                      ? 'ring-1 ring-[#C9A961]'
                      : 'opacity-50 hover:opacity-80'
                    }
                  `}
                  aria-label={`Ver foto ${i + 1}`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    className="object-contain p-1"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>

          </div>

          {/* ── Columna derecha: Info + selector ── */}
          <div className="flex flex-col justify-start pt-2">

            {/* Tag editorial */}
            <div className="flex items-center gap-2 mb-5">
              <span className="inline-block w-6 h-px bg-[#C9A961]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
                Beeline · Reino Unido
              </span>
            </div>

            {/* Título */}
            <h1 className="font-sora font-bold text-[48px] md:text-[56px] leading-[1] text-[#F4F1EC] mb-2 tracking-[-0.02em]">
              Moto II.
            </h1>
            <p className="font-cormorant italic text-[20px] text-[#C9A961] mb-8">
              El navegador hecho solo para rodar.
            </p>

            {/* Selector de acabado */}
            <div className="mb-8">
              <div className="flex justify-between items-baseline mb-4">
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#F4F1EC]/50">
                  Elige tu acabado
                </span>
                <span className="font-mono text-[10px] text-[#F4F1EC]/40 tracking-[0.15em]">
                  3 acabados · 1 promesa
                </span>
              </div>

              <div className="flex gap-3">
                {ordenados.map(d => {
                  const cfg = ACABADOS_CONFIG[d.sku_padre];
                  if (!cfg) return null;
                  const activo = d.sku_padre === skuActivo;
                  const precioVariante = d.variants?.[0]?.precio ?? d.precio_base;

                  return (
                    <button
                      key={d.sku_padre}
                      onClick={() => handleColorChange(d.sku_padre)}
                      className={`
                        flex-1 p-4 text-left transition-all duration-200 border
                        ${activo
                          ? 'border-[#C9A961] bg-[rgba(201,169,97,0.06)]'
                          : 'border-[rgba(244,241,236,0.12)] hover:border-[rgba(244,241,236,0.3)]'
                        }
                      `}
                    >
                      {/* Swatch + número */}
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <span
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{
                            background: cfg.swatchBg,
                            border: `0.5px solid ${cfg.swatchBorder}`,
                          }}
                        />
                        <span className="font-mono text-[10px] text-[#F4F1EC]/40 tracking-[0.15em]">
                          {cfg.numero}
                        </span>
                      </div>

                      {/* Nombre */}
                      <div className="font-sora font-bold text-[13px] text-[#F4F1EC] mb-0.5">
                        {cfg.label}
                      </div>

                      {/* Material */}
                      <div className="text-[10px] text-[#F4F1EC]/45 tracking-[0.05em] mb-2">
                        {cfg.material.split(' ')[0]}
                      </div>

                      {/* Precio */}
                      <div className={`font-sora font-bold text-[13px] ${activo ? 'text-[#C9A961]' : 'text-[#F4F1EC]/70'}`}>
                        {formatMXN(precioVariante)}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Precio grande */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-sora font-bold text-[40px] text-[#F4F1EC] tracking-[-0.02em]">
                {formatMXN(precio)}
              </span>
              <span className="font-mono text-[11px] text-[#F4F1EC]/40 tracking-[0.15em]">
                MXN
              </span>
            </div>

            {/* Banner en camino */}
            {enCamino && (
              <div className="flex gap-3 items-start bg-[rgba(56,113,189,0.08)] border border-[rgba(85,140,210,0.35)] p-4 mb-6 text-[#9DC5F0]">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                </svg>
                <div>
                  <div className="font-sora font-medium text-[12px] mb-1">Embarque en camino</div>
                  <div className="text-[11px] text-[#9DC5F0]/80 leading-relaxed">
                    Disponible a principios de julio. Pagas hoy, te apartamos uno.
                  </div>
                </div>
              </div>
            )}

            {/* CTA principal */}
            <button className="w-full bg-[#F4F1EC] text-[#0A0A0A] font-sora font-bold text-[13px] tracking-[0.1em] uppercase py-5 hover:bg-[#C9A961] transition-colors duration-200 mb-3">
              Agregar al carrito — {formatMXN(precio)}
            </button>

            {/* CTA secundario: link a marca */}
            <a
              href="/moto-ii"
              className="w-full text-center text-[11px] tracking-[0.15em] uppercase text-[#F4F1EC]/50 border border-[rgba(244,241,236,0.15)] py-4 hover:border-[rgba(244,241,236,0.35)] hover:text-[#F4F1EC]/80 transition-all duration-200"
            >
              Conoce la marca →
            </a>

            {/* Datos técnicos rápidos */}
            <div className="mt-8 pt-6 border-t border-[rgba(244,241,236,0.08)] grid grid-cols-3 gap-4">
              {[
                { label: 'Batería', valor: '14 horas' },
                { label: 'Resistencia', valor: 'IP67' },
                { label: 'Garantía', valor: '30 días' },
              ].map(({ label, valor }) => (
                <div key={label} className="text-center">
                  <div className="font-sora font-bold text-[15px] text-[#F4F1EC] mb-1">{valor}</div>
                  <div className="text-[10px] tracking-[0.1em] uppercase text-[#F4F1EC]/40">{label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
