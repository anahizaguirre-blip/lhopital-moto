/**
 * /checkout/pago?orden=<uuid> — resumen de la orden + Card Payment Brick.
 * Solo la abre el navegador que creó la orden (cookie firmada).
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Footer from '@/app/components/Footer';
import { cargarOrdenDelComprador } from '@/lib/orden-cliente';
import { mpMaxInstallments, mpPublicKey } from '@/lib/mp-config';
import { formatoMXN, linkWhatsApp, WHATSAPP } from '@/lib/venta';
import { pagosEnLineaActivos } from '@/lib/pagos-estado';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { formatearDireccion } from '@/lib/orders-format';
import { PagoBrick } from './PagoBrick';

export const metadata: Metadata = {
  title: 'Pago · Lhopital-moto',
  robots: { index: false },
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ orden?: string }>;
}

export default async function PagoPage({ searchParams }: PageProps) {
  const { orden: ordenId } = await searchParams;
  const resultado = await cargarOrdenDelComprador(ordenId);

  if (resultado.tipo !== 'ok') {
    return (
      <Marco>
        <h1 className="font-sora font-bold text-[32px] tracking-[-0.02em] mb-6">
          {resultado.tipo === 'sin_acceso' ? 'Este pedido no está disponible aquí' : 'No encontramos este pedido'}
        </h1>
        <p className="font-inter text-[17px] text-[#F4F1EC]/75 mb-10 max-w-xl">
          {resultado.tipo === 'sin_acceso'
            ? 'Por seguridad, solo puedes pagar un pedido desde el navegador donde lo creaste.'
            : 'Revisa el enlace o vuelve a tu carrito.'}
        </p>
        <Link href="/carrito" className="font-inter text-[15px] text-[#C9A961] underline underline-offset-4">
          Volver al carrito
        </Link>
      </Marco>
    );
  }

  const orden = resultado.orden;
  if (orden.estado !== 'pago_pendiente') {
    redirect(`/checkout/confirmacion?orden=${orden.id}`);
  }

  const publicKey = mpPublicKey();
  const recoleccion = orden.metodo_entrega === 'recoleccion';
  const direccion = formatearDireccion(orden.direccion_envio);

  return (
    <Marco>
      <p className="font-mono text-[12px] tracking-[0.15em] text-[#C9A961] mb-3">PEDIDO {orden.numero_orden}</p>
      <h1 className="font-sora font-bold text-[32px] md:text-[44px] tracking-[-0.02em] leading-tight mb-10">
        {pagosEnLineaActivos() ? 'Pago' : 'Pedido apartado'}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-10 lg:gap-16 items-start">
        {/* Resumen */}
        <section className="border border-[#F4F1EC]/10 p-6 min-w-0">
          <h2 className="font-sora font-bold text-[18px] mb-5">Tu pedido</h2>
          <ul className="divide-y divide-[#F4F1EC]/8 mb-5">
            {orden.items.map((it) => (
              <li key={it.id} className="flex gap-3 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- miniatura de Cloudinary */}
                <img
                  src={cloudinaryUrl(it.imagen_principal?.split(',')[0]?.trim(), 'thumbnail')}
                  alt=""
                  width={56}
                  height={56}
                  className="w-14 h-14 object-cover bg-[#1a1a1a] shrink-0"
                />
                <div className="flex-1 min-w-0 font-inter">
                  <p className="text-[14px] text-[#F4F1EC] leading-snug">{it.nombre_snapshot}</p>
                  <p className="text-[12px] text-[#F4F1EC]/55">Cant. {it.cantidad}</p>
                </div>
                <p className="font-inter text-[14px] whitespace-nowrap">{formatoMXN(Number(it.subtotal))}</p>
              </li>
            ))}
          </ul>

          <dl className="font-inter text-[15px] space-y-3 border-t border-[#F4F1EC]/10 pt-5">
            <div className="flex justify-between gap-4">
              <dt className="text-[#F4F1EC]/65">Subtotal</dt>
              <dd>{formatoMXN(Number(orden.subtotal))}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#F4F1EC]/65">{recoleccion ? 'Recolección en showroom' : 'Envío a domicilio'}</dt>
              <dd>{Number(orden.envio) === 0 ? 'Gratis' : formatoMXN(Number(orden.envio))}</dd>
            </div>
            <div className="flex justify-between gap-4 pt-3 border-t border-[#F4F1EC]/10 text-[17px] font-semibold">
              <dt>Total</dt>
              <dd>{formatoMXN(Number(orden.total))}</dd>
            </div>
          </dl>

          {!recoleccion && direccion.length > 0 && (
            <div className="mt-6 pt-5 border-t border-[#F4F1EC]/10 font-inter text-[14px] text-[#F4F1EC]/70 leading-relaxed">
              <p className="text-[12px] tracking-[0.1em] uppercase text-[#F4F1EC]/45 mb-2">Se enviará a</p>
              {direccion.map((l, i) => (
                <p key={i}>{l}</p>
              ))}
            </div>
          )}
        </section>

        {/* Brick, o WhatsApp mientras el cobro en línea está en pausa */}
        <section className="min-w-0">
          {!pagosEnLineaActivos() ? (
            <BloqueWhatsApp
              numero={orden.numero_orden}
              total={Number(orden.total)}
              recoleccion={recoleccion}
              items={orden.items.map((it) => `${it.cantidad} × ${it.nombre_snapshot}`)}
            />
          ) : publicKey ? (
            <PagoBrick
              ordenId={orden.id}
              total={Number(orden.total)}
              email={orden.email_cliente ?? ''}
              publicKey={publicKey}
              maxInstallments={mpMaxInstallments()}
            />
          ) : (
            <p className="font-inter text-[15px] text-red-200">
              El pago con tarjeta no está disponible en este momento. Escríbenos a contacto@lhopital.mx.
            </p>
          )}
        </section>
      </div>
    </Marco>
  );
}

