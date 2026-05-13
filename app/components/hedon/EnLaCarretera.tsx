import Image from "next/image";

export default function EnLaCarretera() {
  return (
    <section className="bg-hedon-brown pt-16 md:pt-20 pb-0 px-6 md:px-12">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10 md:mb-14">
        <p className="font-almaq text-hedon-brass text-xs tracking-[0.25em] uppercase mb-8 animate-fade-in-up">
  <span className="inline-block w-8 h-px bg-hedon-brass align-middle mr-3" />
          En la ciudad.
        </p>
        <h2 className="font-rider text-hedon-cream text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8 animate-fade-in-up">
          El casco en su elemento.
        </h2>
        <p className="font-cormorant italic text-hedon-brass text-2xl md:text-3xl animate-fade-in-up-slow">
        No fue diseñado para la vitrina.
      </p>
      </div>

      {/* Grid de fotos */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Foto izquierda - Hedonist en Tlatelolco */}
        <figure className="relative aspect-[2/3] overflow-hidden animate-fade-in-scale">
          <Image
            src="/products/hedonist-en-moto.jpg"
            alt="Casco Hedonist en Av. Guerrero, Tlatelolco, CDMX"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
          {/* Gradiente legibilidad */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          {/* Pie de foto editorial */}
          <figcaption className="absolute bottom-8 left-8 right-8">
            <p className="font-almaq text-hedon-cream text-base md:text-lg leading-tight">
              Hedonist
            </p>
            <p className="font-almaq text-hedon-brass text-sm md:text-base tracking-wide mt-1">
              Av. Guerrero · Tlatelolco
            </p>
            <p className="font-cormorant italic text-hedon-cream/85 text-base md:text-lg mt-3">
              Tres culturas. Una sola línea de fuga.
            </p>
          </figcaption>
        </figure>

        {/* Foto derecha - Heroine en Bellas Artes */}
        <figure
          className="relative aspect-[2/3] overflow-hidden animate-fade-in-scale"
          style={{ animationDelay: "200ms", animationFillMode: "backwards" }}
        >
          <Image
            src="/products/heroine-en-moto.jpg"
            alt="Casco Heroine Racer en Av. Juárez, frente a Bellas Artes, CDMX"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
          <figcaption className="absolute bottom-8 left-8 right-8">
            <p className="font-almaq text-hedon-cream text-base md:text-lg leading-tight">
              Heroine Racer
            </p>
            <p className="font-almaq text-hedon-brass text-sm md:text-base tracking-wide mt-1">
              Av. Juárez · frente a Bellas Artes
            </p>
            <p className="font-cormorant italic text-hedon-cream/85 text-base md:text-lg mt-3">
              El mármol detrás. La ruta adelante.
            </p>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}