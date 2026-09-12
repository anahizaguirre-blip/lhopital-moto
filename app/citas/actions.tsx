'use server';

import { headers } from 'next/headers';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { getResend, EMAIL_FROM_CONTACTO, EMAIL_COPIA_INTERNA_CONTACTO } from '@/lib/resend';
import { BLOQUES, MARCAS_INTERES, formatFechaSolo, type Bloque } from '@/lib/citas';
import { CitaSolicitudInternaEmail } from '@/emails/cita-solicitud-interna';

export interface EnviarSolicitudCitaState {
  error?: string;
  success?: boolean;
}

async function getOrigin() {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = host?.startsWith('localhost') ? 'http' : 'https';
  return `${protocol}://${host}`;
}

export async function enviarSolicitudCita(
  _prevState: EnviarSolicitudCitaState,
  formData: FormData
): Promise<EnviarSolicitudCitaState> {
  const nombre = String(formData.get('nombre') ?? '').trim();
  const correo = String(formData.get('correo') ?? '').trim();
  const telefono = String(formData.get('telefono') ?? '').trim();
  const marcas = formData.getAll('marcas_interes').map(String).filter((m) => MARCAS_INTERES.includes(m as (typeof MARCAS_INTERES)[number]));
  const modeloInteres = String(formData.get('modelo_interes') ?? '').trim() || null;
  const tallaAprox = String(formData.get('talla_aprox') ?? '').trim() || null;
  const fecha = String(formData.get('fecha') ?? '').trim();
  const bloque = String(formData.get('bloque') ?? '').trim() as Bloque;

  if (!nombre || !correo || !telefono) {
    return { error: 'Faltan tus datos de contacto.' };
  }
  if (marcas.length === 0) {
    return { error: 'Dinos qué te interesa ver.' };
  }
  if (!fecha || (bloque !== 'manana' && bloque !== 'tarde')) {
    return { error: 'Elige una fecha y un horario.' };
  }

  const supabase = createSupabaseAdmin();

  const { data: fechaBloqueada } = await supabase
    .from('showroom_dias_bloqueados')
    .select('fecha')
    .eq('fecha', fecha)
    .maybeSingle();

  if (fechaBloqueada) {
    return { error: 'Esa fecha ya no está disponible. Elige otra.' };
  }

  const { data: choque } = await supabase
    .from('citas_showroom')
    .select('id')
    .eq('fecha', fecha)
    .eq('bloque', bloque)
    .in('estado', ['pendiente', 'confirmada'])
    .maybeSingle();

  if (choque) {
    return { error: 'Ese horario ya no está disponible, elige otro.' };
  }

  const { data: cita, error: insertError } = await supabase
    .from('citas_showroom')
    .insert({
      nombre,
      correo,
      telefono,
      marcas_interes: marcas,
      modelo_interes: modeloInteres,
      talla_aprox: tallaAprox,
      fecha,
      bloque,
    })
    .select('id')
    .single();

  if (insertError) {
    // 23505 = choque con el índice único de fecha+bloque (race entre dos submits).
    if (insertError.code === '23505') {
      return { error: 'Ese horario ya no está disponible, elige otro.' };
    }
    console.error('[citas] insert:', insertError);
    return { error: 'No se pudo enviar tu solicitud. Intenta de nuevo.' };
  }

  const origin = await getOrigin();
  const interes = [marcas.join(' / '), modeloInteres].filter(Boolean).join(' — ');

  try {
    const { error: emailError } = await getResend().emails.send({
      from: EMAIL_FROM_CONTACTO,
      to: EMAIL_COPIA_INTERNA_CONTACTO,
      subject: 'Nueva solicitud de cita — Showroom',
      react: (
        <CitaSolicitudInternaEmail
          nombre={nombre}
          correo={correo}
          telefono={telefono}
          interes={interes}
          talla={tallaAprox ?? 'por calcular'}
          fechaTexto={formatFechaSolo(fecha)}
          bloqueLabel={BLOQUES[bloque].label}
          adminUrl={`${origin}/admin/citas#${cita.id}`}
        />
      ),
    });
    if (emailError) console.error('[citas] Resend (alerta interna):', emailError);
  } catch (err) {
    console.error('[citas] Resend (alerta interna):', err);
  }

  return { success: true };
}
