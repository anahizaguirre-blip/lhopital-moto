'use client'

import Image from 'next/image'

// Banners 940x400. El diseño y los datos (nombre, año) ya viven dentro de cada imagen.
// Solo guardamos la ruta y un alt para accesibilidad/SEO. Orden: más reciente arriba.
const eventosPasados: { foto: string; alt: string }[] = [
  { foto: '/eventos/dgr-2026.png', alt: 'DGR 2026 CDMX' },
  { foto: '/eventos/autocinema-coyote.png', alt: 'Autocinema Coyote, Polanco 2026' },
  { foto: '/eventos/simm-2025.png', alt: 'SIMM 2025, Ciudad de México' },
  { foto: '/eventos/dgr-2025.png', alt: 'DGR 2025 CDMX' },
  { foto: '/eventos/la-grande.png', alt: 'La Grande 2025' },
  { foto: '/eventos/simm-2024.png', alt: 'SIMM 2024, Ciudad de México' },
  { foto: '/eventos/vespa-festival-2024.png', alt: 'Vespa Festival 2024' },
]

export default function Eventos() {
  return (
    <section
      id="eventos"
      aria-label="Eventos"
      className="bg-moto-black py-20 md:py-28 border-t border-brass/10"
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* Header de sección */}
        <div className="mb-12 md:mb-16">
          <p className="font-almaq text-brass text-[10px] md:text-xs tracking-[0.35em] uppercase mb-3">
            Comunidad
          </p>
          <h2 className="font-rider text-moto-bone text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.9]">
            Nuestros{' '}
            <span className="font-cormorant italic lowercase text-brass tracking-wide">
              eventos
            </span>
          </h2>
          <p className="font-almaq text-moto-bone/45 text-[11px] md:text-xs tracking-[0.15em] uppercase mt-4">
            No tenemos showroom por el momento. Nos encuentras donde rueda la comunidad.
          </p>
        </div>

        {/* PRÓXIMO — bloque "Próximamente" digno */}
        <div className="mb-16 md:mb-20">
          <p className="font-almaq text-brass/60 text-[10px] tracking-[0.3em] uppercase mb-5">
            Próximo
          </p>
          <div className="border border-brass/20 bg-white/[0.02] px-8 py-14 md:py-20 flex flex-col items-center text-center">
            <p className="font-rider text-moto-bone/90 text-3xl md:text-5xl uppercase leading-none mb-4">
              Próximamente
            </p>
            <p className="font-cormorant italic text-moto-bone/50 text-base md:text-lg max-w-md">
              Estamos preparando la siguiente salida. Síguenos en Instagram para
              enterarte antes que nadie.
            </p>
            <a
              href="https://instagram.com/lhopitalmx"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 font-almaq text-brass text-[10px] md:text-xs tracking-[0.2em] uppercase hover:text-moto-bone transition-colors"
            >
              @lhopitalmx
              <span aria-hidden="true" className="inline-block w-6 h-px bg-brass" />
            </a>
          </div>
        </div>

        {/* ANTERIORES — galería de banners horizontales, 2 columnas, sin texto encima */}
        <div>
          <p className="font-almaq text-brass/60 text-[10px] tracking-[0.3em] uppercase mb-5">
            Dónde hemos estado
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
            {eventosPasados.map((ev) => (
              <div
                key={ev.foto}
                className="group relative aspect-[940/400] overflow-hidden bg-white/[0.02]"
              >
                <Image
                  src={ev.foto}
                  alt={ev.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
