import { Body, Head, Html, Link, Preview, Text } from '@react-email/components';

/**
 * Correo de alerta interna — puramente funcional, nadie externo lo lee, así
 * que no lleva la identidad de marca (EmailLayout) de los correos al cliente.
 */
export function CitaSolicitudInternaEmail({
  nombre,
  correo,
  telefono,
  interes,
  talla,
  fechaTexto,
  bloqueLabel,
  adminUrl,
}: {
  nombre: string;
  correo: string;
  telefono: string;
  interes: string;
  talla: string;
  fechaTexto: string;
  bloqueLabel: string;
  adminUrl: string;
}) {
  return (
    <Html lang="es">
      <Head />
      <Preview>Nueva solicitud de cita — Showroom</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', color: '#111', padding: '24px' }}>
        <Text style={{ margin: '0 0 16px', fontWeight: 'bold' }}>Nueva solicitud de cita.</Text>
        <Text style={{ margin: '4px 0' }}>Nombre: {nombre}</Text>
        <Text style={{ margin: '4px 0' }}>Correo: {correo}</Text>
        <Text style={{ margin: '4px 0' }}>Teléfono: {telefono}</Text>
        <Text style={{ margin: '4px 0' }}>Interés: {interes}</Text>
        <Text style={{ margin: '4px 0' }}>Talla: {talla}</Text>
        <Text style={{ margin: '4px 0 16px' }}>
          Fecha solicitada: {fechaTexto} — {bloqueLabel}
        </Text>
        <Text style={{ margin: 0 }}>
          <Link href={adminUrl} style={{ color: '#020202', fontWeight: 'bold', marginRight: '16px' }}>
            Confirmar cita
          </Link>
          <Link href={adminUrl} style={{ color: '#888' }}>
            Rechazar
          </Link>
        </Text>
      </Body>
    </Html>
  );
}

export default CitaSolicitudInternaEmail;
