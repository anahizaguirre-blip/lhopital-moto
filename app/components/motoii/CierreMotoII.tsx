'use client'

export default function CierreMotoII() {
  return (
    <>
      <section className="bg-moto-black min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="text-center px-6 w-full">
          <h2
            className="font-sora font-bold text-moto-bone leading-[0.85] select-none uppercase whitespace-nowrap"
            style={{ fontSize: 'clamp(3rem, 15vw, 15rem)', letterSpacing: '-0.02em' }}
          >
            MOTO II
          </h2>
          <p className="font-cormorant italic text-[var(--gold)] text-xl md:text-2xl mt-4 md:mt-6 tracking-wide">
            Navegación pura.
          </p>
        </div>
      </section>
    </>
  )
}