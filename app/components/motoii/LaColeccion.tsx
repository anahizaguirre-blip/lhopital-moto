import Image from 'next/image'

export default function LaColeccion() {
const modelos = [
  {
    nombre: 'Black',
    archivo: 'ModeloBlack.jpg',
    codigo: 'MTII_BLK',
    objectPosition: '50% 35%',
    scale: 'scale-[3]',
  },
  {
  nombre: 'Gun Metal',
  archivo: 'ModeloGun.jpg',
  codigo: 'MTII_GMG',
  objectPosition: '40% 50%',   // ← cambia este valor
  scale: 'scale-[2.5]',
},
  {
    nombre: 'Silver',
    archivo: 'ModeloSilver.jpg',
    codigo: 'MTII_SVR',
    objectPosition: '50% 50%',
    scale: 'scale-[2]',
  },
]

  return (
    <section
      aria-label="La colección Moto II"
      className="bg-moto-black pt-24 md:pt-32 pb-0"
    >
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">

        {/* Header de sección */}
        <div className="mb-16 md:mb-20 max-w-3xl">
          <span className="block mb-6">
            <span
              aria-hidden="true"
              className="inline-block w-8 h-px bg-moto-signal align-middle mr-3"
            />
            <span className="font-mono text-moto-signal text-xs tracking-[0.3em] uppercase">
              La colección
            </span>
          </span>

          <h2 className="font-rider text-moto-bone text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6">
            Tres acabados.
            <br />
            Una misma promesa.
          </h2>

          <p className="font-inter font-light text-moto-bone/70 text-lg md:text-xl leading-relaxed max-w-2xl">
            Mismo navegador. Mismas capacidades. Tres lecturas estéticas para que combines con tu
            moto, no contra ella.
          </p>
        </div>

        {/* Grid de 3 modelos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {modelos.map((modelo, idx) => (
            <div key={modelo.nombre} className="group">

              {/* Foto del modelo con zoom personalizado */}
              <div className="relative w-full aspect-[3/2] overflow-hidden mb-6 bg-moto-line">
                <Image
                  src={`/products/motoii/${modelo.archivo}`}
                  alt={`Beeline Moto II acabado ${modelo.nombre}`}
                  fill
                  quality={90}
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className={`object-cover ${modelo.scale} transition-transform duration-700`}
                  style={{ objectPosition: modelo.objectPosition }}
                />
              </div>

              {/* Info del modelo */}
              <div className="flex items-baseline justify-between border-t border-moto-line pt-4">
                <div>
                  <div className="font-mono text-moto-grey text-xs tracking-[0.3em] uppercase mb-2">
                    / 0{idx + 1}
                  </div>
                  <h3 className="font-rider text-moto-bone text-3xl md:text-4xl">
                    {modelo.nombre}
                  </h3>
                </div>
                <span className="font-mono text-moto-grey text-xs tracking-[0.2em] uppercase">
                  {modelo.codigo}
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}