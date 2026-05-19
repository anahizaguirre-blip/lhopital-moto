'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function TiendaCTA() {
  return (
    <section
      id="tienda"
      className="relative bg-[#0a0a0a] text-[#f5f3f0] border-b border-[rgba(245,243,240,0.07)] overflow-hidden"
    >
      {/* Cabecera de sección — mismo lenguaje que las anteriores */}
      <header className="px-5 pt-16 pb-8 md:pt-24 md:pb-10 text-center">
        <p className="text-[8px] md:text-[9px] tracking-[0.35em] uppercase text-[var(--gold-dim)] mb-3">
          — Tienda
        </p>
        <h2 className="text-[36px] md:text-[56px] font-black uppercase leading-[0.92] tracking-[0.03em]">
          Tu próxima ruta
          <em className="block not-italic">
            <span
              className="italic font-normal text-[var(--gold)] text-[0.55em] tracking-[0.12em] mt-2 inline-block"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              empieza con esto.
            </span>
          </em>
        </h2>
        <div className="w-10 h-px bg-[var(--gold-dim)] mx-auto mt-6" />
      </header>

      {/* Cuerpo: layout asimétrico — foto izquierda, texto derecha en desktop */}
      <div className="relative max-w-[1280px] mx-auto px-5 md:px-12 pb-20 md:pb-28">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          {/* Foto — héroe absoluto */}
          <div className="relative w-full max-w-[480px] mx-auto md:mx-0 md:ml-auto">
            <div className="relative aspect-[3/4] w-full">
              <Image
                src="/products/motoii/cta.jpg"
                alt="Beeline Moto II — el navegador minimalista para motociclistas"
                fill
                priority={false}
                sizes="(max-width: 768px) 100vw, 480px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Texto + CTA — al lado en desktop, debajo en mobile */}
          <div className="text-center md:text-left max-w-[440px] mx-auto md:mx-0">
            {/* Eyebrow producto */}
            <p className="text-[8px] md:text-[9px] tracking-[0.3em] uppercase text-[var(--gold-dim)] mb-3">
              Beeline · Moto II
            </p>

            {/* Cita italic */}
            <p
              className="text-[22px] md:text-[30px] italic font-medium leading-[1.25] mb-6 text-[rgba(245,243,240,0.92)]"
              style={{ fontFamily: 'var(--font-cormorant)' }}
            >
              Traza tu ruta.
              <br />
              <span className="text-[var(--gold)] not-italic font-semibold">
                Sigue el camino.
              </span>
            </p>

            {/* Cuerpo breve */}
            <p className="text-[10px] md:text-[11px] leading-[1.85] text-[rgba(245,243,240,0.5)] mb-9">
              Navegación minimalista. 30 horas de batería. Mapeo global. Diseñado en Reino Unido,
              distribuido en México por{' '}
              <strong className="text-[rgba(245,243,240,0.85)] font-medium">Lhopital</strong>.
            </p>

            {/* El único botón */}
            <Link
              href="/tienda"
              className="inline-block bg-[#f5f3f0] text-[#0a0a0a] px-10 py-4 md:px-12 md:py-5 text-[10px] md:text-[11px] tracking-[0.2em] uppercase font-bold transition-all duration-300 hover:bg-[var(--gold)] hover:tracking-[0.25em]"
            >
              Conseguir el mío
            </Link>

            {/* Microcopy bajo el botón */}
            <p className="text-[8px] md:text-[9px] tracking-[0.28em] uppercase text-[rgba(245,243,240,0.35)] mt-6">
              Envíos a toda la República · Garantía oficial
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
