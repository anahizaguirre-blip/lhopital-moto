/**
 * EditorialMotoII.tsx
 * Secciones editoriales de la tienda Moto II.
 *
 * No recibe props — contenido estático editorial.
 * Dos bloques:
 *   01 · "Hecho solo para rodar" — argumento principal vs celular
 *   02 · "Qué cambió" — 4 mejoras sobre Moto V1 en grid
 */

import Link from 'next/link';

// ─── Datos ─────────────────────────────────────────────────────────────────────

const MEJORAS = [
  {
    numero: '/ 01',
    titulo: 'Pantalla TFT 2× más grande',
    descripcion: 'Color IPS, antireflectivo, legible bajo el sol directo.',
  },
  {
    numero: '/ 02',
    titulo: 'Mapa vuelta por vuelta',
    descripcion: 'Nueva interfaz con indicaciones precisas en cada cruce.',
  },
  {
    numero: '/ 03',
    titulo: 'Alerta LED de giro',
    descripcion: 'Anticipación visual antes de la maniobra. Reaccionas antes.',
  },
  {
    numero: '/ 04',
    titulo: 'Botones RockerTop',
    descripcion: 'Acceso a configuraciones sin soltar el manubrio.',
  },
] as const;

// ─── Componente ────────────────────────────────────────────────────────────────

export function EditorialMotoII() {
  return (
    <>

      {/* ── 01 · Hecho solo para rodar ── */}
      <section className="bg-[#0A0A0A] pt-16 md:pt-20 pb-0">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

          <div className="max-w-3xl">

            {/* Tag */}
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-6 h-px bg-[#C9A961]" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
                / 01 · La siguiente generación
              </span>
            </div>

            {/* Título */}
            <h2 className="font-sora font-bold text-[30px] md:text-[38px] text-[#F4F1EC] leading-tight tracking-[-0.02em] mb-2">
              Hecho solo para rodar.
            </h2>
            <p className="font-cormorant italic text-[20px] text-[#C9A961] mb-6">
              No es un instrumento de muchas cosas.
            </p>

            {/* Cuerpo editorial */}
            <p className="text-[14px] text-[#F4F1EC]/75 leading-[1.8] mb-4">
              El celular es muchas cosas. Moto II es una sola: la ruta. No vibra con
              mensajes. No se agota a las dos horas. No te exige voltear a una pantalla
              brillante bajo el sol.
            </p>
            <p className="text-[14px] text-[#F4F1EC]/75 leading-[1.8]">
              Una ruta. Una distancia. La calle.
            </p>

            {/* Link a comparativa */}
            <div className="mt-8">
              <Link
                href="/moto-ii#comparativa"
                className="text-[11px] tracking-[0.1em] uppercase text-[#C9A961] border-b border-[#C9A961]/40 pb-1 hover:border-[#C9A961] transition-colors duration-200"
              >
                Lee la comparativa Moto II vs celular →
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Divisor */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="border-t border-[rgba(244,241,236,0.08)] mt-16" />
      </div>

      {/* ── 02 · Qué cambió vs V1 ── */}
      <section className="bg-[#0A0A0A] pt-16 md:pt-20 pb-0">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

          {/* Tag */}
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-6 h-px bg-[#C9A961]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
              / 02 · Qué cambió
            </span>
          </div>

          <h2 className="font-sora font-bold text-[28px] md:text-[34px] text-[#F4F1EC] leading-tight tracking-[-0.02em] mb-10">
            Mejoras sobre Moto V1.
          </h2>

          {/* Grid de mejoras */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MEJORAS.map(({ numero, titulo, descripcion }) => (
              <div
                key={numero}
                className="p-5 bg-[rgba(244,241,236,0.02)] border-l border-[#C9A961]"
              >
                <div className="font-mono text-[10px] text-[#F4F1EC]/35 tracking-[0.15em] mb-3">
                  {numero}
                </div>
                <div className="font-sora font-bold text-[13px] text-[#F4F1EC] mb-2 leading-snug">
                  {titulo}
                </div>
                <div className="text-[11px] text-[#F4F1EC]/50 leading-relaxed">
                  {descripcion}
                </div>
              </div>
            ))}
          </div>

          {/* Link a usuarios V1 */}
          <div className="mt-8 flex items-center gap-2">
            <span className="text-[11px] text-[#F4F1EC]/40">
              ¿Tienes el Moto V1?{' '}
            </span>
            <Link
              href="/moto-ii#adaptador"
              className="text-[11px] tracking-[0.05em] text-[#C9A961] hover:text-[#F4F1EC] transition-colors duration-200"
            >
              Ve cómo actualizar con el adaptador →
            </Link>
          </div>

        </div>
      </section>

    </>
  );
}
