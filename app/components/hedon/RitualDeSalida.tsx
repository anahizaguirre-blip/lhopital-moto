import Image from 'next/image'

export default function RitualDeSalida() {
  return (
    <section
      id="ritual"
      aria-label="El ritual de salida"
      className="relative w-full overflow-hidden h-[100svh] lg:h-[100vh]"
          >
      {/* Foto full-bleed de fondo */}
      <Image
        src="/products/hedon/hedonist-2.jpg"
        alt="Motociclista abrochando el barbiquejo de su casco Hedonist, con chamarra camel"
        fill
        priority={false}
        quality={90}
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: 'center 10%' }}
      />

      {/* Overlay lateral 30% — gradiente marrón desde la izquierda */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(42, 24, 16, 0.75) 0%, rgba(42, 24, 16, 0.4) 30%, transparent 55%)',
        }}
      />

      {/* Texto sobre la foto */}
      <div className="relative z-10 h-full flex items-center">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="max-w-[70%] sm:max-w-[55%] lg:max-w-[50%]">

            {/* Microcopy con guion editorial */}
            <div
              className="flex items-center gap-4 mb-8 opacity-0 animate-fade-in-up-slow"
              style={{ animationDelay: '0.2s' }}
            >
              <span
                aria-hidden="true"
                className="block w-10 h-px bg-hedon-brass"
              />
              <p className="font-almaq text-hedon-brass text-xs tracking-[0.30em] uppercase">
                El ritual
              </p>
            </div>

            {/* Título display — rompe en dos líneas */}
            <h2
              className="font-rider text-hedon-cream text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[0.95] tracking-tight mb-8 opacity-0 animate-fade-in-up-slow"
              style={{ animationDelay: '0.4s' }}
            >
              Antes del<br />
              primer kilómetro.
            </h2>

            {/* Cierre poético en cursiva */}
            <p
              className="font-cormorant italic text-hedon-brass/70 text-xl sm:text-2xl lg:text-3xl leading-relaxed max-w-md opacity-0 animate-fade-in-up-slow"
              style={{ animationDelay: '0.65s' }}
            >
              Hay un instante que sólo el motociclista conoce.
            </p>

          </div>
        </div>
      </div>
    </section>
  )
}
