import Link from 'next/link';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { formatFechaSolo } from '@/lib/citas';
import { BloqueadoForm } from './BloqueadoForm';
import { quitarDiaBloqueado } from './actions';

export default async function BloqueadosPage() {
  const supabase = createSupabaseAdmin();
  const { data } = await supabase
    .from('showroom_dias_bloqueados')
    .select('id, fecha, motivo')
    .order('fecha', { ascending: true });

  const dias = data ?? [];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '22px' }}>Días bloqueados del showroom</h1>
        <Link href="/admin/citas" style={{ fontSize: '13px', color: '#020202' }}>
          ← Solicitudes
        </Link>
      </div>

      <BloqueadoForm />

      <div style={{ backgroundColor: 'white', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Motivo</th>
              <th style={{ ...thStyle, textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {dias.length === 0 && (
              <tr>
                <td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>
                  No hay fechas bloqueadas.
                </td>
              </tr>
            )}
            {dias.map((dia) => (
              <tr key={dia.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={tdStyle}>{formatFechaSolo(dia.fecha)}</td>
                <td style={tdStyle}>{dia.motivo ?? '—'}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <form action={quitarDiaBloqueado.bind(null, dia.id)}>
                    <button
                      type="submit"
                      style={{
                        padding: '6px 14px',
                        borderRadius: '999px',
                        border: '1px solid #ccc',
                        backgroundColor: 'transparent',
                        fontSize: '13px',
                        cursor: 'pointer',
                      }}
                    >
                      Quitar
                    </button>
                  </form>
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
const tdStyle: React.CSSProperties = { padding: '12px 16px' };
