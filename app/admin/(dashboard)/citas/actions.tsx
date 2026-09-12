'use server';

import { revalidatePath } from 'next/cache';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { getResend, EMAIL_FROM_CONTACTO } from '@/lib/resend';
import { BLOQUES, formatFechaSolo, type Bloque } from '@/lib/citas';
import { CitaConfirmadaEmail } from '@/emails/cita-confirmada';

export async function confirmarCita(id: string): Promise<void> {
  const supabase = createSupabaseAdmin();

  const { data: cita, error: fetchError } = await supabase
    .from('citas_showroom')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !cita) {
    console.error('[admin/citas] confirmar: solicitud no encontrada', fetchError);
    return;
  }

  const { error: updateError } = await supabase
    .from('citas_showroom')
    .update({ estado: 'confirmada', confirmada_at: new Date().toISOString() })
    .eq('id', id);

  if (updateError) {
    console.error('[admin/citas] confirmar:', updateError);
    return;
  }

  const bloque = cita.bloque as Bloque;
  const interes = [((cita.marcas_interes as string[]) ?? []).join(' / '), cita.modelo_interes].filter(Boolean).join(' — ');

  try {
    const { error: emailError } = await getResend().emails.send({
      from: EMAIL_FROM_CONTACTO,
      to: cita.correo,
      subject: 'Tu cita en el showroom está confirmada',
      react: (
        <CitaConfirmadaEmail
          nombre={cita.nombre}
          fechaTexto={formatFechaSolo(cita.fecha)}
          hora={BLOQUES[bloque].hora}
          interes={interes}
        />
      ),
    });
    if (emailError) console.error('[admin/citas] Resend (confirmación):', emailError);
  } catch (err) {
    console.error('[admin/citas] Resend (confirmación):', err);
  }

  revalidatePath('/admin/citas');
}

export async function rechazarCita(id: string): Promise<void> {
  const supabase = createSupabaseAdmin();

  const { error } = await supabase.from('citas_showroom').update({ estado: 'cancelada' }).eq('id', id);
  if (error) console.error('[admin/citas] rechazar:', error);

  revalidatePath('/admin/citas');
}
