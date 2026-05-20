import Image from 'next/image'

const playeras = [
  {
    numero: '01',
    nombre: "It's a Biker Thing",
    copy: "El saludo. La mano abajo, dedos abiertos, paz al cruzarse en la ruta. No se explica. Se entiende rodando.",
    imagen: '/products/lhopitaltees/BikerThing.jpg',
    rojo: false,
  },
  {
    numero: '02',
    nombre: "Death Doesn't Die",
    copy: "La calaca al manubrio. Porque en México, a la muerte se le hace sátira — y luego se le acelera.",
    imagen: '/products/lhopitaltees/Death.jpg',
    rojo: false,
  },
  {
    numero: '03',
    nombre: "Good Times, Good Rides",
    copy: "No hay manera de tener una sin la otra. El nombre no necesita más.",
    imagen: '/products/lhopitaltees/GoodTimes.jpg',
    rojo: false,
  },
  {
    numero: '04',
    nombre: "Let's Ride",
    copy: "El personaje de Lhopital con casco. La invitación de la casa. Si hay duda, la respuesta siempre es la misma: vámonos a rodar.",
    imagen: '/products/lhopitaltees/LhopitalPersonaje.jpg',
    rojo: false,
  },
  {
    numero: '05',
    nombre: "Tiny Movement",
    copy: "Dos centímetros de muñeca. Eso es la diferencia entre estar parado y ser libre.",
    imagen: '/products/lhopitaltees/Tiny.jpg',
    rojo: false,
  },
  {
    numero: '06',
    nombre: 'BBB',
    nombreCompleto: 'Beers, Bikes & Bros',
    copy: "Las tres cosas que llegan después de la rodada. En ese orden o en cualquiera.",
    imagen: '/products/lhopitaltees/BBB.jpg',
    rojo: true, // Único modelo con acento rojo en el nombre
  },
]

export default function LaColeccion() {
  return (
    <section
      id="coleccion"
      aria-label="La Colección"
      className="relative w-full bg-tees-black overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16">

        {/* Encabezado de sección */}
        <div className="max-w-2xl pt-24 lg:pt-32 pb-16 lg:pb-24">

          {/* Numeración */}
          <div className="flex items-center gap-4 mb-8">
            <span
              aria-hidden="true"
              className="block w-10 h-px bg-tees-red"
            />
            <p className="font-mono text-tees-red text-xs tracking-[0.30em] uppercase">
              La Colección
            </p>
          </div>

          {/* Headline */}
          <h2 className="font-rider text-tees-white text-5xl sm:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
            Seis piezas.<br />Cada una con algo que decir.
          </h2>
        </div>

        {/* Bloques editoriales — cada playera */}
        <div className="space-y-16 lg:space-y-20 pb-24 lg:pb-32">
          {playeras.map((playera, index) => {
            const esImpar = index % 2 === 1

            return (
              <article
                key={playera.numero}
                className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center"
              >
                {/* Columna de imagen */}
                <div
                  className={`relative w-full aspect-[4/5] ${
                    esImpar ? 'lg:order-2' : 'lg:order-1'
                  }`}
                >
                  <Image
                    src={playera.imagen}
                    alt={`Playera ${playera.nombre} — Lhopital Tees`}
                    fill
                    quality={90}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>

                {/* Columna de texto */}
                <div
                  className={`flex flex-col justify-center ${
                    esImpar ? 'lg:order-1 lg:pr-8' : 'lg:order-2 lg:pl-8'
                  }`}
                >
                  {/* Numeración pequeña */}
                  <p className="font-mono text-tees-red text-xs tracking-[0.30em] uppercase mb-4">
                    {playera.numero}
                  </p>

                  {/* Nombre */}
                  <h3 className="font-rider text-tees-white text-4xl sm:text-5xl lg:text-6xl leading-[0.95] tracking-tight mb-3">
                    {playera.rojo ? (
                      <>
                        <span className="text-tees-red">BBB</span>
                      </>
                    ) : (
                      playera.nombre
                    )}
                  </h3>

                  {/* Nombre completo (solo para BBB) */}
                  {playera.nombreCompleto && (
                    <p className="font-almaq text-tees-white/80 text-sm sm:text-base tracking-[0.15em] uppercase mb-6">
                      {playera.nombreCompleto}
                    </p>
                  )}

                  {/* Copy narrativo */}
                  <p className="font-almaq text-tees-white/80 text-lg sm:text-xl leading-relaxed max-w-md mb-8">
                    {playera.copy}
                  </p>

                  {/* CTA sutil */}
                  <a
                    href="#tienda"
                    className="inline-flex items-center gap-3 font-mono text-xs tracking-[0.3em] uppercase text-tees-white hover:text-tees-red transition-colors duration-300 group w-fit"
                  >
                    <span>Ver en tienda</span>
                    <span
                      aria-hidden="true"
                      className="inline-block w-12 h-px bg-tees-white group-hover:bg-tees-red transition-colors duration-300"
                    />
                  </a>
                </div>
              </article>
            )
          })}
        </div>

      </div>
    </section>
  )
}