/**
 * Cliente Supabase para Client Components ("use client").
 * Se usa en componentes interactivos del navegador.
 * Singleton para evitar crear múltiples conexiones.
 */

'use client';

import { createClient, SupabaseClient } from '@supabase/supabase-js';

let supabase: SupabaseClient | null = null;

export function createSupabaseClient(): SupabaseClient {
  if (!supabase) {
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabase;
}
