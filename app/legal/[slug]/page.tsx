/**
 * Página legal genérica
 * URL: /legal/[slug]
 *
 * Ruta dinámica que renderiza los 4 documentos legales (aviso de
 * privacidad, términos y condiciones, políticas de entrega, política de
 * devoluciones) desde una constante en el repo — no requiere Supabase,
 * es contenido estático que casi no cambia.
 */

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Footer from '@/app/components/Footer';
import { LEGAL_DOCUMENTOS, getLegalDocumento, type LegalBloque } from '@/lib/legal-content';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return LEGAL_DOCUMENTOS.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const documento = getLegalDocumento(slug);
  if (!documento) return { title: 'Contenido no encontrado' };
  return {
    title: `${documento.titulo} · Lhopital-moto`,
    description: documento.titulo,
  };
}

// Soporta **negritas** inline con la misma sintaxis ligera que el resto
// del sitio usa para bloques de texto estático.
function renderInline(texto: string) {
  const partes = texto.split(/\*\*(.+?)\*\*/g);
  return partes.map((parte, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-[#F4F1EC] font-semibold">
        {parte}
      </strong>
    ) : (
      <span key={i}>{parte}</span>
    )
  );
}

function BloqueLegal({ bloque }: { bloque: LegalBloque }) {
  switch (bloque.tipo) {
    case 'h2':
      return (
        <h2 className="font-sora font-bold text-[20px] md:text-[24px] text-[#F4F1EC] tracking-[-0.01em] mt-10 mb-4 first:mt-0">
          {bloque.texto}
        </h2>
      );
    case 'h3':
      return (
        <h3 className="font-sora font-bold text-[16px] md:text-[18px] text-[#F4F1EC] tracking-[-0.01em] mt-8 mb-3">
          {bloque.texto}
        </h3>
      );
    case 'p':
      return (
        <p className="font-almaq text-[14px] text-[#F4F1EC]/85 leading-[1.8] mb-4">
          {renderInline(bloque.texto)}
        </p>
      );
    case 'lista':
      return (
        <ul className="mb-4 space-y-2">
          {bloque.items.map((item, i) => (
            <li key={i} className="font-almaq text-[14px] text-[#F4F1EC]/85 leading-[1.8] pl-5 relative">
              <span className="absolute left-0 top-[0.7em] w-1.5 h-1.5 bg-[#C9A961]" />
              {renderInline(item)}
            </li>
          ))}
        </ul>
      );
    default:
      return null;
  }
}

export default async function LegalPage({ params }: PageProps) {
  const { slug } = await params;
  const documento = getLegalDocumento(slug);
  if (!documento) notFound();

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F1EC]">

      {/* Breadcrumb */}
      <nav className="pt-32 pb-6">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <div className="text-[11px] tracking-[0.1em] text-[#F4F1EC]/45 font-mono">
            <Link href="/" className="hover:text-[#C9A961] transition">/ Inicio</Link>
            {' · '}
            <span className="text-[#F4F1EC]">Legal</span>
          </div>
        </div>
      </nav>

      {/* Título */}
      <header className="pb-12">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16">
          <h1 className="font-sora font-bold text-[30px] md:text-[42px] text-[#F4F1EC] leading-tight tracking-[-0.02em] max-w-3xl mx-auto">
            {documento.titulo}
          </h1>
        </div>
      </header>

      {/* Cuerpo */}
      <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pb-16">
        <div className="max-w-3xl mx-auto">
          {documento.cuerpo.map((bloque, i) => (
            <BloqueLegal key={i} bloque={bloque} />
          ))}

          <p className="font-almaq text-[11px] tracking-[0.1em] uppercase text-[#F4F1EC]/35 mt-12 pt-6 border-t border-[rgba(244,241,236,0.08)]">
            Última actualización: {documento.ultimaActualizacion}
          </p>
        </div>
      </div>

      <Footer bg="dark" />

    </main>
  );
}
