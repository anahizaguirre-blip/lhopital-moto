import Image from 'next/image'

export default function ElOrigen() {
  return (
    <section
      id="origen"
      aria-label="El Origen de Tees"
      className="relative w-full bg-tees-black overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 px-6 sm:px-10 lg:px-16 pt-24 lg:pt-32 pb-16 lg:pb-20 items-center">

        {/* Columna de texto */}
        <div className="order-2 lg:order-1">

          {/* Numeración de sección */}
          <div className="flex items-center gap-4 mb-8">
            <span
              aria-hidden="true"
              className="block w-10 h-px bg-brass"
            />
            <p className="font-mono text-brass text-xs tracking-[0.30em] uppercase">
              El Origen
            </p>
          </div>

          {/* Headline */}
          <h2 className="font-rider text-tees-white text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-10">
            Nació en la ruta.
          </h2>

          {/* Cuerpo narrativo */}
          <div className="space-y-6 font-almaq text-tees-white/80 text-lg sm:text-xl leading-relaxed max-w-xl">
            <p>
              Tees no nació en una mesa de diseño.
              <br />
              Nació en una parada de gasolina, después del sol y antes del próximo tramo.
            </p>
            <p>
              Por eso es así: oversize por comodidad; algodón pesado porque no es ropa de moda; estampado que no se sientes porque se vuelve parte de la tela.
            </p>
            <p className="font-cormorant italic text-tees-white text-2xl sm:text-3xl pt-4">
              Lo que traes puesto lo definimos rodando.
            </p>
          </div>
        </div>

        {/* Columna de imagen */}
        <div className="relative w-full aspect-[4/5] lg:aspect-[3/4] order-1 lg:order-2">
          <Image
            src="/products/lhopitaltees/ElOrigen.jpg"
            alt="Playera Good Times, Good Rides"
            fill
            quality={90}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          {/* Marco sutil — opcional, da sensación editorial */}
          <div
            aria-hidden="true"
            className="absolute inset-0 ring-1 ring-tees-black/10"
          />
        </div>
      </div>
    </section>
  )
}