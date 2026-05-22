export default function FranjaConfianza() {
  const pilares = [
    'Montajes versátiles',
    'Botones para uso con guantes',
    'USB-C incluido',
  ]

  return (
    <section
      aria-label="Por qué Moto II"
      className="bg-moto-black py-20 md:py-28"
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">

          {/* Frase principal */}
          <h2 className="font-sora font-light text-moto-bone text-3xl md:text-4xl lg:text-5xl leading-[1.1] tracking-tight">
            Enfocado en la navegación,{' '}
            <br className="hidden sm:block" />
            diseño clásico.
          </h2>

          {/* Tres pilares con separador brass */}
          <div className="mt-10 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-0">
            {pilares.map((pilar, i) => (
              <span key={pilar} className="flex items-center">
                <span className="font-mono text-moto-bone text-xs md:text-sm tracking-[0.25em] uppercase">
                  {pilar}
                </span>
                {i < pilares.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden sm:inline-block mx-5 md:mx-7 w-1 h-1 rounded-full bg-moto-brass"
                  />
                )}
              </span>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}
