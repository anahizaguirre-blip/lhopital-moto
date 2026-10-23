'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { cloudinaryUrl } from '@/lib/cloudinary';
import {
  estadoPieza,
  precioPieza,
  variantePieza,
  notaExtra,
  formatMXN,
} from '@/lib/fuera-de-serie';
import { GaleriaCasco } from '../GaleriaCasco';
import { SelloMotivo, SelloVendida, AvisoElectrico, TextoDGR } from './Sellos';
import { BotonAgregarPieza } from './BotonAgregarPieza';

interface Props {
  piezas: Product[];
  /** Vistas existentes en Cloudinary por id de producto. */
  vistasPorPieza: Record<string, string[]>;
}

const esDGR = (p: Product) => p.motivo_unico === 'edicion_limitada';

/**
 * Vitrina: la pieza seleccionada se muestra en grande arriba (galería +
 * texto completo) y las 5 piezas quedan abajo como tarjetas. Arranca con el
 * Hedonist × DGR 2026; ?pieza=<slug> abre otra directamente.
 */
export function VitrinaFueraDeSerie({ piezas, vistasPorPieza }: Props) {
  const inicial = piezas.find(esDGR) ?? piezas[0];
  const [selId, setSelId] = useState<string | undefined>(inicial?.id);
  const vitrinaRef = useRef<HTMLElement>(null);

  // Respeta ?pieza=<slug> al cargar (link compartido)
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get('pieza');
    const p = slug ? piezas.find((x) => x.slug === slug) : null;
    if (p) setSelId(p.id);
  }, [piezas]);

  const seleccionar = (p: Product) => {
    setSelId(p.id);
    const url = new URL(window.location.href);
    url.searchParams.set('pieza', p.slug);
    window.history.replaceState(null, '', url);
    vitrinaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const sel = piezas.find((p) => p.id === selId);
  if (!sel) return null;

  return (
    <>
      {/* Pieza en vitrina */}
      <section ref={vitrinaRef} className="pt-16 scroll-mt-24">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <GaleriaCasco
            key={sel.id}
            product={sel}
            vistasDisponibles={vistasPorPieza[sel.id]}
            apagada={estadoPieza(sel) === 'vendida'}
          />
          <InfoPieza key={`info-${sel.id}`} product={sel} />
        </div>
      </section>

      {/* Todas las piezas */}
      <section className="pt-20 md:pt-24 pb-24">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-6 flex items-baseline gap-3 border-t border-[#F4F1EC]/8 pt-10">
            <h2 className="text-2xl md:text-3xl font-medium tracking-tight">Las cinco piezas.</h2>
            <span className="text-xs tracking-[0.15em] text-[#F4F1EC]/40 font-mono">
              toca una para verla arriba
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {piezas.map((p) => (
              <TarjetaPieza
                key={p.id}
                product={p}
                activa={p.id === sel.id}
                onSelect={() => seleccionar(p)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function InfoPieza({ product }: { product: Product }) {
  const estado   = estadoPieza(product);
  const precio   = precioPieza(product);
  const variante = variantePieza(product);
  const nota     = notaExtra(product);
  const dgr      = esDGR(product);

  return (
    <div className="lg:pt-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-block w-6 h-px bg-[#C9A961]" />
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
          {product.familia}
        </span>
      </div>

      <h2 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1] mb-5">
        {dgr ? 'Hedonist × DGR 2026' : `${product.color}.`}
      </h2>

      <div className="mb-6 space-y-3">
        {estado === 'vendida' ? (
          <SelloVendida />
        ) : (
          product.motivo_unico && <SelloMotivo motivo={product.motivo_unico} />
        )}
        {nota && <p className="text-[12px] text-[#F4F1EC]/60">{nota}</p>}
      </div>

      {dgr ? (
        <div className="mb-8">
          <TextoDGR conTitulo={false} />
        </div>
      ) : (
        <dl className="grid grid-cols-3 border-y border-[#F4F1EC]/10 mb-8 text-center">
          <div className="py-4">
            <dt className="text-[10px] tracking-[0.3em] uppercase text-[#F4F1EC]/55 mb-1">Talla</dt>
            <dd className="text-lg font-medium">{variante?.talla ?? '—'}</dd>
          </div>
          <div className="py-4 border-x border-[#F4F1EC]/10">
            <dt className="text-[10px] tracking-[0.3em] uppercase text-[#F4F1EC]/55 mb-1">Certificación</dt>
            <dd className="text-lg font-medium">{product.certificacion ?? '—'}</dd>
          </div>
          <div className="py-4">
            <dt className="text-[10px] tracking-[0.3em] uppercase text-[#F4F1EC]/55 mb-1">Piezas</dt>
            <dd className="text-lg font-medium">Única</dd>
          </div>
        </dl>
      )}

      <div className="flex items-baseline gap-2 mb-6">
        {estado === 'vendida' ? (
          <span className="text-xl text-[#F4F1EC]/45">Pieza vendida</span>
        ) : precio !== null ? (
          <>
            <span className="text-3xl font-bold">{formatMXN(precio)}</span>
            <span className="text-[10px] tracking-[0.15em] uppercase text-[#F4F1EC]/45">MXN</span>
          </>
        ) : (
          <span className="text-xl text-[#F4F1EC]/75">Precio por confirmar</span>
        )}
      </div>

      {product.motivo_unico === 'electrico' && <AvisoElectrico className="mb-4" />}

      {estado === 'disponible' && variante && (
        <div className="mb-3">
          <BotonAgregarPieza nombre={product.nombre} sku={variante.sku_variante} talla={variante.talla} />
        </div>
      )}
      {estado === 'precio_por_definir' && (
        <Link
          href="/citas"
          className="block w-full text-center bg-[#C9A961] text-[#0A0A0A] py-4 text-sm font-bold tracking-[0.1em] uppercase hover:opacity-85 transition mb-3"
        >
          Agenda una cita en showroom
        </Link>
      )}

      <Link
        href={`/tienda/hedon/${product.slug}`}
        className="inline-block mt-3 text-xs tracking-[0.15em] uppercase text-[#C9A961] border-b border-[#C9A961]/40 pb-1 hover:border-[#C9A961] transition"
      >
        Ver ficha completa →
      </Link>
    </div>
  );
}

function TarjetaPieza({
  product,
  activa,
  onSelect,
}: {
  product: Product;
  activa: boolean;
  onSelect: () => void;
}) {
  const estado   = estadoPieza(product);
  const precio   = precioPieza(product);
  const variante = variantePieza(product);
  const vendida  = estado === 'vendida';

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={activa}
      className="group block text-left w-full"
    >
      <div
        className={`relative aspect-square bg-gradient-to-b from-[#1a1a1a] to-[#0d0d0d] overflow-hidden mb-4 border transition ${
          activa ? 'border-[#C9A961]' : 'border-transparent group-hover:border-[#F4F1EC]/20'
        }`}
      >
        <Image
          src={cloudinaryUrl(product.imagen_principal, 'card')}
          alt={`${product.nombre}, talla ${variante?.talla ?? ''}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-opacity duration-300 ${
            vendida ? 'grayscale opacity-50' : 'group-hover:opacity-90'
          }`}
        />
        <div className="absolute top-3 left-3">
          {vendida ? (
            <span className="bg-[#0A0A0A]/80 inline-block">
              <SelloVendida />
            </span>
          ) : (
            product.motivo_unico && (
              <span className="bg-[#0A0A0A]/70 inline-block">
                <SelloMotivo motivo={product.motivo_unico} conMicro={false} />
              </span>
            )
          )}
        </div>
        {activa && (
          <div className="absolute bottom-3 right-3 text-[9px] tracking-[0.2em] uppercase text-[#C9A961] font-mono">
            / En vitrina
          </div>
        )}
      </div>

      <div className="text-[10px] tracking-[0.2em] uppercase text-[#F4F1EC]/45 mb-1.5">
        {product.familia} · Talla {variante?.talla ?? '—'} · {product.certificacion}
      </div>
      <h3 className="text-lg font-medium leading-tight mb-2 text-[#F4F1EC] group-hover:text-[#C9A961] transition-colors">
        {esDGR(product) ? 'DGR 2026' : product.color}.
      </h3>

      {product.motivo_unico === 'electrico' && !vendida && <AvisoElectrico className="mt-3" />}

      <div className="flex items-center justify-between mt-3">
        {vendida ? (
          <span className="text-[11px] tracking-[0.15em] uppercase text-[#F4F1EC]/40">Pieza vendida</span>
        ) : precio !== null ? (
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-[#F4F1EC]">{formatMXN(precio)}</span>
            <span className="text-[10px] tracking-[0.1em] uppercase text-[#F4F1EC]/40">MXN</span>
          </div>
        ) : (
          <span className="text-sm text-[#F4F1EC]/70">Precio por confirmar</span>
        )}
        <span className="text-[10px] tracking-[0.15em] uppercase text-[#F4F1EC]/40 group-hover:text-[#C9A961] transition">
          {activa ? 'En vitrina' : 'Ver arriba ↑'}
        </span>
      </div>
    </button>
  );
}
