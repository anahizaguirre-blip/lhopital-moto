import Image from "next/image";

type Modelo = {
  nombre: string;
  imagen: string;
  alt: string;
  badge?: string;
};

const modelos: Modelo[] = [
  {
    nombre: "Heroine Racer 2.0",  
    imagen: "/products/hedon/heroine.jpg",
    alt: "Casco Heroine Racer de Hedon",
  },
  {
    nombre: "Hedonist",
    imagen: "/products/hedon/hedonist.jpg",
    alt: "Casco Hedonist de Hedon",
  },
  {
    nombre: "Epicurist 2.0",
    imagen: "/products/hedon/epicurist-1.jpg",
    alt: "Casco Epicurist 2.0 de Hedon",
    badge: "Foto oficial Hedon UK",
  },
  {
    nombre: "Psilo Explorer",
    imagen: "/products/hedon/psilo-1.jpg",
    alt: "Casco Psilo Explorer de Hedon",
    badge: "Colección 2026",
  },
];

export default function LaColeccion() {
  return (
    <section className="bg-hedon-brown pt-16 md:pt-20 pb-0">
      {/* Header */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
        <p className="font-almaq text-hedon-brass text-xs tracking-[0.30em] uppercase mb-8 animate-fade-in-up">
          <span className="inline-block w-8 h-px bg-hedon-brass align-middle mr-3" />
          La Colección
        </p>
        <h2 className="font-hedon-display text-hedon-cream text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-6 animate-fade-in-up">
          Cuatro maneras de salir a rodar.
        </h2>
        <p className="font-cormorant italic text-hedon-brass text-2xl md:text-3xl mb-12 md:mb-16 animate-fade-in-up-slow">
          Cada casco, una decisión.
        </p>
      </div>

      {/* Grid 2x2 */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {modelos.map((modelo, index) => (
          <article
            key={modelo.nombre}
            className="group animate-fade-in-scale"
            style={{
              animationDelay: `${index * 150}ms`,
              animationFillMode: "backwards",
            }}
          >
            {/* Contenedor de foto */}
            <div className="relative aspect-square overflow-hidden mb-3">
              <Image
              src={modelo.imagen}
              alt={modelo.alt}
              fill
              className={
  modelo.nombre === "Heroine Racer"
    ? "object-cover object-[center_10%] scale-100"
    : modelo.nombre === "Hedonist"
    ? "object-cover object-[center_5%]"
    : modelo.nombre === "Epicurist 2.0"
    ? "object-cover object-[center_10%]"
    : "object-cover"
}
  sizes="(max-width: 768px) 100vw, 50vw"
  priority={index < 2}
/>
              {/* Badge condicional */}
              {modelo.badge && (
                <div className="absolute top-5 left-5 bg-hedon-brown/85 border border-hedon-brass/40 px-3 py-1.5 backdrop-blur-sm">
                  <p className="font-almaq text-hedon-brass text-[10px] tracking-[0.2em] uppercase">
                    {modelo.badge}
                  </p>
                </div>
              )}
            </div>
              {/* Info debajo de la foto */}
              <div className="px-1">
              <h3 className="font-hedon-display text-hedon-cream text-3xl md:text-4xl leading-tight">
              {modelo.nombre}
            </h3>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}