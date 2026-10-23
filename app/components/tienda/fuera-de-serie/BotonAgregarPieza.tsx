'use client';

interface Props {
  nombre: string;
  sku: string;
  talla: string | null;
}

/** CTA de compra de una pieza única. Cantidad fija en 1. */
export function BotonAgregarPieza({ nombre, sku, talla }: Props) {
  const handleClick = () => {
    // TODO(fuera-de-serie): conectar al carrito/checkout. El descuento de
    // stock debe ser atómico y condicionado antes de cobrar (ver
    // BloquePiezaUnica en ProductDetail.tsx).
    alert(
      `[PLACEHOLDER]\n\nProducto: ${nombre}\nTalla: ${talla ?? '—'}\nCantidad: 1\nSKU: ${sku}\n\nEl carrito se conecta en el siguiente paso.`
    );
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-[#F5EFE0] text-[#2A1810] py-3 text-[11px] font-bold tracking-[0.2em] uppercase hover:bg-[#C9A961] transition"
    >
      Agregar al carrito
    </button>
  );
}
