import Image from 'next/image'

export default function LaHermandad() {
  return (
    <section className="bg-hedon-brown pt-16 md:pt-20 pb-0">
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span className="block mb-6">
            <span className="inline-block w-8 h-px bg-hedon-brass align-middle mr-3" />
            <span className="font-almaq text-hedon-brass text-xs tracking-[0.25em] uppercase">
              La Hermandad
            </span>
          </span>
          <h2 className="font-rider text-hedon-cream text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-4">
            No es un casco.
          </h2>
          <p className="font-cormorant italic text-hedon-brass text-2xl md:text-3xl">
            Es una forma de moverse por el mundo.
          </p>
        </div>

        {/* Mosaico asimétrico */}
 <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-2 gap-4 md:gap-6 md:h-[700px] lg:h-[800px]">
          {/* Foto grande dominante - izquierda, span 2 rows */}
           <div className="md:col-span-7 md:row-span-2 relative aspect-[3/4] md:aspect-auto overflow-hidden bg-hedon-brown/40">
            <Image
              src="/products/hedon/hermandad-1.jpeg"
              alt="La hermandad Hedon — primer retrato"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 58vw"
            />
            <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 z-10">
              <p className="font-almaq text-hedon-cream text-base md:text-lg leading-tight">
                Pata Negra · Cuauhtémoc
              </p>
            </div>
          </div>

          {/* Foto arriba derecha */}
          <div className="md:col-span-5 md:row-span-1 relative aspect-[4/3] md:aspect-auto overflow-hidden bg-hedon-brown/40">
            <Image
              src="/products/hermandad-2.jpeg"
              alt="La hermandad Hedon — segundo retrato"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
          </div>

          {/* Abajo derecha — dos fotos chicas */}
          <div className="md:col-span-3 md:row-span-1 relative aspect-square md:aspect-auto overflow-hidden bg-hedon-brown/40">
            <Image
              src="/products/hedon/hermandad-3.jpeg"
              alt="La hermandad Hedon — tercer retrato"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          </div>

          <div className="md:col-span-2 md:row-span-1 relative aspect-square md:aspect-auto overflow-hidden bg-hedon-brown/40">
            <Image
              src="/products/hedon/heroine-en-mesa.jpg"
              alt="Heroine sobre la mesa — detalle de objeto"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 17vw"
            />
          </div>
        </div>

       

      </div>
    </section>
  )
}