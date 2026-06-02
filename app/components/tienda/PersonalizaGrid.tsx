// app/components/tienda/PersonalizaGrid.tsx
'use client';

import { useState } from 'react';
import type { Product } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface PersonalizaGridProps {
  products: Product[];
}

type Tab = 'viseras' | 'visores' | 'tornillos';

const TABS: { id: Tab; label: string }[] = [
  { id: 'viseras',   label: 'Viseras' },
  { id: 'visores',   label: 'Visores' },
  { id: 'tornillos', label: 'Tornillos CNC' },
];

// Qué familias van en cada tab
const FAMILIAS_POR_TAB: Record<Tab, string[]> = {
  viseras:   ['Visera Carbon', 'Visera Classic', 'Visera Gloss', 'Visera Matte', 'Visera MX'],
  visores:   ['Visor', 'Visor Burbuja', 'Visor Protector'],
  tornillos: ['Tornillo CNC'],
};

// Aviso de compatibilidad por tab
const COMPAT: Record<Tab, { modelos: string; advertencia?: string }> = {
  viseras: {
    modelos: 'Solo Psilo Explorer',
  },
  visores: {
    modelos: 'Hedonist · Heroine Racer 2.0 · Epicurist 2.0',
  },
  tornillos: {
    modelos: 'Epicurist 2.0 · Heroine Racer 2.0',
    advertencia: 'No compatible con Heroine Racer V1 ni Hedonist.',
  },
};

export function PersonalizaGrid({ products }: PersonalizaGridProps) {
  const [tabActivo, setTabActivo] = useState<Tab>('viseras');

  const familias = FAMILIAS_POR_TAB[tabActivo];
  const compat   = COMPAT[tabActivo];

  // Productos del tab activo, agrupados por familia
  const grupos = familias
    .map((familia) => ({
      familia,
      productos: products.filter((p) => p.familia === familia),
    }))
    .filter((g) => g.productos.length > 0);

  const totalTab = grupos.reduce((acc, g) => acc + g.productos.length, 0);

  return (
    <section className="px-6 md:px-12 lg:px-24 pb-24">
      <div className="max-w-6xl mx-auto">

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

        {/* Compatibilidad */}
        <div className="mb-10 flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <span className="inline-block w-4 h-px bg-[#C9A961]/50" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]/70">
              Compatible con
            </span>
            <span className="text-[10px] tracking-[0.15em] uppercase text-[#F4F1EC]/60">
              {compat.modelos}
            </span>
          </div>
          {compat.advertencia && (
            <div className="border border-[#C9A961]/20 bg-[#C9A961]/5 px-5 py-3 text-xs text-[#C9A961]/80 tracking-wide max-w-xl">
              ⚠ {compat.advertencia}
            </div>
          )}
        </div>

        {/* Contador */}
        <div className="mb-8 text-xs tracking-[0.1em] text-[#F4F1EC]/45 font-mono">
          / {totalTab} {totalTab === 1 ? 'pieza' : 'piezas'}
        </div>

        {/* Grupos por familia */}
        {grupos.length === 0 ? (
          <div className="text-center py-24 text-[#F4F1EC]/50">
            <p className="font-cormorant italic text-2xl mb-2">Sin piezas disponibles.</p>
            <p className="text-sm">Próximamente.</p>
          </div>
        ) : (
          grupos.map(({ familia, productos }) => (
            <div key={familia} className="mb-16">
              <div className="mb-6 flex items-baseline gap-3">
                <h2 className="text-xl font-medium tracking-tight">
                  {familia}.
                </h2>
                <span className="text-xs tracking-[0.15em] text-[#F4F1EC]/40 font-mono">
                  {productos.length} {productos.length === 1 ? 'opción' : 'opciones'}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {productos.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          ))
        )}

      </div>
    </section>
  );
}