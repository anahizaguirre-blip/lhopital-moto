/**
 * Helper para generar URLs de Cloudinary optimizadas.
 *
 * Cloudinary genera URLs como:
 * https://res.cloudinary.com/{cloud_name}/image/upload/{transformaciones}/{public_id}
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'lhopital-moto';
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

type CloudinaryPreset =
  | 'card'        // 600x600 — para grid de productos
  | 'detail'      // 1200x1200 — galería de ficha
  | 'thumbnail'   // 200x200 — miniaturas del carrito
  | 'hero';       // 1920x1080 — hero banners

const PRESETS: Record<CloudinaryPreset, string> = {
  card: 'w_600,h_600,c_fill,g_auto,f_auto,q_auto',
  detail: 'w_1200,h_1200,c_fill,g_auto,f_auto,q_auto',
  thumbnail: 'w_200,h_200,c_fill,g_auto,f_auto,q_auto',
  hero: 'w_1920,h_1080,c_fill,g_auto,f_auto,q_auto',
};

/**
 * Genera una URL de Cloudinary con preset.
 */
export function cloudinaryUrl(
  publicId: string | null | undefined,
  preset: CloudinaryPreset = 'card'
): string {
  if (!publicId) {
    return placeholderImage();
  }
  return `${BASE_URL}/${PRESETS[preset]}/${publicId}`;
}

/**
 * Genera las 4 vistas estándar de un producto Hedon.
 * El orden simula rotar el casco: frente → tres cuartos → lado → atrás.
 */
export function hedonGallery(basePath: string): {
  front: string;
  threeQuarter: string;
  side: string;
  back: string;
} {
  return {
    front: cloudinaryUrl(`${basePath}-front`, 'detail'),
    threeQuarter: cloudinaryUrl(`${basePath}-three-quarter`, 'detail'),
    side: cloudinaryUrl(`${basePath}-side`, 'detail'),
    back: cloudinaryUrl(`${basePath}-back`, 'detail'),
  };
}

/**
 * Convierte un path como "hedonist-macadamia-front"
 * al baseName sin sufijo: "hedonist-macadamia"
 */
export function extractBasePath(imagenPrincipal: string | null): string | null {
  if (!imagenPrincipal) return null;
  return imagenPrincipal.replace(/-(front|three-quarter|side|back)$/, '');
}

/**
 * Placeholder visual cuando no hay foto disponible.
 */
export function placeholderImage(): string {
  return (
    'data:image/svg+xml;base64,' +
    Buffer.from(
      `<svg width="600" height="600" xmlns="http://www.w3.org/2000/svg">
        <rect width="600" height="600" fill="#1a1a1a"/>
        <text x="300" y="300" font-family="Georgia, serif" font-style="italic" font-size="18" fill="#444" text-anchor="middle" dy=".3em">Foto pendiente</text>
      </svg>`
    ).toString('base64')
  );
}