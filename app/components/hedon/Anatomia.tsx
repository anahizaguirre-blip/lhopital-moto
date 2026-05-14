import Image from 'next/image'

const bloques = [
  {
    numero: '01',
    titulo: 'La materia',
    descripcion: 'Cubierta de fibra de vidrio y fibra de carbono. Ligera, indestructible, honesta.',
  },
  {
    numero: '02',
    titulo: 'La protección',
    descripcion: 'Liner Hed Armour con acolchado de 360°. Tejido antibacterial Merlin.',
  },
  {
    numero: '03',
    titulo: 'El acabado',
    descripcion: 'Pintura grado automotriz sobre la cubierta. Forro y detalles en cuero.',
  },
  {
    numero: '04',
    titulo: 'Los detalles',
    descripcion: 'Placa HEDON de latón. Hebilla DD de latón. La firma de la casa.',
  },
  {
    numero: '05',
    titulo: 'El respiro',
    descripcion: 'Sistema de ventilación de 3 canales. Ultra ligero, perfil bajo.',
  },
]

export default function Anatomia() {
  return (
    <section className="bg-hedon-brown pt-16 md:pt-20 pb-24 md:pb-32">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        {/* Header */}
        <div className="mb-12 md:mb-16">
          <span className="block mb-6">
            <span className="inline-block w-8 h-px bg-hedon-brass align-middle mr-3" />
            <span className="font-almaq text-hedon-brass text-xs tracking-[0.25em] uppercase">
              Anatomía
            </span>
          </span>
          <h2 className="font-rider text-hedon-cream text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-4">
            La cúspide de los cascos artesanales.
          </h2>
          <p className="font-cormorant italic text-hedon-brass text-2xl md:text-3xl">
            Detalle por detalle.
          </p>
        </div>

        {/* Split asimétrico: foto + specs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Foto editorial - 7/12 */}
           <div className="lg:col-span-7 lg:self-stretch">
            <div className="relative w-full h-[600px] md:h-[700px] lg:h-full overflow-hidden bg-hedon-brown/40">
              <Image
                src="/products/heroine-eastwood-1.jpg"
                alt="Casco Hedon Heroine Eastwood — detalle artesanal"
                fill
                className="object-cover"
                style={{ objectPosition: 'center -10%' }}
                sizes="(max-width: 1024px) 100vw, 58vw"
              />
            </div>
          </div>

          {/* Specs - 5/12 */}
          <div className="lg:col-span-5 lg:pt-4">
            {/* Eyebrow */}
            <p className="font-almaq text-hedon-brass/80 text-[10px] md:text-xs tracking-[0.3em] uppercase mb-10 md:mb-12">
              Hecho a mano · Ultra ligero
            </p>

            {/* Lista de bloques */}
            <ul className="space-y-8 md:space-y-10">
              {bloques.map((bloque) => (
                <li key={bloque.numero} className="grid grid-cols-[auto_1fr] gap-5 md:gap-6">
                  <span className="font-rider text-hedon-brass text-3xl md:text-4xl leading-none pt-1">
                    {bloque.numero}
                  </span>
                  <div>
                    <h3 className="font-rider text-hedon-cream text-xl md:text-2xl mb-2">
                      {bloque.titulo}
                    </h3>
                    <p className="font-almaq text-hedon-cream/70 text-sm md:text-base leading-relaxed">
                      {bloque.descripcion}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}