import { ActualizarPasswordForm } from './ActualizarPasswordForm';

export default function ActualizarPasswordPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#020202',
      }}
    >
      <div style={{ width: '100%', maxWidth: '360px', padding: '24px' }}>
        <h1 style={{ color: '#F5EFE0', fontSize: '20px', marginBottom: '8px', textAlign: 'center' }}>
          Pon tu contraseña
        </h1>
        <p style={{ color: '#F5EFE0', opacity: 0.6, fontSize: '13px', marginBottom: '24px', textAlign: 'center' }}>
          La vas a usar para entrar a /admin de ahora en adelante.
        </p>
        <ActualizarPasswordForm />
      </div>
    </main>
  );
}
