import Image from 'next/image'

export default function EnLaCarretera() {
  return (
    <section
      aria-label="Moto II en la carretera mexicana"
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
              En la carretera
            </span>
          </span>

          <h2 className="font-sora text-moto-bone text-4xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight mb-6">
            Sin señal.
            <br />
            Con dirección.
          </h2>

          <p className="font-inter font-light text-moto-bone/70 text-lg md:text-xl leading-relaxed max-w-2xl">
            El Ajusco no tiene 5G. Tampoco hace falta. El Moto II guarda la ruta antes de que pierdas
            cobertura y la sigue mostrando hasta que llegas.
          </p>
        </div>
      </div>

      {/* Foto principal full-bleed (sale del max-w para mayor impacto) */}
      <div className="relative w-full aspect-[3/2] mb-6 md:mb-8 overflow-hidden">
        <Image
          src="/products/motoii/EnLaCarretera_h1.jpg"
          alt="Motociclistas en la carretera del Ajusco al amanecer"
          fill
          quality={90}
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Bloque inferior: foto + texto */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center">

          {/* Foto secundaria */}
          <div className="lg:col-span-7">
            <div className="relative w-full aspect-[3/2] overflow-hidden">
              <Image
                src="/products/motoii/EnLaCarretera_h2.jpg"
                alt="Vista frontal de motociclistas en ruta de montaña"
                fill
                quality={90}
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Texto editorial */}
          <div className="lg:col-span-5">
            <div className="font-mono text-moto-brass text-xs tracking-[0.3em] uppercase mb-6">
              / Hecho para México
            </div>

            <p className="font-inter font-light text-moto-bone text-2xl md:text-3xl leading-snug mb-6">
              Aquí las carreteras tienen historia.
            </p>

            <p className="font-inter font-light text-moto-bone/70 text-base md:text-lg leading-relaxed">
              Diseñado en Londres para enfrentar la lluvia inglesa. Probado en el Ajusco, La Sierra del Tigre y la costa de Mazatlan. El Moto II entiende que rodar en México no es lo mismo
              que rodar en cualquier parte.
            </p>
          </div>

        </div>
      </div>

    </section>
  )
}