import Image from 'next/image'

const estilos = [
  'Adventure', 'Scrambler', 'Custom', 'Scooter',
  'Bobber', 'Touring', 'Café Racer', 'Chopper',
  'Sport', 'Cruiser', 'Naked', 'Enduro',
  'Brat Style', 'Bagger',
]

export default function EnLaCarretera() {
  return (
    <section
      id="carretera"
      aria-label="En la Carretera"
      className="relative w-full bg-tees-black overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 py-24 lg:py-32">

        {/* Encabezado de sección */}
        <div className="max-w-3xl mb-16 lg:mb-20">

          {/* Numeración */}
          <div className="flex items-center gap-4 mb-8">
            <span
              aria-hidden="true"
              className="block w-10 h-px bg-tees-red"
            />
            <p className="font-mono text-tees-red text-xs tracking-[0.30em] uppercase">
              En la Carretera
            </p>
          </div>

          {/* Headline */}
          <h2 className="font-rider text-tees-white text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-8">
            No importa el tipo.<br />Las amamos todas.
          </h2>
        </div>

        {/* Lista de estilos — como manifiesto */}
        <div className="mb-16 lg:mb-20">
          <div className="flex flex-wrap gap-x-6 gap-y-3 lg:gap-x-8">
            {estilos.map((estilo) => (
              <span
                key={estilo}
                className="font-rider text-tees-white/40 text-2xl sm:text-3xl lg:text-4xl leading-tight hover:text-tees-white transition-colors duration-300"
              >
                {estilo}
              </span>
            ))}
          </div>
        </div>

        {/* Cierre del manifiesto */}
        <p className="font-almaq text-tees-white/70 text-lg sm:text-xl leading-relaxed max-w-2xl mb-16 lg:mb-20">
          Aquí no hay tribu mejor que otra. Hay una sola cosa que importa:
          {' '}
          <span className="text-tees-white">que estés rodando.</span>
        </p>

        {/* Fotos icónicas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">

          <div className="relative aspect-[4/3]">
            <Image
              src="/products/lhopitaltees/HarleyFatBob.jpg"
              alt="Harley-Davidson — comunidad Lhopital"
              fill
              quality={85}
               sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover object-center grayscale scale-[1.8] translate-y-[-45%]"
            />
          </div>

          <div className="relative aspect-[4/3]">
            <Image
              src="/products/lhopitaltees/YamahaR1.jpg"
              alt="Yamaha R1 en ruta— comunidad Lhopital"
              fill
              quality={85}
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover grayscale"
            />
          </div>

          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/products/lhopitaltees/HarleySportster.jpg"
              alt="Harley en ruta — comunidad Lhopital"
              fill
              quality={85}
             sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover object-right grayscale"
            />
          </div>

        </div>

      </div>
    </section>
  )
}