/**
 * Diagnóstico TEMPORAL de Mercado Pago (solo admins: lo protege el middleware de /admin).
 *
 * Prueba la llave de Vercel (MP_ACCESS_TOKEN) sin cobrar nada:
 *  1. ¿De qué cuenta es la llave?
 *  2. Pedido vacío a la API de Orders y a la de Payments.
 *  3. Pedido completo con un token de tarjeta falso (no puede cobrar).
 * Nunca muestra la llave. Borrar esta página cuando se resuelva el cobro.
 */
import { randomUUID } from 'crypto';
import { mpAccessToken, mpPublicKey } from '@/lib/mp-config';

export const dynamic = 'force-dynamic';

type Prueba = { nombre: string; esperado: string; status: number | string; respuesta: string };

async function llamar(url: string, init: RequestInit): Promise<{ status: number | string; body: unknown }> {
  try {
    const res = await fetch(url, { ...init, cache: 'no-store' });
    const body = await res.json().catch(() => null);
    return { status: res.status, body };
  } catch (e) {
    return { status: 'error de red', body: e instanceof Error ? e.message : String(e) };
  }
}

function resumen(body: unknown): string {
  const s = JSON.stringify(body) ?? '';
  return s.length > 600 ? s.slice(0, 600) + '…' : s;
}

export default async function DiagnosticoMP() {
  const token = mpAccessToken();
  const pk = mpPublicKey();
  const pruebas: Prueba[] = [];
  let cuenta = 'sin llave configurada';

  if (token) {
    const headers = (extra: Record<string, string> = {}) => ({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...extra,
    });

    const me = await llamar('https://api.mercadopago.com/users/me', { headers: headers() });
    const u = me.body as Record<string, unknown> | null;
    cuenta = me.status === 200 && u
      ? `id ${u.id} · ${u.nickname} · ${u.site_id} · tags: ${(u.tags as string[] | undefined)?.join(', ')}`
      : `status ${me.status}: ${resumen(me.body)}`;

    const vacioOrders = await llamar('https://api.mercadopago.com/v1/orders', {
      method: 'POST', headers: headers({ 'X-Idempotency-Key': randomUUID() }), body: '{}',
    });
    pruebas.push({ nombre: 'Orders API · pedido vacío', esperado: '400 = hay permiso · 403 = bloqueado', status: vacioOrders.status, respuesta: resumen(vacioOrders.body) });

    const vacioPayments = await llamar('https://api.mercadopago.com/v1/payments', {
      method: 'POST', headers: headers({ 'X-Idempotency-Key': randomUUID() }), body: '{}',
    });
    pruebas.push({ nombre: 'Payments API · pago vacío', esperado: '400 = hay permiso · 403 = bloqueado', status: vacioPayments.status, respuesta: resumen(vacioPayments.body) });

    const tarjetaFalsa = await llamar('https://api.mercadopago.com/v1/orders', {
      method: 'POST',
      headers: headers({ 'X-Idempotency-Key': randomUUID() }),
      body: JSON.stringify({
        type: 'online',
        processing_mode: 'automatic',
        total_amount: '10.00',
        external_reference: `diagnostico-${Date.now()}`,
        payer: { email: 'diagnostico@example.com' },
        transactions: {
          payments: [{ amount: '10.00', payment_method: { id: 'visa', type: 'credit_card', token: '00000000000000000000000000000000', installments: 1 } }],
        },
      }),
    });
    pruebas.push({ nombre: 'Orders API · tarjeta falsa ($10, no cobra)', esperado: '402/400 con invalid_card_token = hay permiso (queda un pedido fallido, sin cargo) · 403 = bloqueado', status: tarjetaFalsa.status, respuesta: resumen(tarjetaFalsa.body) });
  }

  const celda = { border: '1px solid #ccc', padding: '8px', verticalAlign: 'top' as const, fontSize: '13px' };
  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif', color: '#111' }}>
      <h1 style={{ fontSize: 20, marginBottom: 12 }}>Diagnóstico Mercado Pago (temporal)</h1>
      <p style={{ fontSize: 14 }}><strong>Ambiente:</strong> {process.env.VERCEL_ENV ?? 'local'}</p>
      <p style={{ fontSize: 14 }}><strong>Llave pública:</strong> {pk ? `${pk.slice(0, 12)}…${pk.slice(-5)}` : 'no configurada'}</p>
      <p style={{ fontSize: 14 }}><strong>Llave secreta:</strong> {token ? `configurada (empieza con ${token.slice(0, 8)}, ${token.length} caracteres)` : 'NO configurada'}</p>
      <p style={{ fontSize: 14, marginBottom: 16 }}><strong>Cuenta de la llave:</strong> {cuenta}</p>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>{['Prueba', 'Qué significa', 'Status', 'Respuesta de MP'].map((h) => <th key={h} style={{ ...celda, textAlign: 'left', background: '#eee' }}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {pruebas.map((p) => (
            <tr key={p.nombre}>
              <td style={celda}>{p.nombre}</td>
              <td style={celda}>{p.esperado}</td>
              <td style={{ ...celda, fontWeight: 700 }}>{p.status}</td>
              <td style={{ ...celda, fontFamily: 'monospace', wordBreak: 'break-all' }}>{p.respuesta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
