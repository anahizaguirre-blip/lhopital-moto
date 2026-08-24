/**
 * Mapeo compartido entre PersonalizaGrid (tienda/hedon/personaliza) y cualquier
 * link que quiera regresar a una familia especifica dentro de esa pagina.
 */

export type PersonalizaTab = 'viseras' | 'visores' | 'tornillos';

export const FAMILIAS_POR_TAB: Record<PersonalizaTab, string[]> = {
  viseras:   ['Visera Carbon', 'Visera Classic', 'Visera Gloss', 'Visera Matte', 'Visera MotoCross'],
  visores:   ['Visor Epicurist 2.0', 'Visor Heroine Racer 2.0', 'Visor Burbuja', 'Visor Protector'],
  tornillos: ['Tornillo CNC'],
};

export function familiaToTab(familia: string): PersonalizaTab | null {
  for (const tab of Object.keys(FAMILIAS_POR_TAB) as PersonalizaTab[]) {
    if (FAMILIAS_POR_TAB[tab].includes(familia)) return tab;
  }
  return null;
}

export function familiaToId(familia: string): string {
  return familia
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export function personalizaHref(familia: string | null): string {
  const tab = familia ? familiaToTab(familia) : null;
  if (!tab || !familia) return '/tienda/hedon/personaliza';
  const params = new URLSearchParams({ tab, familia });
  return `/tienda/hedon/personaliza?${params.toString()}`;
}
