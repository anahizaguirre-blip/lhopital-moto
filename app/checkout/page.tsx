import type { Metadata } from 'next';
import Footer from '@/app/components/Footer';
import { CheckoutCliente } from './CheckoutCliente';

export const metadata: Metadata = {
  title: 'Checkout · Lhopital-moto',
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F1EC]">
      <CheckoutCliente />
      <Footer bg="dark" />
    </main>
  );
}
