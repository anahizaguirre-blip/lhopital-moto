'use client';

/**
 * SelectorMontaje.tsx
 * URL: componente de /tienda/moto-ii
 *
 * Responsabilidades:
 * - Mostrar los 4 montajes clásicos en grid 2x2
 * - Calcular el total: precio base del dispositivo + precio del montaje
 * - Mostrar disclaimer cuando se selecciona Powered Mount
 * - Emitir el montaje seleccionado hacia TiendaMotoII via onMontajeChange
 *
 * Props:
 *   accesorios      — array de Product con variants[] (categoría add_on_simple)
 *   precioBase      — precio del dispositivo actualmente seleccionado
 *   colorLabel      — nombre del color activo (para el resumen "Moto II Gun Metal + Bar Clamp")
 *   onMontajeChange — callback con el accesorio seleccionado (o null si Universal)
 */

import { useState } from 'react';
import type { Product } from '@/lib/types';

// ─── Constantes ────────────────────────────────────────────────────────────────

// Los 4 montajes clásicos que aparecen en el selector visual
// El resto (AMPS, Ball, Fork, Mod) van al grid de accesorios completo
const SKUS_CLASICOS = [
  'CHR_MNT3.0_BAR',
  'CHR_MNT3.0_MIRRORXBAR',
  'CHR_MNT3.0_PWR',
] as const;

// Metadatos visuales y editoriales por SKU
const MONTAJE_META: Record<string, {
  numero: string;
  titulo: string;
  descripcion: string;
  icono: React.ReactNode;
  esPowered?: boolean;
}> = {
  universal: {
    numero: '/ 01',
    titulo: 'Ya incluido',
    descripcion: 'Manubrio estándar con correa elástica. Funciona en cualquier moto.',
    icono: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  'CHR_MNT3.0_BAR': {
    numero: '/ 02',
    titulo: 'Manubrio fijo',
    descripcion: 'Aluminio anodizado. Inserto rotable 360°. El más vendido.',
    icono: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
      </svg>
    ),
  },
  'CHR_MNT3.0_MIRRORXBAR': {
    numero: '/ 03',
    titulo: 'Retrovisor / cruzado',
    descripcion: 'Metal anodizado. 4 espaciadores incluidos. Ideal para naked y adventure.',
    icono: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
      </svg>
    ),
  },
  'CHR_MNT3.0_PWR': {
    numero: '/ 04',
    titulo: 'Carga mientras ruedas',
    descripcion: 'Se conecta a batería 12V. Para viajes largos sin pausa.',
    icono: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    esPowered: true,
  },
};

// ─── Helpers ───────────────────────────────────────────────────────────────────

function formatMXN(n: number) {
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
}

// ─── Tipos ─────────────────────────────────────────────────────────────────────

interface SelectorMontajeProps {
  accesorios: Product[];
  precioBase: number;
  colorLabel: string;
  onMontajeChange?: (accesorio: Product | null) => void;
}

// ─── Componente ────────────────────────────────────────────────────────────────

