'use server';

import { redirect } from 'next/navigation';
import { createSupabaseAuthServer } from '@/lib/supabase/auth-server';

export async function cerrarSesion() {
  const supabase = await createSupabaseAuthServer();
  await supabase.auth.signOut();
  redirect('/admin/login');
}
