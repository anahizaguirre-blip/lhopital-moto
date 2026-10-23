/**
 * Fuera de Serie — piezas Hedon únicas.
 * URL: /tienda/hedon/fuera-de-serie (no va en el menú principal)
 */

import Image from 'next/image';
import Link from 'next/link';
import Footer from '@/app/components/Footer';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { getPiezasUnicas, contarDisponibles } from '@/lib/fuera-de-serie-query';
import { estadoPieza, precioPieza, variantePieza, formatMXN } from '@/lib/fuera-de-serie';
import { TarjetaPieza } from '@/app/components/tienda/fuera-de-serie/TarjetaPieza';
import { SelloMotivo, SelloVendida, TextoDGR } from '@/app/components/tienda/fuera-de-serie/Sellos';
import { BotonAgregarPieza } from '@/app/components/tienda/fuera-de-serie/BotonAgregarPieza';

export const metadata = {
  title: 'Fuera de Serie · Tienda Hedon · Lhopital-moto',
  description: 'Cinco cascos Hedon que son piezas únicas. Cuando se van, se van.',
};

export const revalidate = 60;

export default async function FueraDeSeriePage() {
  const piezas = await getPiezasUnicas();
  const disponibles = contarDisponibles(piezas);

  const protagonista = piezas.find((p) => p.motivo_unico === 'edicion_limitada') ?? null;
  const resto = piezas.filter((p) => p !== protagonista);

  return (
    <main className="min-h-screen bg-hedon-brown text-hedon-cream font-almaq">

      {/* Hero */}
      <section className="pt-32 md:pt-40">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-6 flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase">
            <span className="inline-block w-6 h-px bg-hedon-brass" />
            <Link href="/tienda/hedon" className="text-hedon-brass hover:underline">Tienda · Hedon</Link>
          </div>
          <h1 className="text-5xl md:text-7xl font-medium leading-[0.95] mb-6">Fuera de Serie</h1>
          <p className="font-cormorant italic text-2xl md:text-3xl text-hedon-brass leading-snug max-w-2xl">
            Cinco cascos. Una sola vez. Cuando se van, se van.
          </p>
          <p className="mt-8 text-[11px] tracking-[0.3em] uppercase text-hedon-cream/70">
            <span className="text-hedon-cream text-base tracking-normal font-medium">{disponibles}</span>{' '}
            de {piezas.length} disponibles
          </p>
        </div>
      </section>

      {/* Pieza protagonista: Hedonist × DGR 2026 */}
      {protagonista && <Protagonista product={protagonista} />}

      {/* Las otras piezas */}
      <section className="pt-20 md:pt-28 pb-24">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-10 flex items-center gap-3">
            <span className="inline-block w-6 h-px bg-hedon-brass" />
            <h2 className="text-[10px] tracking-[0.3em] uppercase text-hedon-brass">Las otras piezas</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {resto.map((p) => (
              <TarjetaPieza key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <Footer bg="hedon" />
    </main>
  );
}

function Protagonista({ product }: { product: import('@/lib/types').Product }) {
  const estado   = estadoPieza(product);
  const precio   = precioPieza(product);
  const variante = variantePieza(product);
  const vendida  = estado === 'vendida';
  const href     = `/tienda/hedon/${product.slug}`;

  return (
    <section className="pt-16 md:pt-24">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-10 lg:gap-16 items-center border-t border-hedon-brass/25 pt-10 md:pt-14">
          <Link href={href} className="relative block aspect-[4/3] lg:aspect-square overflow-hidden bg-[#1f120b]">
            <Image
              src={cloudinaryUrl(product.imagen_principal, 'detail')}
              alt="Hedonist × DGR 2026, talla XL"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 55vw"
              className={`object-cover ${vendida ? 'grayscale opacity-50' : ''}`}
            />
          </Link>

          <div>
            <div className="mb-6">
              {vendida ? (
                <SelloVendida />
              ) : (
                product.motivo_unico && <SelloMotivo motivo={product.motivo_unico} />
              )}
            </div>

            <TextoDGR />

            <div className="mt-8 flex flex-wrap items-center gap-6">
              {estado === 'disponible' && precio !== null && variante && (
                <>
                  <p className="text-3xl font-medium">
                    {formatMXN(precio)} <span className="text-[10px] tracking-[0.15em] text-hedon-cream/45">MXN</span>
                  </p>
                  <div className="w-full sm:w-64">
                    <BotonAgregarPieza nombre={product.nombre} sku={variante.sku_variante} talla={variante.talla} />
                  </div>
                </>
              )}
              {estado === 'precio_por_definir' && (
                <>
                  <p className="text-lg text-hedon-cream/75">Precio por confirmar</p>
                  <Link
                    href="/citas"
                    className="border border-hedon-brass text-hedon-brass px-6 py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-hedon-brass hover:text-hedon-brown transition"
                  >
                    Agenda una cita en showroom
                  </Link>
                </>
              )}
              <Link
                href={href}
                className="text-xs tracking-[0.15em] uppercase text-hedon-brass border-b border-hedon-brass/40 pb-1 hover:border-hedon-brass transition"
              >
                Ver la pieza →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
