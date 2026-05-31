/**
 * Cliente Supabase para Server Components y API Routes.
 * Usa la anon_key porque las políticas RLS protegen los datos.
 * Se usa en páginas async (server components) para leer datos del catálogo.
 */

import { createClient } from '@supabase/supabase-js';

export function createSupabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
