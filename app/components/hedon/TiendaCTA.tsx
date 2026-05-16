'use client'

import Image from 'next/image'
import Link from 'next/link'

type Modelo = {
  nombre: string
  precio: string
  imagen: string
  alt: string
  badge?: string
  objectPosition?: string
  scale: string
}

const modelos: Modelo[] = [
  {
    nombre: 'Heroine Racer',
    precio: 'Desde $22,900 MXN',
    imagen: '/products/hedon/heroine.jpg',
    alt: 'Casco Hedon Heroine Racer',
    objectPosition: 'center -25%',
    scale: 'scale-[1.2]'
  },
  {
    nombre: 'Hedonist',
    precio: 'Desde $12,600 MXN',
    imagen: '/products/hedon/hedonist.jpg',
    alt: 'Casco Hedon Hedonist',
    objectPosition: 'center -60%',
    scale: 'scale-[1.3]',
  },
  {
    nombre: 'Epicurist 2.0',
    precio: '$17,000 MXN',
    imagen: '/products/hedon/epicurist-1.jpg',
    alt: 'Casco Hedon Epicurist 2.0',
    objectPosition: 'center -10%',
    scale: 'scale-[1.10]',
  },
  {
    nombre: 'Psilo Explores',
    precio: 'Desde $31,000 MXN',
    imagen: '/products/hedon/psilo-1.jpg',
    alt: 'Casco Hedon Psilo Explores',
    objectPosition: 'center 99%',
    scale: 'scale-[1.15]',    
    badge: 'Colección 2026',
  },
]

export default function TiendaCTA() {
  return (
    <section className="bg-hedon-brown pt-16 md:pt-20 pb-24 md:pb-32">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span className="block mb-6">
            <span className="inline-block w-8 h-px bg-hedon-brass align-middle mr-3" />
            <span className="font-almaq text-hedon-brass text-xs tracking-[0.30em] uppercase">
              La Tienda
            </span>
          </span>
          <h2 className="font-hedon-display text-hedon-cream text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-4">
            Llévatelo a casa.
          </h2>
          <p className="font-cormorant italic text-hedon-brass text-2xl md:text-3xl">
            Quienes lo entienden, lo llevan.
          </p>
        </div>

        {/* Grid de 4 en una línea */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-16 md:mb-20">
          {modelos.map((modelo) => (
            <div key={modelo.nombre} className="group">
              <div className="relative aspect-[4/5] overflow-hidden bg-hedon-brown/40 mb-4">
                <Image
                  src={modelo.imagen}
                  alt={modelo.alt}
                  fill
                  className={`object-cover ${modelo.scale ?? ''}`}
                  style={{ objectPosition: modelo.objectPosition ?? 'center' }}
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                {modelo.badge && (
                  <span className="absolute top-3 left-3 font-almaq text-[9px] tracking-[0.2em] uppercase text-hedon-brown bg-hedon-brass px-2.5 py-1">
                    {modelo.badge}
                  </span>
                )}
              </div>
              <h3 className="font-hedon-display text-hedon-cream text-xl md:text-2xl mb-1">
                {modelo.nombre}
              </h3>
              <p className="font-almaq text-hedon-brass text-xs md:text-sm tracking-wide">
                {modelo.precio}
              </p>
            </div>
          ))}
        </div>

        {/* CTA grande centrado */}
        <div className="text-center">
          <Link
            href="/tienda"
            className="inline-block font-almaq text-hedon-brown bg-hedon-brass hover:bg-hedon-cream transition-colors duration-300 px-12 py-5 text-sm tracking-[0.30em] uppercase"
          >
            Ver tienda completa →
          </Link>
          <p className="font-almaq text-hedon-cream/60 text-xs tracking-[0.30em] uppercase mt-6">
            Pago seguro con Mercado Pago y PayPal · Envíos a todo México
          </p>
        </div>
      </div>
    </section>
  )
}