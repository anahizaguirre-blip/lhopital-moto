import Image from 'next/image'

export default function HeroHedon() {
  return (
    <section
      aria-label="Hero Hedon"
      className="relative w-full bg-hedon-brown overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] grid grid-cols-1 lg:grid-cols-2 min-h-[100svh]">

        <div className="flex flex-col justify-start lg:justify-center px-6 pt-10 pb-16 sm:px-10 lg:px-16 lg:py-24 order-2 lg:order-1">

          <div
            className="flex items-center gap-4 mb-10 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span
              aria-hidden="true"
              className="block w-10 h-px bg-hedon-brass"
            />
            <p className="font-almaq text-hedon-brass text-xs tracking-[0.30em] uppercase">
              Made in United Kingdom
            </p>
          </div>

          <h1
            className="font-hedon-display text-hedon-cream text-7xl sm:text-8xl lg:text-8xl xl:text-9xl leading-[0.95] tracking-tight mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.25s' }}
          >
            Hedon.
          </h1>

          <p
            className="font-cormorant italic text-hedon-cream text-2xl sm:text-3xl lg:text-4xl leading-snug mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            El arte de la proteccion.
          </p>

          <p
            className="font-almaq text-hedon-brass/70 text-base sm:text-lg leading-relaxed max-w-xl mb-12 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.55s' }}
          >
            Diseñados en Londres. Curados en Mexico por Lhopital.
          </p>

          <div
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.7s' }}
          >
            <a
              href="#ritual"
              className="inline-flex items-center justify-center bg-hedon-brass text-hedon-brown font-almaq text-sm tracking-[0.2em] uppercase px-8 py-5 hover:bg-hedon-brass/90 transition-all duration-300 group"
            >
              Conoce el ritual
              <span className="ml-3 transition-transform duration-300 group-hover:translate-y-1">
                v
              </span>
            </a>
          </div>
        </div>

        <div className="relative w-full h-[50svh] lg:h-full order-1 lg:order-2">
          <Image
            src="/products/hedon/hedonist-hero.jpeg"
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