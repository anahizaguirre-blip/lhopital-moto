"use client";

import Image from "next/image";

export default function HeroMotoII() {
  const scrollToInicio = () => {
    const el = document.getElementById("inicio");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative w-full h-screen overflow-hidden bg-moto-black">
      {/* Imagen de fondo */}
      <Image
        src="/products/MOTO_II/hero_moto_ii.jpg"
        alt="Moto II por Beeline en carretera mexicana"
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: "50% 50%" }}
      />

      {/* Overlay sutil para legibilidad */}
      <div className="absolute inset-0 bg-gradient-to-b from-moto-black/40 via-transparent to-moto-black/70" />

      {/* Contenido */}
      <div className="relative z-10 h-full w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col justify-between py-16 md:py-20">
        {/* Top: tag editorial */}
        <div className="pt-8 md:pt-12">
          <span className="font-mono text-moto-bone/70 text-xs tracking-[0.3em] uppercase">
            Beeline &middot; Reino Unido
          </span>
        </div>

        {/* Centro/Bottom: título + tagline */}
        <div className="pb-8 md:pb-16 max-w-4xl">
          <h1 className="font-rider text-moto-bone text-7xl md:text-8xl lg:text-9xl leading-[0.9] mb-6">
            MOTO II
          </h1>
          <p className="font-inter text-moto-bone/90 text-lg md:text-2xl font-light max-w-2xl mb-10 leading-relaxed">
            El navegador que no quiere ser visto.
            <br />
            Solo quiere que llegues.
          </p>

          {/* CTA scroll suave */}
          <button
            onClick={scrollToInicio}
            className="group inline-flex items-center gap-3 font-mono text-xs tracking-[0.3em] uppercase text-moto-bone hover:text-moto-signal transition-colors duration-300"
          >
            <span>Descubrir</span>
            <span className="inline-block w-12 h-px bg-moto-bone group-hover:bg-moto-signal transition-colors duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}
