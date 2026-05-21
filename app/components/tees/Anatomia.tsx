const especificaciones = [
  {
    numero: '01',
    titulo: 'Algodón premium 100%',
    detalle: 'Nada de mezclas baratas. Solo algodón que aguanta.',
  },
  {
    numero: '02',
    titulo: '220 GSM',
    detalle: 'Alto gramaje. No se transparenta, no se deforma, no se rinde.',
  },
  {
    numero: '03',
    titulo: 'Corte oversize funcional',
    detalle: 'Pensado para subir a la moto, no para la pasarela.',
  },
  {
    numero: '04',
    titulo: 'Tinta que no se pega',
    detalle: 'Estampado que aguanta el sudor de la ruta.',
  },
]

export default function Anatomia() {
  return (
    <section
      id="anatomia"
      aria-label="Anatomía"
      className="relative w-full bg-tees-black overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 py-24 lg:py-32">

        {/* Encabezado de sección */}
        <div className="max-w-2xl mb-16 lg:mb-20">

          {/* Numeración */}
          <div className="flex items-center gap-4 mb-8">
            <span
              aria-hidden="true"
              className="block w-10 h-px bg-brass"
            />
            <p className="font-mono text-brass text-xs tracking-[0.30em] uppercase">
              Anatomía
            </p>
          </div>

          {/* Headline */}
          <h2 className="font-rider text-tees-white text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
            El detalle importa.
          </h2>

          {/* Sublínea */}
          <p className="font-almaq text-tees-white/80 text-lg sm:text-xl leading-relaxed">
            Lo que no se ve en la foto, pero se siente en cada rodada.
          </p>
        </div>

        {/* Grid de especificaciones */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 lg:gap-x-12">
          {especificaciones.map((spec) => (
            <div
              key={spec.numero}
              className="border-t border-tees-white/15 pt-6"
            >
              {/* Número grande */}
              <p className="font-rider text-brass text-5xl lg:text-6xl leading-none mb-6">
                {spec.numero}
              </p>

              {/* Título */}
              <h3 className="font-almaq font-bold text-tees-white text-xl lg:text-2xl leading-tight mb-3">
                {spec.titulo}
              </h3>

              {/* Detalle */}
              <p className="font-almaq text-tees-white/80 text-base leading-relaxed">
                {spec.detalle}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}