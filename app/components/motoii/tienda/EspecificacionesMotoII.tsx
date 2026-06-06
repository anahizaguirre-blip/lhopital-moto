/**
 * EspecificacionesMotoII.tsx
 * Ficha técnica + contenido de la caja del Moto II.
 *
 * Props:
 *   skuActivo — SKU del color seleccionado, para mostrar peso y material correctos
 *
 * Dos bloques:
 *   04 · "En la caja" — iconos de lo que incluye
 *   05 · "Las especificaciones" — tabla de specs técnicas
 */

// ─── Datos ─────────────────────────────────────────────────────────────────────

const CAJA_ITEMS = [
  {
    label: 'Dispositivo Moto II',
    icono: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
    ),
  },
  {
    label: 'Soporte universal',
    icono: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    label: 'Cable USB-C',
    icono: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
      </svg>
    ),
  },
  {
    label: 'Guía rápida',
    icono: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
  },
] as const;

// Specs que varían por color
const SPECS_POR_SKU: Record<string, { peso: string; material: string }> = {
  'CHR_BLD3.0_BLK': { peso: '40 g', material: 'Carcasa de plástico' },
  'CHR_BLD3.0_GMG': { peso: '60 g', material: 'Aluminio anodizado oxford' },
  'CHR_BLD3.0_SVR': { peso: '60 g', material: 'Aluminio anodizado silver' },
};

// Specs fijas (iguales en los 3 colores)
const SPECS_FIJAS = [
  { label: 'Pantalla', valor: '1.45″ · TFT color IPS antireflectivo' },
  { label: 'Batería', valor: '600 mAh · hasta 14 horas' },
  { label: 'Resistencia', valor: 'IP67 · agua y polvo' },
  { label: 'Modos', valor: 'Ruta (mapa) · Brújula' },
  { label: 'Conectividad', valor: 'Bluetooth · App iOS / Android' },
  { label: 'Carga', valor: 'USB-C' },
  { label: 'Garantía', valor: '30 días por defecto de fabricación' },
] as const;

// ─── Tipos ─────────────────────────────────────────────────────────────────────

interface EspecificacionesMotoIIProps {
  skuActivo: string;
}

// ─── Componente ────────────────────────────────────────────────────────────────

export function EspecificacionesMotoII({ skuActivo }: EspecificacionesMotoIIProps) {
  const specsVariante = SPECS_POR_SKU[skuActivo] ?? SPECS_POR_SKU['CHR_BLD3.0_GMG'];

  const specsCompletas = [
    ...SPECS_FIJAS,
    { label: 'Peso', valor: specsVariante.peso },
    { label: 'Material', valor: specsVariante.material },
  ];

  return (
    <>

      {/* Divisor */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="border-t border-[rgba(244,241,236,0.08)] mt-16" />
      </div>

      {/* ── 04 · En la caja ── */}
      <section className="bg-[#0A0A0A] pt-16 md:pt-20 pb-0">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-6 h-px bg-[#C9A961]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
              / 04 · Lo que recibes
            </span>
          </div>

          <h2 className="font-sora font-bold text-[24px] md:text-[28px] text-[#F4F1EC] tracking-[-0.02em] mb-8">
            En la caja.
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CAJA_ITEMS.map(({ label, icono }) => (
              <div
                key={label}
                className="flex flex-col items-center text-center p-6 bg-[rgba(244,241,236,0.02)]"
              >
                <div className="text-[#C9A961] mb-4">
                  {icono}
                </div>
                <div className="text-[12px] text-[#F4F1EC]/75 leading-snug">
                  {label}
                </div>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#F4F1EC]/35 text-center mt-5 leading-relaxed">
            Moto II requiere un teléfono inteligente con Bluetooth para funcionar.
          </p>

        </div>
      </section>

      {/* Divisor */}
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="border-t border-[rgba(244,241,236,0.08)] mt-16" />
      </div>

      {/* ── 05 · Ficha técnica ── */}
      <section className="bg-[#0A0A0A] pt-16 md:pt-20 pb-0">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

          <div className="flex items-center gap-2 mb-4">
            <span className="inline-block w-6 h-px bg-[#C9A961]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
              / 05 · Ficha técnica
            </span>
          </div>

          <h2 className="font-sora font-bold text-[24px] md:text-[28px] text-[#F4F1EC] tracking-[-0.02em] mb-8">
            Las especificaciones.
          </h2>

          <div className="max-w-2xl">
            {specsCompletas.map(({ label, valor }, i) => (
              <div
                key={label}
                className={`
                  flex justify-between items-baseline py-4 text-[13px]
                  ${i < specsCompletas.length - 1 ? 'border-b border-[rgba(244,241,236,0.07)]' : ''}
                `}
              >
                <span className="text-[#F4F1EC]/50 min-w-[120px]">{label}</span>
                <span className="text-[#F4F1EC] text-right">{valor}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

    </>
  );
}
