'use client';

/**
 * CierreMotoII.tsx
 * Cierre de la tienda Moto II.
 *
 * Dos bloques:
 *   07 · Quote de hermandad — testimonio editorial
 *   08 · FAQ — preguntas frecuentes con acordeón
 *
 * No recibe props — contenido estático editorial.
 */

import { useState } from 'react';
import Link from 'next/link';

// ─── Datos ─────────────────────────────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    pregunta: '¿Funciona sin internet en la ruta?',
    respuesta:
      'Sí. Las rutas se descargan desde la app antes de salir. Una vez en la moto, Moto II funciona sin conexión. El teléfono solo se necesita para configurar la ruta.',
  },
  {
    pregunta: '¿Cuál es la diferencia con Moto V1?',
    respuesta:
      'Moto II tiene pantalla TFT color 2× más grande, mapa con indicaciones vuelta por vuelta, alerta LED de giro y botones RockerTop. Si tienes el V1, puedes usar tu montaje existente con el adaptador incluido en nuestra tienda.',
  },
  {
    pregunta: '¿Es compatible con cualquier moto?',
    respuesta:
      'Sí. El soporte universal incluido funciona en cualquier manubrio estándar con correa elástica. Para posiciones específicas o carga en ruta, tenemos montajes adicionales.',
  },
  {
    pregunta: '¿Cómo activo la garantía?',
    respuesta:
      'La garantía de 30 días cubre defectos de fabricación. Escríbenos a contacto@lhopital.mx con tu número de pedido y descripción del problema. Respondemos en menos de 24 horas.',
  },
  {
    pregunta: '¿Cuánto tarda el envío?',
    respuesta:
      'Enviamos a toda la República Mexicana. CDMX y área metropolitana: 1-2 días hábiles. Interior de la república: 3-5 días hábiles. Recibes número de rastreo por correo al confirmar tu pedido.',
  },
] as const;

// ─── Subcomponente: ítem de FAQ ────────────────────────────────────────────────

function FaqItem({
  pregunta,
  respuesta,
}: {
  pregunta: string;
  respuesta: string;
}) {
  const [abierto, setAbierto] = useState(false);

  return (
    <div className="border-b border-[rgba(244,241,236,0.07)]">
      <button
        onClick={() => setAbierto(!abierto)}
        className="w-full flex justify-between items-center py-5 text-left gap-4"
      >
        <span className="font-sora font-medium text-[13px] text-[#F4F1EC] leading-snug">
          {pregunta}
        </span>
        <span
          className={`
            flex-shrink-0 text-[#C9A961] transition-transform duration-200
            ${abierto ? 'rotate-45' : 'rotate-0'}
          `}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </span>
      </button>

      {abierto && (
        <div className="pb-5">
          <p className="text-[13px] text-[#F4F1EC]/60 leading-relaxed">
            {respuesta}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Componente principal ──────────────────────────────────────────────────────

export function CierreMotoII() {
  return (
    <>

      {/* Divisor */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="border-t border-[rgba(244,241,236,0.08)] mt-16" />
      </div>

      {/* ── 07 · Quote hermandad ── */}
      <section className="bg-[rgba(244,241,236,0.015)] pt-16 md:pt-20 pb-0">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-2xl mx-auto text-center">

            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="inline-block w-6 h-px bg-[#C9A961]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
                La hermandad lo dice
              </span>
              <span className="inline-block w-6 h-px bg-[#C9A961]" />
            </div>

            <blockquote className="font-cormorant italic text-[24px] md:text-[28px] text-[#F4F1EC] leading-[1.45] mb-6">
              &ldquo;Dejé el celular en la mochila.<br className="hidden md:block" />
              Volví a mirar la calle.&rdquo;
            </blockquote>

            <cite className="not-italic text-[10px] tracking-[0.2em] uppercase text-[#F4F1EC]/40">
              Diego R. · Rider CDMX · Bonneville T120
            </cite>

          </div>
        </div>
      </section>

      {/* Divisor */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="border-t border-[rgba(244,241,236,0.08)] mt-16" />
      </div>

      {/* ── 08 · FAQ ── */}
      <section className="bg-[#0A0A0A] pt-16 md:pt-20 pb-0">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-6 h-px bg-[#C9A961]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
              / 07 · Preguntas frecuentes
            </span>
          </div>

          <h2 className="font-sora font-bold text-[24px] md:text-[28px] text-[#F4F1EC] tracking-[-0.02em] mb-10">
            Lo que más se pregunta.
          </h2>

          <div className="max-w-2xl">
            {FAQ_ITEMS.map(({ pregunta, respuesta }) => (
              <FaqItem key={pregunta} pregunta={pregunta} respuesta={respuesta} />
            ))}
          </div>

          {/* CTA final — contacto */}
          <div className="mt-10 pt-8 border-t border-[rgba(244,241,236,0.07)] flex flex-col sm:flex-row sm:items-center gap-4">
            <p className="text-[13px] text-[#F4F1EC]/45">
              ¿Tienes otra pregunta?
            </p>
            <a
              href="mailto:contacto@lhopital.mx"
              className="text-[11px] tracking-[0.1em] uppercase text-[#C9A961] border-b border-[#C9A961]/40 pb-1 hover:border-[#C9A961] transition-colors duration-200 w-fit"
            >
              Escríbenos a contacto@lhopital.mx →
            </a>
          </div>

        </div>
      </section>

      {/* ── Franja final de marca ── */}
      <section className="bg-[#0A0A0A] pt-16 md:pt-20 pb-0">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="border border-[rgba(244,241,236,0.06)] p-10 md:p-16 flex flex-col md:flex-row md:items-center md:justify-between gap-8">

            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-block w-6 h-px bg-[#C9A961]" />
                <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
                  Beeline · Reino Unido · Distribuidor oficial México
                </span>
              </div>
              <p className="font-cormorant italic text-[22px] md:text-[26px] text-[#F4F1EC] leading-snug">
                El navegador que más kilómetros<br className="hidden md:block" />
                ha recorrido en el mundo.
              </p>
              <p className="text-[12px] text-[#F4F1EC]/40 mt-3">
                +100 millones de km registrados. +2.5 millones de viajes.
              </p>
            </div>

            <div className="flex flex-col gap-3 md:min-w-[200px]">
              <Link
                href="#hero"
                className="w-full text-center bg-[#F4F1EC] text-[#0A0A0A] font-sora font-bold text-[12px] tracking-[0.1em] uppercase py-4 hover:bg-[#C9A961] transition-colors duration-200"
              >
                Comprar Moto II
              </Link>
              <Link
                href="/moto-ii"
                className="w-full text-center border border-[rgba(244,241,236,0.2)] text-[#F4F1EC]/60 font-sora text-[11px] tracking-[0.1em] uppercase py-3.5 hover:border-[rgba(244,241,236,0.4)] hover:text-[#F4F1EC]/90 transition-all duration-200"
              >
                Conoce la marca →
              </Link>
            </div>

          </div>
        </div>
      </section>

    </>
  );
}