export function SelectorMontaje({
  accesorios,
  precioBase,
  colorLabel,
  onMontajeChange,
}: SelectorMontajeProps) {
  const [skuSeleccionado, setSkuSeleccionado] = useState<string>('universal');

  // Filtrar solo los montajes clásicos del array de accesorios
  const montajesClasicos = SKUS_CLASICOS
    .map(sku => accesorios.find(a => a.sku_padre === sku))
    .filter(Boolean) as Product[];

  const accesorioSeleccionado = skuSeleccionado === 'universal'
    ? null
    : montajesClasicos.find(m => m.sku_padre === skuSeleccionado) ?? null;

  const precioMontaje = accesorioSeleccionado?.variants?.[0]?.precio
    ?? accesorioSeleccionado?.precio_base
    ?? 0;

  const totalCombo = precioBase + precioMontaje;
  const metaSeleccionado = MONTAJE_META[skuSeleccionado];
  const esPowered = metaSeleccionado?.esPowered ?? false;

  function handleSeleccion(sku: string) {
    setSkuSeleccionado(sku);
    if (sku === 'universal') {
      onMontajeChange?.(null);
    } else {
      const acc = montajesClasicos.find(m => m.sku_padre === sku) ?? null;
      onMontajeChange?.(acc);
    }
  }

  // Construir array de tarjetas: Universal (sin costo) + 3 clásicos
  const tarjetas = [
    { sku: 'universal', precio: 0, nombre: 'Universal · incluido' },
    ...montajesClasicos.map(m => ({
      sku: m.sku_padre,
      precio: m.variants?.[0]?.precio ?? m.precio_base,
    })),
  ];

  return (
    <section className="bg-[#0A0A0A] pt-16 md:pt-20 pb-0">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* Header de sección */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-block w-6 h-px bg-[#C9A961]" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
            / 03 · Adáptalo a tu moto
          </span>
        </div>

        <h2 className="font-sora font-bold text-[28px] md:text-[34px] text-[#F4F1EC] leading-tight mb-2 tracking-[-0.02em]">
          Tu Moto II ya trae montaje universal.
        </h2>
        <p className="font-cormorant italic text-[18px] text-[#C9A961] mb-4">
          ¿Quieres una posición distinta?
        </p>
        <p className="text-[13px] text-[#F4F1EC]/65 leading-relaxed max-w-2xl mb-8">
          El soporte universal funciona en cualquier manubrio estándar. Pero si tu manejo
          es deportivo, tienes una posición específica, o quieres que se cargue mientras
          ruedas — estos son los lugares clásicos.
        </p>

        {/* Grid de montajes */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
          {tarjetas.map(({ sku, precio}) => {
            const meta = MONTAJE_META[sku];
            if (!meta) return null;
            const activo = skuSeleccionado === sku;

            return (
              <button
                key={sku}
                onClick={() => handleSeleccion(sku)}
                className={`
                  text-left p-4 transition-all duration-200 border relative
                  ${activo
                    ? 'border-[#C9A961] bg-[rgba(201,169,97,0.05)]'
                    : 'border-[rgba(244,241,236,0.10)] hover:border-[rgba(244,241,236,0.28)]'
                  }
                `}
              >
                {/* Número */}
                <div className={`font-mono text-[10px] tracking-[0.15em] mb-3 ${activo ? 'text-[#C9A961]' : 'text-[#F4F1EC]/35'}`}>
                  {meta.numero}{activo ? ' ✓' : ''}
                </div>

                {/* Ícono */}
                <div className={`mb-3 ${activo ? 'text-[#C9A961]' : 'text-[#F4F1EC]/40'}`}>
                  {meta.icono}
                </div>

                {/* Título */}
                <div className="font-sora font-bold text-[13px] text-[#F4F1EC] mb-1.5">
                  {meta.titulo}
                </div>

                {/* Descripción */}
                <div className="text-[11px] text-[#F4F1EC]/50 leading-relaxed mb-3">
                  {meta.descripcion}
                </div>

                {/* Precio */}
                <div className={`font-sora text-[12px] font-medium ${activo ? 'text-[#C9A961]' : 'text-[#F4F1EC]/50'}`}>
                  {precio === 0 ? 'Sin costo extra' : `+ ${formatMXN(precio)}`}
                </div>
              </button>
            );
          })}
        </div>

        {/* Disclaimer Powered Mount */}
        {esPowered && (
          <div className="flex gap-3 items-start bg-[rgba(186,117,23,0.06)] border border-[rgba(186,117,23,0.3)] p-4 mb-5 text-[#EF9F27]">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
            <div>
              <div className="font-sora font-medium text-[12px] mb-1">Importante</div>
              <div className="text-[11px] text-[#EF9F27]/85 leading-relaxed">
                El Powered Mount no es compatible con el soporte universal. Necesitas un
                montaje adicional (Bar Clamp, Espejo o similar) para usarlo.
              </div>
            </div>
          </div>
        )}

        {/* Resumen del combo */}
        <div className="flex justify-between items-center bg-[rgba(201,169,97,0.05)] border border-[rgba(201,169,97,0.25)] p-4 mb-4">
          <div>
            <div className="text-[10px] tracking-[0.1em] uppercase text-[#F4F1EC]/45 mb-1">
              Tu combinación
            </div>
            <div className="font-sora font-bold text-[13px] text-[#F4F1EC]">
              Moto II {colorLabel}
              {skuSeleccionado !== 'universal' && accesorioSeleccionado
                ? ` + ${MONTAJE_META[skuSeleccionado]?.titulo}`
                : ' · solo dispositivo'
              }
            </div>
          </div>
          <div className="font-sora font-bold text-[20px] text-[#C9A961]">
            {formatMXN(totalCombo)}
          </div>
        </div>

        {/* Link guía de montajes */}
        <div className="text-center pb-2">
          <span className="text-[11px] text-[#F4F1EC]/40">
            ¿No sabes cuál es para ti?{' '}
            <a
              href="/moto-ii#montajes"
              className="text-[#C9A961] underline underline-offset-2 hover:text-[#F4F1EC] transition-colors"
            >
              Lee la guía completa de montajes
            </a>
          </span>
        </div>

      </div>
    </section>
  );
}
