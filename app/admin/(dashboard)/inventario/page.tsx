import Link from 'next/link';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { AjusteStock } from './AjusteStock';

export const dynamic = 'force-dynamic';

const MARCAS = [
  { id: '', label: 'Todas' },
  { id: 'hedon', label: 'Hedon' },
  { id: 'moto_ii', label: 'Moto II' },
  { id: 'tees', label: 'Tees' },
] as const;

const ETIQUETA_MARCA: Record<string, string> = { hedon: 'Hedon', moto_ii: 'Moto II', tees: 'Tees', lhopital: 'Lhopital' };

interface Fila {
  id: string;
  sku_variante: string;
  talla: string | null;
  color_variante: string | null;
  acabado_tornillo: string | null;
  estado: string;
  stock_actual: number | null;
  visible_publico: boolean | null;
  products: {
    nombre: string;
    marca: string;
    familia: string | null;
    categoria: string;
    pieza_unica: boolean;
    visible_publico: boolean | null;
  } | null;
}

export default async function InventarioPage({
  searchParams,
}: {
  searchParams: Promise<{ marca?: string; q?: string; vista?: string }>;
}) {
  const { marca = '', q = '', vista = '' } = await searchParams;
  const supabase = createSupabaseAdmin();

  const { data } = await supabase
    .from('product_variants')
    .select(
      'id, sku_variante, talla, color_variante, acabado_tornillo, estado, stock_actual, visible_publico, products!inner(nombre, marca, familia, categoria, pieza_unica, visible_publico)'
    )
    .range(0, 1999);

  // Piezas apartadas ahora: reservas de pagos en proceso que no se han liberado
  const { data: reservas } = await supabase
    .from('stock_movements')
    .select('variant_id, cantidad')
    .eq('tipo', 'reserva_pago')
    .is('referencia_externa', null);
  const apartadas = new Map<string, number>();
  for (const r of reservas ?? []) apartadas.set(r.variant_id, (apartadas.get(r.variant_id) ?? 0) - r.cantidad);

  const todas = ((data ?? []) as unknown as Fila[]).filter(
    (f) => f.products && f.products.visible_publico !== false && f.visible_publico !== false
  );

  // Cascos Hedon bajo pedido: stock 0 es normal, se venden igual (hasta 90 días)
  const esBajoPedido = (f: Fila) =>
    f.products!.marca === 'hedon' && f.products!.categoria === 'estrella' && !f.products!.pieza_unica && f.estado === 'bajo_pedido';
  const agotada = (f: Fila) => (f.stock_actual ?? 0) <= 0 && !esBajoPedido(f);

  const texto = q.trim().toLowerCase();
  const filas = todas
    .filter((f) => !marca || f.products!.marca === marca)
    .filter((f) => !texto || `${f.products!.nombre} ${f.sku_variante}`.toLowerCase().includes(texto))
    .filter((f) => vista !== 'agotados' || agotada(f))
    .filter((f) => vista !== 'bajo-pedido' || ((f.stock_actual ?? 0) <= 0 && esBajoPedido(f)))
    .filter((f) => vista !== 'con-stock' || (f.stock_actual ?? 0) > 0)
    .sort(
      (a, b) =>
        a.products!.marca.localeCompare(b.products!.marca) ||
        a.products!.nombre.localeCompare(b.products!.nombre) ||
        a.sku_variante.localeCompare(b.sku_variante)
    );

  // Resumen por marca (sobre todo el catálogo visible)
  const resumen = new Map<string, { piezas: number; agotadas: number; bajoPedido: number; variantes: number }>();
  for (const f of todas) {
    const m = f.products!.marca;
    const r = resumen.get(m) ?? { piezas: 0, agotadas: 0, bajoPedido: 0, variantes: 0 };
    r.variantes++;
    r.piezas += Math.max(0, f.stock_actual ?? 0);
    if (agotada(f)) r.agotadas++;
    else if ((f.stock_actual ?? 0) <= 0) r.bajoPedido++;
    resumen.set(m, r);
  }

  const href = (cambios: Record<string, string>) => {
    const p = new URLSearchParams({ marca, q, vista, ...cambios });
    for (const [k, v] of [...p.entries()]) if (!v) p.delete(k);
    const s = p.toString();
    return `/admin/inventario${s ? `?${s}` : ''}`;
  };

  return (
    <div>
      <h1 style={{ fontSize: '22px', marginBottom: '6px' }}>Inventario</h1>
      <p style={{ fontSize: '13px', color: '#666', margin: '0 0 16px' }}>
        Stock actual en la base (el que usa la tienda). Las ventas en línea lo descuentan solas; aquí lo corriges cuando
        llega mercancía, haces un conteo o hay una merma.
      </p>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        {['hedon', 'moto_ii', 'tees'].map((m) => {
          const r = resumen.get(m);
          if (!r) return null;
          return (
            <div key={m} style={{ backgroundColor: 'white', borderRadius: '6px', padding: '12px 16px', minWidth: '170px' }}>
              <div style={{ fontSize: '12px', color: '#666', textTransform: 'uppercase' }}>{ETIQUETA_MARCA[m]}</div>
              <div style={{ fontSize: '22px', fontWeight: 600 }}>{r.piezas} piezas</div>
              <div style={{ fontSize: '12px', color: r.agotadas ? '#b42318' : '#666' }}>
                {r.agotadas} {r.agotadas === 1 ? 'variante agotada' : 'variantes agotadas'}
              </div>
              {r.bajoPedido > 0 && (
                <div style={{ fontSize: '12px', color: '#666' }}>{r.bajoPedido} tallas bajo pedido</div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        {MARCAS.map((m) => (
          <Filtro key={m.id} href={href({ marca: m.id })} activo={marca === m.id}>{m.label}</Filtro>
        ))}
        <span style={{ width: '12px' }} />
        <Filtro href={href({ vista: '' })} activo={!vista}>Todo</Filtro>
        <Filtro href={href({ vista: 'con-stock' })} activo={vista === 'con-stock'}>Con stock</Filtro>
        <Filtro href={href({ vista: 'agotados' })} activo={vista === 'agotados'}>Agotados</Filtro>
        <Filtro href={href({ vista: 'bajo-pedido' })} activo={vista === 'bajo-pedido'}>Bajo pedido</Filtro>
      </div>

      <form action="/admin/inventario" style={{ marginBottom: '16px', display: 'flex', gap: '8px' }}>
        {marca && <input type="hidden" name="marca" value={marca} />}
        {vista && <input type="hidden" name="vista" value={vista} />}
        <input
          name="q"
          defaultValue={q}
          placeholder="Buscar por nombre o SKU"
          style={{ flex: '1 1 260px', maxWidth: '360px', padding: '8px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
        />
        <button type="submit" style={{ padding: '8px 14px', border: 'none', borderRadius: '4px', backgroundColor: '#020202', color: '#F5EFE0', fontSize: '13px', cursor: 'pointer' }}>
          Buscar
        </button>
      </form>

      <div style={{ backgroundColor: 'white', borderRadius: '6px', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', minWidth: '820px' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
              <th style={th}>Producto</th>
              <th style={th}>Variante</th>
              <th style={th}>SKU</th>
              <th style={th}>Estado</th>
              <th style={{ ...th, textAlign: 'right' }}>Stock</th>
              <th style={{ ...th, textAlign: 'right' }}>Apartado</th>
              <th style={th}>Corregir stock</th>
            </tr>
          </thead>
          <tbody>
            {filas.length === 0 && (
              <tr><td colSpan={7} style={{ ...td, textAlign: 'center', color: '#888' }}>No hay productos que mostrar.</td></tr>
            )}
            {filas.map((f) => {
              const stock = f.stock_actual ?? 0;
              const variante = [f.talla && `Talla ${f.talla}`, f.color_variante, f.acabado_tornillo].filter(Boolean).join(' · ');
              const apartado = apartadas.get(f.id) ?? 0;
              return (
                <tr key={f.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={td}>
                    <div style={{ fontWeight: 600 }}>{f.products!.nombre}</div>
                    <div style={{ fontSize: '12px', color: '#888' }}>
                      {ETIQUETA_MARCA[f.products!.marca] ?? f.products!.marca}
                      {f.products!.pieza_unica ? ' · Fuera de Serie' : ''}
                    </div>
                  </td>
                  <td style={td}>{variante || '—'}</td>
                  <td style={{ ...td, fontFamily: 'monospace', fontSize: '12px' }}>{f.sku_variante}</td>
                  <td style={td}>{f.estado.replace('_', ' ')}</td>
                  <td style={{ ...td, textAlign: 'right', fontWeight: 700, color: agotada(f) ? '#b42318' : stock <= 0 ? '#888' : stock <= 2 ? '#a15c07' : '#020202' }}>
                    {stock}
                  </td>
                  <td style={{ ...td, textAlign: 'right', color: apartado ? '#a15c07' : '#bbb' }}>{apartado || '—'}</td>
                  <td style={td}><AjusteStock variantId={f.id} stock={stock} /></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p style={{ fontSize: '12px', color: '#888', marginTop: '10px' }}>
        {filas.length} variantes · «Apartado» = piezas reservadas por pagos en proceso (se liberan si el pago no pasa).
      </p>
    </div>
  );
}

function Filtro({ href, activo, children }: { href: string; activo: boolean; children: React.ReactNode }) {
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

const th: React.CSSProperties = { padding: '12px 16px', fontSize: '12px', color: '#666', textTransform: 'uppercase' };
const td: React.CSSProperties = { padding: '10px 16px', verticalAlign: 'middle' };
