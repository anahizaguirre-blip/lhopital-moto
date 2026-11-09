import { Link, Section, Text } from '@react-email/components';
import { EmailOscuro, OSCURO, estilos } from './components/EmailOscuro';
import { SHOWROOM } from '@/lib/venta';
import { urlSitio } from '@/lib/sitio';
import type { OrderDetail } from '@/lib/orders-query';

const DIAS_PARA_RECOGER = 10;

function fechaLarga(d: Date): string {
  return d.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Mexico_City' });
}

/** Correo al cliente cuando su pedido de recolección ya se puede recoger en el showroom. */
export function PedidoListoRecogerEmail({ order, avisadoEn = new Date() }: { order: OrderDetail; avisadoEn?: Date }) {
  const sitio = urlSitio();
  const nombre = order.nombre_cliente?.split(' ')[0] ?? '';
  const limite = new Date(avisadoEn.getTime() + DIAS_PARA_RECOGER * 24 * 60 * 60 * 1000);

  return (
    <EmailOscuro preview={`Tu pedido #${order.numero_orden} ya está listo para recoger.`}>
      <Text style={estilos.meta}>PEDIDO #{order.numero_orden}</Text>
      <Text style={estilos.h1}>{nombre ? `${nombre}, tu pedido está listo.` : 'Tu pedido está listo.'}</Text>
      <Text style={{ ...estilos.p, color: OSCURO.tenue }}>Ya puedes recogerlo en nuestro showroom.</Text>

      {/* Qué se recoge */}
      <Section style={{ marginTop: '24px', borderTop: `1px solid ${OSCURO.linea}`, paddingTop: '12px' }}>
        {order.items.map((it) => (
          <Text key={it.id} style={{ ...estilos.p, margin: '0 0 6px' }}>
            {it.cantidad}× {it.nombre_snapshot}
          </Text>
        ))}
      </Section>

      {/* Dónde y cuándo */}
      <Section style={{ marginTop: '24px', padding: '20px', backgroundColor: OSCURO.panel, border: `1px solid ${OSCURO.linea}` }}>
        <Text style={estilos.etiqueta}>Recolección en showroom</Text>
        <Text style={estilos.p}>{SHOWROOM.direccion}</Text>
        <Text style={estilos.tenue}>
          {SHOWROOM.horario[0]}
          <br />
          {SHOWROOM.horario[1]} ·{' '}
          <Link href={`${sitio}${SHOWROOM.citasHref}`} style={estilos.link}>agenda tu cita</Link>
        </Text>
        <Text style={{ ...estilos.p, marginTop: '16px', marginBottom: '4px' }}>
          Recógelo a más tardar el {fechaLarga(limite)}.
        </Text>
        <Text style={estilos.tenue}>Trae tu número de pedido (#{order.numero_orden}) e identificación oficial.</Text>
      </Section>

      <Text style={{ ...estilos.tenue, marginTop: '24px' }}>
        Si alguien más lo recogerá por ti, respóndenos este correo con su nombre.
      </Text>
    </EmailOscuro>
  );
}

export default PedidoListoRecogerEmail;
