/**
 * /checkout/pago?orden=<uuid> — temporal hasta la Fase 3, donde aquí va
 * el Card Payment Brick de Mercado Pago. Por ahora confirma que la orden
 * quedó creada en `pago_pendiente`.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import Footer from '@/app/components/Footer';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { formatoMXN } from '@/lib/venta';

export const metadata: Metadata = {
  title: 'Pago · Lhopital-moto',
  robots: { index: false },
};

export const dynamic = 'force-dynamic';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface PageProps {
  searchParams: Promise<{ orden?: string }>;
}

export default async function PagoPage({ searchParams }: PageProps) {
  const { orden: ordenId } = await searchParams;

  const orden =
    ordenId && UUID.test(ordenId)
      ? (
          await createSupabaseAdmin()
            .from('orders')
            .select('numero_orden, estado, subtotal, envio, total, metodo_entrega')
            .eq('id', ordenId)
            .maybeSingle()
        ).data
      : null;

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F1EC]">
      <section className="pt-32 pb-20">
        <div className="w-full max-w-[720px] mx-auto px-4 sm:px-10">
          {orden ? (
            <>
              <p className="font-mono text-[12px] tracking-[0.15em] text-[#C9A961] mb-3">
                PEDIDO {orden.numero_orden}
              </p>
              <h1 className="font-sora font-bold text-[32px] md:text-[40px] tracking-[-0.02em] leading-tight mb-6">
                Tu pedido está apartado
              </h1>
              <p className="font-inter text-[17px] text-[#F4F1EC]/75 leading-relaxed mb-10">
                Guardamos tu pedido con estado <strong className="text-[#F4F1EC]">pago pendiente</strong>. El pago con
                tarjeta se habilita en este paso muy pronto.
              </p>

              <dl className="border border-[#F4F1EC]/10 p-6 font-inter text-[15px] space-y-3 mb-10">
                <div className="flex justify-between">
                  <dt className="text-[#F4F1EC]/65">Subtotal</dt>
                  <dd>{formatoMXN(Number(orden.subtotal))}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#F4F1EC]/65">
                    {orden.metodo_entrega === 'recoleccion' ? 'Recolección en showroom' : 'Envío a domicilio'}
                  </dt>
                  <dd>{Number(orden.envio) === 0 ? 'Gratis' : formatoMXN(Number(orden.envio))}</dd>
                </div>
                <div className="flex justify-between pt-3 border-t border-[#F4F1EC]/10 text-[17px] font-semibold">
                  <dt>Total</dt>
                  <dd>{formatoMXN(Number(orden.total))}</dd>
                </div>
              </dl>
            </>
          ) : (
            <>
              <h1 className="font-sora font-bold text-[32px] tracking-[-0.02em] mb-6">No encontramos este pedido</h1>
              <p className="font-inter text-[17px] text-[#F4F1EC]/75 mb-10">
                Revisa el enlace o vuelve a tu carrito.
              </p>
            </>
          )}

          <Link href="/carrito" className="font-inter text-[15px] text-[#C9A961] underline underline-offset-4">
            Volver al carrito
          </Link>
        </div>
      </section>
      <Footer bg="dark" />
    </main>
  );
}
