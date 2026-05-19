'use client'

import Image from 'next/image'

export default function LaHermandad() {
  return (
    <section
      id="hermandad"
      className="relative bg-[#0a0a0a] text-[#f5f3f0] border-b border-[rgba(245,243,240,0.07)]"
    >
      {/* Cabecera de sección — mismo lenguaje que las anteriores */}
      <header className="px-5 pt-16 pb-10 md:pt-24 md:pb-14 text-center">
        <p className="text-[8px] md:text-[9px] tracking-[0.35em] uppercase text-[var(--gold-dim)] mb-3">
          — La Hermandad
        </p>
        <h2 className="text-[36px] md:text-[56px] font-black uppercase leading-[0.92] tracking-[0.03em]">
          Dos ruedas.
          <em className="block not-italic">
            <span
              className="italic font-normal text-[var(--gold)] text-[0.55em] tracking-[0.12em] mt-2 inline-block"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              un solo camino.
            </span>
          </em>
        </h2>
        <div className="w-10 h-px bg-[var(--gold-dim)] mx-auto mt-6" />
      </header>

      {/* Foto cinemascope — protagonista absoluta */}
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
          {/* Viñeta sutil para que el quote respire */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Quote superpuesto — abajo-izquierda, estilo cinemascope */}
        <div className="absolute inset-0 flex items-end">
          <div className="w-full px-5 md:px-12 pb-10 md:pb-16">
            <div className="max-w-[640px]">
              <p
                className="text-[20px] md:text-[34px] leading-[1.25] italic font-medium text-[#f5f3f0]"
                style={{ fontFamily: 'var(--font-cormorant)' }}
              >
                “Aquí no hay señal.
                <br />
                Solo el camino, el aire,
                <br />
                y alguien que{' '}
                <span className="text-[var(--gold)] not-italic font-semibold">
                  entiende por qué.
                </span>
                ”
              </p>
              <div className="w-10 h-px bg-[var(--gold-dim)] mt-6 mb-3" />
              <p className="text-[8px] md:text-[9px] tracking-[0.28em] uppercase text-[rgba(245,243,240,0.55)]">
                Bitácora de viaje · Sin coordenadas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pie de sección — narrativa breve, mismo registro que Inicio.tsx */}
      <div className="px-5 md:px-12 py-12 md:py-16 max-w-[860px] mx-auto text-center">
        <p
          className="text-[18px] md:text-[22px] leading-[1.4] italic font-medium text-[rgba(245,243,240,0.9)] mb-6"
          style={{ fontFamily: 'var(--font-cormorant)' }}
        >
          Salir a rodar no es escapar.
          <br />
          Es <span className="text-[var(--gold)] not-italic font-semibold">volver al lugar</span>{' '}
          donde el mundo todavía cabe en una conversación.
        </p>
        <p className="text-[10px] md:text-[11px] leading-[1.8] text-[rgba(245,243,240,0.5)] max-w-[560px] mx-auto">
          Moto II no te dice por dónde es más rápido. Te dice por dónde es{' '}
          <strong className="text-[rgba(245,243,240,0.85)] font-medium">tuyo</strong>. Una flecha,
          una línea, un camino que solo cobra sentido cuando lo rueda alguien más contigo.
        </p>
      </div>
    </section>
  )
}
