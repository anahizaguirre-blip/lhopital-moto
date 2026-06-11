'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { HedonCrossSell } from '@/lib/types';

const CLOUD = 'https://res.cloudinary.com/lhopital-moto/image/upload';

const imgCard  = (publicId: string) => `${CLOUD}/w_400,h_400,c_fill,q_auto,f_auto/${publicId}`;
const imgModal = (publicId: string) => `${CLOUD}/w_900,h_900,c_fit,q_auto,f_auto/${publicId}`;

// Orden de visores HR2.0: de más claro a más oscuro
// La clave es el SKU del accesorio
const VISOR_ORDER_HR: Record<string, number> = {
  'VIS-HER-AMB06+AF': 1,  // Amber       — más claro
  'VIS-HER-SUN06+AF': 2,  // Sunset
  'VIS-HER-RDS06+AF': 3,  // Red Smoke
  'VIS-HER-CFH06+AF': 4,  // Coffee Haze
  'VIS-HER-DPS06+AF': 5,  // Deep Smoke  — más oscuro
};

function sortItems(items: HedonCrossSell[]): HedonCrossSell[] {
  // Solo reordena si TODOS los items son visores HR2.0 conocidos
  // (es decir, si la lista contiene alguno de los 5 visores HR)
  const esVisorHR = (item: HedonCrossSell) =>
    item.sku_accesorio in VISOR_ORDER_HR;

  if (!items.some(esVisorHR)) return items; // no tocar otros cascos

  return [...items].sort((a, b) => {
    const oa = VISOR_ORDER_HR[a.sku_accesorio] ?? 99;
    const ob = VISOR_ORDER_HR[b.sku_accesorio] ?? 99;
    return oa - ob;
  });
}

interface CrossSellHedonProps {
  items: HedonCrossSell[];
  nombreCasco: string;
}

