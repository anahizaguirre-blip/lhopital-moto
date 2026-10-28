import { Column, Link, Row, Section, Text } from '@react-email/components';
import { EmailOscuro, OSCURO, FUENTE, estilos } from './components/EmailOscuro';
import { formatearDireccion } from '@/lib/orders-format';
import { formatoMXN } from '@/lib/venta';
import { urlSitio } from '@/lib/sitio';
import type { OrderDetail } from '@/lib/orders-query';

/** Aviso interno. Asunto: "Nuevo pedido #<folio> · $<total> · Envío/Recolección". */
export function PedidoNuevoInternoEmail({
  order,
  etiqueta = 'NUEVO PEDIDO',
}: {
  order: OrderDetail;
  etiqueta?: string;
}) {
  const recoleccion = order.metodo_entrega === 'recoleccion';
  const direccion = formatearDireccion(order.direccion_envio);
  const celda = { fontFamily: FUENTE, fontSize: '14px', lineHeight: '20px', color: OSCURO.texto, margin: '6px 0' };

  return (
    <EmailOscuro preview={`Nuevo pedido #${order.numero_orden} · ${formatoMXN(Number(order.total))}`}>
      <Text style={estilos.meta}>{etiqueta}</Text>
      <Text style={estilos.h1}>
        #{order.numero_orden} · {formatoMXN(Number(order.total))}
      </Text>
      <Text style={{ ...estilos.p, color: OSCURO.tenue }}>{recoleccion ? 'Recolección en showroom' : 'Envío a domicilio'}</Text>

      <Section style={{ marginTop: '20px', borderTop: `1px solid ${OSCURO.linea}` }}>
        {order.items.map((it) => (
          <Row key={it.id} style={{ borderBottom: `1px solid ${OSCURO.linea}` }}>
            <Column><Text style={celda}>{it.cantidad} × {it.nombre_snapshot}<br /><span style={{ color: OSCURO.tenue, fontSize: '12px' }}>{it.sku_snapshot}</span></Text></Column>
            <Column style={{ width: '110px', textAlign: 'right' }}><Text style={celda}>{formatoMXN(Number(it.subtotal))}</Text></Column>
          </Row>
        ))}
        <Row>
          <Column><Text style={{ ...celda, color: OSCURO.tenue }}>Envío</Text></Column>
          <Column style={{ textAlign: 'right' }}><Text style={celda}>{Number(order.envio) === 0 ? 'Gratis' : formatoMXN(Number(order.envio))}</Text></Column>
        </Row>
      </Section>

      <Section style={{ marginTop: '24px' }}>
        <Text style={estilos.etiqueta}>Cliente</Text>
        <Text style={{ ...estilos.p, margin: '0 0 2px' }}>{order.nombre_cliente ?? '—'}</Text>
        <Text style={{ ...estilos.tenue, margin: '0 0 2px' }}>{order.email_cliente ?? '—'}</Text>
        <Text style={estilos.tenue}>{order.telefono_cliente ?? '—'}</Text>
        {!recoleccion && direccion.length > 0 && (
          <>
            <Text style={{ ...estilos.etiqueta, marginTop: '16px' }}>Dirección de envío</Text>
            {direccion.map((l, i) => (
              <Text key={i} style={{ ...estilos.tenue, margin: '0 0 2px' }}>{l}</Text>
            ))}
          </>
        )}
      </Section>

      <Section style={{ marginTop: '28px' }}>
        <Link
          href={`${urlSitio()}/admin/pedidos/${order.id}`}
          style={{
            display: 'inline-block',
            backgroundColor: OSCURO.acento,
            color: OSCURO.fondo,
            fontFamily: FUENTE,
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            padding: '12px 20px',
            textDecoration: 'none',
          }}
        >
          VER PEDIDO EN EL ADMIN
        </Link>
      </Section>
    </EmailOscuro>
  );
}

export default PedidoNuevoInternoEmail;
