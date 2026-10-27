/**
 * POST /api/pagos/procesar — TEMPORAL (revisión del Paso 1).
 * El cobro con la API de Orders se conecta en el Paso 2.
 */

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'El cobro con tarjeta se conecta en el siguiente paso. No se hizo ningún cargo.' },
    { status: 503 }
  );
}
