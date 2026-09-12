-- Hace que numero_orden se genere solo: el primer pedido nuevo será
-- 26001, y de ahí sigue sumando automáticamente en cada INSERT que no
-- especifique numero_orden a mano.
--
-- Nota: si ya existe una secuencia con este nombre, "create sequence
-- if not exists" no reinicia su valor — bórrala primero
-- (drop sequence orders_numero_orden_seq;) si necesitas cambiar el
-- arranque otra vez.
create sequence if not exists orders_numero_orden_seq start with 26001;
alter table orders alter column numero_orden set default nextval('orders_numero_orden_seq')::text;
