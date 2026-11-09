'use client'

import Link from 'next/link'
import { cloudinaryEditorialUrl } from '@/lib/cloudinary'

// Video del hero en Cloudinary: cortado a 41s (eo_41). El logo de cierre aparece en el
// segundo 40, así que se ve ~1s antes de reiniciar el loop. Sin audio (va muted) y comprimido.
const HERO_VIDEO_URL =
  'https://res.cloudinary.com/lhopital-moto/video/upload/eo_41,ac_none,vc_h264,q_auto:eco/LhopitalVideo.mp4'

export default function HeroHome() {
  const scrollToMarcas = () => {
    const el = document.getElementById('marcas')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      aria-label="Hero Lhopital"
      className="relative w-full min-h-[100svh] overflow-hidden bg-moto-black"
    >
      {/* Video de fondo full bleed */}
      <video
        src={HERO_VIDEO_URL}
        poster={cloudinaryEditorialUrl('hero_moto_ii', 1920)}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover opacity-0 animate-fade-in-scale"
        style={{ objectPosition: '50% 50%' }}
      />

      {/* Overlay degradado: oscuro abajo-izquierda para que el texto respire */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-moto-black/75 via-moto-black/35 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-t from-moto-black/70 via-transparent to-transparent"
      />

      {/* Contenido: centrado vertical, alineado a la izquierda (editorial) */}
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 min-h-[100svh] flex items-center pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="max-w-3xl">

          {/* H1 (SEO): Finest Motorcycle Gear en brass, como eyebrow */}
          <div
            className="flex items-center gap-3 mb-8 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.1s' }}
          >
            <span aria-hidden="true" className="block w-10 h-px bg-brass" />
            <h1 className="font-almaq text-brass text-xs sm:text-sm font-bold tracking-[0.35em] uppercase">
              Finest Motorcycle Gear
            </h1>
          </div>

          {/* Lema visual: WE ARE en Rider sólido (no es heading para no competir con el H1) */}
          <p
            className="font-rider text-moto-bone leading-[0.85] tracking-tight mb-6 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.25s' }}
          >
            <span className="block text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-extrabold uppercase">
              We are
            </span>
            {/* "The standard" como remate emocional: en brass, Cormorant */}
            <span className="block font-cormorant italic font-medium text-brass text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-wide mt-1">
              The standard
            </span>
          </p>

          {/* Subtítulo: origen */}
          <p
            className="font-almaq text-moto-bone/70 text-sm sm:text-base font-semibold tracking-[0.3em] uppercase mb-10 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.4s' }}
          >
            Est. 2021 &middot; CDMX, México
          </p>

          {/* CTAs */}
          <div
            className="flex flex-wrap items-center gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: '0.55s' }}
          >
            <Link
              href="/tienda"
              className="bg-moto-bone text-moto-black px-7 py-3 font-almaq text-xs font-bold tracking-[0.2em] uppercase hover:bg-brass transition-colors duration-300"
            >
              Comprar ahora
            </Link>
            <button
              onClick={scrollToMarcas}
              className="group inline-flex items-center gap-3 font-almaq text-xs tracking-[0.3em] uppercase text-moto-bone hover:text-brass transition-colors duration-300"
            >
              <span>Descubrir</span>
              <span
                aria-hidden="true"
                className="inline-block w-12 h-px bg-moto-bone group-hover:bg-brass transition-colors duration-300"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
