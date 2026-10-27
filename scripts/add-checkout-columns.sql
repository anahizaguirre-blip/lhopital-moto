-- CHECKOUT (Fase 2) — columnas que faltan en orders + email único en customers
-- Correr una sola vez en Supabase Studio → SQL Editor.
--
-- Ya existen y se reutilizan: orders.envio (costo de envío),
-- orders.direccion_envio (jsonb), orders.subtotal/total, orders.estado.

-- 1. Entrega y prueba de consentimiento legal
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS metodo_entrega text
    CHECK (metodo_entrega IN ('envio', 'recoleccion')),
  ADD COLUMN IF NOT EXISTS acepto_terminos_at timestamptz,
  ADD COLUMN IF NOT EXISTS version_terminos date;

-- 2. Un cliente por correo (el checkout guarda el email en minúsculas).
--    customers está vacía hoy, así que no hay duplicados que estorben.
CREATE UNIQUE INDEX IF NOT EXISTS customers_email_lower_key
  ON customers (lower(email));

-- 3. Verificación
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'orders'
  AND column_name IN ('metodo_entrega', 'acepto_terminos_at', 'version_terminos');
