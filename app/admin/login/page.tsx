import { LoginForm } from './LoginForm';

export default function AdminLoginPage() {
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
        <h1 style={{ color: '#F5EFE0', fontSize: '20px', marginBottom: '24px', textAlign: 'center' }}>
          Admin · L&rsquo;Hopital Moto
        </h1>
        <LoginForm />
      </div>
    </main>
  );
}
