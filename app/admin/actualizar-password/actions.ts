'use server';

import { redirect } from 'next/navigation';
import { createSupabaseAuthServer } from '@/lib/supabase/auth-server';

export interface ActualizarPasswordState {
  error?: string;
}

const MIN_LARGO = 8;

export async function actualizarPassword(
  _prevState: ActualizarPasswordState,
  formData: FormData
): Promise<ActualizarPasswordState> {
  const password = String(formData.get('password') ?? '');
  const confirmar = String(formData.get('confirmar') ?? '');

  if (password.length < MIN_LARGO) {
    return { error: `La contraseña debe tener al menos ${MIN_LARGO} caracteres.` };
  }
  if (password !== confirmar) {
    return { error: 'Las contraseñas no coinciden.' };
  }

  const supabase = await createSupabaseAuthServer();

  // Requiere la sesión temporal que deja el link de recuperación (via
  // /auth/callback) — si alguien llega aquí sin haber pasado por ese link,
  // no hay sesión y esto falla.
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    console.error('[admin/actualizar-password] updateUser:', error.message);
    return { error: 'No se pudo actualizar la contraseña. Pide un link nuevo desde el login.' };
  }

  redirect('/admin/pedidos');
}
