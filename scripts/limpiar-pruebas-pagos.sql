-- Limpieza de pruebas de checkout y pagos (antes de salir a producción)
-- Correr una sola vez en Supabase Studio → SQL Editor.
--
-- Borra todo lo creado con el correo de pruebas ordenes@lhopital.mx,
-- devuelve el stock que se llevaron sus reservas/ventas y reinicia el folio.

BEGIN;

-- 1. Devolver stock neto tomado por las órdenes de prueba (product_variants y tees)
WITH pruebas AS (
  SELECT id FROM orders WHERE email_invitado = 'ordenes@lhopital.mx'
),
neto AS (
  SELECT sm.variant_id, pv.sku_variante, -SUM(sm.cantidad)::int AS qty
    FROM stock_movements sm
    JOIN product_variants pv ON pv.id = sm.variant_id
   WHERE sm.order_id IN (SELECT id FROM pruebas)
   GROUP BY sm.variant_id, pv.sku_variante
  HAVING -SUM(sm.cantidad) > 0
),
devuelto AS (
  UPDATE product_variants p
     SET stock_actual = COALESCE(p.stock_actual, 0) + neto.qty, updated_at = now()
    FROM neto
   WHERE p.id = neto.variant_id
  RETURNING neto.sku_variante, neto.qty
)
UPDATE tees t
   SET stock = t.stock + devuelto.qty, updated_at = now()
  FROM devuelto
 WHERE t.sku_variante = devuelto.sku_variante;

-- 2. Borrar historial y órdenes de prueba
DELETE FROM stock_movements
 WHERE order_id IN (SELECT id FROM orders WHERE email_invitado = 'ordenes@lhopital.mx');
DELETE FROM order_items
 WHERE order_id IN (SELECT id FROM orders WHERE email_invitado = 'ordenes@lhopital.mx');
DELETE FROM orders WHERE email_invitado = 'ordenes@lhopital.mx';
DELETE FROM customers WHERE email = 'ordenes@lhopital.mx';

-- 3. Bitácora de webhooks (hasta hoy solo hay pruebas)
DELETE FROM mp_webhook_events;

-- 4. El primer pedido real será el 26001
ALTER SEQUENCE orders_numero_orden_seq RESTART WITH 26001;

COMMIT;

-- 5. Verificación: no debe quedar nada de pruebas y el stock de estas Tees
--    debe volver a: LHOP003_BLK_M 8 · LHOP003_BLK_L 8 · LHOP004_BLK_M 13 ·
--    LHOP005_BLK_M 10 · LHOP005_BLK_L 9 · LHOP006_BLK_M 2
SELECT (SELECT count(*) FROM orders) AS ordenes, (SELECT count(*) FROM customers) AS clientes;
SELECT pv.sku_variante, pv.stock_actual, t.stock AS stock_tabla_tees
  FROM product_variants pv
  LEFT JOIN tees t ON t.sku_variante = pv.sku_variante
 WHERE pv.sku_variante IN ('LHOP003_BLK_M','LHOP003_BLK_L','LHOP004_BLK_M','LHOP005_BLK_M','LHOP005_BLK_L','LHOP006_BLK_M')
 ORDER BY 1;
