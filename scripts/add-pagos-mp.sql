-- FASE 3 — Pagos con Mercado Pago (Checkout API vía Orders)
-- Correr una sola vez en Supabase Studio → SQL Editor.
--
-- Reutiliza columnas que ya existían en orders: mp_payment_id, mp_status,
-- fecha_pago (= momento en que se confirmó el pago).

-- 1. Tipos de movimiento para la reserva temporal de stock -------------------
ALTER TYPE tipo_movimiento_stock ADD VALUE IF NOT EXISTS 'reserva_pago';
ALTER TYPE tipo_movimiento_stock ADD VALUE IF NOT EXISTS 'liberacion_reserva';

-- 2. Columnas de pago en orders ----------------------------------------------
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS mp_order_id text UNIQUE,
  ADD COLUMN IF NOT EXISTS mp_status_detail text,
  ADD COLUMN IF NOT EXISTS intentos_pago int NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS pago_en_proceso_at timestamptz,   -- candado anti doble clic
  ADD COLUMN IF NOT EXISTS correo_confirmacion_at timestamptz,
  ADD COLUMN IF NOT EXISTS tarjeta_ultimos4 text;           -- solo para el correo

-- 3. Bitácora de webhooks (deduplica reintentos por x-request-id) -----------
CREATE TABLE IF NOT EXISTS mp_webhook_events (
  id bigserial PRIMARY KEY,
  request_id text UNIQUE,
  mp_order_id text,
  action text,
  payload jsonb,
  received_at timestamptz DEFAULT now(),
  processed_at timestamptz,
  error text
);
ALTER TABLE mp_webhook_events ENABLE ROW LEVEL SECURITY;  -- sin políticas: solo service role

-- 4. iniciar_intento_pago -----------------------------------------------------
-- Marca la orden "en proceso" y suma un intento. Si ya hay un intento en
-- curso (doble clic, dos pestañas) falla con EN_PROCESO y no se cobra dos veces.
CREATE OR REPLACE FUNCTION iniciar_intento_pago(p_order_id uuid)
RETURNS int
LANGUAGE plpgsql
AS $$
DECLARE
  v_orden orders%ROWTYPE;
BEGIN
  SELECT * INTO v_orden FROM orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ORDEN_NO_ENCONTRADA'; END IF;
  IF v_orden.estado <> 'pago_pendiente' THEN RAISE EXCEPTION 'ORDEN_NO_PENDIENTE'; END IF;
  IF v_orden.pago_en_proceso_at IS NOT NULL AND v_orden.pago_en_proceso_at > now() - interval '90 seconds' THEN
    RAISE EXCEPTION 'EN_PROCESO';
  END IF;

  UPDATE orders
     SET intentos_pago = intentos_pago + 1, pago_en_proceso_at = now(), updated_at = now()
   WHERE id = p_order_id
  RETURNING intentos_pago INTO v_orden.intentos_pago;

  RETURN v_orden.intentos_pago;
END;
$$;

CREATE OR REPLACE FUNCTION terminar_intento_pago(p_order_id uuid)
RETURNS void
LANGUAGE sql
AS $$
  UPDATE orders SET pago_en_proceso_at = NULL WHERE id = p_order_id;
$$;

