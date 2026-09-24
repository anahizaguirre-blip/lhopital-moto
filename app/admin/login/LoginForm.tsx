'use client';

import { useActionState, useState } from 'react';
import { iniciarSesion, solicitarRecuperacion, type LoginState, type RecuperarState } from './actions';

const initialLoginState: LoginState = {};
const initialRecuperarState: RecuperarState = {};

export function LoginForm() {
  const [modo, setModo] = useState<'login' | 'recuperar'>('login');
  const [loginState, loginAction, loginPending] = useActionState(iniciarSesion, initialLoginState);
  const [recState, recAction, recPending] = useActionState(solicitarRecuperacion, initialRecuperarState);

  if (modo === 'recuperar') {
    if (recState.success) {
      return (
        <p style={{ color: '#F5EFE0', textAlign: 'center', fontSize: '14px' }}>
          Te enviamos un link para poner tu contraseña. Revisa tu correo.
        </p>
      );
    }

    return (
      <form action={recAction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input type="email" name="email" required placeholder="tu@correo.com" style={inputStyle} />
        <button type="submit" disabled={recPending} style={buttonStyle(recPending)}>
          {recPending ? 'Enviando…' : 'Enviar link para poner contraseña'}
        </button>
        {recState.error && <p style={errorStyle}>{recState.error}</p>}
        <button type="button" onClick={() => setModo('login')} style={linkStyle}>
          ← Volver a iniciar sesión
        </button>
      </form>
    );
  }

  return (
    <form action={loginAction} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <input type="email" name="email" required placeholder="tu@correo.com" style={inputStyle} />
      <input type="password" name="password" required placeholder="Contraseña" style={inputStyle} />
      <button type="submit" disabled={loginPending} style={buttonStyle(loginPending)}>
        {loginPending ? 'Entrando…' : 'Entrar'}
      </button>
      {loginState.error && <p style={errorStyle}>{loginState.error}</p>}
      <button type="button" onClick={() => setModo('recuperar')} style={linkStyle}>
        ¿Olvidaste tu contraseña o es tu primera vez? Ponla aquí
      </button>
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

function buttonStyle(pending: boolean): React.CSSProperties {
  return {
    padding: '12px',
    borderRadius: '999px',
    border: 'none',
    backgroundColor: '#C9A961',
    color: '#020202',
    fontSize: '14px',
    fontWeight: 600,
    cursor: pending ? 'default' : 'pointer',
    opacity: pending ? 0.7 : 1,
  };
}

const errorStyle: React.CSSProperties = { color: '#FF6B6B', fontSize: '13px', margin: 0 };

const linkStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#F5EFE0',
  opacity: 0.6,
  fontSize: '12px',
  textAlign: 'center',
  cursor: 'pointer',
  textDecoration: 'underline',
  padding: 0,
};
