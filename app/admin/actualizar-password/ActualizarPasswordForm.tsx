'use client';

import { useActionState } from 'react';
import { actualizarPassword, type ActualizarPasswordState } from './actions';

const initialState: ActualizarPasswordState = {};

export function ActualizarPasswordForm() {
  const [state, formAction, pending] = useActionState(actualizarPassword, initialState);

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <input
        type="password"
        name="password"
        required
        minLength={8}
        placeholder="Nueva contraseña"
        style={inputStyle}
      />
      <input
        type="password"
        name="confirmar"
        required
        minLength={8}
        placeholder="Confirma la contraseña"
        style={inputStyle}
      />
      <button
        type="submit"
        disabled={pending}
        style={{
          padding: '12px',
          borderRadius: '999px',
          border: 'none',
          backgroundColor: '#C9A961',
          color: '#020202',
          fontSize: '14px',
          fontWeight: 600,
          cursor: pending ? 'default' : 'pointer',
          opacity: pending ? 0.7 : 1,
        }}
      >
        {pending ? 'Guardando…' : 'Guardar contraseña'}
      </button>
      {state.error && <p style={{ color: '#FF6B6B', fontSize: '13px', margin: 0 }}>{state.error}</p>}
    </form>
  );
}

const inputStyle: React.CSSProperties = {
  padding: '12px 14px',
  borderRadius: '4px',
  border: '1px solid #333',
  backgroundColor: '#111',
  color: '#F5EFE0',
  fontSize: '14px',
};
