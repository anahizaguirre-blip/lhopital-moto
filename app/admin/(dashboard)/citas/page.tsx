import Link from 'next/link';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { formatFecha } from '@/lib/orders-format';
import { BLOQUES, formatFechaSolo, type Bloque } from '@/lib/citas';
import { confirmarCita, rechazarCita } from './actions';

interface CitaPendiente {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  marcas_interes: string[];
  modelo_interes: string | null;
  talla_aprox: string | null;
  fecha: string;
  bloque: Bloque;
  created_at: string;
}

export default async function CitasAdminPage() {
  const supabase = createSupabaseAdmin();
  const { data } = await supabase
    .from('citas_showroom')
    .select('id, nombre, correo, telefono, marcas_interes, modelo_interes, talla_aprox, fecha, bloque, created_at')
    .eq('estado', 'pendiente')
    .order('created_at', { ascending: true });

  const citas = (data ?? []) as CitaPendiente[];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '22px' }}>Citas · Solicitudes pendientes</h1>
        <Link href="/admin/citas/bloqueados" style={{ fontSize: '13px', color: '#020202' }}>
          Días bloqueados →
        </Link>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={thStyle}>Solicitada</th>
              <th style={thStyle}>Cliente</th>
              <th style={thStyle}>Interés</th>
              <th style={thStyle}>Fecha pedida</th>
              <th style={{ ...thStyle, textAlign: 'right' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {citas.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>
                  No hay solicitudes pendientes.
                </td>
              </tr>
            )}
            {citas.map((cita) => (
              <tr key={cita.id} id={cita.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={tdStyle}>{formatFecha(cita.created_at)}</td>
                <td style={tdStyle}>
                  <div>{cita.nombre}</div>
                  <div style={{ color: '#888', fontSize: '12px' }}>{cita.correo} · {cita.telefono}</div>
                </td>
                <td style={tdStyle}>
                  <div>{(cita.marcas_interes ?? []).join(' / ')}</div>
                  {cita.modelo_interes && <div style={{ color: '#888', fontSize: '12px' }}>{cita.modelo_interes}</div>}
                  {cita.talla_aprox && <div style={{ color: '#888', fontSize: '12px' }}>Talla: {cita.talla_aprox}</div>}
                </td>
                <td style={tdStyle}>
                  {formatFechaSolo(cita.fecha)}
                  <div style={{ color: '#888', fontSize: '12px' }}>{BLOQUES[cita.bloque].label}</div>
                </td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <form action={confirmarCita.bind(null, cita.id)}>
                      <button type="submit" style={botonConfirmar}>
                        Confirmar
                      </button>
                    </form>
                    <form action={rechazarCita.bind(null, cita.id)}>
                      <button type="submit" style={botonRechazar}>
                        Rechazar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle: React.CSSProperties = { padding: '12px 16px', fontSize: '12px', color: '#666', textTransform: 'uppercase' };
const tdStyle: React.CSSProperties = { padding: '12px 16px', verticalAlign: 'top' };
const botonConfirmar: React.CSSProperties = {
  padding: '6px 14px',
  borderRadius: '999px',
  border: 'none',
  backgroundColor: '#020202',
  color: '#F5EFE0',
  fontSize: '13px',
  cursor: 'pointer',
};
const botonRechazar: React.CSSProperties = {
  padding: '6px 14px',
  borderRadius: '999px',
  border: '1px solid #ccc',
  backgroundColor: 'transparent',
  color: '#020202',
  fontSize: '13px',
  cursor: 'pointer',
};
