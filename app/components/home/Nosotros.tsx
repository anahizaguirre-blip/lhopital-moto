'use client'

import Image from 'next/image'

export default function Nosotros() {
  return (
    <section
      id="nosotros"
      aria-label="Nosotros"
      className="bg-moto-black py-20 md:py-28 border-t border-brass/10"
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* Header de sección */}
        <div className="mb-12 md:mb-16">
          <p className="font-almaq text-brass text-[10px] md:text-xs tracking-[0.35em] uppercase mb-3">
            Quiénes somos
          </p>
          <h2 className="font-rider text-moto-bone text-4xl sm:text-5xl lg:text-6xl uppercase leading-[0.9]">
            Lhopital{' '}
            <span className="font-cormorant italic lowercase text-brass tracking-wide">
              Crew
            </span>
          </h2>
        </div>

        {/* Grid editorial: foto | texto */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 items-stretch">

          {/* Foto */}
          <div className="relative overflow-hidden aspect-[4/5] md:aspect-auto md:min-h-[480px] bg-white/[0.02]">
            <Image
              src="/nosotros-moto.jpg"
              alt="Lhopital · sobre dos ruedas"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover grayscale-[20%]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-moto-black/40 to-transparent"
            />
          </div>

          {/* Texto */}
          <div className="flex flex-col justify-center bg-white/[0.02] border border-brass/10 px-8 py-12 md:pl-12 md:pr-16 md:py-14">

            {/* Ancho de lectura cómodo — el texto no llega hasta el filo derecho */}
            <div className="max-w-[34rem]">

            {/* Cita de origen — el corazón emocional */}
            <blockquote className="font-cormorant italic text-moto-bone text-2xl md:text-3xl leading-snug mb-8">
              &ldquo;Así como L&rsquo;Hôpital tenía una regla para
              resolver sus problemas, nosotros tenemos una:{' '}
              <span className="not-italic font-medium text-brass">
                ¡salir a rodar!
              </span>
              &rdquo;
            </blockquote>

            {/* Respaldo */}
            <p className="font-almaq text-moto-bone/70 text-sm leading-relaxed mb-6">
              Somos una empresa mexicana fundada por amantes de las motocicletas,
              con 17 años de experiencia en la industria de la seguridad. Sabemos
              lo que se siente encontrar esa moto que te hace amar las dos ruedas
              — y lo que cuesta encontrar el equipo que esté a su altura.
            </p>

            {/* Remate curatorial — conecta con "We are the standard" */}
            <p className="font-almaq text-moto-bone/80 text-base md:text-lg leading-relaxed mb-8">
              Por eso no vendemos cualquier cosa. Traemos a México solo las marcas
              del mundo que cumplen el estándar.{' '}
              <span className="font-cormorant italic text-brass">
                We are the standard.
              </span>
            </p>

            {/* Pilares — espaciado parejo, con aire vertical si saltan de línea */}
            <div className="flex flex-wrap gap-x-3 gap-y-3">
              {['Calidad', 'Desempeño', 'Comodidad', 'Estética'].map((pilar) => (
                <span
                  key={pilar}
                  className="border border-brass/30 text-brass font-almaq text-[10px] tracking-[0.15em] uppercase px-4 py-2"
                >
                  {pilar}
                </span>
              ))}
            </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
