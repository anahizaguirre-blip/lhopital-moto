import { Column, Img, Link, Row, Section, Text } from '@react-email/components';
import { EmailOscuro, OSCURO, FUENTE, estilos } from './components/EmailOscuro';
import { cloudinaryUrl } from '@/lib/cloudinary';
import { formatFecha, formatearDireccion } from '@/lib/orders-format';
import { formatoMXN, SHOWROOM } from '@/lib/venta';
import { LEGAL_RUTAS } from '@/lib/legal-rutas';
import { urlSitio } from '@/lib/sitio';
import type { OrderDetail } from '@/lib/orders-query';

/** Correo al cliente cuando el pago se confirma. Asunto: "Tu pedido Lhopital #<folio> está confirmado". */
export function PedidoConfirmadoEmail({ order }: { order: OrderDetail }) {
  const sitio = urlSitio();
  const nombre = order.nombre_cliente?.split(' ')[0] ?? '';
  const recoleccion = order.metodo_entrega === 'recoleccion';
  const direccion = formatearDireccion(order.direccion_envio);
  const celda = { fontFamily: FUENTE, fontSize: '14px', lineHeight: '20px', color: OSCURO.texto, margin: 0 };

  return (
    <EmailOscuro preview={`Tu pedido #${order.numero_orden} está confirmado.`}>
      <Text style={estilos.meta}>
        PEDIDO #{order.numero_orden} · {formatFecha(order.created_at).toUpperCase()}
      </Text>
      <Text style={estilos.h1}>{nombre ? `Gracias, ${nombre}.` : 'Gracias.'}</Text>
      <Text style={{ ...estilos.p, color: OSCURO.tenue }}>Tu pedido está confirmado.</Text>

      {/* Partidas */}
      <Section style={{ marginTop: '28px', borderTop: `1px solid ${OSCURO.linea}` }}>
        {order.items.map((it) => (
          <Row key={it.id} style={{ borderBottom: `1px solid ${OSCURO.linea}` }}>
            <Column style={{ width: '68px', padding: '14px 0', verticalAlign: 'top' }}>
              <Img
                src={cloudinaryUrl(it.imagen_principal?.split(',')[0]?.trim(), 'thumbnail')}
                width="56"
                height="56"
                alt=""
                style={{ display: 'block', backgroundColor: OSCURO.panel }}
              />
            </Column>
            <Column style={{ padding: '14px 12px', verticalAlign: 'top' }}>
              <Text style={celda}>{it.nombre_snapshot}</Text>
              <Text style={{ ...celda, fontSize: '12px', color: OSCURO.tenue, marginTop: '2px' }}>
                Cant. {it.cantidad}
                {it.cantidad > 1 ? ` · ${formatoMXN(Number(it.precio_unitario))} c/u` : ''}
              </Text>
            </Column>
            <Column style={{ width: '110px', padding: '14px 0', verticalAlign: 'top', textAlign: 'right' }}>
              <Text style={celda}>{formatoMXN(Number(it.subtotal))}</Text>
            </Column>
          </Row>
        ))}
      </Section>

      {/* Totales */}
      <Section style={{ marginTop: '12px' }}>
        <Row>
          <Column><Text style={estilos.tenue}>Subtotal</Text></Column>
          <Column style={{ textAlign: 'right' }}><Text style={{ ...estilos.tenue, color: OSCURO.texto }}>{formatoMXN(Number(order.subtotal))}</Text></Column>
        </Row>
        <Row>
          <Column><Text style={estilos.tenue}>{recoleccion ? 'Recolección en showroom' : 'Envío'}</Text></Column>
          <Column style={{ textAlign: 'right' }}>
            <Text style={{ ...estilos.tenue, color: OSCURO.texto }}>
              {Number(order.envio) === 0 ? 'Gratis' : formatoMXN(Number(order.envio))}
            </Text>
          </Column>
        </Row>
        <Row>
          <Column><Text style={{ ...estilos.p, fontWeight: 700, margin: '6px 0 0' }}>Total</Text></Column>
          <Column style={{ textAlign: 'right' }}>
            <Text style={{ ...estilos.p, fontWeight: 700, margin: '6px 0 0' }}>{formatoMXN(Number(order.total))}</Text>
          </Column>
        </Row>
        {order.tarjeta_ultimos4 && (
          <Text style={{ ...estilos.tenue, fontSize: '12px', marginTop: '6px' }}>
            Pagado con tarjeta terminación {order.tarjeta_ultimos4}
          </Text>
        )}
      </Section>

      {/* Entrega */}
      <Section style={{ marginTop: '32px', padding: '20px', backgroundColor: OSCURO.panel, border: `1px solid ${OSCURO.linea}` }}>
        <Text style={estilos.etiqueta}>{recoleccion ? 'Recolección en showroom' : 'Envío a domicilio'}</Text>
        {recoleccion ? (
          <>
            <Text style={estilos.p}>Te avisaremos por correo cuando tu pedido esté listo.</Text>
            <Text style={estilos.p}>{SHOWROOM.direccion}</Text>
            <Text style={estilos.tenue}>
              {SHOWROOM.horario[0]}
              <br />
              {SHOWROOM.horario[1]} ·{' '}
              <Link href={`${sitio}${SHOWROOM.citasHref}`} style={estilos.link}>previa cita</Link>
            </Text>
            <Text style={estilos.tenue}>
              Tienes 10 días naturales para recogerlo. Trae tu número de pedido e identificación oficial.
            </Text>
          </>
        ) : (
          <>
            {direccion.map((l, i) => (
              <Text key={i} style={{ ...estilos.p, margin: '0 0 2px' }}>{l}</Text>
            ))}
            <Text style={{ ...estilos.tenue, marginTop: '12px' }}>
              Te enviaremos el número de guía cuando tu pedido salga. Productos en stock: hasta 30 días naturales;
              bajo pedido: hasta 90.
            </Text>
          </>
        )}
      </Section>

      {/* Factura y políticas */}
      <Section style={{ marginTop: '28px' }}>
        <Text style={estilos.etiqueta}>¿Necesitas factura?</Text>
        <Text style={estilos.tenue}>
          Escribe a{' '}
          <Link href="mailto:factura@lhopital.mx" style={estilos.link}>factura@lhopital.mx</Link> dentro de los 5 días
          naturales siguientes a recibir tu pedido, con tu Constancia de Situación Fiscal y uso de CFDI.
        </Text>
        <Text style={{ ...estilos.tenue, marginTop: '16px' }}>
          <Link href={`${sitio}${LEGAL_RUTAS.entrega}`} style={estilos.link}>Políticas de entrega</Link>
          {'  ·  '}
          <Link href={`${sitio}${LEGAL_RUTAS.devoluciones}`} style={estilos.link}>Política de devoluciones</Link>
        </Text>
      </Section>
    </EmailOscuro>
  );
}

export default PedidoConfirmadoEmail;
