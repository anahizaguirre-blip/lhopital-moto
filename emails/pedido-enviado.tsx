import { Button, Section, Text } from '@react-email/components';
import { EmailLayout, COLORS, FONT_FAMILY } from './components/EmailLayout';
import type { OrderDetail } from '@/lib/orders-query';

export function PedidoEnviadoEmail({ order }: { order: OrderDetail }) {
  const productosResumen = order.items
    .map((item) => `${item.cantidad}x ${item.nombre_snapshot}`)
    .join(', ');

  return (
    <EmailLayout preview={`Tu pedido ${order.numero_orden} va en camino`}>
      <Text style={{ fontFamily: FONT_FAMILY, fontSize: '22px', margin: '0 0 8px', color: COLORS.dark }}>
        Tu pedido va en camino
      </Text>
      <Text style={{ fontFamily: FONT_FAMILY, fontSize: '14px', color: '#555', margin: '0 0 24px' }}>
        Pedido {order.numero_orden}
      </Text>

      <Section
        style={{
          border: `1px solid ${COLORS.brass}`,
          borderRadius: '6px',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <Text style={{ fontFamily: FONT_FAMILY, fontSize: '13px', color: '#555', margin: '0 0 4px' }}>
          {order.paqueteria ?? 'Paquetería'}
        </Text>
        <Text style={{ fontFamily: FONT_FAMILY, fontSize: '18px', fontWeight: 'bold', margin: '0 0 16px', color: COLORS.dark }}>
          Guía: {order.numero_guia}
        </Text>
        {order.url_rastreo ? (
          <Button
            href={order.url_rastreo}
            style={{
              backgroundColor: COLORS.brass,
              color: COLORS.dark,
              fontFamily: FONT_FAMILY,
              fontSize: '14px',
              padding: '12px 28px',
              borderRadius: '999px',
              textDecoration: 'none',
            }}
          >
            Rastrear pedido
          </Button>
        ) : null}
      </Section>

      {productosResumen && (
        <Text style={{ fontFamily: FONT_FAMILY, fontSize: '13px', color: '#555', margin: '20px 0 0' }}>
          {productosResumen}
        </Text>
      )}
    </EmailLayout>
  );
}

export default PedidoEnviadoEmail;
