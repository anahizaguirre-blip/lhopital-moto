/**
 * POST /api/carrito — { skus: string[] } → datos frescos de cada línea
 * (nombre, precio, foto, disponibilidad, tope de cantidad).
 * Los precios que use la UI salen de aquí, nunca de localStorage.
 */

import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createSupabaseServer } from '@/lib/supabase/server';
import { resolverSkus } from '@/lib/carrito-server';

const Body = z.object({
  skus: z.array(z.string().min(1).max(80)).max(100),
});

export async function POST(req: Request) {
  const parsed = Body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: 'Solicitud inválida' }, { status: 400 });
  }

  try {
    const lineas = await resolverSkus(createSupabaseServer(), parsed.data.skus);
    return NextResponse.json(
      { lineas: Object.fromEntries(lineas) },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (e) {
    console.error('[api/carrito]', e);
    return NextResponse.json({ error: 'No se pudo cargar el carrito' }, { status: 500 });
  }
}
