'use client'

import Image from 'next/image'

export default function HeroMotoII() {
  const scrollToInicio = () => {
    const el = document.getElementById('inicio')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      aria-label="Hero Moto II"
      className="relative w-full min-h-[100svh] overflow-hidden bg-moto-black"
    >
      {/* Imagen de fondo full bleed */}
      <Image
        src="/products/motoii/hero_moto_ii.jpg"
        alt="Beeline Moto II montado en manillar, carretera mexicana"
        fill
        priority
        quality={90}
        sizes="100vw"
        className="object-cover opacity-0 animate-fade-in-scale"
        style={{ objectPosition: '50% 50%', animationDelay: '0s' }}
      />

      {/* Overlay degradado para legibilidad */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-moto-black/70 via-moto-black/30 to-transparent"
      />

      {/* Contenido centrado verticalmente, alineado a la izquierda */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 min-h-[100svh] flex items-center pb-20 md:pb-31">

        <div className="max-w-2xl">

          {/* Tag de origen */}
          <div
            className="flex items-center gap-3 mb-10 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span
              aria-hidden="true"
              className="block w-8 h-px bg-moto-bone/60"
            />
            <p className="font-mono text-moto-bone/80 text-xs tracking-[0.3em] uppercase">
              Beeline &middot; Reino Unido
            </p>
          </div>

          {/* Título */}
          <h1
            className="font-black text-moto-bone text-7xl sm:text-8xl lg:text-9xl leading-[0.9] mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.25s' }}
          >
            Moto II.
          </h1>

          {/* Tagline */}
          <p
            className="font-inter font-light text-moto-bone/90 text-lg sm:text-xl md:text-2xl leading-relaxed mb-10 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            El navegador que no quiere ser visto.
            <br />
            Solo quiere que llegues.
          </p>

          {/* CTA naranja siempre, hover lo aclara */}
          <button
            onClick={scrollToInicio}
            className="group inline-flex items-center gap-3 font-mono text-xs tracking-[0.3em] uppercase text-moto-bone hover:text-moto-brass transition-colors duration-300 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.55s' }}
        >
          <span>Descubrir</span>
          <span
            aria-hidden="true"
            className="inline-block w-12 h-px bg-moto-bone group-hover:bg-moto-brass transition-colors duration-300"
         />
      </button>
        </div>
      </div>
    </section>
  )
}