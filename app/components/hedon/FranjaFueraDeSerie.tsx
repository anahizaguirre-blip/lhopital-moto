import Link from 'next/link';
import { getPiezasUnicas, contarDisponibles } from '@/lib/fuera-de-serie-query';
import { FUERA_DE_SERIE_HREF } from '@/lib/fuera-de-serie';

/** Franja delgada entre "03 La Colección" y "04 Anatomía". Se oculta sin piezas disponibles. */
export default async function FranjaFueraDeSerie() {
  const disponibles = contarDisponibles(await getPiezasUnicas());
  if (disponibles === 0) return null;

  return (
    <section className="bg-hedon-brown pt-16 md:pt-20">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <Link
          href={FUERA_DE_SERIE_HREF}
          className="group flex items-center justify-between gap-4 border-y border-hedon-brass/30 py-4 text-hedon-cream hover:border-hedon-brass transition"
        >
          <span className="font-cormorant italic text-xl md:text-2xl">
            También hay piezas Fuera de Serie
          </span>
          <span className="font-almaq text-hedon-brass text-lg transition-transform group-hover:translate-x-1" aria-hidden>
            →
          </span>
        </Link>
      </div>
    </section>
  );
}
