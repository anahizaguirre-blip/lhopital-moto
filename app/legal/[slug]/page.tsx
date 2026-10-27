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

// Soporta **negritas** y [enlaces](/ruta) inline.
function renderInline(texto: string) {
  const partes = texto.split(/(\*\*.+?\*\*|\[[^\]]+\]\([^)]+\))/g);
  return partes.map((parte, i) => {
    const negrita = parte.match(/^\*\*(.+)\*\*$/);
    if (negrita) {
      return (
        <strong key={i} className="text-[#F4F1EC] font-semibold">
          {negrita[1]}
        </strong>
      );
    }
    const enlace = parte.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (enlace) {
      return (
        <Link
          key={i}
          href={enlace[2]}
          className="text-[#C9A961] underline underline-offset-4 decoration-[#C9A961]/40 hover:decoration-[#C9A961] transition"
        >
          {enlace[1]}
        </Link>
      );
    }
    return <span key={i}>{parte}</span>;
  });
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
    case 'lista_num':
      return (
        <ol className="mb-4 space-y-2">
          {bloque.items.map((item, i) => (
            <li key={i} className="font-almaq text-[14px] text-[#F4F1EC]/85 leading-[1.8] pl-7 relative">
              <span className="absolute left-0 top-0 font-mono text-[12px] leading-[2.1] text-[#C9A961]">
                {String(i + 1).padStart(2, '0')}
              </span>
              {renderInline(item)}
            </li>
          ))}
        </ol>
      );
    case 'tabla':
      // Dos columnas: el texto largo se envuelve en la primera y el
      // importe queda alineado a la derecha, así cabe en 320px sin scroll.
      return (
        <div className="my-6">
          <table className="w-full border-collapse font-almaq text-[14px] leading-[1.6]">
            <thead>
              <tr className="border-b border-[#F4F1EC]/30">
                <th scope="col" className="text-left font-semibold text-[#F4F1EC] text-[11px] tracking-[0.1em] uppercase py-3 pr-4">
                  {bloque.encabezados[0]}
                </th>
                <th scope="col" className="text-right font-semibold text-[#F4F1EC] text-[11px] tracking-[0.1em] uppercase py-3 whitespace-nowrap">
                  {bloque.encabezados[1]}
                </th>
              </tr>
            </thead>
            <tbody>
              {bloque.filas.map(([a, b], i) => (
                <tr key={i} className="border-b border-[rgba(244,241,236,0.08)]">
                  <td className="py-3 pr-4 text-[#F4F1EC]/85 align-top">{renderInline(a)}</td>
                  <td className="py-3 text-right text-[#F4F1EC] align-top whitespace-nowrap">{renderInline(b)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
