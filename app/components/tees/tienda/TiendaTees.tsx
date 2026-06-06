'use client'

import Image from 'next/image'
import { useState } from 'react'
import type { TeeProducto } from '@/app/tienda/tees/page'

const CLD_BASE = 'https://res.cloudinary.com/lhopital-moto/image/upload'
const TALLAS_ORDEN = ['S', 'M', 'L', 'XL']

function cldUrl(publicId: string, w = 800) {
  return `${CLD_BASE}/f_auto,q_auto,w_${w}/${publicId}`
}

type FotoTab = 'back' | 'front' | 'lifestyle'
const FOTO_LABELS: Record<FotoTab, string> = {
  back: 'Diseño',
  front: 'Frente',
  lifestyle: 'Lifestyle',
}

function TeeCard({ producto }: { producto: TeeProducto }) {
  const [fotoActiva, setFotoActiva] = useState<FotoTab>('back')
  const [tallaSeleccionada, setTallaSeleccionada] = useState<string | null>(null)
  const [agregado, setAgregado] = useState(false)

  const fotos: Record<FotoTab, string | null> = {
    back: producto.foto_back,
    front: producto.foto_front,
    lifestyle: producto.foto_lifestyle,
  }

  const fotoActual = fotos[fotoActiva]

  const variantePorTalla = Object.fromEntries(
    producto.variantes.map((v) => [v.talla, v])
  )

  const varianteSeleccionada = tallaSeleccionada
    ? variantePorTalla[tallaSeleccionada]
    : null

  const stockTotal = producto.variantes.reduce((acc, v) => acc + v.stock, 0)
  const esUltimas = stockTotal <= 10 && stockTotal > 0

  function handleAgregar() {
    if (!tallaSeleccionada) return
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
    // TODO: integrar con contexto de carrito cuando esté disponible
  }

  return (
    <div className="bg-[#1e1e1e] flex flex-col">

      {/* FOTO */}
      <div className="relative aspect-[3/4] bg-[#222] overflow-hidden">

        {/* Badge */}
        <div
          className={`absolute top-3 left-3 z-10 text-[8px] tracking-[0.15em] uppercase px-2 py-1 border ${
            esUltimas
              ? 'text-[#c97a61] border-[rgba(201,101,61,0.4)] bg-[rgba(26,26,26,0.85)]'
              : 'text-[#C9A961] border-[rgba(201,169,97,0.3)] bg-[rgba(26,26,26,0.85)]'
          }`}
        >
          {esUltimas ? 'Últimas piezas' : 'Disponible'}
        </div>

        {/* Tabs foto */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
          {(Object.keys(FOTO_LABELS) as FotoTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFotoActiva(tab)}
              className={`text-[7px] tracking-[0.15em] uppercase px-2 py-1 border transition-colors ${
                fotoActiva === tab
                  ? 'text-[#C9A961] border-[rgba(201,169,97,0.5)] bg-[rgba(26,26,26,0.9)]'
                  : 'text-[rgba(201,169,97,0.35)] border-[rgba(201,169,97,0.12)] bg-[rgba(26,26,26,0.7)]'
              }`}
            >
              {FOTO_LABELS[tab]}
            </button>
          ))}
        </div>

        {/* Imagen */}
        {fotoActual ? (
          <Image
            src={cldUrl(fotoActual)}
            alt={`${producto.diseno} — ${FOTO_LABELS[fotoActiva]}`}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-opacity duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] tracking-[0.2em] uppercase text-[rgba(201,169,97,0.2)]">
              Foto próximamente
            </span>
          </div>
        )}

        {/* Dots carrusel */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
          {(Object.keys(FOTO_LABELS) as FotoTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFotoActiva(tab)}
              className={`w-[5px] h-[5px] rounded-full transition-colors ${
                fotoActiva === tab
                  ? 'bg-[#C9A961]'
                  : 'bg-[rgba(201,169,97,0.2)]'
              }`}
              aria-label={FOTO_LABELS[tab]}
            />
          ))}
        </div>

        {/* Número decorativo */}
        <span className="absolute bottom-2 right-3 font-cormorant text-[52px] font-light text-[rgba(201,169,97,0.05)] leading-none pointer-events-none select-none">
          {producto.sku_padre.replace('LHOP', '').replace('_BLK', '')}
        </span>
      </div>

      {/* BODY */}
      <div className="px-4 pt-4 pb-5 bg-[#1a1a1a] border-t border-white/[0.04] flex flex-col gap-3">

        {/* Nombre */}
        <div>
          <h3 className="font-cormorant text-[17px] font-light text-[#F0F0F0] leading-tight">
            {producto.diseno}
          </h3>
          <p className="text-[8px] tracking-[0.12em] uppercase text-[#303030] mt-1">
            {producto.sku_padre}
          </p>
        </div>

        {/* Selector tallas */}
        <div className="flex gap-1">
          {TALLAS_ORDEN.map((talla) => {
            const variante = variantePorTalla[talla]
            if (!variante) return null
            const sinStock = variante.stock === 0
            const pocaStock = variante.stock > 0 && variante.stock <= 2
            const seleccionada = tallaSeleccionada === talla

            return (
              <button
                key={talla}
                onClick={() => !sinStock && setTallaSeleccionada(talla)}
                disabled={sinStock}
                className={`w-7 h-7 flex items-center justify-center text-[9px] tracking-[0.05em] border transition-colors ${
                  seleccionada
                    ? 'bg-[#C9A961] text-[#1A1A1A] border-[#C9A961]'
                    : sinStock
                    ? 'border-[rgba(255,255,255,0.04)] text-[#2a2a2a] cursor-not-allowed line-through'
                    : pocaStock
                    ? 'border-[rgba(201,169,97,0.2)] text-[rgba(201,169,97,0.45)] hover:border-[rgba(201,169,97,0.4)]'
                    : 'border-[rgba(201,169,97,0.3)] text-[#C9A961] hover:border-[rgba(201,169,97,0.6)]'
                }`}
              >
                {talla}
              </button>
            )
          })}
        </div>

        {/* Stock info */}
        <div className="flex items-center gap-1.5">
          <div
            className={`w-[5px] h-[5px] rounded-full flex-shrink-0 ${
              esUltimas ? 'bg-[#9c7a1a]' : 'bg-[#3a7c3a]'
            }`}
          />
          <span className="text-[8px] tracking-[0.1em] uppercase text-[#3a3a3a]">
            {varianteSeleccionada
              ? `${varianteSeleccionada.stock} disponibles en ${tallaSeleccionada}`
              : producto.variantes
                  .filter((v) => v.stock > 0)
                  .map((v) => `${v.talla}:${v.stock}`)
                  .join(' · ')}
          </span>
        </div>

        {/* Precio + CTA */}
        <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
          <div className="text-[16px] font-[400] text-[#C9A961] tracking-[0.02em]">
            $400
            <span className="text-[9px] text-[#3a3a3a] font-light ml-1">MXN</span>
          </div>
          <button
            onClick={handleAgregar}
            disabled={!tallaSeleccionada}
            className={`text-[8px] tracking-[0.2em] uppercase px-4 py-2 transition-all ${
              agregado
                ? 'bg-[#3a7c3a] text-white'
                : tallaSeleccionada
                ? 'bg-[#C9A961] text-[#1A1A1A] hover:opacity-85 active:scale-[0.98]'
                : 'bg-[#2a2a2a] text-[#3a3a3a] cursor-not-allowed'
            }`}
          >
            {agregado ? 'Listo ✓' : tallaSeleccionada ? 'Agregar' : 'Elige talla'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function TiendaTees({ productos }: { productos: TeeProducto[] }) {
  return (
    <div className="bg-[#1A1A1A] text-[#F5F5F5] font-sora w-full">

      {/* HERO FRASE */}
      <section className="bg-[#111] pt-16 md:pt-20 pb-0">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pb-16 text-center">
          <p className="text-[10px] tracking-[0.35em] uppercase text-[#C9A961] mb-5">
            Lhopital Tees
          </p>
          <h1 className="font-cormorant text-[52px] md:text-[64px] font-light italic text-[#F5F5F5] leading-[1.08] mb-4">
            La ruta empieza<br />antes de salir.
          </h1>
          <p className="text-[13px] font-light text-[#555] max-w-[400px] mx-auto leading-[1.7]">
            Cada pieza cuenta una historia del asfalto mexicano. Úsala en la
            ruta o fuera de ella — el punto de vista no cambia.
          </p>
        </div>
      </section>

      {/* HEADER TIENDA */}
      <section className="bg-[#1A1A1A] pt-10 pb-0 border-b border-[rgba(201,169,97,0.18)]">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 pb-7 flex items-end justify-between">
          <div>
            <p className="text-[10px] tracking-[0.3em] uppercase text-[#C9A961] mb-2">
              Tienda · Lhopital Tees
            </p>
            <h2 className="font-cormorant text-[40px] font-light text-[#F5F5F5] leading-none">
              La colección.
            </h2>
            <p className="text-[12px] font-light text-[#555] mt-2">
              Seis piezas. Todas en Negro. Hecho en México.
            </p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[11px] text-[#555] leading-loose">
              <strong className="text-[#888] font-normal">Tallas</strong>&nbsp; S — XL
            </p>
            <p className="text-[11px] text-[#555] leading-loose">
              <strong className="text-[#888] font-normal">Precio</strong>&nbsp; $400 MXN
            </p>
            <p className="text-[11px] text-[#555] leading-loose">
              <strong className="text-[#888] font-normal">Técnica</strong>&nbsp; Discharge print
            </p>
            <p className="text-[11px] text-[#555] leading-loose">
              <strong className="text-[#888] font-normal">Envío CDMX</strong>&nbsp; 24 hrs
            </p>
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="bg-[#1A1A1A] pt-0 pb-0">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-[2px] p-[2px]">
          {productos.map((producto) => (
            <TeeCard key={producto.sku_padre} producto={producto} />
          ))}
        </div>
      </section>

      {/* STRIP MATERIAL */}
      <section className="bg-[#161616] border-t border-[rgba(201,169,97,0.1)] pt-0 pb-0">
        <div className="w-full max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-16 py-4 flex gap-6 md:gap-8 flex-wrap items-center">
          {[
            { label: 'Material', val: '100% algodón' },
            { label: 'Gramaje', val: '220 GSM' },
            { label: 'Corte', val: 'Oversize' },
            { label: 'Técnica', val: 'Discharge print' },
            { label: 'Origen', val: 'Hecho en México' },
          ].map(({ label, val }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="text-[9px] tracking-[0.15em] uppercase text-[#444]">
                {label}
              </span>
              <span className="text-[10px] text-[#666] font-light">{val}</span>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
