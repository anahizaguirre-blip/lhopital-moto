'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';

/** Agrega al carrito y deja `agregado` en true unos segundos para dar feedback. */
export function useAgregarCarrito(duracionMs = 4000) {
  const { addItem } = useCart();
  const [agregado, setAgregado] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const agregar = useCallback(
    (sku: string, qty = 1, max?: number) => {
      addItem(sku, qty, max);
      setAgregado(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setAgregado(false), duracionMs);
    },
    [addItem, duracionMs]
  );

  return { agregar, agregado };
}

export function AvisoAgregado({ visible, className = '' }: { visible: boolean; className?: string }) {
  if (!visible) return null;
  return (
    <p role="status" className={`font-inter text-[14px] text-emerald-300/90 ${className}`}>
      Agregado al carrito ·{' '}
      <Link href="/carrito" className="text-[#C9A961] underline underline-offset-4">
        Ver carrito
      </Link>
    </p>
  );
}
