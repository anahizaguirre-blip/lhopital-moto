import { Body, Container, Head, Html, Img, Preview, Section, Text } from '@react-email/components';
import { cloudinaryEditorialUrl } from '@/lib/cloudinary';

export const COLORS = {
  dark: '#020202',
  cream: '#F5EFE0',
  brass: '#C9A961',
};

export const FONT_FAMILY = "Georgia, 'Times New Roman', serif";

export function EmailLayout({
  preview,
  children,
}: {
  preview: string;
  children: React.ReactNode;
}) {
  return (
    <Html lang="es">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={{ margin: 0, padding: 0, backgroundColor: COLORS.cream, fontFamily: FONT_FAMILY }}>
        <Section style={{ backgroundColor: COLORS.dark, padding: '32px 24px', textAlign: 'center' }}>
          <Img
            src={cloudinaryEditorialUrl('frase_horizontal_invertido', 400)}
            width="200"
            alt="Lhopital Moto"
            style={{ margin: '0 auto' }}
          />
        </Section>

        <Container style={{ backgroundColor: COLORS.cream, padding: '32px 24px', maxWidth: '600px' }}>
          {children}
        </Container>

        <Section style={{ backgroundColor: COLORS.dark, padding: '24px' }}>
          <Text
            style={{
              color: COLORS.cream,
              opacity: 0.7,
              fontSize: '12px',
              textAlign: 'center',
              margin: 0,
              fontFamily: FONT_FAMILY,
            }}
          >
            Lhopital Moto · ordenes@lhopital.mx
          </Text>
          <Text
            style={{
              color: COLORS.cream,
              opacity: 0.7,
              fontSize: '12px',
              textAlign: 'center',
              margin: '4px 0 0',
              fontFamily: FONT_FAMILY,
            }}
          >
            lhopital.mx
          </Text>
        </Section>
      </Body>
    </Html>
  );
}
