'use server';

import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { createSupabaseAuthServer } from '@/lib/supabase/auth-server';
import { isAllowedAdminEmail } from '@/lib/admin-auth';

async function getOrigin() {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = host?.startsWith('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export interface LoginState {
  error?: string;
}

export async function iniciarSesion(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Escribe tu correo y contraseña.' };
  }
  if (!isAllowedAdminEmail(email)) {
    return { error: 'Ese correo no tiene acceso al admin.' };
  }

  const supabase = await createSupabaseAuthServer();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('[admin/login] signInWithPassword:', error.message);
    return { error: 'Correo o contraseña incorrectos.' };
  }

  redirect('/admin/pedidos');
}

export interface RecuperarState {
  error?: string;
  success?: boolean;
}

export async function solicitarRecuperacion(
  _prevState: RecuperarState,
  formData: FormData
): Promise<RecuperarState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();

  if (!email) {
    return { error: 'Escribe tu correo.' };
  }
  if (!isAllowedAdminEmail(email)) {
    return { error: 'Ese correo no tiene acceso al admin.' };
  }

  const origin = await getOrigin();
  const supabase = await createSupabaseAuthServer();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/admin/actualizar-password`,
  });

  if (error) {
    console.error('[admin/login] resetPasswordForEmail:', error.message);
    return { error: 'No se pudo enviar el correo. Intenta de nuevo.' };
  }

  return { success: true };
}
