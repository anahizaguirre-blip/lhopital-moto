import Image from 'next/image';

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
    // Símbolo "Compass" de marca — imagen (no vector), a diferencia de
    // los otros 3 íconos que son SVG heredando currentColor. Su color
    // ámbar viene fijo en el PNG a propósito (badge de marca, no un
    // ícono de línea genérico como sus vecinos).
    imagen: '/products/MOTOII/icons/icon-compass.png',
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
    imagen: '/products/MOTOII/icons/icon-usb.png',
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
// Cada bloque cuenta una experiencia primero; el dato técnico va debajo,
// con menor jerarquía visual.
const SPECS_FIJAS = [
  { label: 'Se lee bajo el sol del mediodía.', valor: '1.45″ TFT antireflectivo' },
  { label: 'Un día completo de ruta, sin pensar en cargarlo.', valor: 'hasta 14 horas' },
  { label: 'Lluvia, polvo, terracería. No se detiene.', valor: 'IP67' },
  { label: 'Mapa cuando lo necesitas. Brújula cuando solo quieres rodar.', valor: 'Ruta y Brújula' },
  { label: 'Se sincroniza y se olvida.', valor: 'Bluetooth, app iOS/Android' },
  { label: 'El mismo cable que ya usas.', valor: 'USB-C' },
  { label: 'Respaldado desde el primer kilómetro.', valor: '30 días' },
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
    { label: 'No lo notas hasta que lo necesitas.', valor: specsVariante.peso },
    { label: 'Hecho para el manubrio, no para el escritorio.', valor: specsVariante.material },
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

          <h2 className="font-sora font-bold text-[24px] md:text-[28px] text-[#F4F1EC] tracking-[-0.02em] mb-4">
            En la caja.
          </h2>

          <p className="text-[14px] md:text-[15px] text-[#F4F1EC]/65 leading-relaxed mb-8 max-w-2xl">
            Moto II requiere un teléfono inteligente con Bluetooth para funcionar.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CAJA_ITEMS.map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center text-center p-6 bg-[rgba(244,241,236,0.02)]"
              >
                <div className="text-[#C9A961] mb-4">
                  {'imagen' in item ? (
                    <div className="relative w-6 h-6">
                      <Image
                        src={item.imagen}
                        alt=""
                        fill
                        className="object-contain"
                        sizes="24px"
                      />
                    </div>
                  ) : (
                    item.icono
                  )}
                </div>
                <div className="text-[12px] text-[#F4F1EC]/75 leading-snug">
                  {item.label}
                </div>
              </div>
            ))}
          </div>

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

          <div className="flex flex-col gap-8 lg:grid lg:grid-cols-2 lg:gap-16">

            {/* Imagen — espejo + velocímetro con mapa (mismo asset del storytelling, layout espejado) */}
            <div className="lg:order-2">
              <div className="relative w-full aspect-[3662/4424] overflow-hidden">
                <Image
                  src="/products/motoii/Anatomia.jpg"
                  alt="Moto II montado en espejo retrovisor, pantalla mostrando ruta de navegación"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Specs */}
            <div className="lg:order-1 flex flex-col">
              {specsCompletas.map(({ label, valor }, i) => (
                <div
                  key={label}
                  className={`
                    flex flex-col gap-1 py-5
                    ${i < specsCompletas.length - 1 ? 'border-b border-[rgba(244,241,236,0.07)]' : ''}
                  `}
                >
                  <span className="font-sora font-bold text-2xl md:text-3xl text-[#F4F1EC] tracking-[-0.01em]">
                    {label}
                  </span>
                  <span className="font-sora font-normal text-lg md:text-xl text-[#F4F1EC]/50">
                    {valor}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

    </>
  );
}
