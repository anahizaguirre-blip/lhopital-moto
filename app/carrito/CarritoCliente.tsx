'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import { ETIQUETA_DISPONIBILIDAD, formatoMXN } from '@/lib/venta';
import type { LineaResuelta } from '@/lib/carrito-server';

const TIENDAS = [
  { href: '/tienda/hedon', marca: 'Hedon', texto: 'Cascos hechos a mano' },
  { href: '/tienda/moto-ii', marca: 'Moto II', texto: 'Navegación para moto' },
  { href: '/tienda/tees', marca: 'Tees', texto: 'Playeras Lhopital' },
];

type Estado = 'cargando' | 'listo' | 'error';

export function CarritoCliente() {
  const { items, hydrated, setQty, removeItem } = useCart();
  const [lineas, setLineas] = useState<Record<string, LineaResuelta>>({});
  const [estado, setEstado] = useState<Estado>('cargando');
  const [avisos, setAvisos] = useState<string[]>([]);

  // Solo vuelve a pedir datos cuando cambia el conjunto de productos, no la cantidad.
  const claveSkus = useMemo(() => items.map((i) => i.sku).sort().join('|'), [items]);

  useEffect(() => {
    if (!hydrated) return;
    if (!claveSkus) {
      setLineas({});
      setEstado('listo');
      return;
    }
    let cancelado = false;
    setEstado('cargando');
    fetch('/api/carrito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skus: claveSkus.split('|') }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((data: { lineas: Record<string, LineaResuelta> }) => {
        if (cancelado) return;
        setLineas(data.lineas);
        setEstado('listo');
      })
      .catch(() => !cancelado && setEstado('error'));
    return () => {
      cancelado = true;
    };
  }, [claveSkus, hydrated]);

  // Ajusta cantidades que rebasan el stock actual (o productos que ya no existen).
  useEffect(() => {
    if (estado !== 'listo') return;
    const nuevos: string[] = [];
    for (const item of items) {
      const l = lineas[item.sku];
      if (!l) {
        removeItem(item.sku);
        nuevos.push('Quitamos un producto que ya no está en el catálogo.');
      } else if (l.maxCantidad > 0 && item.qty > l.maxCantidad) {
        setQty(item.sku, l.maxCantidad);
        nuevos.push(
          `${l.nombre}: solo hay ${l.maxCantidad} ${l.maxCantidad === 1 ? 'pieza disponible' : 'piezas disponibles'}, ajustamos la cantidad.`
        );
      }
    }
    if (nuevos.length) setAvisos((prev) => [...prev, ...nuevos]);
  }, [estado, lineas, items, setQty, removeItem]);

  const filas = items
    .map((item) => ({ item, linea: lineas[item.sku] }))
    .filter((f): f is { item: typeof f.item; linea: LineaResuelta } => Boolean(f.linea));

  const disponibles = filas.filter((f) => f.linea.disponibilidad !== 'no_disponible');
  const hayNoDisponibles = filas.length > disponibles.length;
  const subtotal = disponibles.reduce((s, f) => s + f.linea.precio * f.item.qty, 0);
  const piezas = disponibles.reduce((s, f) => s + f.item.qty, 0);

  if (!hydrated || (estado === 'cargando' && filas.length === 0 && items.length > 0)) {
    return (
      <Contenedor>
        <p className="font-inter text-[15px] text-[#F4F1EC]/55">Cargando tu carrito…</p>
      </Contenedor>
    );
  }

  if (items.length === 0) {
    return (
      <Contenedor>
        <div className="max-w-2xl">
          <p className="font-inter text-[17px] text-[#F4F1EC]/75 leading-relaxed mb-10">
            Tu carrito está vacío. Elige por dónde empezar:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {TIENDAS.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="group border border-[#F4F1EC]/15 hover:border-[#C9A961] p-6 transition"
              >
                <div className="font-sora font-bold text-[20px] mb-2 group-hover:text-[#C9A961] transition">
                  {t.marca}
                </div>
                <div className="font-inter text-[14px] text-[#F4F1EC]/60">{t.texto}</div>
                <div className="mt-6 text-[11px] tracking-[0.15em] uppercase text-[#C9A961]">Ver tienda →</div>
              </Link>
            ))}
          </div>
        </div>
      </Contenedor>
    );
  }

  return (
    <Contenedor>
      {estado === 'error' && (
        <div className="mb-8 border border-red-400/40 bg-red-400/5 p-4 font-inter text-[14px] text-red-200">
          No pudimos actualizar precios y existencias. Revisa tu conexión y recarga la página.
        </div>
      )}

      {avisos.length > 0 && (
        <div className="mb-8 border border-[#C9A961]/40 bg-[#C9A961]/5 p-4 font-inter text-[14px] text-[#F4F1EC]/85 space-y-1">
          {[...new Set(avisos)].map((a) => (
            <p key={a}>{a}</p>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 lg:gap-16 items-start">
        {/* Líneas */}
        <ul className="border-t border-[#F4F1EC]/10">
          {filas.map(({ item, linea }) => (
            <LineaCarrito
              key={item.sku}
              linea={linea}
              qty={item.qty}
              onQty={(q) => setQty(item.sku, q)}
              onQuitar={() => removeItem(item.sku)}
            />
          ))}
        </ul>

        {/* Resumen */}
        <aside className="border border-[#F4F1EC]/10 p-6 lg:sticky lg:top-28">
          <h2 className="font-sora font-bold text-[18px] mb-6">Resumen</h2>
          <dl className="font-inter text-[15px] space-y-4">
            <div className="flex justify-between gap-4">
              <dt className="text-[#F4F1EC]/65">
                Subtotal ({piezas} {piezas === 1 ? 'pieza' : 'piezas'})
              </dt>
              <dd className="text-[#F4F1EC] whitespace-nowrap">{formatoMXN(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#F4F1EC]/65">Envío o recolección</dt>
              <dd className="text-[#F4F1EC]/65 text-right">Se calcula en el checkout</dd>
            </div>
          </dl>

          {hayNoDisponibles && (
            <p className="mt-6 font-inter text-[13px] text-red-200 leading-relaxed">
              Quita los productos sin existencias para continuar.
            </p>
          )}

          {disponibles.length > 0 && !hayNoDisponibles && estado === 'listo' ? (
            <Link
              href="/checkout"
              className="mt-8 block w-full text-center bg-[#F4F1EC] text-[#0A0A0A] py-4 font-sora font-bold text-[13px] tracking-[0.1em] uppercase hover:bg-[#C9A961] transition"
            >
              Continuar al checkout
            </Link>
          ) : (
            <span
              aria-disabled="true"
              className="mt-8 block w-full text-center bg-[#F4F1EC]/20 text-[#0A0A0A]/70 py-4 font-sora font-bold text-[13px] tracking-[0.1em] uppercase cursor-not-allowed"
            >
              Continuar al checkout
            </span>
          )}

          <Link
            href="/tienda"
            className="mt-4 block text-center font-inter text-[13px] text-[#F4F1EC]/60 hover:text-[#C9A961] transition"
          >
            Seguir comprando
          </Link>
        </aside>
      </div>
    </Contenedor>
  );
}

function Contenedor({ children }: { children: React.ReactNode }) {
  return (
    <section className="pt-32 pb-20">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-10 lg:px-16">
        <h1 className="font-sora font-bold text-[32px] md:text-[44px] tracking-[-0.02em] leading-tight mb-10">
          Tu carrito
        </h1>
        {children}
      </div>
    </section>
  );
}

function LineaCarrito({
  linea,
  qty,
  onQty,
  onQuitar,
}: {
  linea: LineaResuelta;
  qty: number;
  onQty: (q: number) => void;
  onQuitar: () => void;
}) {
  const agotado = linea.disponibilidad === 'no_disponible';
  const max = Math.max(linea.maxCantidad, 1);

  return (
    <li className="flex gap-4 sm:gap-6 py-6 border-b border-[#F4F1EC]/10">
      <Link href={linea.href} className="shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element -- miniatura de Cloudinary ya optimizada */}
        <img
          src={linea.imagen}
          alt={linea.nombre}
          width={112}
          height={112}
          className={`w-20 h-20 sm:w-28 sm:h-28 object-cover bg-[#1a1a1a] ${agotado ? 'opacity-40' : ''}`}
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={linea.href}
              className="font-sora font-bold text-[16px] sm:text-[18px] leading-snug hover:text-[#C9A961] transition"
            >
              {linea.nombre}
            </Link>
            {linea.detalle && (
              <p className="font-inter text-[14px] text-[#F4F1EC]/60 mt-1">{linea.detalle}</p>
            )}
            <p
              className={`font-inter text-[13px] mt-1 ${
                agotado
                  ? 'text-red-300'
                  : linea.disponibilidad === 'bajo_pedido'
                  ? 'text-[#9DC5F0]'
                  : 'text-emerald-300/90'
              }`}
            >
              {ETIQUETA_DISPONIBILIDAD[linea.disponibilidad]}
            </p>
          </div>
          <div className="text-right font-inter text-[15px] whitespace-nowrap">
            {formatoMXN(linea.precio * qty)}
            {qty > 1 && (
              <div className="text-[12px] text-[#F4F1EC]/50">{formatoMXN(linea.precio)} c/u</div>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          {agotado ? (
            <span className="font-inter text-[13px] text-[#F4F1EC]/50">Ya no está disponible</span>
          ) : linea.piezaUnica ? (
            <span className="font-inter text-[13px] text-[#F4F1EC]/60">Pieza única · 1</span>
          ) : (
            <div className="flex border border-[#F4F1EC]/20" role="group" aria-label={`Cantidad de ${linea.nombre}`}>
              <button
                type="button"
                onClick={() => onQty(qty - 1)}
                disabled={qty <= 1}
                aria-label="Quitar una"
                className="w-10 h-10 hover:bg-[#F4F1EC]/5 transition disabled:opacity-30"
              >
                −
              </button>
              <div className="w-11 h-10 flex items-center justify-center border-x border-[#F4F1EC]/20 font-inter text-[15px]">
                {qty}
              </div>
              <button
                type="button"
                onClick={() => onQty(Math.min(qty + 1, max))}
                disabled={qty >= max}
                aria-label="Agregar una"
                className="w-10 h-10 hover:bg-[#F4F1EC]/5 transition disabled:opacity-30"
              >
                +
              </button>
            </div>
          )}
          <button
            type="button"
            onClick={onQuitar}
            className="font-inter text-[13px] text-[#F4F1EC]/55 hover:text-[#C9A961] underline underline-offset-4 transition"
          >
            Quitar
          </button>
        </div>
      </div>
    </li>
  );
}
