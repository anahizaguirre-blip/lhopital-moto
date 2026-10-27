/**
 * POST /api/checkout — crea la orden en estado `pago_pendiente`.
 *
 * 1. Valida con zod.
 * 2. Relee precio y stock de cada producto en Supabase; rechaza lo que
 *    ya no esté disponible o rebase el stock (mensaje por producto).
 * 3. Calcula subtotal + envío aquí, nunca en el navegador.
 * 4. Crea/actualiza el cliente, inserta la orden y sus partidas con
 *    precios del servidor y guarda la prueba de consentimiento.
 *
 * No descuenta stock: eso pasa cuando se confirma el pago (Fase 3).
 */

import { NextResponse } from 'next/server';
import type { SupabaseClient } from '@supabase/supabase-js';
import { CheckoutSchema, type CheckoutDatos } from '@/lib/checkout-schema';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { resolverSkus, type LineaResuelta } from '@/lib/carrito-server';
import { costoEnvio } from '@/lib/venta';
import { VERSION_TERMINOS } from '@/lib/legal-content';
import { firmarOrden, nombreCookieOrden, OPCIONES_COOKIE_ORDEN } from '@/lib/orden-acceso';

export const dynamic = 'force-dynamic';

interface ErrorProducto {
  sku: string;
  nombre: string;
  mensaje: string;
}

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: Request) {
  const parsed = CheckoutSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return json(
      { error: 'Revisa los datos del formulario.', campos: parsed.error.flatten().fieldErrors },
      400
    );
  }
  const datos = parsed.data;
  const supabase = createSupabaseAdmin();

  // Junta líneas repetidas del mismo SKU
  const qtyPorSku = new Map<string, number>();
  for (const it of datos.items) qtyPorSku.set(it.sku, (qtyPorSku.get(it.sku) ?? 0) + it.qty);

  let catalogo: Map<string, LineaResuelta>;
  try {
    catalogo = await resolverSkus(supabase, [...qtyPorSku.keys()]);
  } catch (e) {
    console.error('[checkout] catálogo', e);
    return json({ error: 'No pudimos verificar existencias. Intenta de nuevo.' }, 503);
  }

  const errores: ErrorProducto[] = [];
  const partidas: { linea: LineaResuelta; qty: number }[] = [];
  for (const [sku, qty] of qtyPorSku) {
    const linea = catalogo.get(sku);
    if (!linea) {
      errores.push({ sku, nombre: sku, mensaje: 'Este producto ya no está en el catálogo.' });
    } else if (linea.disponibilidad === 'no_disponible') {
      errores.push({ sku, nombre: linea.nombre, mensaje: 'Ya no hay existencias.' });
    } else if (qty > linea.maxCantidad) {
      errores.push({
        sku,
        nombre: linea.nombre,
        mensaje: `Solo ${linea.maxCantidad === 1 ? 'queda 1 pieza' : `quedan ${linea.maxCantidad} piezas`}.`,
      });
    } else {
      partidas.push({ linea, qty });
    }
  }
  if (errores.length) {
    return json({ error: 'Algunos productos cambiaron de disponibilidad.', productos: errores }, 409);
  }

  const subtotal = partidas.reduce((s, p) => s + p.linea.precio * p.qty, 0);
  const envio = costoEnvio(datos.metodo, partidas.map((p) => p.linea));
  const total = subtotal + envio;

  let customerId: string;
  try {
    customerId = await guardarCliente(supabase, datos);
  } catch (e) {
    console.error('[checkout] cliente', e);
    return json({ error: 'No pudimos guardar tus datos. Intenta de nuevo.' }, 500);
  }

  const direccion =
    datos.metodo === 'envio' && datos.direccion
      ? {
          nombre_completo: datos.nombre,
          telefono: datos.telefono,
          calle: datos.direccion.calle,
          colonia: datos.direccion.colonia,
          alcaldia_municipio: datos.direccion.alcaldia,
          ciudad: datos.direccion.ciudad,
          estado: datos.direccion.estado,
          cp: datos.direccion.cp,
          referencias: datos.direccion.referencias || null,
        }
      : null;

  const { data: orden, error: errorOrden } = await supabase
    .from('orders')
    .insert({
      customer_id: customerId,
      email_invitado: datos.email,
      estado: 'pago_pendiente',
      canal: 'online',
      subtotal,
      descuento: 0,
      envio,
      total,
      direccion_envio: direccion,
      metodo_entrega: datos.metodo,
      acepto_terminos_at: new Date().toISOString(),
      version_terminos: VERSION_TERMINOS,
    })
    .select('id, numero_orden')
    .single();

  if (errorOrden || !orden) {
    console.error('[checkout] orden', errorOrden);
    return json({ error: 'No pudimos crear tu pedido. Intenta de nuevo.' }, 500);
  }

  const { error: errorItems } = await supabase.from('order_items').insert(
    partidas.map(({ linea, qty }) => ({
      order_id: orden.id,
      variant_id: linea.variantId,
      sku_snapshot: linea.sku,
      nombre_snapshot: linea.detalle ? `${linea.nombre} · ${linea.detalle}` : linea.nombre,
      precio_unitario: linea.precio,
      cantidad: qty,
      subtotal: linea.precio * qty,
    }))
  );

  if (errorItems) {
    console.error('[checkout] partidas', errorItems);
    // Sin transacciones vía REST: deshacer la orden para no dejarla huérfana.
    await supabase.from('orders').delete().eq('id', orden.id);
    return json({ error: 'No pudimos crear tu pedido. Intenta de nuevo.' }, 500);
  }

  // Solo este navegador podrá abrir la página de pago de la orden
  const res = json({ orden: orden.id, numero: orden.numero_orden });
  res.cookies.set(nombreCookieOrden(orden.id), firmarOrden(orden.id), OPCIONES_COOKIE_ORDEN);
  return res;
}

/** Busca el cliente por correo; si existe actualiza contacto, si no lo crea. */
async function guardarCliente(supabase: SupabaseClient, datos: CheckoutDatos): Promise<string> {
  const [nombre, ...resto] = datos.nombre.split(/\s+/);
  const campos = { nombre, apellidos: resto.join(' ') || null, telefono: datos.telefono };

  const buscar = () =>
    // El correo ya viene en minúsculas (zod) y así se guarda.
    supabase.from('customers').select('id').eq('email', datos.email).limit(1).maybeSingle();

  const { data: existente, error: errBuscar } = await buscar();
  if (errBuscar) throw errBuscar;

  if (existente) {
    const { error } = await supabase
      .from('customers')
      .update({ ...campos, updated_at: new Date().toISOString() })
      .eq('id', existente.id);
    if (error) throw error;
    return existente.id;
  }

  const { data: nuevo, error } = await supabase
    .from('customers')
    .insert({ email: datos.email, ...campos })
    .select('id')
    .single();

  if (error?.code === '23505') {
    // Otro checkout con el mismo correo lo creó al mismo tiempo
    const { data: otraVez } = await buscar();
    if (otraVez) return otraVez.id;
  }
  if (error || !nuevo) throw error ?? new Error('Cliente no creado');
  return nuevo.id;
}
