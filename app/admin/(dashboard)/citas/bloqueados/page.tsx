import Link from 'next/link';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { formatFechaSolo } from '@/lib/citas';
import { BloqueadoForm } from './BloqueadoForm';
import { quitarDiasBloqueados } from './actions';

interface DiaBloqueado {
  id: string;
  fecha: string;
  motivo: string | null;
}

interface RangoBloqueado {
  ids: string[];
  desde: string;
  hasta: string;
  motivo: string | null;
}

// Convierte una fecha "yyyy-mm-dd" en la del día siguiente, sin pasar por
// UTC (mismo motivo que formatFechaSolo: evita corrimientos de zona horaria).
function siguienteDia(fechaISO: string): string {
  const [y, m, d] = fechaISO.split('-').map(Number);
  const fecha = new Date(y, m - 1, d);
  fecha.setDate(fecha.getDate() + 1);
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, '0')}-${String(fecha.getDate()).padStart(2, '0')}`;
}

// Agrupa fechas consecutivas con el mismo motivo en un solo rango — así un
// bloqueo de varios días (una expo) se ve y se quita como una sola fila en
// vez de una fila por día.
function agruparRangos(dias: DiaBloqueado[]): RangoBloqueado[] {
  const ordenados = [...dias].sort((a, b) => a.fecha.localeCompare(b.fecha));
  const grupos: RangoBloqueado[] = [];

  for (const dia of ordenados) {
    const ultimo = grupos[grupos.length - 1];
    const esConsecutivo = ultimo && ultimo.motivo === dia.motivo && siguienteDia(ultimo.hasta) === dia.fecha;

    if (esConsecutivo) {
      ultimo.hasta = dia.fecha;
      ultimo.ids.push(dia.id);
    } else {
      grupos.push({ ids: [dia.id], desde: dia.fecha, hasta: dia.fecha, motivo: dia.motivo });
    }
  }

  return grupos;
}

export default async function BloqueadosPage() {
  const supabase = createSupabaseAdmin();
  const { data } = await supabase
    .from('showroom_dias_bloqueados')
    .select('id, fecha, motivo')
    .order('fecha', { ascending: true });

  const rangos = agruparRangos(data ?? []);

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
            {rangos.length === 0 && (
              <tr>
                <td colSpan={3} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>
                  No hay fechas bloqueadas.
                </td>
              </tr>
            )}
            {rangos.map((rango) => (
              <tr key={rango.ids[0]} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={tdStyle}>
                  {rango.desde === rango.hasta
                    ? formatFechaSolo(rango.desde)
                    : `${formatFechaSolo(rango.desde)} – ${formatFechaSolo(rango.hasta)}`}
                </td>
                <td style={tdStyle}>{rango.motivo ?? '—'}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  <form action={quitarDiasBloqueados.bind(null, rango.ids)}>
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
