import Image from 'next/image'

export default function LaHermandad() {
  return (
    <section
      id="hermandad"
      aria-label="La Hermandad"
      className="relative w-full bg-tees-black overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 py-24 lg:py-32">

        {/* Encabezado de sección */}
        <div className="max-w-2xl mb-16 lg:mb-20">

          {/* Numeración */}
          <div className="flex items-center gap-4 mb-8">
            <span
              aria-hidden="true"
              className="block w-10 h-px bg-tees-red"
            />
            <p className="font-mono text-tees-red text-xs tracking-[0.30em] uppercase">
              La Hermandad
            </p>
          </div>

          {/* Headline */}
          <h2 className="font-rider text-tees-white text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-8">
            La hermandad no se escribe.<br />Se rueda.
          </h2>

          {/* Cuerpo */}
          <p className="font-almaq text-tees-white/70 text-lg sm:text-xl leading-relaxed max-w-xl">
            Cuando se te queda la moto, no estás solo.
            <br />
            Eso no lo enseña ningún manual.
          </p>
        </div>

        {/* Foto protagonista — empujar la moto */}
        <div className="relative w-full aspect-[16/9] mb-6 lg:mb-8">
          <Image
            src="/products/lhopitaltees/hermandad5.jpg"
            alt="Riders empujando una moto descompuesta — la hermandad en acción"
            fill
            quality={90}
            sizes="(max-width: 1440px) 100vw, 1440px"
            className="object-cover grayscale"
          />
        </div>

        {/* Grid de fotos secundarias */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">

          <div className="relative aspect-[4/3]">
            <Image
              src="/products/lhopitaltees/hermandad3.jpg"
              alt="Grupo de riders Lhopital"
              fill
              quality={85}
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover grayscale"
            />
          </div>

          <div className="relative aspect-[4/3]">
            <Image
              src="/products/lhopitaltees/hermandad1.jpg"
              alt="Riders Lhopital en ruta"
              fill
              quality={85}
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover grayscale"
            />
          </div>

        </div>

      </div>
    </section>
  )
}