function BloqueWhatsApp({
  numero,
  total,
  recoleccion,
  items,
}: {
  numero: string;
  total: number;
  recoleccion: boolean;
  items: string[];
}) {
  const mensaje = [
    `Hola, quiero completar mi pedido #${numero} de la tienda Lhopital.`,
    ...items,
    `Total: ${formatoMXN(total)} (${recoleccion ? 'recolección en showroom' : 'envío a domicilio'})`,
  ].join('\n');

  return (
    <div className="border border-[#F4F1EC]/10 p-6">
      <h2 className="font-sora font-bold text-[20px] mb-3">Tu pedido está apartado</h2>
      <p className="font-inter text-[16px] leading-relaxed text-[#F4F1EC]/80 mb-6">
        El pago con tarjeta en línea estará disponible muy pronto. Para terminar tu compra, escríbenos por WhatsApp con
        tu número de pedido <strong className="text-[#F4F1EC]">#{numero}</strong>; te confirmamos existencias y la forma
        de pago.
      </p>
      <a
        href={linkWhatsApp(mensaje)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full bg-[#F4F1EC] text-[#0A0A0A] py-4 font-sora font-bold text-[13px] tracking-[0.1em] uppercase hover:bg-[#C9A961] transition"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.1 5.1 0 0 0 1.1 2.7 11.7 11.7 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .2-1.3c-.1-.1-.2-.2-.4-.3Z" />
        </svg>
        Terminar compra por WhatsApp
      </a>
      <p className="mt-4 font-inter text-[14px] text-[#F4F1EC]/60 text-center">
        WhatsApp {WHATSAPP.visible} · contacto@lhopital.mx
      </p>
    </div>
  );
}

function Marco({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F1EC]">
      <section className="pt-32 pb-20">
        <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-10 lg:px-16">{children}</div>
      </section>
      <Footer bg="dark" />
    </main>
  );
}
