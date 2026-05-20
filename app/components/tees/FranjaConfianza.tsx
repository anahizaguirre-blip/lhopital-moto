const sellos = [
  'Hecho en México',
  'Diseños propios y exclusivos',
  'Envíos a todo México',
]

export default function FranjaConfianza() {
  return (
    <section
      aria-label="Franja de confianza"
      className="relative w-full bg-tees-black overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 py-10 lg:py-12">

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-0">
          {sellos.map((sello, index) => (
            <div key={sello} className="flex items-center">

              {/* Separador rojo — no aparece antes del primer sello */}
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="hidden sm:block text-tees-red text-xl mx-6 lg:mx-10"
                >
                  ·
                </span>
              )}

              {/* Texto del sello */}
              <p className="font-mono text-tees-white text-xs sm:text-sm tracking-[0.25em] uppercase text-center">
                {sello}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}