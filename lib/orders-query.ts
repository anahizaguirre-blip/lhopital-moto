import type { SupabaseClient } from '@supabase/supabase-js';

export interface OrderItemDetail {
  id: string;
  sku_snapshot: string;
  nombre_snapshot: string;
  precio_unitario: number;
  cantidad: number;
  subtotal: number;
  talla: string | null;
  color_variante: string | null;
  imagen_principal: string | null;
}

export interface OrderDetail {
  id: string;
  numero_orden: string;
  estado: string;
  created_at: string;
  subtotal: number;
  descuento: number;
  envio: number;
  total: number;
  direccion_envio: unknown;
  paqueteria: string | null;
  numero_guia: string | null;
  url_rastreo: string | null;
  fecha_envio: string | null;
  email_cliente: string | null;
  nombre_cliente: string | null;
  telefono_cliente: string | null;
  items: OrderItemDetail[];
}

type ProductVariantEmbed = {
  talla: string | null;
  color_variante: string | null;
  products: { imagen_principal: string | null } | null;
} | null;

/**
 * Trae una orden + sus items (con imagen/talla vía join a
 * product_variants → products) + datos del cliente (registrado o invitado).
 * Compartido entre el webhook de confirmación y el detalle del admin.
 */
export async function getOrderDetail(
  supabase: SupabaseClient,
  orderId: string
): Promise<OrderDetail | null> {
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .select(
      '*, customers(email, nombre, apellidos, telefono)'
    )
    .eq('id', orderId)
    .maybeSingle();

  if (orderError || !order) return null;

  const { data: items } = await supabase
    .from('order_items')
    .select(
      'id, sku_snapshot, nombre_snapshot, precio_unitario, cantidad, subtotal, product_variants(talla, color_variante, products(imagen_principal))'
    )
    .eq('order_id', orderId);

  const customer = order.customers as {
    email: string | null;
    nombre: string | null;
    apellidos: string | null;
    telefono: string | null;
  } | null;

  const nombreCliente = customer
    ? [customer.nombre, customer.apellidos].filter(Boolean).join(' ').trim() || null
    : null;

  return {
    id: order.id,
    numero_orden: order.numero_orden,
    estado: order.estado,
    created_at: order.created_at,
    subtotal: order.subtotal,
    descuento: order.descuento,
    envio: order.envio,
    total: order.total,
    direccion_envio: order.direccion_envio,
    paqueteria: order.paqueteria,
    numero_guia: order.numero_guia,
    url_rastreo: order.url_rastreo,
    fecha_envio: order.fecha_envio,
    email_cliente: customer?.email ?? order.email_invitado ?? null,
    nombre_cliente: nombreCliente,
    telefono_cliente: customer?.telefono ?? null,
    items: (items ?? []).map((item) => {
      const variant = item.product_variants as unknown as ProductVariantEmbed;
      return {
        id: item.id,
        sku_snapshot: item.sku_snapshot,
        nombre_snapshot: item.nombre_snapshot,
        precio_unitario: item.precio_unitario,
        cantidad: item.cantidad,
        subtotal: item.subtotal,
        talla: variant?.talla ?? null,
        color_variante: variant?.color_variante ?? null,
        imagen_principal: variant?.products?.imagen_principal ?? null,
      };
    }),
  };
}
