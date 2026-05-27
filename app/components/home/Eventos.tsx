'use client'

import Image from 'next/image'

// Banners 940x400. El diseño y los datos (nombre, año) ya viven dentro de cada imagen.
// Cada evento tiene su URL y tipo (youtube/instagram) para el microfeedback al hover.
// Orden: más reciente arriba.
const eventosPasados: {
  foto: string
  alt: string
  url: string
  tipo: 'youtube' | 'instagram'
}[] = [
  {
    foto: '/eventos/dgr-2026.png',
    alt: 'DGR 2026 CDMX',
    url: 'https://www.instagram.com/p/DYoIHuvDoN1/?img_index=1',
    tipo: 'instagram',
  },
  {
    foto: '/eventos/autocinema-coyote.png',
    alt: 'Autocinema Coyote, Polanco 2026',
    url: 'https://www.instagram.com/reel/DWjk8Ibg2Oe/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==',
    tipo: 'instagram',
  },
  {
    foto: '/eventos/simm-2025.png',
    alt: 'SIMM 2025, Ciudad de México',
    url: 'https://www.instagram.com/simm_mexico/',
    tipo: 'instagram',
  },
  {
    foto: '/eventos/dgr-2025.png',
    alt: 'DGR 2025 CDMX',
    url: 'https://www.instagram.com/p/DJzuPUaSOKT/',
    tipo: 'instagram',
  },
  {
    foto: '/eventos/la-grande.png',
    alt: 'La Grande 2025',
    url: 'https://www.instagram.com/p/DJ5cfIatELY/',
    tipo: 'instagram',
  },
  {
    foto: '/eventos/simm-2024.png',
    alt: 'SIMM 2024, Ciudad de México',
    url: 'https://www.instagram.com/simm_mexico/',
    tipo: 'instagram',
  },
  {
    foto: '/eventos/vespa-festival-2024.png',
    alt: 'Vespa Festival 2024',
    url: 'https://www.youtube.com/watch?v=mpY1UY5XRl4',
    tipo: 'youtube',
  },
]

// Leyenda por tipo — copy corto, voz Lhopital
const leyendaPorTipo = {
  instagram: 'Ver en Instagram',
  youtube: 'Ver video',
}

export default function Eventos() {
  return (
    <section
      id="eventos"
      aria-label="Eventos"
      className="bg-moto-black pt-20 md:pt-28 border-t border-brass/10"
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
              <a
                key={ev.foto}
                href={ev.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${ev.alt} — ${leyendaPorTipo[ev.tipo]}`}
                className="group relative aspect-[940/400] overflow-hidden bg-white/[0.02] block"
              >
                <Image
                  src={ev.foto}
                  alt={ev.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Microfeedback al hover: oscurecido + leyenda en esquina superior izquierda */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-moto-black/0 group-hover:bg-moto-black/30 transition-all duration-500"
                >
                  <span className="absolute top-4 left-4 md:top-5 md:left-5 font-almaq text-brass text-[10px] md:text-xs tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center gap-3">
                    {leyendaPorTipo[ev.tipo]}
                    <span className="inline-block w-6 h-px bg-brass" />
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}