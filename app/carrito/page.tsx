import type { Metadata } from 'next';
import Footer from '@/app/components/Footer';
import { CarritoCliente } from './CarritoCliente';

export const metadata: Metadata = {
  title: 'Carrito · Lhopital-moto',
  robots: { index: false },
};

export default function CarritoPage() {
  return (
    <main className="min-h-screen bg-[#0A0A0A] text-[#F4F1EC]">
      <CarritoCliente />
      <Footer bg="dark" />
    </main>
  );
}
