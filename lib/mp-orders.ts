/**
 * Cliente mínimo de la API de Orders de Mercado Pago (Checkout API).
 * Docs: /developers/es/docs/checkout-api-orders
 *
 * Solo servidor. Nunca registrar el token de tarjeta ni datos del pagador.
 */

import { mpAccessToken } from '@/lib/mp-config';

const API = 'https://api.mercadopago.com/v1/orders';

export interface PagoMP {
  id?: string;
  status?: string;
  status_detail?: string;
  amount?: string;
  paid_amount?: string;
  payment_method?: { id?: string; type?: string; installments?: number };
}

export interface OrdenMP {
  id?: string;
  status?: string;
  status_detail?: string;
  external_reference?: string;
  total_amount?: string;
  total_paid_amount?: string;
  transactions?: { payments?: PagoMP[] };
}

export type ResultadoMP = 'approved' | 'pending' | 'rejected';

export interface RespuestaMP {
  ok: boolean;
  httpStatus: number;
  orden: OrdenMP | null;
  pago: PagoMP | null;
  resultado: ResultadoMP;
  detalle: string | null;
}

function token(): string {
  const t = mpAccessToken();
  if (!t) throw new Error('Falta MP_ACCESS_TOKEN');
  return t;
}

const dosDecimales = (n: number) => n.toFixed(2);

/** Clasifica una order de MP en aprobada / pendiente / rechazada. */
export function clasificarOrden(orden: OrdenMP | null): { resultado: ResultadoMP; detalle: string | null } {
  const pago = orden?.transactions?.payments?.[0];
  const status = orden?.status;
  const detalle = pago?.status_detail ?? orden?.status_detail ?? null;

  if (status === 'processed' && (orden?.status_detail === 'accredited' || pago?.status_detail === 'accredited')) {
    return { resultado: 'approved', detalle };
  }
  if (status === 'processing' || status === 'action_required') {
    return { resultado: 'pending', detalle };
  }
  return { resultado: 'rejected', detalle };
}

export async function crearOrdenTarjeta(params: {
  ordenId: string;
  total: number;
  email: string;
  cardToken: string;
  paymentMethodId: string;
  paymentType: 'credit_card' | 'debit_card';
  installments: number;
  idempotencyKey: string;
}): Promise<RespuestaMP> {
  const monto = dosDecimales(params.total);
  const res = await fetch(API, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token()}`,
      'Content-Type': 'application/json',
      'X-Idempotency-Key': params.idempotencyKey,
    },
    body: JSON.stringify({
      type: 'online',
      processing_mode: 'automatic',
      total_amount: monto,
      external_reference: params.ordenId,
      payer: { email: params.email },
      transactions: {
        payments: [
          {
            amount: monto,
            payment_method: {
              id: params.paymentMethodId,
              type: params.paymentType,
              token: params.cardToken,
              installments: params.installments,
            },
          },
        ],
      },
    }),
    cache: 'no-store',
  });

  const body = (await res.json().catch(() => null)) as
    | (OrdenMP & { errors?: { code?: string; details?: string[] }[]; data?: OrdenMP })
    | null;
  // Aprobado: la order viene en el cuerpo. Rechazado (402): { errors, data: order }.
  const orden = body?.id ? body : body?.data?.id ? body.data : null;
  if (!res.ok && body?.errors) {
    // Solo códigos y motivos (p. ej. "PAY…: insufficient_amount"), nunca el token.
    console.info('[mp] rechazo', res.status, JSON.stringify(body.errors.map((e) => ({ code: e.code, details: e.details }))));
  }
  const { resultado, detalle } = clasificarOrden(orden);

  return {
    ok: res.ok,
    httpStatus: res.status,
    orden,
    pago: orden?.transactions?.payments?.[0] ?? null,
    resultado: orden ? resultado : 'rejected',
    detalle: orden ? detalle : `http_${res.status}`,
  };
}

export async function obtenerOrden(mpOrderId: string): Promise<OrdenMP | null> {
  const res = await fetch(`${API}/${encodeURIComponent(mpOrderId)}`, {
    headers: { Authorization: `Bearer ${token()}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return (await res.json()) as OrdenMP;
}

/** Mensaje para el comprador según el motivo de rechazo. */
export function mensajeRechazo(detalle: string | null): string {
  switch (detalle) {
    case 'insufficient_amount':
      return 'Tu tarjeta no tiene fondos suficientes. Intenta con otra tarjeta.';
    case 'bad_filled_card_data':
    case 'bad_filled_security_code':
    case 'bad_filled_date':
    case 'bad_filled_other':
      return 'Revisa los datos de la tarjeta (número, vencimiento y código de seguridad) e intenta de nuevo.';
    case 'required_call_for_authorize':
    case 'call_for_authorize':
      return 'Tu banco necesita que autorices este pago. Llámales y vuelve a intentarlo, o usa otra tarjeta.';
    case 'card_disabled':
      return 'Tu tarjeta está desactivada. Comunícate con tu banco o usa otra tarjeta.';
    case 'invalid_installments':
      return 'Tu tarjeta no acepta esta forma de pago. Intenta con otra tarjeta.';
    case 'max_attempts_exceeded':
      return 'Llegaste al límite de intentos con esta tarjeta. Usa otra tarjeta.';
    case 'cc_rejected_duplicated_payment':
    case 'duplicated_payment':
      return 'Parece que ya hiciste un pago igual hace un momento. Revisa tu correo antes de volver a intentar.';
    case 'high_risk':
    case 'rejected_by_issuer':
    case 'cc_rejected_other_reason':
    default:
      return 'Tu banco rechazó el pago. Intenta con otra tarjeta. No se hizo ningún cargo.';
  }
}
