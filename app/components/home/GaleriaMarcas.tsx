'use client'

import Link from 'next/link'
import Image from 'next/image'

type Marca = {
  num: string
  href: string
  foto: string
  logo: string
  logoW: number
  logoH: number
  logoClass: string // altura óptica individual: cada logo pesa distinto
  nombre: string
  tagline: string
  cta: string
}

const marcas: Marca[] = [
  {
    num: '01',
    href: '/motoii',
    foto: '/products/brand-Moto2.jpg',
    logo: '/logo/motoii/motoii.png',
    logoW: 4000,
    logoH: 1411,
    // Moto II: bloque pesado y ancho (2.83:1). Altura media — ya domina solo.
    logoClass: 'h-10 md:h-12',
    nombre: 'Moto II',
    tagline: 'Navegación satelital · Beeline UK',
    cta: 'Ver accesorios',
  },
  {
    num: '02',
    href: '/hedon',
    foto: '/products/brand-Hedon.jpg',
    logo: '/logo/HEDON/hedon-black.png',
    logoW: 1177,
    logoH: 396,
    // Hedon: insignia de líneas finas (2.97:1). El más alto — necesita tamaño para pesar igual.
    logoClass: 'h-12 md:h-16',
    nombre: 'Hedon',
    tagline: 'Cascos artesanales · London UK',
    cta: 'Ver cascos',
  },
  {
    num: '03',
    href: '/tees',
    foto: '/products/brand-Lhopital.jpg',
    logo: '/logo/LHOPITAL/horizontal_invertido.png',
    logoW: 2250,
    logoH: 527,
    // Lhopital: muy alargado (4.27:1). Altura media-alta; el ancho lo compensa.
    logoClass: 'h-11 md:h-14',
    nombre: 'Lhopital Tees',
    tagline: 'Playeras & merch · Hecho en MX',
    cta: 'Ver colección',
  },
]

export default function GaleriaMarcas() {
  return (
    <section
       id="marcas"
      aria-label="Nuestras marcas"
      className="bg-moto-black pt-20 md:pt-28"
    >
      {/* Header — conserva la sangría para que el texto se lea cómodo */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 mb-12 md:mb-16">
        <p className="font-almaq text-brass text-[10px] md:text-xs tracking-[0.35em] uppercase mb-3">
          Nuestras marcas
        </p>
        <h2 className="font-rider text-moto-bone text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.9]">
          Tres marcas,{' '}
          <span className="font-cormorant italic lowercase text-brass tracking-wide">
            un standard
          </span>
        </h2>
      </div>

      {/* Tríptico full-bleed — las fotos abarcan TODO el ancho, sin sangría */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
        {marcas.map((m) => (
            <Link
              key={m.num}
              href={m.href}
              aria-label={`Ver ${m.nombre}`}
              className="group block bg-moto-black"
            >
              {/* Franja del logo — espacio propio arriba, foto intacta abajo */}
              <div className="flex items-center justify-center py-8 md:py-11">
                <Image
                  src={m.logo}
                  alt={m.nombre}
                  width={m.logoW}
                  height={m.logoH}
                  className={`${m.logoClass} w-auto object-contain opacity-90 transition-opacity duration-300 group-hover:opacity-100`}
                />
              </div>

              {/* Foto protagonista — limpia, sin degradado que la ensucie arriba */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={m.foto}
                  alt={m.nombre}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover grayscale-[15%] transition-all duration-700 group-hover:scale-105 group-hover:grayscale-0"
                />

                {/* Degradado abajo — aloja número + CTA */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-moto-black via-moto-black/60 to-transparent z-10"
                />

                {/* Pie: número + tagline + CTA */}
                <div className="absolute bottom-0 inset-x-0 z-20 p-6 md:p-7">
                  <p className="font-almaq text-brass/70 text-[10px] tracking-[0.3em] mb-2">
                    {m.num}
                  </p>
                  <p className="font-cormorant italic text-moto-bone/60 text-sm mb-4">
                    {m.tagline}
                  </p>
                  <span className="inline-flex items-center gap-2 font-almaq text-brass text-[10px] md:text-xs tracking-[0.2em] uppercase">
                    {m.cta}
                    <span
                      aria-hidden="true"
                      className="inline-block w-6 h-px bg-brass transition-all duration-300 group-hover:w-10"
                    />
                  </span>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </section>
  )
}
