import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/lib/types';
import { cloudinaryUrl } from '@/lib/cloudinary';
import {
  estadoPieza,
  precioPieza,
  variantePieza,
  notaExtra,
  formatMXN,
} from '@/lib/fuera-de-serie';
import { SelloMotivo, SelloVendida, AvisoElectrico } from './Sellos';
import { BotonAgregarPieza } from './BotonAgregarPieza';

export function TarjetaPieza({ product }: { product: Product }) {
  const estado   = estadoPieza(product);
  const precio   = precioPieza(product);
  const variante = variantePieza(product);
  const nota     = notaExtra(product);
  const vendida  = estado === 'vendida';
  const href     = `/tienda/hedon/${product.slug}`;

  return (
    <article className="flex flex-col border border-[#F5EFE0]/10 bg-[#F5EFE0]/[0.03]">
      <Link href={href} className="relative block aspect-square overflow-hidden bg-[#1f120b]">
        <Image
          src={cloudinaryUrl(product.imagen_principal, 'card')}
          alt={`${product.nombre}, talla ${variante?.talla ?? ''}`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover transition duration-500 ${
            vendida ? 'grayscale opacity-50' : 'hover:scale-[1.03]'
          }`}
        />
        {vendida && (
          <span className="absolute inset-x-0 bottom-4 flex justify-center">
            <span className="bg-[#2A1810]/85 px-1">
              <SelloVendida />
            </span>
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-4 min-h-[2.5rem]">
          {!vendida && product.motivo_unico && <SelloMotivo motivo={product.motivo_unico} />}
        </div>

        <h3 className="text-lg font-medium text-[#F5EFE0] leading-snug">
          <Link href={href} className="hover:text-[#C9A961] transition">
            {product.familia} <span className="font-cormorant italic text-xl">{product.color}</span>
          </Link>
        </h3>
        <p className="mt-1 text-[11px] tracking-[0.18em] uppercase text-[#F5EFE0]/55">
          Talla {variante?.talla ?? '—'} · {product.certificacion}
        </p>
        {nota && <p className="mt-2 text-[12px] text-[#8B6F47]">{nota}</p>}

        {product.motivo_unico === 'electrico' && !vendida && <AvisoElectrico className="mt-4" />}

        <div className="mt-auto pt-6">
          {estado === 'disponible' && precio !== null && (
            <>
              <p className="mb-4 text-2xl font-medium text-[#F5EFE0]">
                {formatMXN(precio)} <span className="text-[10px] tracking-[0.15em] text-[#F5EFE0]/45">MXN</span>
              </p>
              <BotonAgregarPieza
                nombre={product.nombre}
                sku={variante!.sku_variante}
                talla={variante!.talla}
              />
            </>
          )}

          {estado === 'precio_por_definir' && (
            <>
              <p className="mb-4 text-lg text-[#F5EFE0]/75">Precio por confirmar</p>
              <Link
                href="/citas"
                className="block w-full text-center border border-[#C9A961] text-[#C9A961] py-3 text-[11px] tracking-[0.2em] uppercase hover:bg-[#C9A961] hover:text-[#2A1810] transition"
              >
                Agenda una cita en showroom
              </Link>
            </>
          )}

          {vendida && (
            <p className="text-[12px] tracking-[0.15em] uppercase text-[#F5EFE0]/40">Pieza vendida</p>
          )}
        </div>
      </div>
    </article>
  );
}
