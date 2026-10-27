'use client';

import { useAgregarCarrito, AvisoAgregado } from '../useAgregarCarrito';

interface Props {
  nombre: string;
  sku: string;
  talla: string | null;
}

/** CTA de compra de una pieza única. Cantidad fija en 1. */
export function BotonAgregarPieza({ nombre, sku, talla }: Props) {
  const { agregar, agregado } = useAgregarCarrito();

  return (
    <>
      <button
        onClick={() => agregar(sku, 1, 1)}
        aria-label={`Agregar al carrito: ${nombre}${talla ? `, talla ${talla}` : ''}`}
        className="w-full bg-[#F5EFE0] text-[#2A1810] py-3 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#C9A961] transition"
      >
        Agregar al carrito
      </button>
      <AvisoAgregado visible={agregado} className="mt-3" />
    </>
  );
}
