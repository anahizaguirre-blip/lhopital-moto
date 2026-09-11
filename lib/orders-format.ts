/**
 * Formateo compartido entre los correos transaccionales y el admin.
 */

export function formatMoneda(valor: number | string): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(Number(valor));
}

export function formatFecha(iso: string): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(iso));
}

/**
 * `direccion_envio` es jsonb sin schema fijo — el checkout que la escriba
 * (fuera de este repo por ahora) puede usar nombres de campo distintos a
 * los que asumimos aquí. Probamos las claves más probables en español y,
 * si ninguna existe, mostramos los valores de texto que haya en vez de
 * ocultar la dirección por completo.
 */
export function formatearDireccion(direccion: unknown): string[] {
  if (!direccion || typeof direccion !== 'object') return [];
  const obj = direccion as Record<string, unknown>;

  const val = (...claves: string[]): string | null => {
    for (const clave of claves) {
      const v = obj[clave];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
    return null;
  };

  const nombre = val('nombre_completo', 'nombre', 'destinatario');
  const calle = val('calle', 'street', 'direccion');
  const numeroExt = val('numero_ext', 'numero_exterior', 'numero');
  const numeroInt = val('numero_int', 'numero_interior');
  const colonia = val('colonia', 'neighborhood', 'barrio');
  const ciudad = val('ciudad', 'municipio', 'delegacion', 'city');
  const estado = val('estado', 'state');
  const cp = val('cp', 'codigo_postal', 'zip');
  const referencias = val('referencias', 'notas', 'references');

  const lineas: string[] = [];
  if (nombre) lineas.push(nombre);

  const calleLinea = [calle, numeroExt && `#${numeroExt}`, numeroInt && `Int. ${numeroInt}`]
    .filter(Boolean)
    .join(' ');
  if (calleLinea) lineas.push(calleLinea);
  if (colonia) lineas.push(colonia);

  const ciudadLinea = [ciudad, estado, cp].filter(Boolean).join(', ');
  if (ciudadLinea) lineas.push(ciudadLinea);
  if (referencias) lineas.push(referencias);

  if (lineas.length === 0) {
    for (const v of Object.values(obj)) {
      if (typeof v === 'string' && v.trim()) lineas.push(v.trim());
    }
  }

  return lineas;
}
