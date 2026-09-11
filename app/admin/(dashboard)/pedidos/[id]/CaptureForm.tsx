'use client';

import { useActionState } from 'react';
import { capturarEnvio, type CapturarEnvioState } from './actions';

const initialState: CapturarEnvioState = {};

export function CaptureForm({
  orderId,
  paqueteria,
  numeroGuia,
  urlRastreo,
  yaEnviado,
}: {
  orderId: string;
  paqueteria: string | null;
  numeroGuia: string | null;
  urlRastreo: string | null;
  yaEnviado: boolean;
}) {
  const action = capturarEnvio.bind(null, orderId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {yaEnviado && !state.success && (
        <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
          Este pedido ya está marcado como enviado. Guardar aquí actualiza la guía.
        </p>
      )}

      <label style={labelStyle}>
        Paquetería
        <input
          type="text"
          name="paqueteria"
          defaultValue={paqueteria ?? ''}
          placeholder="Estafeta, DHL, FedEx…"
          style={inputStyle}
          required
        />
      </label>

      <label style={labelStyle}>
        Número de guía
        <input
          type="text"
          name="numero_guia"
          defaultValue={numeroGuia ?? ''}
          style={inputStyle}
          required
        />
      </label>

      <label style={labelStyle}>
        Link de rastreo (opcional)
        <input
          type="url"
          name="url_rastreo"
          defaultValue={urlRastreo ?? ''}
          placeholder="https://…"
          style={inputStyle}
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        style={{
          marginTop: '4px',
          padding: '10px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#020202',
          color: '#F5EFE0',
          fontSize: '14px',
          cursor: pending ? 'default' : 'pointer',
          opacity: pending ? 0.7 : 1,
        }}
      >
        {pending ? 'Guardando…' : 'Guardar y enviar correo de rastreo'}
      </button>

      {state.error && <p style={{ color: '#c0392b', fontSize: '13px', margin: 0 }}>{state.error}</p>}
      {state.success && !state.avisoCorreo && (
        <p style={{ color: '#2e7d32', fontSize: '13px', margin: 0 }}>Guardado. Correo de rastreo enviado.</p>
      )}
      {state.success && state.avisoCorreo && (
        <p style={{ color: '#b8860b', fontSize: '13px', margin: 0 }}>{state.avisoCorreo}</p>
      )}
    </form>
  );
}

const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#666' };
const inputStyle: React.CSSProperties = { padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px' };
