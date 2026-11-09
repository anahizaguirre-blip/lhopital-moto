import { Link, Section, Text } from '@react-email/components';
import { EmailOscuro, OSCURO, estilos } from './components/EmailOscuro';
import type { OrderDetail } from '@/lib/orders-query';

/** Correo al cliente cuando el pedido se marca como entregado (recogido en showroom o recibido en casa). */
export function PedidoEntregadoEmail({ order }: { order: OrderDetail }) {
  const nombre = order.nombre_cliente?.split(' ')[0] ?? '';
  const recoleccion = order.metodo_entrega === 'recoleccion';
  const unaPieza = order.items.length === 1 ? order.items[0].nombre_snapshot : null;

  const titulo = recoleccion
    ? nombre ? `Gracias por visitarnos, ${nombre}.` : 'Gracias por visitarnos.'
    : nombre ? `Ya está contigo, ${nombre}.` : 'Ya está contigo.';

  return (
    <EmailOscuro preview={unaPieza ? `Que disfrutes tu ${unaPieza}.` : 'Que disfrutes tu pedido.'}>
      <Text style={estilos.meta}>PEDIDO #{order.numero_orden}</Text>
      <Text style={estilos.h1}>{titulo}</Text>
      <Text style={estilos.p}>
        Esperamos que disfrutes {unaPieza ? <>tu <strong>{unaPieza}</strong></> : 'tu pedido'}.
      </Text>
      <Text style={{ ...estilos.p, color: OSCURO.tenue }}>
        No elegimos cualquier cosa: cada pieza que traemos cumple el estándar. Ahora le toca a la ruta.
      </Text>

      {!unaPieza && (
        <Section style={{ marginTop: '8px', borderTop: `1px solid ${OSCURO.linea}`, paddingTop: '12px' }}>
          {order.items.map((it) => (
            <Text key={it.id} style={{ ...estilos.tenue, margin: '0 0 4px' }}>
              {it.cantidad}× {it.nombre_snapshot}
            </Text>
          ))}
        </Section>
      )}

      <Section style={{ marginTop: '28px', padding: '20px', backgroundColor: OSCURO.panel, border: `1px solid ${OSCURO.linea}` }}>
        <Text style={estilos.etiqueta}>Seguimos cerca</Text>
        <Text style={estilos.tenue}>
          Si algo no está como esperabas, escríbenos a{' '}
          <Link href="mailto:contacto@lhopital.mx" style={estilos.link}>contacto@lhopital.mx</Link> con tu número de
          pedido.
        </Text>
        <Text style={estilos.tenue}>
          ¿Necesitas factura? Tienes 5 días naturales a partir de hoy: escribe a{' '}
          <Link href="mailto:factura@lhopital.mx" style={estilos.link}>factura@lhopital.mx</Link> con tu Constancia de
          Situación Fiscal y uso de CFDI.
        </Text>
        <Text style={{ ...estilos.tenue, margin: 0 }}>
          Comparte tu ruta con nosotros en{' '}
          <Link href="https://www.instagram.com/lhopitalmx" style={estilos.link}>@lhopitalmx</Link>.
        </Text>
      </Section>

      <Text style={{ ...estilos.p, marginTop: '28px' }}>Nos vemos en el camino.</Text>
    </EmailOscuro>
  );
}

export default PedidoEntregadoEmail;
