'use client';

import { useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { Product, Collection } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  collections: Collection[];
}

// Orden de botones: novedad primero
const MODELOS = ['Psilo Explorer', 'Heroine Racer 2.0', 'Epicurist 2.0', 'Hedonist'];

const FAMILIA_ORDEN: Record<string, number> = {
  'Psilo Explorer':    1,
  'Heroine Racer 2.0': 2,
  'Epicurist 2.0':     3,
  'Hedonist':          4,
};

export function ProductGrid({ products, collections }: ProductGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const modeloParam = searchParams.get('modelo');
  const [modeloActivo,    setModeloActivo]    = useState<string | null>(() =>
    MODELOS.includes(modeloParam ?? '') ? modeloParam : null
  );
  const [coleccionActiva, setColeccionActiva] = useState<string | null>(null);

  const productosFiltrados = useMemo(() => {
    return products.filter((p) => {
      if (modeloActivo    && p.familia      !== modeloActivo)    return false;
      if (coleccionActiva && p.coleccion_id !== coleccionActiva) return false;
      return true;
    });
  }, [products, modeloActivo, coleccionActiva]);

  const productosPorFamilia = useMemo(() => {
    const map = new Map<string, Product[]>();
    productosFiltrados.forEach((p) => {
      if (!p.familia) return;
      if (!map.has(p.familia)) map.set(p.familia, []);
      map.get(p.familia)!.push(p);
    });
    return new Map(
      [...map.entries()].sort(
        ([a], [b]) => (FAMILIA_ORDEN[a] ?? 99) - (FAMILIA_ORDEN[b] ?? 99)
      )
    );
  }, [productosFiltrados]);

  return (
    <section className="pb-24">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* Filtros */}
        <div className="border-y border-[#F4F1EC]/8 py-6 mb-12 flex flex-wrap gap-8 items-start">

          <div className="flex-1 min-w-[280px]">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#F4F1EC]/45 mb-3">
              Filtra por modelo
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setModeloActivo(null)}
                className={`text-xs tracking-[0.1em] uppercase px-4 py-2 border transition ${
                  modeloActivo === null
                    ? 'border-[#C9A961] text-[#C9A961] bg-[#C9A961]/5'
                    : 'border-[#F4F1EC]/20 text-[#F4F1EC]/70 hover:border-[#F4F1EC]/40'
                }`}
              >
                Todos
              </button>
              {MODELOS.map((modelo) => (
                <button
                  key={modelo}
                  onClick={() => setModeloActivo(modelo)}
                  className={`text-xs tracking-[0.1em] uppercase px-4 py-2 border transition ${
                    modeloActivo === modelo
                      ? 'border-[#C9A961] text-[#C9A961] bg-[#C9A961]/5'
                      : 'border-[#F4F1EC]/20 text-[#F4F1EC]/70 hover:border-[#F4F1EC]/40'
                  }`}
                >
                  {modelo}
                </button>
              ))}
              <span className="self-center text-[#F4F1EC]/20 text-sm">|</span>
              <button
                onClick={() => router.push('/tienda/hedon/personaliza')}
                className="text-xs tracking-[0.1em] uppercase px-4 py-2 border transition border-[#F4F1EC]/20 text-[#F4F1EC]/70 hover:border-[#C9A961]/50 hover:text-[#C9A961]"
              >
                Accesorios →
              </button>
            </div>
          </div>

          <div className="flex-1 min-w-[280px]">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#F4F1EC]/45 mb-3">
              Filtra por coleccion
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setColeccionActiva(null)}
                className={`text-xs tracking-[0.1em] uppercase px-4 py-2 border transition ${
                  coleccionActiva === null
                    ? 'border-[#C9A961] text-[#C9A961] bg-[#C9A961]/5'
                    : 'border-[#F4F1EC]/20 text-[#F4F1EC]/70 hover:border-[#F4F1EC]/40'
                }`}
              >
                Todas
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => setColeccionActiva(col.id)}
                  className={`text-xs tracking-[0.1em] uppercase px-4 py-2 border transition ${
                    coleccionActiva === col.id
                      ? 'border-[#C9A961] text-[#C9A961] bg-[#C9A961]/5'
                      : 'border-[#F4F1EC]/20 text-[#F4F1EC]/70 hover:border-[#F4F1EC]/40'
                  }`}
                >
                  {col.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-8 text-xs tracking-[0.1em] text-[#F4F1EC]/45 font-mono">
          / {productosFiltrados.length} colores
        </div>

        {productosPorFamilia.size === 0 ? (
          <div className="text-center py-24 text-[#F4F1EC]/50">
            <p className="font-cormorant italic text-2xl mb-2">Nada por aqui todavia.</p>
            <p className="text-sm">Prueba con otro filtro.</p>
          </div>
        ) : (
          Array.from(productosPorFamilia.entries()).map(([familia, productos]) => (
            <div key={familia} className="mb-16">
              {!modeloActivo && (
                <div className="mb-6 flex items-baseline gap-3">
                  <h2 className="text-2xl md:text-3xl font-medium tracking-tight">
                    {familia}.
                  </h2>
                  <span className="text-xs tracking-[0.15em] text-[#F4F1EC]/40 font-mono">
                    {productos.length} {productos.length === 1 ? 'color' : 'colores'}
                  </span>
                </div>
              )}
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
