'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Product } from '@/lib/types';
import { FAMILIAS_POR_TAB, familiaToId, type PersonalizaTab } from '@/lib/personaliza';

interface PersonalizaGridProps {
  products: Product[];
}

type Tab = PersonalizaTab;

const TABS: { id: Tab; label: string }[] = [
  { id: 'viseras',   label: 'Viseras' },
  { id: 'visores',   label: 'Visores' },
  { id: 'tornillos', label: 'Tornillos CNC' },
];

// Compatibilidad especifica por familia de accesorio — sacada del catalogo v6
const COMPAT_POR_FAMILIA: Record<string, string> = {
  // Viseras — para Hedonist
  'Visera MX':      'Hedonist',
  'Visera Classic': 'Hedonist',
  'Visera Gloss':   'Hedonist',
  'Visera Matte':   'Hedonist',
  'Visera Carbon':  'Hedonist',
  // Visores por tipo
  'Visor':           'Epicurist 2.0',
  'Visor Burbuja':   'Hedonist',
  'Visor Protector': 'Hedonist',
  // Tornillos
  'Tornillo CNC':    'Epicurist 2.0 · Heroine Racer 2.0',
};

// Advertencias adicionales
const ADVERTENCIA_POR_FAMILIA: Record<string, string> = {
  'Tornillo CNC': 'No compatible con Heroine Racer V1 ni Hedonist.',
  'Visor':        'El visor se instala lateralmente con tornillos. Solo Epicurist 2.0.',
};

// Aviso general del tab (para la cabecera)
const COMPAT_TAB: Record<Tab, string> = {
  viseras:   'Hedonist',
  visores:   'Hedonist · Epicurist 2.0',
  tornillos: 'Epicurist 2.0 · Heroine Racer 2.0',
};

const CLOUDINARY_BASE = 'https://res.cloudinary.com/lhopital-moto/image/upload';

function AccesorioCard({ product }: { product: Product }) {
  const router = useRouter();
  const imgSrc = product.imagen_principal
    ? `${CLOUDINARY_BASE}/w_600,h_600,c_pad,q_auto,f_auto/${product.imagen_principal}`
    : null;

  // Estado del accesorio
  const variante   = product.variants?.[0] ?? null;
  const enStock    = variante && variante.stock_actual > 0;
  const estado     = enStock ? 'En stock' : 'Bajo pedido';
  const statusColor = enStock ? 'text-emerald-400' : 'text-[#9DC5F0]';

  const compat     = COMPAT_POR_FAMILIA[product.familia ?? ''];
  const advertencia = ADVERTENCIA_POR_FAMILIA[product.familia ?? ''];

  return (
    <article className="group bg-[#111] border border-[#F4F1EC]/8 hover:border-[#C9A961]/30 transition-colors overflow-hidden">
      {/* Foto */}
      <button
        onClick={() => router.push(`/tienda/hedon/${product.slug}`)}
        className="block w-full"
        aria-label={`Ver ${product.nombre}`}
      >
        <div className="relative aspect-square bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] overflow-hidden">
          {imgSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imgSrc}
              alt={product.nombre}
              className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-cormorant italic text-[#F4F1EC]/25 text-sm">Foto pendiente</span>
            </div>
          )}
        </div>
      </button>

      {/* Info */}
      <div className="p-5">
        {/* Compatible con */}
        {compat && (
          <div className="text-[9px] tracking-[0.2em] uppercase text-[#C9A961]/70 mb-2">
            Compatible · {compat}
          </div>
        )}

        {/* Nombre + precio */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="text-sm font-medium leading-snug">
            {product.color || product.nombre}
          </h3>
          <span className="text-sm font-bold text-[#F4F1EC] whitespace-nowrap">
            ${product.precio_base.toLocaleString('es-MX')}
          </span>
        </div>

        {/* Familia */}
        <p className="text-[10px] tracking-[0.1em] uppercase text-[#F4F1EC]/40 mb-3">
          {product.familia}
        </p>

        {/* Estado */}
        <div className={`text-[10px] tracking-[0.1em] uppercase ${statusColor} mb-3`}>
          {estado}
        </div>

        {/* Advertencia especifica */}
        {advertencia && (
          <div className="border border-[#C9A961]/20 bg-[#C9A961]/5 px-3 py-2 text-[10px] text-[#C9A961]/80 tracking-wide mb-3">
            ⚠ {advertencia}
          </div>
        )}

        {/* CTA */}
        <button
          onClick={() => router.push(`/tienda/hedon/${product.slug}`)}
          className="w-full bg-[#F4F1EC] text-[#0A0A0A] py-2.5 text-xs font-bold tracking-[0.1em] uppercase hover:opacity-85 transition"
        >
          {enStock ? 'Agregar al carrito' : 'Reservar'}
        </button>
      </div>
    </article>
  );
}

export function PersonalizaGrid({ products }: PersonalizaGridProps) {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [tabActivo, setTabActivo] = useState<Tab>(() =>
    TABS.some((t) => t.id === tabParam) ? (tabParam as Tab) : 'viseras'
  );

  useEffect(() => {
    const familiaParam = searchParams.get('familia');
    if (!familiaParam) return;
    const el = document.getElementById(familiaToId(familiaParam));
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [tabActivo, searchParams]);

  const familias  = FAMILIAS_POR_TAB[tabActivo];
  const compatTab = COMPAT_TAB[tabActivo];

  // Productos del tab activo, agrupados por familia
  const grupos = familias
    .map((familia) => ({
      familia,
      productos: products.filter((p) => p.familia === familia),
    }))
    .filter((g) => g.productos.length > 0);

  const totalTab = grupos.reduce((acc, g) => acc + g.productos.length, 0);

  return (
    <section className="pb-24">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* Tabs */}
        <div className="border-b border-[#F4F1EC]/8 mb-12 flex gap-0">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabActivo(tab.id)}
              className={`px-8 py-5 text-xs tracking-[0.2em] uppercase transition border-b-2 ${
                tabActivo === tab.id
                  ? 'text-[#C9A961] border-[#C9A961]'
                  : 'text-[#F4F1EC]/40 border-transparent hover:text-[#F4F1EC]/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Compatibilidad general del tab */}
        <div className="mb-10 flex items-center gap-2">
          <span className="inline-block w-4 h-px bg-[#C9A961]/50" />
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]/70">
            Compatible con
          </span>
          <span className="text-[10px] tracking-[0.15em] uppercase text-[#F4F1EC]/60">
            {compatTab}
          </span>
        </div>

        {/* Contador */}
        <div className="mb-8 text-xs tracking-[0.1em] text-[#F4F1EC]/45 font-mono">
          / {totalTab} {totalTab === 1 ? 'pieza' : 'piezas'}
        </div>

        {/* Grupos por familia */}
        {grupos.length === 0 ? (
          <div className="text-center py-24 text-[#F4F1EC]/50">
            <p className="font-cormorant italic text-2xl mb-2">Sin piezas disponibles.</p>
            <p className="text-sm">Proximamente.</p>
          </div>
        ) : (
          grupos.map(({ familia, productos }) => (
            <div key={familia} id={familiaToId(familia)} className="mb-16 scroll-mt-24">
              <div className="mb-6 flex items-baseline gap-3">
                <h2 className="text-xl font-medium tracking-tight">
                  {familia}.
                </h2>
                <span className="text-[10px] tracking-[0.2em] uppercase text-[#C9A961]/60">
                  Compatible · {COMPAT_POR_FAMILIA[familia] ?? compatTab}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {productos.map((p) => (
                  <AccesorioCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
