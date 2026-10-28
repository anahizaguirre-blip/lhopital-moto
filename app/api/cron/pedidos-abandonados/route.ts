/**
 * GET /api/cron/pedidos-abandonados — Vercel Cron, una vez al día.
 *
 * Pedidos en `pago_pendiente` con más de 48 h:
 * - con un cobro pendiente en Mercado Pago → se dejan (el webhook los cierra);
 * - si MP dice que sí se pagó (aviso perdido) → se confirman;
 * - el resto → `cancelada` + liberar_stock (normalmente no hay nada que liberar).
 *
 * Vercel manda `Authorization: Bearer <CRON_SECRET>`; sin esa clave → 401.
 */

import { NextResponse } from 'next/server';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { clasificarOrden, obtenerOrden } from '@/lib/mp-orders';
import { confirmarPago } from '@/lib/pedidos-pago';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const HORAS = 48;
const LOTE = 100;

export async function GET(req: Request) {
  const secreto = process.env.CRON_SECRET;
  if (!secreto || req.headers.get('authorization') !== `Bearer ${secreto}`) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  // `?horas=` permite correrlo a mano con otro plazo (solo con la clave).
  const pedidas = Number(new URL(req.url).searchParams.get('horas'));
  const horas = Number.isFinite(pedidas) && pedidas >= 1 ? pedidas : HORAS;

  const supabase = createSupabaseAdmin();
  const limite = new Date(Date.now() - horas * 3600 * 1000).toISOString();

  const { data: pedidos, error } = await supabase
    .from('orders')
    .select('id, numero_orden, mp_order_id')
    .eq('estado', 'pago_pendiente')
    .lt('created_at', limite)
    .order('created_at', { ascending: true })
    .limit(LOTE);

  if (error) {
    console.error('[cron abandonados]', error.message);
    return NextResponse.json({ error: 'db' }, { status: 500 });
  }

  const resumen = { revisados: 0, cancelados: [] as string[], confirmados: [] as string[], pendientesMP: [] as string[], errores: [] as string[] };

  for (const p of pedidos ?? []) {
    resumen.revisados++;
    try {
      if (p.mp_order_id) {
        const mp = await obtenerOrden(p.mp_order_id);
        const { resultado, detalle } = clasificarOrden(mp);
        if (mp && resultado === 'pending') {
          resumen.pendientesMP.push(p.numero_orden);
          continue;
        }
        if (mp && resultado === 'approved') {
          await confirmarPago(p.id, {
            orderId: mp.id,
            paymentId: mp.transactions?.payments?.[0]?.id,
            status: mp.status,
            statusDetail: detalle,
          });
          resumen.confirmados.push(p.numero_orden);
          continue;
        }
      }

      await supabase.rpc('liberar_stock', { p_order_id: p.id });
      const { data: cancelado } = await supabase
        .from('orders')
        .update({
          estado: 'cancelada',
          pago_en_proceso_at: null,
          notas_internas: `Cancelado automáticamente: sin pago después de ${horas} h.`,
          updated_at: new Date().toISOString(),
        })
        .eq('id', p.id)
        .eq('estado', 'pago_pendiente')
        .select('id')
        .maybeSingle();
      if (cancelado) resumen.cancelados.push(p.numero_orden);
    } catch (e) {
      console.error('[cron abandonados]', p.numero_orden, e instanceof Error ? e.message : e);
      resumen.errores.push(p.numero_orden);
    }
  }

  console.info('[cron abandonados]', JSON.stringify(resumen));
  return NextResponse.json(resumen);
}
