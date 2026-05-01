import Image from "next/image";

export default function BrandStory() {
  return (
    <section className="bg-white text-black px-6 py-24">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        {/* Logo lado izquierdo */}
        <div className="flex justify-center md:justify-start">
          <Image
            src="/logo/frase_vertical.png"
            alt="Lhopital - Finest Motorcycle Gear"
            width={340}
            height={400}
            className="w-full max-w-xs"
          />
        </div>

        {/* Texto lado derecho */}
        <div>
          <p className="text-black/40 text-xs tracking-[0.4em] uppercase mb-4">
            Nuestra Historia
          </p>
          <h2 className="text-4xl font-bold tracking-widest uppercase text-black mb-6">
            LHOPITAL
          </h2>
          <div className="w-12 h-px bg-black/30 mb-8" />

          <p className="text-black/70 leading-relaxed mb-6 text-base">
            Lhopital nació en 2021 con una idea simple: los motociclistas
            merecen equipo que sea tan apasionado como ellos. Diseñamos
            productos inspirados en la cultura del rider mexicano.
          </p>
          <p className="text-black/70 leading-relaxed mb-6 text-base">
            Adventure, Scrambler, Custom, Scooter, Bobber, Touring, Café
            Racer, Chopper, Sport, Cruiser, Naked, Enduro... No importa el
            tipo: <strong>¡las amamos todas!</strong>
          </p>
          <p className="text-black/70 leading-relaxed mb-10 text-base">
            Hoy somos el Distribuidor Master de{" "}
            <strong>Hedon Helmets</strong> y{" "}
            <strong>Beeline Moto II</strong> en la República Mexicana,
            llevando lo mejor del equipamiento internacional al rider mexa.
          </p>

          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold tracking-wide">2021</p>
              <p className="text-xs tracking-widest uppercase text-black/40 mt-1">
                Fundados
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-wide">2</p>
              <p className="text-xs tracking-widest uppercase text-black/40 mt-1">
                Marcas Master
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold tracking-wide">MX</p>
              <p className="text-xs tracking-widest uppercase text-black/40 mt-1">
                Todo el País
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
