import Link from 'next/link';
import { Cormorant_Garamond } from 'next/font/google';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500'],
  style: ['italic'],
  variable: '--font-cormorant-tienda',
});

export const metadata = {
  title: 'Tienda · Lhopital-moto',
  description: 'Tres marcas premium para motociclistas exigentes. Cascos Hedon, navegación Moto II y playeras Lhopital Tees.',
};

interface MarcaCard {
  slug: 'hedon' | 'moto-ii' | 'tees';
  numero: string;
  marca: string;
  titulo: string;
  frase: string;
  descripcion: string;
  bgColor: string;
  textColor: string;
  brassColor: string;
  fraseColor: string;
  cta: string;
  heroImage?: string;
}

const MARCAS: MarcaCard[] = [
  {
    slug: 'hedon',
    numero: '/ 01',
    marca: 'HEDON · REINO UNIDO',
    titulo: 'El arte de la protección.',
    frase: 'Cuatro modelos. Cada casco, una decisión.',
    descripcion: 'Hedonist, Epicurist 2.0, Heroine Racer 2.0 y el nuevo Psilo Explorer.',
    bgColor: 'bg-[#1A1410]',
    textColor: 'text-[#F4F1EC]',
    brassColor: 'text-[#C9A961]',
    fraseColor: 'text-[#C9A961]',
    cta: 'Ver cascos Hedon',
    heroImage: 'tienda-hedon',
  },
  {
    slug: 'moto-ii',
    numero: '/ 02',
    marca: 'BEELINE · REINO UNIDO',
    titulo: 'Diseñado para rodar.',
    frase: 'Una ruta. Una distancia. La calle.',
    descripcion: 'El navegador satelital más usado de Reino Unido, ahora en México.',
    bgColor: 'bg-[#0A0A0A]',
    textColor: 'text-[#F4F1EC]',
    brassColor: 'text-[#C9A961]',
    fraseColor: 'text-[#C9A961]',
    cta: 'Conoce Moto II',
    heroImage: 'tienda-moto',
  },
  {
    slug: 'tees',
    numero: '/ 03',
    marca: 'LHOPITAL TEES · MÉXICO',
    titulo: 'Rodar es la regla.',
    frase: 'Algodón premium, diseño propio.',
    descripcion: 'Seis diseños orgullosamente fabricados en México.',
    bgColor: 'bg-[#1A1A1A]',
    textColor: 'text-[#F5F5F5]',
    brassColor: 'text-[#C9A961]',
    fraseColor: 'text-[#C9A961]',
    cta: 'Ver playeras',
    heroImage: 'tienda-tees',
  },
];

export default function TiendaPage() {
  return (
    <main className={`${cormorant.variable} min-h-screen bg-[#0A0A0A] text-[#F4F1EC]`}>

      {/* Hero */}
      <section className="pt-32 pb-16">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-block w-6 h-px bg-[#C9A961]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
              Tienda Lhopital
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-medium tracking-tight leading-[0.95] mb-6">
            Tres mundos.<br/>
            <span
              className="font-medium italic text-[#C9A961]"
              style={{ fontFamily: 'var(--font-cormorant-tienda)' }}
            >
              Una sola obsesión.
            </span>
          </h1>
          <p className="text-[#F4F1EC]/60 text-base md:text-lg max-w-2xl leading-relaxed">
            Cada marca, su propio universo. Curados en México para quien
            entiende que rodar bien empieza con el equipo correcto.
          </p>
        </div>
      </section>

      {/* Cards de marca */}
      <section className="pb-24">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 space-y-6">
          {MARCAS.map((m) => (
            <Link key={m.slug} href={`/tienda/${m.slug}`} className="group block">
              <article
                className={`${m.bgColor} ${m.textColor} relative overflow-hidden border border-[#F4F1EC]/8 hover:border-[#C9A961]/40 transition-all duration-500`}
              >
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 min-h-[400px]">
                  <div className="lg:col-span-3 p-8 md:p-12 lg:p-16 flex flex-col justify-between">
                    <div>
                      <div className="flex items-baseline gap-3 mb-6">
                        <span className={`font-mono text-xs tracking-[0.2em] ${m.brassColor}`}>
                          {m.numero}
                        </span>
                        <span className={`text-[10px] tracking-[0.3em] uppercase ${m.textColor} opacity-50`}>
                          {m.marca}
                        </span>
                      </div>
                      <h2 className="text-3xl md:text-5xl font-medium tracking-tight leading-[1.05] mb-4 group-hover:text-[#C9A961] transition-colors duration-300">
                        {m.titulo}
                      </h2>
                      <p
                        className={`text-lg md:text-xl italic ${m.fraseColor} mb-6`}
                        style={{ fontFamily: 'var(--font-cormorant-tienda)' }}
                      >
                        {m.frase}
                      </p>
                      <p className={`text-sm md:text-base ${m.textColor} opacity-70 leading-relaxed max-w-md`}>
                        {m.descripcion}
                      </p>
                    </div>
                    <div className="mt-8">
                      <span className={`inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase ${m.brassColor} border-b border-[#C9A961]/40 pb-1 group-hover:border-[#C9A961] transition-colors`}>
                        {m.cta}
                        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                      </span>
                    </div>
                  </div>
                  <div className="lg:col-span-2 relative aspect-square lg:aspect-auto bg-gradient-to-br from-[#1f1f1f] to-[#0d0d0d] overflow-hidden">
                    {m.heroImage && (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{
                          backgroundImage: `url(https://res.cloudinary.com/lhopital-moto/image/upload/w_800,h_800,c_fill,g_auto,f_auto,q_auto/${m.heroImage})`,
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </section>

      {/* Diferenciador */}
      <section className="py-20 border-t border-[#F4F1EC]/8">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 text-center">
          <div className="mb-6 flex items-center justify-center gap-2">
            <span className="inline-block w-6 h-px bg-[#C9A961]" />
            <span className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961]">
              We are the standard
            </span>
            <span className="inline-block w-6 h-px bg-[#C9A961]" />
          </div>
          <h3
            className="text-3xl md:text-4xl italic text-[#F4F1EC] leading-[1.3] mb-4"
            style={{ fontFamily: 'var(--font-cormorant-tienda)' }}
          >
            &ldquo;No vendemos productos. Curamos el equipo<br/>
            que tu próxima salida merece.&rdquo;
          </h3>
          <p className="text-sm text-[#F4F1EC]/55 max-w-xl mx-auto leading-relaxed mt-6">
            Cada marca pasó por nuestras manos antes de llegar a las tuyas.
            Esto no es importación, es selección.
          </p>
        </div>
      </section>

      <footer className="py-12 px-6 text-center text-[10px] tracking-[0.2em] uppercase text-[#F4F1EC]/35 border-t border-[#F4F1EC]/8">
        Lhopital-moto · We are the standard
      </footer>

    </main>
  );
}
