export default function FranjaConfianza() {
  return (
    <section className="bg-hedon-brass py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6 md:px-10 text-center">
        <p className="font-cormorant italic text-hedon-brown text-2xl md:text-4xl lg:text-5xl leading-[1.2] mb-8 md:mb-10">
          Combina diseño atemporal con comodidad y seguridad de vanguardia.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-6 md:gap-x-10 gap-y-3">
          <span className="font-almaq text-hedon-brown text-xs md:text-sm tracking-[0.25em] uppercase">
            ECE 22.06
          </span>
          <span className="inline-block w-1 h-1 rounded-full bg-hedon-brown/60" />
          <span className="font-almaq text-hedon-brown text-xs md:text-sm tracking-[0.25em] uppercase">
            DOT on demand
          </span>
          <span className="inline-block w-1 h-1 rounded-full bg-hedon-brown/60" />
          <span className="font-almaq text-hedon-brown text-xs md:text-sm tracking-[0.25em] uppercase">
            Garantía Hedon
          </span>
        </div>
      </div>
    </section>
  )
}