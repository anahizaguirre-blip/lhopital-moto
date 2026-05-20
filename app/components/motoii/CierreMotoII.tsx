export default function CierreMotoII() {
  return (
    <>
      {/* === 08 CIERRE MOTO II — letra gigante mic-drop en Lhopital Rider === */}
      <section className="bg-[#0a0a0a] min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="text-center px-6 w-full">
          <h2
            className="font-rider text-[#f5f3f0] leading-[0.85] select-none uppercase"
            style={{ fontSize: 'clamp(6rem, 24vw, 24rem)', letterSpacing: '-0.01em' }}
          >
            MOTO II
          </h2>
          <p
            className="font-cormorant italic text-[var(--gold)] text-xl md:text-2xl mt-4 md:mt-6 tracking-wide"
          >
            Navegación pura.
          </p>
        </div>
      </section>

      
    </>
  )
}
