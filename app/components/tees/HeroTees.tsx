import Image from 'next/image'

export default function HeroTees() {
  return (
    <section
      aria-label="Hero Tees"
      className="relative w-full bg-tees-black overflow-hidden"
    >
      <div className="w-full grid grid-cols-1 lg:grid-cols-[3fr_2fr] min-h-[100svh]">

        {/* Columna de imagen — orden 1 en desktop, orden 1 también en mobile */}
        <div className="relative w-full h-[50svh] lg:h-full order-1">
          <Image
            src="/products/lhopitaltees/hero-sayula.jpg"
            alt="Rodada en Sayula, Jalisco — el origen de Tees"
            fill
            priority
            quality={90}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover grayscale opacity-0 animate-fade-in-scale"
            style={{ animationDelay: '0s' }}
          />
          {/* Overlay sutil para integrar con el fondo negro */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-gradient-to-r from-transparent to-tees-black/40 lg:to-tees-black/60"
          />
        </div>

        {/* Columna de contenido */}
        <div className="flex flex-col justify-start lg:justify-center px-6 pt-10 pb-16 sm:px-10 lg:px-16 lg:py-24 order-2">

          {/* Tag de origen */}
          <div
            className="flex items-center gap-4 mb-10 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span
              aria-hidden="true"
              className="block w-10 h-px bg-tees-red"
            />
            <p className="font-mono bg-tees-red text-xs tracking-[0.30em] uppercase">
              Hecho en México · Diseño propio
            </p>
          </div>

          {/* Título */}
          <h1
            className="font-rider text-tees-white text-6xl sm:text-7xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.25s' }}
          >
            Hecha donde<br />se rueda.
          </h1>

          {/* Sublínea */}
          <p
            className="font-almaq text-tees-white/80 text-lg sm:text-xl lg:text-2xl leading-relaxed max-w-xl mb-12 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            Seis playeras. Seis maneras de decir lo mismo:
            <br />
            ¡rodar lo es todo!          </p>

          {/* CTA */}
          <div
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.55s' }}
          >
            <a
              href="#origen"
              className="inline-flex items-center gap-3 font-mono text-xs tracking-[0.3em] uppercase text-tees-white hover:text-tees-red transition-colors duration-300 group"
            >
              <span>Cómo nacieron</span>
              <span
                aria-hidden="true"
                className="inline-block w-12 h-px bg-tees-white group-hover:bg-tees-red transition-colors duration-300"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}