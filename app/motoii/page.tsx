import type { Metadata } from 'next'
import HeroMotoII from '@/app/components/motoii/HeroMotoII'
import Inicio from '@/app/components/motoii/Inicio'
import Anatomia from '@/app/components/motoii/Anatomia'
import EnLaCarretera from '@/app/components/motoii/EnLaCarretera'
import LaColeccion from '@/app/components/motoii/LaColeccion'
import LaHermandad from '@/app/components/motoii/LaHermandad'
import TiendaCTA from '@/app/components/motoii/TiendaCTA'
import CierreMotoII from '@/app/components/motoii/CierreMotoII'

export const metadata: Metadata = {
  title: 'Moto II por Beeline | Lhopital-moto',
  description:
    'El navegador minimalista para motociclistas. Traza tu ruta. Sigue el camino. Distribuido en México por Lhopital.',
}

export default function MotoIIPage() {
  return (
    <main className="bg-moto-black min-h-screen text-moto-bone">
      <HeroMotoII />
      <Inicio />
      <Anatomia />
      <EnLaCarretera />
      <LaColeccion />
      <LaHermandad />
      <TiendaCTA />
      <CierreMotoII />
    </main>
  )
}