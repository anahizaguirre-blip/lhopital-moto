import Image from 'next/image'
import Link from 'next/link'

export default function HeroHedon() {
  return (
    <section
      aria-label="Hero Hedon"
      className="relative w-full bg-hedon-brown overflow-hidden"
    >
      {/* Grid principal: 1 col en mobile, 2 cols 50/50 en desktop */}
      <div className="mx-auto max-w-[1440px] grid grid-cols-1 lg:grid-cols-2 min-h-[100svh]">

        {/* COLUMNA IZQUIERDA · Copy */}
        <div className="flex flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 lg:py-24 order-2 lg:order-1">

          {/* Microcopy superior con guion editorial */}
          <div
            className="flex items-center gap-4 mb-10 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span
              aria-hidden="true"
              className="block w-10 h-px bg-hedon-brass"
            />
            <p className="font-almaq text-hedon-brass text-xs tracking-[0.25em] uppercase">
              Made in United Kingdom
            </p>
          </div>

          {/* Título principal */}
          <h1
            className="font-rider text-hedon-cream text-6xl sm:text-7xl lg:text-8xl xl:text-9xl leading-[0.95] tracking-tight mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.25s' }}
          >
            Hedon.
          </h1>

          {/* Subtítulo en cursiva (Cormorant) */}
          <p
            className="font-cormorant italic text-hedon-cream text-2xl sm:text-3xl lg:text-4xl leading-snug mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            Cascos sin compromiso.
          </p>

          {/* Descriptor en una sola línea */}
          <p
            className="font-almaq text-hedon-brass/70 text-base sm:text-lg leading-relaxed max-w-xl mb-12 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.55s' }}
          >
            Diseñados en Londres. Curados en México por Lhopital.
          </p>

          {/* CTA + anclaje comercial */}
          <div
            className="flex flex-col sm:flex-row sm:items-center gap-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.7s' }}
          >
            <Link
              href="#modelos"
              className="inline-flex items-center justify-center bg-hedon-brass text-hedon-brown font-almaq text-sm tracking-[0.2em] uppercase px-8 py-5 hover:bg-hedon-brass/90 transition-all duration-300 group"
            >
              Conoce la colección
              <span className="ml-3 transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <span className="font-almaq text-hedon-brass text-sm tracking-[0.15em] uppercase">
              4 modelos disponibles
            </span>
          </div>
        </div>

        {/* COLUMNA DERECHA · Foto */}
        <div className="relative w-full h-[60svh] lg:h-auto order-1 lg:order-2">
          <Image
            src="/products/hedonist-hero.jpeg"
            alt="Casco Hedonist sobre barra, con flores"
            fill
            priority
            quality={90}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover opacity-0 animate-fade-in-scale"
            style={{ animationDelay: '0s' }}
          />
        </div>
      </div>
    </section>
  )
}
