import Image from 'next/image'

export default function Anatomia() {
  const specs = [
    {
      dato: 'IP67',
      promesa: 'Protección total contra agua y polvo',
    },
    {
      dato: 'SUNLIGHT',
      promesa: 'Pantalla legible a plena luz del sol',
    },
    {
      dato: '14H',
      promesa: 'Autonomía continua sin recargar',
    },
    {
      dato: 'UNIVERSAL',
      promesa: 'Se adapta a cualquier manillar',
    },
    {
      dato: 'QUICK',
      promesa: 'Desmontaje en segundos',
    },
  ]

  return (
    <section
      aria-label="Anatomía del Moto II"
      className="bg-moto-black pt-24 md:pt-32 pb-0"
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* Header de sección */}
        <div className="mb-16 md:mb-20 max-w-3xl">
          <span className="block mb-6">
            <span
              aria-hidden="true"
              className="inline-block w-8 h-px bg-moto-brass align-middle mr-3"
            />
            <span className="font-mono text-moto-brass text-xs tracking-[0.3em] uppercase">
              Anatomía
            </span>
          </span>

          <h2 className="font-sora text-moto-bone text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
            Cinco razones
            <br />
            para confiar.
          </h2>

          <p className="font-inter font-light text-moto-bone/70 text-lg md:text-xl leading-relaxed max-w-2xl">
            Lo construyeron para que dejes de pensar en él. La ingeniería se ocupa del trayecto,
            tú te ocupas del paisaje.
          </p>
        </div>

        {/* Grid: foto producto + spec sheet */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16">

          {/* Foto del producto */}
          <div className="lg:col-span-5">
            <div className="relative w-full aspect-[3662/4424] overflow-hidden">
              <Image
                src="/products/motoii/Anatomia.jpg"
                alt="Moto II por Beeline, vista de producto sobre fondo negro"
                fill
                quality={90}
                sizes="(max-width: 1024px) 100vw, 42vw"
                className="object-cover"
                style={{ objectPosition: '35% 65%' }}
                />
            </div>
          </div>

          {/* Spec sheet */}
          <div className="lg:col-span-7 flex flex-col justify-center">

            {/* Header del spec sheet */}
            <div className="flex items-center justify-between border-b border-moto-line pb-4 mb-2">
              <span className="font-mono text-moto-grey text-xs tracking-[0.3em] uppercase">
                Spec sheet
              </span>
              <span className="font-mono text-moto-grey text-xs tracking-[0.3em] uppercase">
                v 2.0
              </span>
            </div>

            {/* Lista de specs */}
<div>
  {specs.map((spec, idx) => (
    <div
      key={spec.dato}
      className="flex flex-col gap-2 md:grid md:grid-cols-12 md:gap-8 border-b border-moto-line py-6 md:py-8 md:items-baseline"
    >
      {/* Fila superior en móvil: número + dato juntos */}
      <div className="flex items-baseline gap-3 md:contents">
        {/* Número de fila */}
        <span className="md:col-span-1 font-mono text-moto-grey text-xs shrink-0">
          / 0{idx + 1}
        </span>

        {/* Dato técnico (grande) */}
        <span className="md:col-span-3 font-mono text-moto-bone text-2xl md:text-3xl lg:text-4xl tracking-tight">
          {spec.dato}
        </span>
      </div>

      {/* Promesa (sans light) */}
      <span className="md:col-span-8 font-inter font-light text-moto-bone/80 text-base md:text-lg leading-snug pl-8 md:pl-0">
        {spec.promesa}
      </span>
    </div>
  ))}
</div>

          </div>
        </div>

      </div>
    </section>
  )
}