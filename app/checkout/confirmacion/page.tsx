/**
 * /checkout/confirmacion?orden=<uuid> — estado del pago para el comprador.
 * Misma cookie firmada que /checkout/pago.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Footer from '@/app/components/Footer';
import { cargarOrdenDelComprador } from '@/lib/orden-cliente';
import { formatearDireccion } from '@/lib/orders-format';
import { formatoMXN, SHOWROOM } from '@/lib/venta';
import { LEGAL_RUTAS } from '@/lib/legal-rutas';
import { AccionesConfirmacion } from './AccionesConfirmacion';

export const metadata: Metadata = {
  title: 'Confirmación · Lhopital-moto',
  robots: { index: false },
};

export const dynamic = 'force-dynamic';

interface PageProps {
  searchParams: Promise<{ orden?: string }>;
}

export default async function ConfirmacionPage({ searchParams }: PageProps) {
  const { orden: ordenId } = await searchParams;
  const r = await cargarOrdenDelComprador(ordenId);

  if (r.tipo !== 'ok') {
    return (
      <Marco>
        <h1 className="font-sora font-bold text-[32px] tracking-[-0.02em] mb-6">No encontramos este pedido</h1>
        <Link href="/tienda" className="font-inter text-[15px] text-[#C9A961] underline underline-offset-4">
          Ir a la tienda
        </Link>
      </Marco>
    );
  }

  const orden = r.orden;
  const pagada = ['pagada', 'preparando', 'enviada', 'entregada'].includes(orden.estado);

  if (orden.estado === 'pago_pendiente') {
    return (
      <Marco>
        <AccionesConfirmacion modo="esperando" ordenId={orden.id} />
        <p className="font-mono text-[12px] tracking-[0.15em] text-[#C9A961] mb-3">PEDIDO {orden.numero_orden}</p>
        <h1 className="font-sora font-bold text-[32px] md:text-[40px] tracking-[-0.02em] leading-tight mb-6">
          Estamos confirmando tu pago…
        </h1>
        <p className="font-inter text-[17px] text-[#F4F1EC]/75 leading-relaxed max-w-xl">
          Tu banco está procesando el cargo. Esta página se actualiza sola; si tarda, te avisaremos por correo a{' '}
          <strong className="text-[#F4F1EC]">{orden.email_cliente}</strong> en cuanto se confirme.
        </p>
      </Marco>
    );
  }

  if (!pagada) {
    redirect(`/checkout/pago?orden=${orden.id}`);
  }

  const nombre = orden.nombre_cliente?.split(' ')[0] ?? '';
  const recoleccion = orden.metodo_entrega === 'recoleccion';
  const direccion = formatearDireccion(orden.direccion_envio);

  return (
    <Marco>
      <AccionesConfirmacion modo="pagada" ordenId={orden.id} />
      <p className="font-mono text-[12px] tracking-[0.15em] text-[#C9A961] mb-4">PEDIDO {orden.numero_orden}</p>
      <h1 className="font-sora font-bold text-[34px] md:text-[48px] tracking-[-0.02em] leading-[1.1] mb-6 max-w-2xl">
        Gracias{nombre ? `, ${nombre}` : ''}. Tu pedido está confirmado.
      </h1>
      <p className="font-inter text-[17px] text-[#F4F1EC]/75 mb-12">
        Te enviamos la confirmación a <strong className="text-[#F4F1EC]">{orden.email_cliente}</strong>.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        <section className="border border-[#F4F1EC]/10 p-6">
          <h2 className="font-sora font-bold text-[18px] mb-5">Resumen</h2>
          <ul className="divide-y divide-[#F4F1EC]/8 mb-5 font-inter">
            {orden.items.map((it) => (
              <li key={it.id} className="flex justify-between gap-4 py-3">
                <span className="text-[14px]">
                  {it.nombre_snapshot}
                  <span className="block text-[12px] text-[#F4F1EC]/55">Cant. {it.cantidad}</span>
                </span>
                <span className="text-[14px] whitespace-nowrap">{formatoMXN(Number(it.subtotal))}</span>
              </li>
            ))}
          </ul>
          <dl className="font-inter text-[15px] space-y-3 border-t border-[#F4F1EC]/10 pt-5">
            <div className="flex justify-between"><dt className="text-[#F4F1EC]/65">Subtotal</dt><dd>{formatoMXN(Number(orden.subtotal))}</dd></div>
            <div className="flex justify-between">
              <dt className="text-[#F4F1EC]/65">{recoleccion ? 'Recolección en showroom' : 'Envío'}</dt>
              <dd>{Number(orden.envio) === 0 ? 'Gratis' : formatoMXN(Number(orden.envio))}</dd>
            </div>
            <div className="flex justify-between pt-3 border-t border-[#F4F1EC]/10 text-[17px] font-semibold"><dt>Total</dt><dd>{formatoMXN(Number(orden.total))}</dd></div>
          </dl>
          {orden.tarjeta_ultimos4 && (
            <p className="mt-4 font-inter text-[13px] text-[#F4F1EC]/55">Pagado con tarjeta terminación {orden.tarjeta_ultimos4}</p>
          )}
        </section>

        <section className="font-inter text-[15px] leading-relaxed text-[#F4F1EC]/80 space-y-4">
          <h2 className="font-sora font-bold text-[18px] text-[#F4F1EC]">{recoleccion ? 'Recolección en showroom' : 'Envío'}</h2>
          {recoleccion ? (
            <>
              <p>Te avisaremos por correo cuando tu pedido esté listo.</p>
              <p className="text-[#F4F1EC]">{SHOWROOM.direccion}</p>
              <p>
                {SHOWROOM.horario[0]}<br />{SHOWROOM.horario[1]} ·{' '}
                <Link href={SHOWROOM.citasHref} className="text-[#C9A961] underline underline-offset-4">previa cita</Link>
              </p>
              <p>Tienes 10 días naturales para recogerlo. Trae tu número de pedido e identificación oficial.</p>
            </>
          ) : (
            <>
              {direccion.length > 0 && (
                <div className="text-[#F4F1EC]">{direccion.map((l, i) => <p key={i}>{l}</p>)}</div>
              )}
              <p>
                Te enviaremos el número de guía cuando tu pedido salga. Productos en stock: hasta 30 días naturales;
                bajo pedido: hasta 90.
              </p>
            </>
          )}
          <p className="pt-4 border-t border-[#F4F1EC]/10">
            ¿Necesitas factura? Escribe a factura@lhopital.mx dentro de los 5 días naturales siguientes a recibir tu
            pedido, con tu Constancia de Situación Fiscal y uso de CFDI.
          </p>
          <p className="text-[13px] text-[#F4F1EC]/55">
            <Link href={LEGAL_RUTAS.entrega} className="underline underline-offset-4 hover:text-[#C9A961]">Políticas de entrega</Link>
            {' · '}
            <Link href={LEGAL_RUTAS.devoluciones} className="underline underline-offset-4 hover:text-[#C9A961]">Política de devoluciones</Link>
            {' · '}contacto@lhopital.mx · +52 (55) 9462 1951
          </p>
        </section>
      </div>
    </Marco>
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
