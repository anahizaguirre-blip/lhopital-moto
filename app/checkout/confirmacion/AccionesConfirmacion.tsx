'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';

/**
 * - pagada: vacía el carrito (solo aquí y solo con el pago confirmado).
 * - esperando: recarga el estado cada 3 s hasta 60 s.
 */
export function AccionesConfirmacion({ modo, ordenId }: { modo: 'pagada' | 'esperando'; ordenId: string }) {
  const router = useRouter();
  const { clear, hydrated } = useCart();
  const [agotado, setAgotado] = useState(false);

  useEffect(() => {
    if (modo === 'pagada' && hydrated) clear();
  }, [modo, hydrated, clear]);

  useEffect(() => {
    if (modo !== 'esperando') return;
    const inicio = Date.now();
    const id = setInterval(() => {
      if (Date.now() - inicio > 60_000) {
        clearInterval(id);
        setAgotado(true);
        return;
      }
      router.refresh();
    }, 3000);
    return () => clearInterval(id);
  }, [modo, router, ordenId]);

  if (modo === 'esperando' && agotado) {
    return (
      <p role="status" className="mb-8 border border-[#F4F1EC]/15 p-4 font-inter text-[14px] text-[#F4F1EC]/80">
        Sigue en proceso. Te avisaremos por correo en cuanto se confirme; no necesitas volver a pagar.
      </p>
    );
  }
  return null;
}
