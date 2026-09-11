'use client';

import { useActionState } from 'react';
import { enviarMagicLink, type EnviarMagicLinkState } from './actions';

const initialState: EnviarMagicLinkState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(enviarMagicLink, initialState);

  if (state.success) {
    return (
      <p style={{ color: '#F5EFE0', textAlign: 'center', fontSize: '14px' }}>
        Te enviamos un link de acceso. Revisa tu correo.
      </p>
    );
  }

  return (
    <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <input
        type="email"
        name="email"
        required
        placeholder="tu@correo.com"
        style={{
          padding: '12px 14px',
          borderRadius: '4px',
          border: '1px solid #333',
          backgroundColor: '#111',
          color: '#F5EFE0',
          fontSize: '14px',
        }}
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
        {pending ? 'Enviando…' : 'Enviar link de acceso'}
      </button>
      {state.error && (
        <p style={{ color: '#FF6B6B', fontSize: '13px', margin: 0 }}>{state.error}</p>
      )}
    </form>
  );
}
