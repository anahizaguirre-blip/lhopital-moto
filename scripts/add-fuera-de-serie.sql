-- ============================================================================
-- FUERA DE SERIE — piezas únicas Hedon
-- Correr una sola vez en Supabase Studio → SQL Editor, ANTES de
-- `npm run sync-catalogo` (el sync escribe estas columnas).
-- ============================================================================

-- 1. Marcas de pieza única en products (cada pieza es su propio producto
--    con una sola variante, así que el grid, el PDP y los avisos filtran aquí).
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS pieza_unica boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS motivo_unico text
    CHECK (motivo_unico IN ('dot', 'electrico', 'edicion_limitada'));

CREATE INDEX IF NOT EXISTS products_pieza_unica_idx
  ON products (pieza_unica) WHERE pieza_unica;

-- 2. Colección de ediciones limitadas. Inactiva: así no aparece como filtro
--    vacío en /tienda/hedon, pero la etiqueta sí se muestra en la ficha.
INSERT INTO collections (id, nombre, "año", modelos_aplicables, etiqueta_visible, activa, destacada, orden_display)
VALUES ('edicion_limitada', 'Edición Limitada', '2026', '{Hedonist}', 'DGR 2026', false, false, 5)
ON CONFLICT (id) DO NOTHING;

-- 3. Verificación
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'products' AND column_name IN ('pieza_unica', 'motivo_unico');

SELECT id, etiqueta_visible, activa FROM collections WHERE id = 'edicion_limitada';
