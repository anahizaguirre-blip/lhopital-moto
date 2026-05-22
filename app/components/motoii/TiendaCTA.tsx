'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function TiendaCTA() {
  return (
    <section
      id="tienda"
      aria-label="Tienda Moto II"
      className="relative bg-moto-black overflow-hidden pt-24 md:pt-32"
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
              Tienda
            </span>
          </span>

          <h2 className="font-sora text-moto-bone text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
            Tu próxima ruta
            <br />
            empieza con esto.
          </h2>
        </div>
      </div>

      {/* Cuerpo: layout asimétrico — INTACTO (foto izquierda, texto derecha en desktop) */}
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
            <p className="text-[8px] md:text-[9px] tracking-[0.3em] uppercase text-brass mb-3">
              Beeline · Moto II
            </p>

            {/* Cita italic */}
            <p
              className="text-[22px] md:text-[30px] font-medium leading-[1.25] mb-6 text-[rgba(245,243,240,0.92)]"
              style={{ fontFamily: 'var(--font-sora)' }}
            >
              Traza tu ruta.
              <br />
              <span className="text-brass not-italic font-semibold">
                Sigue el camino.
              </span>
            </p>

            {/* Cuerpo breve */}
            <p className="text-[10px] md:text-[11px] leading-[1.85] text-[rgba(245,243,240,0.5)] mb-9">
              Navegación minimalista. 
              <br />
              Mapeo global. 
              <br />
              Sin pagos mensuales.
              <br />
              Distribuido en México por{' '}
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