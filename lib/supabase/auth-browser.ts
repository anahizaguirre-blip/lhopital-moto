/**
 * Cliente Supabase con sesión (cookies) para el formulario de login del
 * admin. Distinto del cliente en client.ts (ese es para el catálogo,
 * sin necesidad de sesión).
 */

'use client';

import { createBrowserClient } from '@supabase/ssr';

export function createSupabaseAuthBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
