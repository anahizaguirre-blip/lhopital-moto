-- Estado propio "lista_para_recoger" para pedidos de recolección en showroom.
-- Flujo: pagada → preparando → lista_para_recoger → entregada.
-- Corrido en producción el 11 nov 2026 (cada bloque por separado: Postgres
-- no deja usar un valor nuevo de enum en la misma transacción en que se crea).

-- 1 · Nuevo valor del enum
ALTER TYPE estado_orden ADD VALUE IF NOT EXISTS 'lista_para_recoger' AFTER 'preparando';

-- 2 · El reporte de ventas debe seguir contando estos pedidos
CREATE OR REPLACE VIEW public.v_ventas_por_marca WITH (security_invoker = true) AS
SELECT date_trunc('month'::text, o.created_at) AS mes, p.marca, count(DISTINCT o.id) AS num_ordenes, sum(oi.cantidad) AS unidades_vendidas, sum(oi.subtotal) AS ingresos_mxn
FROM (((order_items oi JOIN orders o ON ((oi.order_id = o.id))) JOIN product_variants pv ON ((oi.variant_id = pv.id))) JOIN products p ON ((pv.product_id = p.id)))
WHERE (o.estado = ANY (ARRAY['pagada'::estado_orden, 'preparando'::estado_orden, 'lista_para_recoger'::estado_orden, 'enviada'::estado_orden, 'entregada'::estado_orden]))
GROUP BY (date_trunc('month'::text, o.created_at)), p.marca
ORDER BY (date_trunc('month'::text, o.created_at)) DESC, (sum(oi.subtotal)) DESC;

-- Nota: v_pedidos_pendientes_envio filtra solo 'preparando'; se deja así a
-- propósito (un pedido listo para recoger ya no está pendiente de preparar).
-- No hubo pedidos que migrar (0 en "preparando" con aviso ya enviado).
