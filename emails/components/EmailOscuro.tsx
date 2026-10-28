/**
 * Diseño oscuro y sobrio para los correos de pedido ("premium quieto").
 * Los correos de citas y de envío siguen usando EmailLayout (crema).
 *
 * Tipografía de sistema: en correo no hay garantía de fuentes web.
 */

import { Body, Container, Head, Html, Img, Link, Preview, Section, Text } from '@react-email/components';
import { cloudinaryEditorialUrl } from '@/lib/cloudinary';

export const OSCURO = {
  fondo: '#0A0A0A',
  panel: '#111111',
  linea: '#2A2A2A',
  texto: '#F4F1EC',
  tenue: '#A8A39A',
  acento: '#C9A961',
};

export const FUENTE = "-apple-system, 'Segoe UI', Helvetica, Arial, sans-serif";

export function EmailOscuro({ preview, children }: { preview: string; children: React.ReactNode }) {
  return (
    <Html lang="es">
      <Head>
        <meta name="color-scheme" content="dark" />
        <meta name="supported-color-schemes" content="dark" />
      </Head>
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, padding: 0, backgroundColor: OSCURO.fondo, fontFamily: FUENTE, color: OSCURO.texto }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px 24px' }}>
          <Section style={{ textAlign: 'center', paddingBottom: '32px' }}>
            <Img
              src={cloudinaryEditorialUrl('frase_horizontal_invertido', 400)}
              width="180"
              alt="Lhopital"
              style={{ margin: '0 auto' }}
            />
          </Section>

          {children}

          <Section style={{ borderTop: `1px solid ${OSCURO.linea}`, marginTop: '40px', paddingTop: '24px', textAlign: 'center' }}>
            <Text style={{ fontFamily: FUENTE, fontSize: '12px', lineHeight: '18px', color: OSCURO.tenue, margin: 0 }}>
              <Link href="mailto:contacto@lhopital.mx" style={{ color: OSCURO.tenue }}>contacto@lhopital.mx</Link>
              {' · '}+52 (55) 9462 1951
            </Text>
            <Text
              style={{
                fontFamily: FUENTE,
                fontSize: '10px',
                letterSpacing: '0.3em',
                color: OSCURO.acento,
                margin: '16px 0 0',
              }}
            >
              WE ARE THE STANDARD
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

export const estilos = {
  h1: { fontFamily: FUENTE, fontSize: '26px', lineHeight: '32px', fontWeight: 700, color: OSCURO.texto, margin: '0 0 8px' },
  meta: { fontFamily: FUENTE, fontSize: '12px', letterSpacing: '0.15em', color: OSCURO.acento, margin: '0 0 16px' },
  p: { fontFamily: FUENTE, fontSize: '15px', lineHeight: '24px', color: OSCURO.texto, margin: '0 0 12px' },
  tenue: { fontFamily: FUENTE, fontSize: '14px', lineHeight: '22px', color: OSCURO.tenue, margin: '0 0 8px' },
  etiqueta: {
    fontFamily: FUENTE,
    fontSize: '11px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
    color: OSCURO.tenue,
    margin: '0 0 8px',
  },
  link: { color: OSCURO.acento, textDecoration: 'underline' },
};
