import Image from 'next/image'

export default function Inicio() {
  const pasos = [
    {
      numero: '01',
      titulo: 'Monta',
      descripcion: 'Anclas el Moto II al manillar. Cualquier manillar, en segundos.',
    },
    {
      numero: '02',
      titulo: 'Traza',
      descripcion: 'Marcas el destino desde la app. El Moto II se queda con la ruta.',
    },
    {
      numero: '03',
      titulo: 'Rueda',
      descripcion: 'Cierras la app. Guarda tu celular. El navegador hace lo suyo.',
    },
  ]

  return (
    <section
      id="inicio"
      aria-label="Cómo funciona Moto II"
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
              Cómo funciona
            </span>
          </span>

          <h2 className="font-sora text-moto-bone text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
            Tres movimientos.
            <br />
            Una salida.
          </h2>

          <p className="font-inter font-light text-moto-bone/70 text-lg md:text-xl leading-relaxed max-w-2xl">
            El Moto II está pensado para que la curva de aprendizaje
            sea la propia carretera.
          </p>
        </div>

        {/* Grid asimétrico de 3 fotos */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-16 md:mb-20">

          {/* Foto 1 - izquierda, vertical */}
          <div className="md:col-span-4 md:mt-12">
            <div className="relative w-full aspect-[2/3] overflow-hidden">
              <Image
                src="/products/motoii/inicio2.jpg"
                alt="Manos colocando el Moto II en el manillar de la moto"
                fill
                quality={85}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Foto 2 - centro, más grande */}
          <div className="md:col-span-4">
            <div className="relative w-full aspect-[2/3] overflow-hidden">
              <Image
                src="/products/motoii/inicio3.jpg"
                alt="Moto II encendido en el manillar, conectándose al celular"
                fill
                quality={85}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Foto 3 - derecha, vertical */}
          <div className="md:col-span-4 md:mt-12">
            <div className="relative w-full aspect-[2/3] overflow-hidden">
              <Image
                src="/products/motoii/EnLaCarretera_v2.jpg"
                alt="Mano enguantada lista para arrancar"
                fill
                quality={85}
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Los 3 pasos numerados */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {pasos.map((paso) => (
            <div key={paso.numero} className="border-t border-moto-line pt-6">
              <div className="font-mono text-moto-brass text-xs tracking-[0.3em] uppercase mb-4">
                / {paso.numero}
              </div>
              <h3 className="font-sora text-moto-bone text-3xl md:text-4xl mb-3">
                {paso.titulo}
              </h3>
              <p className="font-inter font-light text-moto-bone/70 text-base leading-relaxed">
                {paso.descripcion}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}