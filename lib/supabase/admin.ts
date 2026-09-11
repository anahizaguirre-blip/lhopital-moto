/**
 * Cliente Supabase con la service role key — solo para código de servidor
 * de confianza (rutas /admin ya protegidas por sesión + whitelist, y el
 * webhook ya protegido por secreto compartido). Ignora RLS por completo:
 * nunca importar este archivo desde un componente cliente.
 */

import { createClient } from '@supabase/supabase-js';

export function createSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  );
}
