/**
 * Helper para generar URLs de Cloudinary optimizadas.
 *
 * Cloudinary genera URLs como:
 * https://res.cloudinary.com/{cloud_name}/image/upload/{transformaciones}/{public_id}
 *
 * Las transformaciones nos permiten:
 * - Redimensionar (w_800)
 * - Cambiar formato (f_auto entrega WebP/AVIF según navegador)
 * - Calidad automática (q_auto)
 * - Crop (c_fill)
 *
 * Documentación: https://cloudinary.com/documentation/image_transformations
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
 *
 * @example
 * cloudinaryUrl('hedon/hedonist/macadamia-front', 'card')
 * → https://res.cloudinary.com/lhopital-moto/image/upload/w_600,h_600,c_fill,g_auto,f_auto,q_auto/hedon/hedonist/macadamia-front
 */
export function cloudinaryUrl(
  publicId: string | null | undefined,
  preset: CloudinaryPreset = 'card'
): string {
  if (!publicId) {
    // Placeholder cuando no hay foto
    return placeholderImage();
  }
  return `${BASE_URL}/${PRESETS[preset]}/${publicId}`;
}

/**
 * Genera las 4 vistas estándar de un producto Hedon.
 * Útil para galerías.
 */
export function hedonGallery(basePath: string): {
  front: string;
  threeQuarter: string;
  lifestyle: string;
  detail: string;
} {
  // basePath tipo "hedon/hedonist/macadamia"
  // Las fotos siguen patrón: macadamia-front, macadamia-three-quarter, etc.
  return {
    front: cloudinaryUrl(`${basePath}-front`, 'detail'),
    threeQuarter: cloudinaryUrl(`${basePath}-three-quarter`, 'detail'),
    lifestyle: cloudinaryUrl(`${basePath}-lifestyle`, 'detail'),
    detail: cloudinaryUrl(`${basePath}-detail`, 'detail'),
  };
}

/**
 * Convierte un path como "hedon/hedonist/macadamia-front"
 * al basePath sin sufijo: "hedon/hedonist/macadamia"
 */
export function extractBasePath(imagenPrincipal: string | null): string | null {
  if (!imagenPrincipal) return null;
  // Quita sufijos conocidos
  return imagenPrincipal.replace(/-(front|three-quarter|lifestyle|detail)$/, '');
}

/**
 * Placeholder visual cuando no hay foto disponible.
 * SVG embebido para que no requiera red.
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
