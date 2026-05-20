export default function CierreTees() {
  return (
    <section
      aria-label="Cierre Tees"
      className="relative w-full min-h-screen bg-tees-black overflow-hidden flex flex-col items-center justify-center text-center px-6 sm:px-10 lg:px-16"
    >
      {/* Lhopital gigante */}
      <h2 className="font-rider text-tees-white text-7xl sm:text-8xl lg:text-9xl xl:text-[12rem] leading-[0.85] tracking-tight mb-8">
        LHOPITAL
      </h2>

      {/* Frase de cierre Tees */}
      <p className="font-cormorant italic text-tees-white/80 text-2xl sm:text-3xl lg:text-4xl mb-16">
        Hecha donde se rueda.
      </p>
      
    </section>
  )
}