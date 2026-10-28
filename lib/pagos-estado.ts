/**
 * Interruptor del cobro en línea — solo servidor.
 *
 * Mientras Mercado Pago no habilite la cuenta, la tienda funciona "sin
 * cobro": el checkout crea el pedido y el cliente lo termina por WhatsApp.
 * Para activar el pago con tarjeta: en Vercel (Production) agregar
 * PAGOS_EN_LINEA=activo y volver a desplegar.
 */
export function pagosEnLineaActivos(): boolean {
  return process.env.PAGOS_EN_LINEA === 'activo';
}
