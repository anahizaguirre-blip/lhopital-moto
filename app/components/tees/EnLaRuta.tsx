import Image from 'next/image'

export default function EnLaRuta() {
  return (
    <section
      id="ruta"
      aria-label="En la Ruta — Sayula"
      className="relative w-full bg-tees-black overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 pt-16 lg:pt-20 pb-24 lg:pb-32">

        {/* Encabezado de sección */}
        <div className="max-w-2xl mb-16 lg:mb-20">

          {/* Numeración */}
          <div className="flex items-center gap-4 mb-8">
            <span
              aria-hidden="true"
              className="block w-10 h-px bg-brass"
            />
            <p className="font-mono text-brass text-xs tracking-[0.30em] uppercase">
              En la Ruta
            </p>
          </div>

          {/* Headline */}
          <h2 className="font-rider text-tees-white text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
            Esto pasó en Sayula.
          </h2>

          {/* Sublínea */}
          <p className="font-almaq text-tees-white/80 text-lg sm:text-xl leading-relaxed">
            De ahí salieron las playeras.
          </p>
        </div>

        {/* Mosaico de fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">

          {/* Foto 1 — Grande, ocupa 2 columnas */}
          <div className="relative aspect-[4/3] sm:col-span-2 lg:row-span-2 lg:aspect-auto lg:min-h-[500px]">
            <Image
              src="/products/lhopitaltees/ruta-01.jpg"
              alt="Rodada en Sayula — momento principal"
              fill
              quality={85}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
          </div>

          {/* Foto 2 — Cuadrada */}
          <div className="relative aspect-[3/2]">
            <Image
              src="/products/lhopitaltees/ruta-02.jpg"
              alt="Motos en parada de gasolina, Sayula"
              fill
              quality={85}
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-contain"
            />
          </div>

          {/* Foto 3 — Cuadrada */}
          <div className="relative aspect-[3/2]">
            <Image
              src="/products/lhopitaltees/ruta-03.jpg"
              alt="Carretera hacia Sayula, Jalisco"
              fill
              quality={85}
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-contain"
            />
          </div>

          {/* Foto 4 — Vertical */}
          <div className="relative aspect-[3/4] sm:col-span-1">
            <Image
              src="/products/lhopitaltees/ruta-04.jpg"
              alt="Detalle de moto y playera Tees"
              fill
              quality={85}
              sizes="(max-width: 640px) 100vw, 33vw"
              className="object-cover"
            />
          </div>

          {/* Foto 5 — Horizontal, ocupa 2 columnas */}
          <div className="relative aspect-[16/9] sm:col-span-2">
            <Image
              src="/products/lhopitaltees/ruta-05.jpg"
              alt="Grupo en ruta, Sayula"
              fill
              quality={85}
              sizes="(max-width: 640px) 100vw, 66vw"
              className="object-cover"
            />
          </div>

        </div>

      </div>
    </section>
  )
}