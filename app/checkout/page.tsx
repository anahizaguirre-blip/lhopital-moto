import type { Metadata } from 'next';
import Footer from '@/app/components/Footer';
import { pagosEnLineaActivos } from '@/lib/pagos-estado';
import { CheckoutCliente } from './CheckoutCliente';

export const metadata: Metadata = {
  title: 'Checkout · Lhopital-moto',
  robots: { index: false },
};

// Lee el interruptor de pagos en cada visita
export const dynamic = 'force-dynamic';

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F1EC]">
      <CheckoutCliente pagosActivos={pagosEnLineaActivos()} />
      <Footer bg="dark" />
    </main>
  );
}
