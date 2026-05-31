/**
 * Grid interactivo de productos Hedon con filtros por modelo y colección.
 *
 * Client Component porque maneja estado de filtros.
 * Recibe los productos pre-cargados del Server Component padre.
 */

'use client';

import { useState, useMemo } from 'react';
import type { Product, Collection } from '@/lib/types';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  collections: Collection[];
}

const MODELOS = ['Hedonist', 'Epicurist 2.0', 'Heroine Racer 2.0', 'Psilo Explorer'];

export function ProductGrid({ products, collections }: ProductGridProps) {
  const [modeloActivo, setModeloActivo] = useState<string | null>(null);
  const [coleccionActiva, setColeccionActiva] = useState<string | null>(null);

  // Filtra productos según selección
  const productosFiltrados = useMemo(() => {
    return products.filter((p) => {
      if (modeloActivo && p.familia !== modeloActivo) return false;
      if (coleccionActiva && p.coleccion_id !== coleccionActiva) return false;
      return true;
    });
  }, [products, modeloActivo, coleccionActiva]);

  // Agrupa productos por familia para mostrarlos organizados
  const productosPorFamilia = useMemo(() => {
    const map = new Map<string, Product[]>();
    productosFiltrados.forEach((p) => {
      if (!p.familia) return;
      if (!map.has(p.familia)) map.set(p.familia, []);
      map.get(p.familia)!.push(p);
    });
    return map;
  }, [productosFiltrados]);

  return (
    <section className="px-6 md:px-12 lg:px-24 pb-24">
      <div className="max-w-6xl mx-auto">

        {/* Filtros */}
        <div className="border-y border-[#F4F1EC]/8 py-6 mb-12 flex flex-wrap gap-8 items-start">

          {/* Filtro: Modelo */}
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
            </div>
          </div>

          {/* Filtro: Colección */}
          <div className="flex-1 min-w-[280px]">
            <div className="text-[10px] tracking-[0.3em] uppercase text-[#F4F1EC]/45 mb-3">
              Filtra por colección
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

        {/* Contador de resultados */}
        <div className="mb-8 text-xs tracking-[0.1em] text-[#F4F1EC]/45 font-mono">
          / {productosFiltrados.length} productos
        </div>

        {/* Grid por familia */}
        {productosPorFamilia.size === 0 ? (
          <div className="text-center py-24 text-[#F4F1EC]/50">
            <p className="font-cormorant italic text-2xl mb-2">Nada por aquí todavía.</p>
            <p className="text-sm">Prueba con otro filtro.</p>
          </div>
        ) : (
          Array.from(productosPorFamilia.entries()).map(([familia, productos]) => (
            <div key={familia} className="mb-16">
              {/* Header de familia (solo si no hay filtro de modelo) */}
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

              {/* Grid de productos */}
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
