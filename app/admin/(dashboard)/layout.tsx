import Link from 'next/link';
import { cerrarSesion } from './actions';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F5EFE0' }}>
      <nav
        style={{
          backgroundColor: '#020202',
          color: '#F5EFE0',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/admin/pedidos" style={{ color: '#F5EFE0', fontSize: '15px', textDecoration: 'none' }}>
          L&rsquo;Hopital Moto · Admin
        </Link>
        <form action={cerrarSesion}>
          <button
            type="submit"
            style={{
              background: 'none',
              border: '1px solid #444',
              color: '#F5EFE0',
              borderRadius: '4px',
              padding: '6px 12px',
              fontSize: '13px',
              cursor: 'pointer',
            }}
          >
            Cerrar sesión
          </button>
        </form>
      </nav>
      <main style={{ padding: '24px', color: '#020202' }}>{children}</main>
    </div>
  );
}
