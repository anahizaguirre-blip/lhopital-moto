import { Column, Hr, Row, Section, Text } from '@react-email/components';
import { EmailLayout, COLORS, FONT_FAMILY } from './components/EmailLayout';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { formatFecha, formatMoneda, formatearDireccion } from '@/lib/orders-format';
import type { OrderDetail } from '@/lib/orders-query';

export function PedidoConfirmadoEmail({ order }: { order: OrderDetail }) {
  const direccionLineas = formatearDireccion(order.direccion_envio);

  return (
    <EmailLayout preview={`Tu pedido ${order.numero_orden} está confirmado`}>
      <Text style={{ fontFamily: FONT_FAMILY, fontSize: '22px', margin: '0 0 8px', color: COLORS.dark }}>
        Tu pedido está confirmado
      </Text>
      <Text style={{ fontFamily: FONT_FAMILY, fontSize: '14px', color: '#555', margin: '0 0 24px' }}>
        Pedido {order.numero_orden} · {formatFecha(order.created_at)}
      </Text>

      <Hr style={{ borderColor: '#E0D8C3' }} />

      {order.items.map((item) => (
        <Row key={item.id} style={{ marginTop: '16px' }}>
          <Column style={{ width: '64px', verticalAlign: 'top' }}>
            {item.imagen_principal && (
              <img
                src={cloudinaryUrl(item.imagen_principal, 'thumbnail')}
                width="56"
                height="56"
                alt={item.nombre_snapshot}
                style={{ borderRadius: '4px', objectFit: 'cover' }}
              />
            )}
          </Column>
          <Column style={{ verticalAlign: 'top', paddingLeft: '12px' }}>
            <Text style={{ fontFamily: FONT_FAMILY, fontSize: '15px', margin: 0, color: COLORS.dark }}>
              {item.nombre_snapshot}
            </Text>
            <Text style={{ fontFamily: FONT_FAMILY, fontSize: '13px', color: '#666', margin: '2px 0 0' }}>
              {[item.talla, item.color_variante].filter(Boolean).join(' · ') || item.sku_snapshot}
              {' · '}Cantidad: {item.cantidad}
            </Text>
          </Column>
          <Column style={{ width: '90px', verticalAlign: 'top', textAlign: 'right' }}>
            <Text style={{ fontFamily: FONT_FAMILY, fontSize: '14px', margin: 0, color: COLORS.dark }}>
              {formatMoneda(item.subtotal)}
            </Text>
          </Column>
        </Row>
      ))}

      <Hr style={{ borderColor: '#E0D8C3', marginTop: '20px' }} />

      <Section style={{ marginTop: '8px' }}>
        <Row>
          <Column style={{ textAlign: 'right' }}>
            <Text style={{ fontFamily: FONT_FAMILY, fontSize: '13px', color: '#555', margin: '2px 0' }}>
              Subtotal: {formatMoneda(order.subtotal)}
            </Text>
            {Number(order.descuento) > 0 && (
              <Text style={{ fontFamily: FONT_FAMILY, fontSize: '13px', color: '#555', margin: '2px 0' }}>
                Descuento: -{formatMoneda(order.descuento)}
              </Text>
            )}
            <Text style={{ fontFamily: FONT_FAMILY, fontSize: '13px', color: '#555', margin: '2px 0' }}>
              Envío: {formatMoneda(order.envio)}
            </Text>
            <Text style={{ fontFamily: FONT_FAMILY, fontSize: '16px', fontWeight: 'bold', margin: '8px 0 0', color: COLORS.dark }}>
              Total: {formatMoneda(order.total)}
            </Text>
          </Column>
        </Row>
      </Section>

      {direccionLineas.length > 0 && (
        <>
          <Hr style={{ borderColor: '#E0D8C3', marginTop: '20px' }} />
          <Text style={{ fontFamily: FONT_FAMILY, fontSize: '13px', color: '#555', margin: '16px 0 4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Dirección de envío
          </Text>
          {direccionLineas.map((linea, i) => (
            <Text key={i} style={{ fontFamily: FONT_FAMILY, fontSize: '14px', margin: '2px 0', color: COLORS.dark }}>
              {linea}
            </Text>
          ))}
        </>
      )}
    </EmailLayout>
  );
}

export default PedidoConfirmadoEmail;
