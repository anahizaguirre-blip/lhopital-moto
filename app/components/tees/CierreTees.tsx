export default function CierreTees() {
  return (
    <section className="bg-tees-black min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="text-center px-6">
        <h2
          className="font-rider text-tees-white leading-[0.8] select-none"
          style={{ fontSize: 'clamp(6rem, 22vw, 22rem)' }}
        >
          LHOPITAL.
        </h2>
        <p className="font-almaq text-tees-white/80 text-xl md:text-2xl mt-4 md:mt-6">
          Aquí se rueda.
        </p>
      </div>
    </section>
  )
}