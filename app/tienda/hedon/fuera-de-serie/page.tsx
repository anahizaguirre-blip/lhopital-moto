/**
 * Fuera de Serie — piezas Hedon únicas.
 * URL: /tienda/hedon/fuera-de-serie (no va en el menú principal)
 *
 * Parte de la tienda: mismo fondo negro y mismo hero que /tienda/hedon.
 * El café de Hedon se reserva para el story en /hedon.
 */

import Link from 'next/link';
import Footer from '@/app/components/Footer';
import { getPiezasUnicas, contarDisponibles } from '@/lib/fuera-de-serie-query';
import { vistasExistentes } from '@/lib/cloudinary-vistas';
import { VitrinaFueraDeSerie } from '@/app/components/tienda/fuera-de-serie/VitrinaFueraDeSerie';

export const metadata = {
  title: 'Fuera de Serie · Tienda Hedon · Lhopital-moto',
  description: 'Cinco cascos Hedon que son piezas únicas. Cuando se van, se van.',
};

export const revalidate = 60;

export default async function FueraDeSeriePage() {
  const piezas = await getPiezasUnicas();
  const disponibles = contarDisponibles(piezas);

  const vistasPorPieza = Object.fromEntries(
    await Promise.all(piezas.map(async (p) => [p.id, await vistasExistentes(p.imagen_principal)] as const))
  );

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F1EC]">

      {/* Hero — mismo patrón que /tienda/hedon */}
      <section className="pt-32">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

          <div className="mb-4 flex items-center gap-2">
            <span className="inline-block w-6 h-px bg-[#C9A961]" />
            <Link
              href="/tienda/hedon"
              className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961] hover:underline"
            >
              Tienda · Hedon
            </Link>
          </div>

          <h1 className="font-cormorant text-5xl md:text-7xl font-medium italic text-[#F4F1EC] leading-[0.95] mb-6">
            Fuera de Serie. <br />
            <span className="text-[#C9A961]">Cinco cascos. Una sola vez.</span>
          </h1>

          <p className="font-cormorant italic text-[#F4F1EC]/60 text-xl md:text-2xl max-w-2xl leading-relaxed">
            Cuando se van, se van.
          </p>

          <p className="mt-8 text-xs tracking-[0.15em] uppercase text-[#C9A961]">
            {disponibles} de {piezas.length} disponibles
          </p>

        </div>
      </section>

      <VitrinaFueraDeSerie piezas={piezas} vistasPorPieza={vistasPorPieza} />

      <Footer bg="dark" />

    </main>
  );
}
