/**
 * GuiaBody.tsx
 * Renderiza el array `cuerpo` (jsonb) de un registro `contenido`.
 *
 * Recibe los bloques ya resueltos: los sku_card con `sku` llegan con
 * `producto` adjunto (join hecho en el Server Component de la página).
 */

import Image from 'next/image';
import Link from 'next/link';
import type { ContenidoBloque, ContenidoSkuCardProducto } from '@/lib/types';
import { cloudinaryEditorialUrl, cloudinaryUrl, cloudinaryAccesorioUrl } from '@/lib/cloudinary';

function formatMXN(n: number) {
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
}

function tiendaHref(marca: string, sku?: string | null) {
  const base = `/tienda/${marca.replace(/_/g, '-')}`;
  return sku ? `${base}#${sku}` : base;
}

function Parrafos({ texto }: { texto: string }) {
  return (
    <>
      {texto.split('\n\n').filter(Boolean).map((parrafo, i) => (
        <p key={i} className="text-[14px] text-[#F4F1EC]/75 leading-[1.8] mb-4 last:mb-0">
          {parrafo}
        </p>
      ))}
    </>
  );
}

function BloqueTexto({ bloque }: { bloque: Extract<ContenidoBloque, { tipo: 'texto' }> }) {
  const { titulo, texto } = bloque.contenido;
  return (
    <div className="max-w-2xl mx-auto mb-12">
      {titulo && (
        <h2 className="font-sora font-bold text-[22px] md:text-[26px] text-[#F4F1EC] tracking-[-0.01em] mb-4">
          {titulo}
        </h2>
      )}
      <Parrafos texto={texto} />
    </div>
  );
}

function BloqueImagen({ bloque }: { bloque: Extract<ContenidoBloque, { tipo: 'imagen' }> }) {
  const { public_id, alt } = bloque.contenido;
  return (
    <div className="max-w-3xl mx-auto mb-12">
      <div className="relative w-full bg-[#111] border border-[rgba(244,241,236,0.08)]">
        <Image
          src={cloudinaryEditorialUrl(public_id)}
          alt={alt}
          width={1600}
          height={1067}
          className="w-full h-auto"
          sizes="(max-width: 768px) 100vw, 768px"
        />
      </div>
    </div>
  );
}

function BloqueSkuCard({
  bloque,
  marca,
  producto,
}: {
  bloque: Extract<ContenidoBloque, { tipo: 'sku_card' }>;
  marca: string;
  producto?: ContenidoSkuCardProducto;
}) {
  const { sku, numero, titulo, texto, imagen_public_id, precio_label } = bloque.contenido;

  const nombre = producto?.nombre ?? titulo;
  // La foto "en uso" del bloque (curada para la guía) tiene prioridad sobre
  // la foto de catálogo del producto — son distintas a propósito (ver nota
  // en la hoja "Contenido relacionado": no reemplazan la galería de la ficha).
  const imagenSrc = imagen_public_id
    ? cloudinaryAccesorioUrl(imagen_public_id)
    : producto?.imagen_principal
      ? cloudinaryUrl(producto.imagen_principal, 'detail')
      : cloudinaryAccesorioUrl(undefined);
  const precio = precio_label
    ?? (producto ? formatMXN(producto.precio ?? producto.precio_base) : null);
  const href = tiendaHref(marca, sku ?? undefined);

  return (
    <div className="max-w-3xl mx-auto mb-12">
      <div className="border border-[rgba(244,241,236,0.08)] hover:border-[rgba(244,241,236,0.18)] transition-colors duration-200 grid sm:grid-cols-[240px_1fr]">
        <div className="relative aspect-square bg-[#111]">
          <Image
            src={imagenSrc}
            alt={nombre}
            fill
            className="object-contain p-6"
            sizes="240px"
          />
        </div>
        <div className="flex flex-col p-6">
          {numero && (
            <div className="font-mono text-[10px] tracking-[0.15em] text-[#C9A961] mb-2">
              / {numero}
            </div>
          )}
          <h3 className="font-sora font-bold text-[16px] text-[#F4F1EC] mb-2">
            {nombre}
          </h3>
          {texto && <Parrafos texto={texto} />}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[rgba(244,241,236,0.07)]">
            {precio && (
              <span className="font-sora font-bold text-[15px] text-[#C9A961]">
                {precio}
              </span>
            )}
            <Link
              href={href}
              className="text-[11px] tracking-[0.1em] uppercase text-[#F4F1EC] border-b border-[rgba(244,241,236,0.35)] pb-1 hover:border-[#C9A961] hover:text-[#C9A961] transition-colors duration-200"
            >
              Ver en la tienda →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

interface GuiaBodyProps {
  cuerpo: ContenidoBloque[];
  marca: string;
  productosPorSku: Record<string, ContenidoSkuCardProducto>;
}

export function GuiaBody({ cuerpo, marca, productosPorSku }: GuiaBodyProps) {
  return (
    <div>
      {cuerpo.map((bloque, i) => {
        switch (bloque.tipo) {
          case 'texto':
            return <BloqueTexto key={i} bloque={bloque} />;
          case 'imagen':
            return <BloqueImagen key={i} bloque={bloque} />;
          case 'sku_card': {
            const sku = bloque.contenido.sku;
            const producto = sku ? productosPorSku[sku] : undefined;
            return (
              <BloqueSkuCard key={i} bloque={bloque} marca={marca} producto={producto} />
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
