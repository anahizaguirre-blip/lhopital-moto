'use client'

import Image from 'next/image'

export default function LaHermandad() {
  return (
    <section
      id="hermandad"
      aria-label="La Hermandad Moto II"
      className="bg-moto-black pt-24 md:pt-32 pb-0"
    >
      {/* Cabecera — mismo lenguaje que las demás: línea + eyebrow brass, título Sora a la izquierda */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="mb-16 md:mb-20 max-w-3xl">
          <span className="block mb-6">
            <span
              aria-hidden="true"
              className="inline-block w-8 h-px bg-moto-brass align-middle mr-3"
            />
            <span className="font-mono text-moto-brass text-xs tracking-[0.3em] uppercase">
              La Hermandad
            </span>
          </span>

          <h2 className="font-sora text-moto-bone text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
            Dos ruedas.
            <br />
            Un solo camino.
          </h2>
        </div>
      </div>

      {/* Foto cinemascope — INTACTA, con el quote superpuesto */}
      <div className="relative w-full overflow-hidden">
        <div className="relative aspect-[3/2] md:aspect-[21/9] w-full">
          <Image
            src="/products/motoii/amigos_moto_ii.jpg"
            alt="Dos amigos rodando con Moto II, sin señal, solo el camino"
            fill
            priority={false}
            sizes="100vw"
            className="object-cover"
            style={{ filter: 'grayscale(10%) contrast(1.03)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Quote superpuesto — abajo-izquierda, estilo cinemascope (intacto) */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-5 md:px-12 pb-10 md:pb-16">
            <div className="max-w-[640px]">
              <p
                className="text-[20px] md:text-[34px] leading-[1.25] italic font-medium text-[#f5f3f0]"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                "Aquí no hay señal.
                <br />
                Solo el camino, el aire,
                <br />
                y alguien que{' '}
                <span className="text-[var(--gold)] not-italic font-semibold">
                  entiende por qué.
                </span>
                "
              </p>
              <div className="w-10 h-px bg-[var(--gold-dim)] mt-6 mb-3" />
              <p className="text-[8px] md:text-[9px] tracking-[0.28em] uppercase text-[rgba(245,243,240,0.55)]">
                Bitácora de viaje · Sin coordenadas
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}