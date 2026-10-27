/**
 * Carga una orden para las páginas del comprador (pago, confirmación),
 * solo si este navegador trae la cookie firmada de esa orden.
 *
 * Solo servidor.
 */

import { cookies } from 'next/headers';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { getOrderDetail, type OrderDetail } from '@/lib/orders-query';
import { esUuid, nombreCookieOrden, verificarFirmaOrden } from '@/lib/orden-acceso';

export type ResultadoOrden =
  | { tipo: 'ok'; orden: OrderDetail }
  | { tipo: 'sin_acceso' }
  | { tipo: 'no_encontrada' };

export async function cargarOrdenDelComprador(ordenId: string | undefined): Promise<ResultadoOrden> {
  if (!esUuid(ordenId)) return { tipo: 'no_encontrada' };

  const jar = await cookies();
  if (!verificarFirmaOrden(ordenId, jar.get(nombreCookieOrden(ordenId))?.value)) {
    return { tipo: 'sin_acceso' };
  }

  const orden = await getOrderDetail(createSupabaseAdmin(), ordenId);
  return orden ? { tipo: 'ok', orden } : { tipo: 'no_encontrada' };
}
