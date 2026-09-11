import { notFound } from 'next/navigation';
import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { getOrderDetail } from '@/lib/orders-query';
import { formatFecha, formatMoneda, formatearDireccion } from '@/lib/orders-format';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { CaptureForm } from './CaptureForm';

export default async function PedidoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = createSupabaseAdmin();
  const order = await getOrderDetail(supabase, id);

  if (!order) notFound();

  const direccionLineas = formatearDireccion(order.direccion_envio);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', maxWidth: '1000px' }}>
      <div>
        <h1 style={{ fontSize: '22px', marginBottom: '4px' }}>Pedido {order.numero_orden}</h1>
        <p style={{ color: '#666', fontSize: '14px', marginBottom: '24px' }}>
          {formatFecha(order.created_at)} · estado: {order.estado}
        </p>

        <Seccion titulo="Productos">
          {order.items.map((item) => (
            <div key={item.id} style={{ display: 'flex', gap: '12px', padding: '10px 0', borderBottom: '1px solid #eee' }}>
              {item.imagen_principal && (
                <img
                  src={cloudinaryUrl(item.imagen_principal, 'thumbnail')}
                  width={48}
                  height={48}
                  alt={item.nombre_snapshot}
                  style={{ borderRadius: '4px', objectFit: 'cover' }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '14px' }}>{item.nombre_snapshot}</div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  {[item.talla, item.color_variante].filter(Boolean).join(' · ') || item.sku_snapshot} · Cantidad: {item.cantidad}
                </div>
              </div>
              <div style={{ fontSize: '14px' }}>{formatMoneda(item.subtotal)}</div>
            </div>
          ))}
          <div style={{ textAlign: 'right', marginTop: '12px', fontSize: '14px', color: '#555' }}>
            <div>Subtotal: {formatMoneda(order.subtotal)}</div>
            {Number(order.descuento) > 0 && <div>Descuento: -{formatMoneda(order.descuento)}</div>}
            <div>Envío: {formatMoneda(order.envio)}</div>
            <div style={{ fontWeight: 700, fontSize: '16px', marginTop: '4px' }}>Total: {formatMoneda(order.total)}</div>
          </div>
        </Seccion>

        <Seccion titulo="Cliente">
          <p style={{ fontSize: '14px', margin: '2px 0' }}>{order.nombre_cliente ?? 'Invitado'}</p>
          <p style={{ fontSize: '14px', margin: '2px 0' }}>{order.email_cliente}</p>
          {order.telefono_cliente && <p style={{ fontSize: '14px', margin: '2px 0' }}>{order.telefono_cliente}</p>}
        </Seccion>

        <Seccion titulo="Dirección de envío">
          {direccionLineas.length > 0 ? (
            direccionLineas.map((linea, i) => (
              <p key={i} style={{ fontSize: '14px', margin: '2px 0' }}>{linea}</p>
            ))
          ) : (
            <p style={{ fontSize: '14px', color: '#888' }}>Sin dirección capturada.</p>
          )}
        </Seccion>
      </div>

      <div>
        <Seccion titulo="Envío">
          <CaptureForm
            orderId={order.id}
            paqueteria={order.paqueteria}
            numeroGuia={order.numero_guia}
            urlRastreo={order.url_rastreo}
            yaEnviado={order.estado === 'enviada' || order.estado === 'entregada'}
          />
        </Seccion>
      </div>
    </div>
  );
}

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div style={{ backgroundColor: 'white', borderRadius: '6px', padding: '16px 20px', marginBottom: '16px' }}>
      <h2 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#888', marginBottom: '10px' }}>{titulo}</h2>
      {children}
    </div>
  );
}
