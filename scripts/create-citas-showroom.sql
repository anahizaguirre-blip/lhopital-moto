-- ============================================================================
-- CITAS SHOWROOM — sistema de citas para el showroom (sur de CDMX)
-- ============================================================================
-- Corre este script UNA VEZ en el SQL Editor de Supabase (Dashboard → SQL
-- Editor). No hay CLI/migraciones locales en este proyecto — el esquema se
-- gestiona directo en Supabase, igual que el resto de las tablas.
-- ============================================================================

-- ── Tipos ───────────────────────────────────────────────────────────────────

do $$ begin
  create type citas_showroom_bloque as enum ('manana', 'tarde');
exception
  when duplicate_object then null;
end $$;

do $$ begin
  create type citas_showroom_estado as enum ('pendiente', 'confirmada', 'cancelada');
exception
  when duplicate_object then null;
end $$;

-- ── Tablas ──────────────────────────────────────────────────────────────────

create table if not exists citas_showroom (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  correo text not null,
  telefono text not null,
  marcas_interes text[] not null default '{}',
  modelo_interes text,
  talla_aprox text,
  fecha date not null,
  bloque citas_showroom_bloque not null,
  estado citas_showroom_estado not null default 'pendiente',
  created_at timestamptz not null default now(),
  confirmada_at timestamptz
);

create table if not exists showroom_dias_bloqueados (
  id uuid primary key default gen_random_uuid(),
  fecha date not null unique,
  motivo text
);

-- Un solo cliente por bloque: garantía atómica a nivel de base de datos,
-- no solo validación de aplicación. Incluye 'pendiente' a propósito — una
-- solicitud pendiente ya reserva el horario para que dos personas no pidan
-- el mismo bloque mientras se revisa la primera.
create unique index if not exists citas_showroom_fecha_bloque_activa
  on citas_showroom (fecha, bloque)
  where estado in ('pendiente', 'confirmada');

-- RLS habilitado sin policies públicas: todo el acceso pasa por
-- createSupabaseAdmin() (service role) desde server actions ya protegidas
-- (el form público inserta vía server action, el admin vive bajo /admin).
alter table citas_showroom enable row level security;
alter table showroom_dias_bloqueados enable row level security;
