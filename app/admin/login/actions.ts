'use server';

import { headers } from 'next/headers';
import { createSupabaseAuthServer } from '@/lib/supabase/auth-server';
import { isAllowedAdminEmail } from '@/lib/admin-auth';

export interface EnviarMagicLinkState {
  error?: string;
  success?: boolean;
}

export async function enviarMagicLink(
  _prevState: EnviarMagicLinkState,
  formData: FormData
): Promise<EnviarMagicLinkState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();

  if (!email) {
    return { error: 'Escribe un correo.' };
  }

  if (!isAllowedAdminEmail(email)) {
    return { error: 'Ese correo no tiene acceso al admin.' };
  }

  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = host?.startsWith('localhost') ? 'http' : 'https';
  const origin = `${protocol}://${host}`;

  const supabase = await createSupabaseAuthServer();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback?next=/admin/pedidos` },
  });

  if (error) {
    console.error('[admin/login] signInWithOtp:', error.message);
    return { error: 'No se pudo enviar el link. Intenta de nuevo.' };
  }

  return { success: true };
}
