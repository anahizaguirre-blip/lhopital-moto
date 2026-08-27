'use client';

/**
 * AccesoriosMotoII.tsx
 * Grid de accesorios especializados de la tienda Moto II.
 *
 * Recibe los accesorios que NO están en el SelectorMontaje clásico:
 *   - Carry Case (CHR_CSE_3.0)
 *   - 4-hole AMPS Mount (CHR_MNT3.0_AMPS)
 *   - 1" Ball Mount Adapter (CHR_MNT3.0_BALL)
 *   - Fork Stem Mount (CHR_MNT3.0_FORK)
 *   - Modular Mount Extender Kit (CHR_MNT3.0_MOD)
 *   - Moto II to V1 Adapter (CHR_MNT3.0_M2_M1ADAPTER) — etiqueta "Para usuarios Moto I"
 *
 * Props:
 *   accesorios — array de Product con variants[] desde Supabase
 */

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/types';

// ─── Constantes ────────────────────────────────────────────────────────────────

const CLOUD = 'https://res.cloudinary.com/lhopital-moto/image/upload';

function cloudUrl(publicId: string, w = 600) {
  return `${CLOUD}/f_auto,q_auto,w_${w}/${publicId}`;
}

function formatMXN(n: number) {
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
}

// Metadatos editoriales por SKU
const ACCESORIO_META: Record<string, {
  descripcion: string;
  esAdaptador?: boolean;
  publicId?: string; // public_id en Cloudinary (a definir cuando suban fotos)
}> = {
  'CHR_CSE_3.0': {
    descripcion: 'Estuche rígido EVA con mosquetón. Para llevarlo cuando no ruedas.',
    publicId: 'chr-cse-front',
  },
  'CHR_MNT3.0_AMPS': {
    descripcion: 'Compatible con sistemas RAM y estándar AMPS de 4 orificios.',
    publicId: 'chr-mnt-amps-1',
  },
  'CHR_MNT3.0_BALL': {
    descripcion: 'Adaptador de 1 pulgada para sistemas de bola universales.',
    publicId: 'chr-mnt-ball-1',
  },
  'CHR_MNT3.0_FORK': {
    descripcion: 'Montaje en horquilla delantera. Ideal para motos deportivas.',
    publicId: 'chr-mnt-fork-1',
  },
  'CHR_MNT3.0_MOD': {
    descripcion: 'Extiende y ajusta la posición de cualquier montaje existente.',
    // Sin foto subida a Cloudinary todavía — se agrega el publicId cuando exista.
  },
  'CHR_MNT3.0_M2_M1ADAPTER': {
    descripcion: 'Usa tu montaje Moto I con el nuevo Moto II. Sin comprar uno nuevo.',
    esAdaptador: true,
    publicId: 'chr-mnt-m2-m1adapter-1',
  },
};

// ─── Tipos ─────────────────────────────────────────────────────────────────────

interface AccesoriosMotoIIProps {
  accesorios: Product[];
}

// ─── Subcomponente: tarjeta de accesorio ───────────────────────────────────────

function AccesorioCard({ producto }: { producto: Product }) {
  const [agregado, setAgregado] = useState(false);
  const meta = ACCESORIO_META[producto.sku_padre] ?? { descripcion: '' };
  const precio = producto.variants?.[0]?.precio ?? producto.precio_base;
  const stock = producto.variants?.[0]?.stock_actual ?? 0;
  const disponible = stock > 0;

  return (
    <div className="flex flex-col bg-[rgba(244,241,236,0.02)] border border-[rgba(244,241,236,0.08)] hover:border-[rgba(244,241,236,0.18)] transition-colors duration-200">

      {/* Foto */}
      <div className="relative aspect-square bg-[#111] overflow-hidden">
        {meta.publicId ? (
          <Image
            src={cloudUrl(meta.publicId)}
            alt={producto.nombre}
            fill
            className="object-contain p-6"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          // Placeholder mientras no hay foto
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-cormorant italic text-[12px] text-[#F4F1EC]/20 text-center px-4 leading-relaxed">
              Foto próximamente
            </span>
          </div>
        )}

        {/* Badge adaptador V1 */}
        {meta.esAdaptador && (
          <div className="absolute top-3 left-3">
            <span className="text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 bg-[rgba(201,169,97,0.12)] border border-[rgba(201,169,97,0.35)] text-[#C9A961]">
              Para usuarios Moto I
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col flex-1 p-4">
        <div className="font-sora font-bold text-[13px] text-[#F4F1EC] mb-1.5 leading-snug">
          {producto.nombre}
        </div>
        <div className="text-[11px] text-[#F4F1EC]/50 leading-relaxed mb-4 flex-1">
          {meta.descripcion}
        </div>

        {/* Precio + stock */}
        <div className="flex items-center justify-between mb-3">
          <span className="font-sora font-bold text-[15px] text-[#F4F1EC]">
            {formatMXN(precio)}
          </span>
          {disponible ? (
            <span className="text-[10px] tracking-[0.1em] uppercase text-[#F4F1EC]/35">
              {stock} en stock
            </span>
          ) : (
            <span className="text-[10px] tracking-[0.1em] uppercase text-[#9DC5F0]/70">
              En camino
            </span>
          )}
        </div>

        {/* Botón */}
        <button
          onClick={() => setAgregado(true)}
          disabled={!disponible || agregado}
          className={`
            w-full text-[11px] tracking-[0.1em] uppercase py-3 transition-all duration-200
            ${agregado
              ? 'bg-[rgba(201,169,97,0.12)] border border-[#C9A961] text-[#C9A961] cursor-default'
              : disponible
                ? 'bg-transparent border border-[rgba(244,241,236,0.25)] text-[#F4F1EC] hover:border-[#F4F1EC] hover:bg-[rgba(244,241,236,0.04)]'
                : 'bg-transparent border border-[rgba(244,241,236,0.08)] text-[#F4F1EC]/25 cursor-not-allowed'
            }
          `}
        >
          {agregado ? '✓ Agregado' : disponible ? 'Agregar al carrito' : 'Sin stock'}
        </button>
      </div>
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function AccesoriosMotoII({ accesorios }: AccesoriosMotoIIProps) {
  if (accesorios.length === 0) return null;

  // Separar adaptador V1 del resto para mostrarlo al final
  const accesoriosRegulares = accesorios.filter(
    a => a.sku_padre !== 'CHR_MNT3.0_M2_M1ADAPTER'
  );
  const adaptadorV1 = accesorios.find(
    a => a.sku_padre === 'CHR_MNT3.0_M2_M1ADAPTER'
  );

  const listaOrdenada = adaptadorV1
    ? [...accesoriosRegulares, adaptadorV1]
    : accesoriosRegulares;

  return (
    <>
      {/* Divisor */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="border-t border-[rgba(244,241,236,0.08)] mt-16" />
      </div>

      <section className="bg-[#0A0A0A] pt-16 md:pt-20 pb-0">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

          {/* Header */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-6 h-px bg-[#C9A961]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
              / 06 · Accesorios
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h2 className="font-sora font-bold text-[28px] md:text-[34px] text-[#F4F1EC] tracking-[-0.02em] mb-2">
                Completa tu Moto II.
              </h2>
              <p className="font-cormorant italic text-[17px] text-[#F4F1EC]/50">
                Cada accesorio tiene su lugar. Encuentra el tuyo.
              </p>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {listaOrdenada.map(accesorio => (
              <AccesorioCard key={accesorio.sku_padre} producto={accesorio} />
            ))}
          </div>

        </div>
      </section>
    </>
  );
}
