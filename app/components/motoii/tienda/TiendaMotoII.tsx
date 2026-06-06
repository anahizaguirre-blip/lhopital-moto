'use client';

/**
 * TiendaMotoII.tsx
 * Orquestador principal de la tienda Moto II.
 *
 * Responsabilidades:
 * - Recibir dispositivos y accesorios desde el Server Component (page.tsx)
 * - Mantener el estado compartido: color activo + montaje seleccionado
 * - Pasar props hacia abajo a cada sección
 * - Definir el orden visual de la página
 *
 * Estado que vive aquí (necesita sincronización entre secciones):
 *   skuActivo    — color del dispositivo seleccionado
 *   precioBase   — precio del color activo (para SelectorMontaje)
 *   colorLabel   — nombre del color activo (para el resumen del combo)
 *   montajeActivo — accesorio de montaje seleccionado (o null = universal)
 */

import { useState, useCallback } from 'react';
import type { Product } from '@/lib/types';
import { HeroTiendaMotoII } from './HeroTiendaMotoII';
import { SelectorMontaje } from './SelectorMontaje';
import { EditorialMotoII } from './EditorialMotoII';
import { EspecificacionesMotoII } from './EspecificacionesMotoII';
import { AccesoriosMotoII } from './AccesoriosMotoII';
import { CierreMotoII } from './CierreMotoII';

// ─── Helpers ───────────────────────────────────────────────────────────────────

// Extrae el label de color desde el nombre del producto
// "Beeline Moto II Metal Grey" → "Gun Metal"
const LABEL_POR_SKU: Record<string, string> = {
  'CHR_BLD3.0_BLK': 'Black',
  'CHR_BLD3.0_GMG': 'Gun Metal',
  'CHR_BLD3.0_SVR': 'Silver Metal',
};

// ─── Tipos ─────────────────────────────────────────────────────────────────────

interface TiendaMotoIIProps {
  dispositivos: Product[];
  accesorios: Product[];
}

// ─── Componente ────────────────────────────────────────────────────────────────

export function TiendaMotoII({ dispositivos, accesorios }: TiendaMotoIIProps) {
  // Dispositivo por defecto: el más barato (Black, $4,700)
  const dispositivoDefault = [...dispositivos].sort((a, b) => a.precio_base - b.precio_base)[0];

  const [skuActivo, setSkuActivo] = useState<string>(
    dispositivoDefault?.sku_padre ?? 'CHR_BLD3.0_BLK'
  );
  const [precioBase, setPrecioBase] = useState<number>(
    dispositivoDefault?.variants?.[0]?.precio ?? dispositivoDefault?.precio_base ?? 4700
  );
  const [colorLabel, setColorLabel] = useState<string>(
    LABEL_POR_SKU[dispositivoDefault?.sku_padre] ?? 'Black'
  );
  const [, setMontajeActivo] = useState<Product | null>(null);

  // Callback: HeroTiendaMotoII → TiendaMotoII → SelectorMontaje
  const handleColorChange = useCallback((sku: string, precio: number) => {
    setSkuActivo(sku);
    setPrecioBase(precio);
    setColorLabel(LABEL_POR_SKU[sku] ?? sku);
  }, []);

  // Callback: SelectorMontaje → TiendaMotoII (para futura integración con carrito)
  const handleMontajeChange = useCallback((accesorio: Product | null) => {
    setMontajeActivo(accesorio);
  }, []);

  // Separar accesorios por tipo para cada sección
  // Montajes clásicos (van al SelectorMontaje): BAR, MIRRORXBAR, PWR
  const montajesClasicos = accesorios.filter(a =>
    ['CHR_MNT3.0_BAR', 'CHR_MNT3.0_MIRRORXBAR', 'CHR_MNT3.0_PWR'].includes(a.sku_padre)
  );

  // Accesorios especializados (van al grid AccesoriosMotoII): el resto
  const accesoriosGrid = accesorios.filter(a =>
    !['CHR_MNT3.0_BAR', 'CHR_MNT3.0_MIRRORXBAR', 'CHR_MNT3.0_PWR'].includes(a.sku_padre)
  );

  return (
    <>
      {/* 01 · Hero — selector de color + galería + CTA */}
      <HeroTiendaMotoII
        dispositivos={dispositivos}
        onColorChange={handleColorChange}
      />

      {/* 02 · Editorial — "Hecho solo para rodar" + mejoras vs V1 */}
      <EditorialMotoII />

      {/* 03 · Selector de montaje — combo dinámico */}
      <SelectorMontaje
        accesorios={montajesClasicos}
        precioBase={precioBase}
        colorLabel={colorLabel}
        onMontajeChange={handleMontajeChange}
      />

      {/* 04 · Especificaciones — ficha técnica + en la caja */}
      <EspecificacionesMotoII skuActivo={skuActivo} />

      {/* 05 · Accesorios — grid completo de montajes especializados + carry case + adaptador */}
      <AccesoriosMotoII accesorios={accesoriosGrid} />

      {/* 06 · Cierre — quote hermandad + FAQ + footer */}
      <CierreMotoII />
    </>
  );
}
