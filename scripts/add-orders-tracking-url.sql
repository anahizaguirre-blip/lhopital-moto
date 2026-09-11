-- Agrega el campo donde el admin captura el link de rastreo real
-- (pegado a mano desde la página de la paquetería, no generado por patrón de URL).
alter table orders add column if not exists url_rastreo text;