export function CrossSellHedon({ items, nombreCasco }: CrossSellHedonProps) {
  const itemsOrdenados = sortItems(items);

  const [modalItem,  setModalItem]  = useState<HedonCrossSell | null>(null);
  const [fotoActiva, setFotoActiva] = useState(0);

  if (!items || items.length === 0) return null;

  const abrirModal = (item: HedonCrossSell) => {
    setModalItem(item);
    setFotoActiva(0);
  };

  const cerrarModal = () => {
    setModalItem(null);
    setFotoActiva(0);
  };

  const formatPrecio = (precio: number) =>
    new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(precio);

  const fotosModal =
    modalItem?.tiene_foto && modalItem.fotos && modalItem.fotos.length > 0
      ? modalItem.fotos
      : [];

  return (
    <>
      <section className="py-16 border-t border-[#F4F1EC]/8">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="inline-block w-6 h-px bg-[#C9A961]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
                Para tu {nombreCasco}
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-medium text-[#F4F1EC] leading-tight">
              Personaliza tu casco.
            </h2>
            <p className="mt-2 font-cormorant italic text-lg text-[#F4F1EC]/50">
              El detalle que solo notan los conocedores.
            </p>
          </div>

          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
            {itemsOrdenados.map((item) => (
              <CrossSellCard
                key={item.id}
                item={item}
                onVerDetalle={() => abrirModal(item)}
                formatPrecio={formatPrecio}
              />
            ))}
          </div>
        </div>
      </section>

      {modalItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4"
          onClick={cerrarModal}
        >
          <div
            className="relative w-full max-w-2xl bg-[#111] border border-[#F4F1EC]/10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={cerrarModal}
              className="absolute top-4 right-4 z-10 text-[#F4F1EC]/50 hover:text-[#F4F1EC] transition text-xl leading-none"
              aria-label="Cerrar"
            >
              ✕
            </button>

            <div className="grid md:grid-cols-2">
              <div className="bg-[#0A0A0A] aspect-square relative">
                {fotosModal.length > 0 ? (
                  <>
                    <Image
                      src={imgModal(fotosModal[fotoActiva])}
                      alt={modalItem.accesorio?.nombre || 'Accesorio Hedon'}
                      fill
                      className="object-contain p-6"
                      sizes="(max-width: 768px) 100vw, 450px"
                    />
                    {fotosModal.length > 1 && (
                      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-2 px-4">
                        {fotosModal.map((foto, i) => (
                          <button
                            key={foto}
                            onClick={() => setFotoActiva(i)}
                            className={`w-12 h-12 border transition overflow-hidden relative ${
                              i === fotoActiva
                                ? 'border-[#C9A961]'
                                : 'border-[#F4F1EC]/20 hover:border-[#F4F1EC]/50'
                            }`}
                          >
                            <Image
                              src={imgCard(foto)}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full p-8">
                    <p className="font-cormorant italic text-2xl text-[#F4F1EC]/40 text-center leading-relaxed">
                      {modalItem.mensaje || 'Accesorio compatible con tu casco.'}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="w-4 h-px bg-[#C9A961]" />
                    <span className="text-[10px] tracking-[0.25em] uppercase text-[#C9A961]">
                      {modalItem.accesorio?.familia || 'Accesorio'}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-[#F4F1EC] leading-snug mb-3">
                    {modalItem.accesorio?.nombre || modalItem.sku_accesorio}
                  </h3>
                  {modalItem.mensaje && (
                    <p className="text-sm text-[#F4F1EC]/60 leading-relaxed mb-6">
                      {modalItem.mensaje}
                    </p>
                  )}
                  <p className="text-[10px] tracking-[0.2em] font-mono text-[#F4F1EC]/30 mb-6">
                    {modalItem.sku_accesorio}
                  </p>
                </div>
                <div>
                  {modalItem.accesorio?.precio_base && (
                    <p className="text-2xl font-medium text-[#C9A961] mb-6">
                      {formatPrecio(modalItem.accesorio.precio_base)}
                    </p>
                  )}
                  <a
                    href={`/tienda/hedon/${modalItem.accesorio?.slug}`}
                    className="block w-full text-center bg-[#C9A961] text-[#0A0A0A] text-xs tracking-[0.2em] uppercase font-medium py-4 hover:bg-[#B8943A] transition"
                  >
                    Ver accesorio
                  </a>
                  <button
                    onClick={cerrarModal}
                    className="block w-full text-center mt-3 text-xs tracking-[0.15em] uppercase text-[#F4F1EC]/40 hover:text-[#F4F1EC]/70 transition py-2"
                  >
                    Seguir viendo
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface CardProps {
  item: HedonCrossSell;
  onVerDetalle: () => void;
  formatPrecio: (n: number) => string;
}

function CrossSellCard({ item, onVerDetalle, formatPrecio }: CardProps) {
  const tieneFoto   = item.tiene_foto && item.fotos && item.fotos.length > 0;
  const fotoPortada = tieneFoto ? item.fotos![0] : null;

  if (!tieneFoto && !item.mensaje && !item.accesorio) return null;

  return (
    <div
      className="snap-start flex-shrink-0 w-64 border border-[#F4F1EC]/10 bg-[#111] hover:border-[#C9A961]/40 transition-colors group cursor-pointer"
      onClick={onVerDetalle}
    >
      <div className="aspect-square relative bg-[#0A0A0A] overflow-hidden">
        {fotoPortada ? (
          <Image
            src={imgCard(fotoPortada)}
            alt={item.accesorio?.nombre || 'Accesorio'}
            fill
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            sizes="256px"
          />
        ) : (
          <div className="flex items-center justify-center h-full p-6">
            <p className="font-cormorant italic text-base text-[#F4F1EC]/30 text-center leading-relaxed">
              {item.mensaje
                ? item.mensaje.slice(0, 60) + (item.mensaje.length > 60 ? '...' : '')
                : item.accesorio?.nombre}
            </p>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#C9A961]/70 font-mono mb-1">
          {item.accesorio?.familia || 'Accesorio'}
        </p>
        <p className="text-sm font-medium text-[#F4F1EC] leading-snug mb-3">
          {item.accesorio?.nombre || item.sku_accesorio}
        </p>
        <div className="flex items-center justify-between">
          {item.accesorio?.precio_base ? (
            <span className="text-[#C9A961] text-sm font-medium">
              + {formatPrecio(item.accesorio.precio_base)}
            </span>
          ) : (
            <span />
          )}
          <span className="text-[10px] tracking-[0.15em] uppercase text-[#F4F1EC]/40 group-hover:text-[#C9A961] transition">
            Ver →
          </span>
        </div>
      </div>
    </div>
  );
}