-- 5. reservar_stock -----------------------------------------------------------
-- En una sola transacción bloquea (FOR UPDATE) las filas de stock de cada
-- partida. Si a alguna le falta stock, falla con SIN_STOCK:<skus> y no mueve
-- nada. Cascos bajo pedido sin stock no se reservan (se fabrican/piden).
-- Idempotente: si la orden ya tiene una reserva vigente, no hace nada.
CREATE OR REPLACE FUNCTION reservar_stock(p_order_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  r record;
  v_faltantes text[] := '{}';
BEGIN
  PERFORM 1 FROM orders WHERE id = p_order_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'ORDEN_NO_ENCONTRADA'; END IF;

  -- Reserva vigente o venta ya registrada → nada que hacer
  IF EXISTS (
    SELECT 1 FROM stock_movements
     WHERE order_id = p_order_id
       AND (tipo = 'venta_online' OR (tipo = 'reserva_pago' AND referencia_externa IS NULL))
  ) THEN
    RETURN;
  END IF;

  -- Bloquea las variantes en orden fijo (evita deadlocks entre compradores)
  FOR r IN
    SELECT oi.variant_id, SUM(oi.cantidad)::int AS qty, pv.sku_variante, pv.stock_actual, pv.estado,
           p.marca, p.categoria, p.pieza_unica
      FROM order_items oi
      JOIN product_variants pv ON pv.id = oi.variant_id
      JOIN products p ON p.id = pv.product_id
     WHERE oi.order_id = p_order_id
     GROUP BY oi.variant_id, pv.sku_variante, pv.stock_actual, pv.estado, p.marca, p.categoria, p.pieza_unica
     ORDER BY oi.variant_id
  LOOP
    PERFORM 1 FROM product_variants WHERE id = r.variant_id FOR UPDATE;
  END LOOP;

  -- Revisa existencias con los datos ya bloqueados
  FOR r IN
    SELECT oi.variant_id, SUM(oi.cantidad)::int AS qty, pv.sku_variante, COALESCE(pv.stock_actual, 0) AS stock,
           pv.estado, p.marca, p.categoria, p.pieza_unica
      FROM order_items oi
      JOIN product_variants pv ON pv.id = oi.variant_id
      JOIN products p ON p.id = pv.product_id
     WHERE oi.order_id = p_order_id
     GROUP BY oi.variant_id, pv.sku_variante, pv.stock_actual, pv.estado, p.marca, p.categoria, p.pieza_unica
  LOOP
    IF r.stock < r.qty AND NOT (
      r.marca = 'hedon' AND r.categoria = 'estrella' AND NOT r.pieza_unica AND r.estado = 'bajo_pedido'
    ) THEN
      v_faltantes := array_append(v_faltantes, r.sku_variante);
    END IF;
  END LOOP;

  IF array_length(v_faltantes, 1) > 0 THEN
    RAISE EXCEPTION 'SIN_STOCK:%', array_to_string(v_faltantes, ',');
  END IF;

  -- Descuenta y registra (solo lo que tiene stock; bajo pedido no se mueve)
  FOR r IN
    SELECT oi.variant_id, SUM(oi.cantidad)::int AS qty, pv.sku_variante, COALESCE(pv.stock_actual, 0) AS stock
      FROM order_items oi
      JOIN product_variants pv ON pv.id = oi.variant_id
     WHERE oi.order_id = p_order_id
     GROUP BY oi.variant_id, pv.sku_variante, pv.stock_actual
  LOOP
    CONTINUE WHEN r.stock < r.qty;

    UPDATE product_variants SET stock_actual = r.stock - r.qty, updated_at = now() WHERE id = r.variant_id;
    -- Las Tees también viven en la tabla `tees` (la que lee /tienda/tees)
    UPDATE tees SET stock = GREATEST(stock - r.qty, 0), updated_at = now() WHERE sku_variante = r.sku_variante;

    INSERT INTO stock_movements (variant_id, tipo, cantidad, stock_anterior, stock_nuevo, order_id, canal, notas)
    VALUES (r.variant_id, 'reserva_pago', -r.qty, r.stock, r.stock - r.qty, p_order_id, 'online',
            'Reserva durante el cobro con Mercado Pago');
  END LOOP;
END;
$$;

-- 6. liberar_stock ------------------------------------------------------------
-- Revierte la reserva vigente con movimientos compensatorios (no borra
-- historial) y marca esas reservas como liberadas. Idempotente.
-- No toca ventas ya confirmadas (venta_online): eso es decisión del admin.
CREATE OR REPLACE FUNCTION liberar_stock(p_order_id uuid)
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  r record;
  v_stock int;
BEGIN
  PERFORM 1 FROM orders WHERE id = p_order_id FOR UPDATE;

  FOR r IN
    SELECT sm.id, sm.variant_id, -sm.cantidad AS qty, pv.sku_variante
      FROM stock_movements sm
      JOIN product_variants pv ON pv.id = sm.variant_id
     WHERE sm.order_id = p_order_id AND sm.tipo = 'reserva_pago' AND sm.referencia_externa IS NULL
     ORDER BY sm.variant_id
  LOOP
    SELECT COALESCE(stock_actual, 0) INTO v_stock FROM product_variants WHERE id = r.variant_id FOR UPDATE;

    UPDATE product_variants SET stock_actual = v_stock + r.qty, updated_at = now() WHERE id = r.variant_id;
    UPDATE tees SET stock = stock + r.qty, updated_at = now() WHERE sku_variante = r.sku_variante;

    INSERT INTO stock_movements (variant_id, tipo, cantidad, stock_anterior, stock_nuevo, order_id, canal, notas)
    VALUES (r.variant_id, 'liberacion_reserva', r.qty, v_stock, v_stock + r.qty, p_order_id, 'online',
            'Pago no completado: se libera la reserva');

    UPDATE stock_movements SET referencia_externa = 'liberada' WHERE id = r.id;
  END LOOP;
END;
$$;

-- 7. confirmar_pago_db --------------------------------------------------------
-- Pasa la orden a `pagada` solo si seguía en `pago_pendiente` (por eso es
-- seguro llamarla dos veces) y convierte la reserva vigente en venta, sin
-- volver a descontar. Devuelve true solo la primera vez.
CREATE OR REPLACE FUNCTION confirmar_pago_db(
  p_order_id uuid,
  p_mp_order_id text,
  p_mp_payment_id text,
  p_mp_status text,
  p_mp_status_detail text
)
RETURNS boolean
LANGUAGE plpgsql
AS $$
DECLARE
  v_id uuid;
BEGIN
  UPDATE orders
     SET estado = 'pagada',
         fecha_pago = now(),
         mp_order_id = COALESCE(p_mp_order_id, mp_order_id),
         mp_payment_id = COALESCE(p_mp_payment_id, mp_payment_id),
         mp_status = p_mp_status,
         mp_status_detail = p_mp_status_detail,
         pago_en_proceso_at = NULL,
         updated_at = now()
   WHERE id = p_order_id AND estado = 'pago_pendiente'
  RETURNING id INTO v_id;

  IF v_id IS NULL THEN
    RETURN false;  -- ya estaba confirmada (o no existe)
  END IF;

  -- Si la reserva se había liberado (p. ej. pago pendiente que tardó), se
  -- intenta reservar ahora; si ya no hay stock, la orden queda pagada y se
  -- anota para que el admin lo resuelva (reembolso o reposición).
  IF NOT EXISTS (
    SELECT 1 FROM stock_movements
     WHERE order_id = p_order_id AND tipo = 'reserva_pago' AND referencia_externa IS NULL
  ) THEN
    BEGIN
      PERFORM reservar_stock(p_order_id);
    EXCEPTION WHEN OTHERS THEN
      UPDATE orders
         SET notas_internas = trim(both ' ' FROM COALESCE(notas_internas, '') || ' [Pagada sin stock reservado: ' || SQLERRM || ']')
       WHERE id = p_order_id;
    END;
  END IF;

  UPDATE stock_movements
     SET tipo = 'venta_online', notas = 'Venta online confirmada (Mercado Pago)'
   WHERE order_id = p_order_id AND tipo = 'reserva_pago' AND referencia_externa IS NULL;

  RETURN true;
END;
$$;

-- 8. Solo el servidor (service role) puede llamar estas funciones ------------
REVOKE ALL ON FUNCTION iniciar_intento_pago(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION terminar_intento_pago(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION reservar_stock(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION liberar_stock(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION confirmar_pago_db(uuid, text, text, text, text) FROM PUBLIC, anon, authenticated;

GRANT EXECUTE ON FUNCTION iniciar_intento_pago(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION terminar_intento_pago(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION reservar_stock(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION liberar_stock(uuid) TO service_role;
GRANT EXECUTE ON FUNCTION confirmar_pago_db(uuid, text, text, text, text) TO service_role;

-- 9. Verificación ------------------------------------------------------------
SELECT column_name FROM information_schema.columns
 WHERE table_name = 'orders'
   AND column_name IN ('mp_order_id', 'mp_status_detail', 'intentos_pago', 'pago_en_proceso_at', 'correo_confirmacion_at');
SELECT proname FROM pg_proc
 WHERE proname IN ('iniciar_intento_pago', 'terminar_intento_pago', 'reservar_stock', 'liberar_stock', 'confirmar_pago_db');
