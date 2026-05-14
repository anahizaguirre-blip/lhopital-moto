import EnLaCarretera from "@/app/components/hedon/EnLaCarretera";
import HeroHedon from '../components/hedon/HeroHedon'
import RitualDeSalida from '../components/hedon/RitualDeSalida'
import LaColeccion from "@/app/components/hedon/LaColeccion";
import TiendaCTA from '@/app/components/hedon/TiendaCTA'
import CierreHedon from '@/app/components/hedon/CierreHedon'

export const metadata = {
  title: 'Hedon — Cascos sin compromiso | Lhopital-moto',
  description:
    'Cascos Hedon: diseñados en Londres, curados en México. 4 modelos disponibles con certificación ECE 22.06.',
}

export default function HedonPage() {
  return (
    <main className="bg-hedon-brown">
      <HeroHedon />
      <RitualDeSalida />
        <EnLaCarretera />
        <LaColeccion />
        <TiendaCTA />
        <CierreHedon />
    </main>
  )
}
