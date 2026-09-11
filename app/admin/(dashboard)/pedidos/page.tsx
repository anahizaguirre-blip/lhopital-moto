import Link from 'next/link';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { formatFecha, formatMoneda } from '@/lib/orders-format';

const ESTADOS = [
  'pago_pendiente',
  'pagada',
  'preparando',
  'enviada',
  'entregada',
  'cancelada',
  'reembolsada',
] as const;

interface FilaPedido {
  id: string | null;
  numero_orden: string;
  created_at: string;
  cliente: string | null;
  estado: string | null;
  total: number;
}

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{ vista?: string; estado?: string }>;
}) {
  const { vista, estado } = await searchParams;
  const supabase = createSupabaseAdmin();
  const mostrandoPendientes = vista === 'pendientes';

  let filas: FilaPedido[] = [];

  if (mostrandoPendientes) {
    const { data: pendientes } = await supabase
      .from('v_pedidos_pendientes_envio')
      .select('*')
      .order('created_at', { ascending: false });

    const numeros = (pendientes ?? []).map((p) => p.numero_orden);
    const { data: idsPorNumero } = numeros.length
      ? await supabase.from('orders').select('id, numero_orden').in('numero_orden', numeros)
      : { data: [] as { id: string; numero_orden: string }[] };

    const idMap = new Map((idsPorNumero ?? []).map((o) => [o.numero_orden, o.id]));

    filas = (pendientes ?? []).map((p) => ({
      id: idMap.get(p.numero_orden) ?? null,
      numero_orden: p.numero_orden,
      created_at: p.created_at,
      cliente: p.cliente ?? p.email,
      estado: null,
      total: p.total,
    }));
  } else {
    let query = supabase
      .from('orders')
      .select('id, numero_orden, created_at, estado, total, email_invitado, customers(email, nombre, apellidos)')
      .order('created_at', { ascending: false });

    if (estado) query = query.eq('estado', estado);

    const { data: orders } = await query;

    filas = (orders ?? []).map((o) => {
      const customer = o.customers as unknown as {
        email: string | null;
        nombre: string | null;
        apellidos: string | null;
      } | null;
      const cliente = customer
        ? [customer.nombre, customer.apellidos].filter(Boolean).join(' ').trim() || customer.email
        : o.email_invitado;
      return {
        id: o.id,
        numero_orden: o.numero_orden,
        created_at: o.created_at,
        cliente,
        estado: o.estado,
        total: o.total,
      };
    });
  }

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '16px' }}>Pedidos</h1>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <FiltroLink href="/admin/pedidos" activo={!vista && !estado}>
          Todos
        </FiltroLink>
        <FiltroLink href="/admin/pedidos?vista=pendientes" activo={mostrandoPendientes}>
          Pendientes de envío
        </FiltroLink>
      </div>

      {!mostrandoPendientes && (
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {ESTADOS.map((e) => (
            <FiltroLink key={e} href={`/admin/pedidos?estado=${e}`} activo={estado === e}>
              {e}
            </FiltroLink>
          ))}
        </div>
      )}

      <div style={{ backgroundColor: 'white', borderRadius: '6px', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={thStyle}>Pedido</th>
              <th style={thStyle}>Cliente</th>
              <th style={thStyle}>Fecha</th>
              {!mostrandoPendientes && <th style={thStyle}>Estado</th>}
              <th style={{ ...thStyle, textAlign: 'right' }}>Total</th>
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 && (
              <tr>
                <td colSpan={5} style={{ ...tdStyle, textAlign: 'center', color: '#888' }}>
                  No hay pedidos que mostrar.
                </td>
              </tr>
            )}
            {filas.map((fila) => (
              <tr key={fila.id ?? fila.numero_orden} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={tdStyle}>
                  {fila.id ? (
                    <Link href={`/admin/pedidos/${fila.id}`} style={{ color: '#020202', fontWeight: 600 }}>
                      {fila.numero_orden}
                    </Link>
                  ) : (
                    fila.numero_orden
                  )}
                </td>
                <td style={tdStyle}>{fila.cliente ?? '—'}</td>
                <td style={tdStyle}>{formatFecha(fila.created_at)}</td>
                {!mostrandoPendientes && <td style={tdStyle}>{fila.estado}</td>}
                <td style={{ ...tdStyle, textAlign: 'right' }}>{formatMoneda(fila.total)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FiltroLink({
  href,
  activo,
  children,
}: {
  href: string;
  activo: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      style={{
        padding: '6px 14px',
        borderRadius: '999px',
        fontSize: '13px',
        textDecoration: 'none',
        backgroundColor: activo ? '#020202' : '#e8e0cc',
        color: activo ? '#F5EFE0' : '#020202',
      }}
    >
      {children}
    </Link>
  );
}

const thStyle: React.CSSProperties = { padding: '12px 16px', fontSize: '12px', color: '#666', textTransform: 'uppercase' };
const tdStyle: React.CSSProperties = { padding: '12px 16px' };
