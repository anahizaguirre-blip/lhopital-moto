import Image from "next/image";
import Link from "next/link";

const products = [
  {
    brand: "Hedon",
    name: "Cascos Premium",
    description:
      "Los cascos más elegantes de Inglaterra. Seguridad máxima con estética legendaria. Distribuidor Master en México.",
    price: "Desde $22,900 MXN",
    href: "/productos/hedon",
    imageSrc: "/products/hedon-casco.webp",
    tag: "Distribuidor Master",
  },
  {
    brand: "Beeline",
    name: "Moto II",
    description:
      "El navegador satelital diseñado específicamente para motociclistas. Minimalista, resistente y conectado.",
    price: "Desde $4,700 MXN",
    href: "/productos/beeline-moto-ii",
    imageSrc: "/products/beeline-moto2.webp",
    tag: "Distribuidor Master",
  },
];

export default function ProductShowcase() {
  return (
    <section className="bg-black px-6 py-24">
      <div className="max-w-6xl mx-auto">
        {/* Encabezado */}
        <div className="text-center mb-16">
          <p className="text-white/40 text-xs tracking-[0.4em] uppercase mb-3">
            Nuestras Marcas
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-widest uppercase text-white">
            Equipo Premium
          </h2>
          <div className="w-16 h-px bg-white/30 mx-auto mt-6" />
        </div>

        {/* Grid de productos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {products.map((product) => (
            <Link
              key={product.brand}
              href={product.href}
              className="group relative overflow-hidden border border-white/10 hover:border-white/40 transition-all duration-500 block"
            >
              {/* Imagen */}
              <div className="relative h-72 bg-white/5 overflow-hidden">
                <Image
                  src={product.imageSrc}
                  alt={product.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                {/* Tag */}
                <span className="absolute top-4 left-4 text-xs tracking-widest uppercase bg-white text-black px-3 py-1 font-bold">
                  {product.tag}
                </span>
              </div>

              {/* Info */}
              <div className="p-8 bg-black">
                <p className="text-white/40 text-xs tracking-[0.3em] uppercase mb-2">
                  {product.brand}
                </p>
                <h3 className="text-2xl font-bold tracking-wide text-white mb-3">
                  {product.name}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed mb-6">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-semibold tracking-wide">
                    {product.price}
                  </span>
                  <span className="text-xs tracking-widest uppercase text-white/50 group-hover:text-white transition-colors duration-200">
                    Ver más →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/tienda"
            className="inline-block border border-white/30 hover:border-white text-white px-10 py-4 text-sm tracking-widest uppercase transition-colors duration-200 hover:bg-white/5"
          >
            Ver todos los productos
          </Link>
        </div>
      </div>
    </section>
  );
}
