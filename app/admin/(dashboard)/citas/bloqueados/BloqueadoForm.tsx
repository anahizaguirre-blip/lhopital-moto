'use client';

import { useActionState } from 'react';
import { agregarDiaBloqueado, type DiaBloqueadoState } from './actions';

const initialState: DiaBloqueadoState = {};

export function BloqueadoForm() {
  const [state, formAction, pending] = useActionState(agregarDiaBloqueado, initialState);

  return (
    <form action={formAction} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '20px' }}>
      <label style={labelStyle}>
        Fecha
        <input type="date" name="fecha" required style={inputStyle} />
      </label>
      <label style={{ ...labelStyle, flex: 1, minWidth: '200px' }}>
        Motivo (opcional, interno)
        <input type="text" name="motivo" placeholder="Expo CDMX" style={inputStyle} />
      </label>
      <button
        type="submit"
        disabled={pending}
        style={{
          padding: '10px 20px',
          borderRadius: '4px',
          border: 'none',
          backgroundColor: '#020202',
          color: '#F5EFE0',
          fontSize: '14px',
          cursor: pending ? 'default' : 'pointer',
          opacity: pending ? 0.7 : 1,
        }}
      >
        {pending ? 'Agregando…' : 'Bloquear fecha'}
      </button>
      {state.error && <p style={{ color: '#c0392b', fontSize: '13px', margin: 0, width: '100%' }}>{state.error}</p>}
    </form>
  );
}

const labelStyle: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '12px', color: '#666' };
const inputStyle: React.CSSProperties = { padding: '10px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '14px' };
