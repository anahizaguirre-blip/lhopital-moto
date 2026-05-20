import Image from 'next/image'

const productos = [
  {
    nombre: "It's a Biker Thing",
    precio: 400,
    imagen: '/products/lhopitaltees/BikerThing.jpg',
    url: '#',
  },
  {
    nombre: "Death Doesn't Die",
    precio: 400,
    imagen: '/products/lhopitaltees/Death.jpg',
    url: '#',
  },
  {
    nombre: 'Good Times, Good Rides',
    precio: 400,
    imagen: '/products/lhopitaltees/GoodTimes.jpg',
    url: '#',
  },
  {
    nombre: "Let's Ride",
    precio: 400,
    imagen: '/products/lhopitaltees/LhopitalPersonaje.jpg',
    url: '#',
  },
  {
    nombre: 'Tiny Movement of Your Wrist',
    precio: 400,
    imagen: '/products/lhopitaltees/Tiny.jpg',
    url: '#',
  },
  {
    nombre: 'BBB — Beers, Bikes & Bros',
    precio: 400,
    imagen: '/products/lhopitaltees/BBB.jpg',
    url: '#',
  },
]

const tallas = ['S', 'M', 'L', 'XL']

export default function TiendaTees() {
  return (
    <section
      id="tienda"
      aria-label="Tienda"
      className="relative w-full bg-tees-fog overflow-hidden"
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
              08 · Tienda
            </p>
          </div>

          {/* Headline */}
          <h2 className="font-rider text-tees-black text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
            La colección.
          </h2>

          {/* Sublínea */}
          <p className="font-almaq text-tees-black/70 text-lg sm:text-xl leading-relaxed">
            Seis modelos. Corte oversize. Tallas S a XL.
          </p>
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12 lg:gap-x-8 lg:gap-y-16">
          {productos.map((producto) => (
            <div key={producto.nombre} className="group flex flex-col">

              {/* Foto del producto */}
              <div className="relative aspect-[4/5] bg-tees-white mb-5 overflow-hidden">
                <Image
                  src={producto.imagen}
                  alt={`Playera ${producto.nombre} — Lhopital Tees`}
                  fill
                  quality={90}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Nombre */}
              <h3 className="font-almaq font-bold text-tees-black text-lg sm:text-xl leading-tight mb-2">
                {producto.nombre}
              </h3>

              {/* Tallas */}
              <div className="flex items-center gap-2 mb-3">
                {tallas.map((talla) => (
                  <span
                    key={talla}
                    className="font-mono text-tees-black/50 text-xs tracking-wider"
                  >
                    {talla}
                  </span>
                ))}
              </div>

              {/* Precio */}
              <p className="font-almaq text-tees-black text-xl mb-5">
                ${producto.precio} <span className="text-tees-black/50 text-sm">MXN</span>
              </p>

              {/* Botón Comprar */}
              <a
                href={producto.url}
                className="inline-flex items-center justify-center bg-tees-red text-tees-white font-mono text-xs tracking-[0.2em] uppercase px-6 py-4 hover:bg-tees-black transition-colors duration-300 mt-auto w-full"
              >
                Comprar
              </a>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}