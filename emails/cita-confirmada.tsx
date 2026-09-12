import { Button, Text } from '@react-email/components';
import { EmailLayout, COLORS, FONT_FAMILY } from './components/EmailLayout';

const DIRECCION_SHOWROOM = 'Pedro Sainz Baranda 139, locación 25, Col. Los Cipreses, Coyoacán, 04830';

// Link temporal — Anahí lo va a cambiar por el pin propio del showroom.
const MAPS_URL =
  'https://www.google.com/maps/place/Pedro+Sainz+de+Baranda+139,+Villas+de+Coyoac%C3%A1n,+Cipreses,+Coyoac%C3%A1n,+04830+Ciudad+de+M%C3%A9xico,+CDMX';

export function CitaConfirmadaEmail({
  nombre,
  fechaTexto,
  hora,
  interes,
}: {
  nombre: string;
  fechaTexto: string;
  hora: string;
  interes: string;
}) {
  return (
    <EmailLayout preview="Tu cita en el showroom está confirmada" contactoEmail="contacto@lhopital.mx">
      <Text style={{ fontFamily: FONT_FAMILY, fontSize: '22px', margin: '0 0 16px', color: COLORS.dark }}>
        Hola {nombre},
      </Text>
      <Text style={{ fontFamily: FONT_FAMILY, fontSize: '15px', color: '#333', margin: '0 0 16px' }}>
        Tu cita quedó lista. Te esperamos el {fechaTexto} a las {hora}.
      </Text>
      <Text style={{ fontFamily: FONT_FAMILY, fontSize: '15px', color: '#333', margin: '0 0 24px' }}>
        Vamos a tener listo lo que quieres ver: {interes}.
      </Text>

      <Text style={{ fontFamily: FONT_FAMILY, fontSize: '13px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 4px' }}>
        Dirección
      </Text>
      <Text style={{ fontFamily: FONT_FAMILY, fontSize: '14px', color: COLORS.dark, margin: '0 0 16px' }}>
        {DIRECCION_SHOWROOM}
      </Text>

      <Button
        href={MAPS_URL}
        style={{
          backgroundColor: COLORS.brass,
          color: COLORS.dark,
          fontFamily: FONT_FAMILY,
          fontSize: '14px',
          fontWeight: 'bold',
          padding: '12px 24px',
          borderRadius: '999px',
          textDecoration: 'none',
        }}
      >
        Ver en el mapa
      </Button>

      <Text style={{ fontFamily: FONT_FAMILY, fontSize: '15px', color: COLORS.dark, margin: '32px 0 0' }}>
        Nos vemos en el camino.
      </Text>
      <Text style={{ fontFamily: FONT_FAMILY, fontSize: '15px', color: COLORS.dark, margin: '4px 0 0' }}>
        — Lhopital Crew
      </Text>
    </EmailLayout>
  );
}

export default CitaConfirmadaEmail;
