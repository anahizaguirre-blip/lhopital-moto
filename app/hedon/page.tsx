import EnLaCarretera from "@/app/components/hedon/EnLaCarretera";
import HeroHedon from '../components/hedon/HeroHedon'
import RitualDeSalida from '../components/hedon/RitualDeSalida'
import LaColeccion from "@/app/components/hedon/LaColeccion";
import TiendaCTA from '@/app/components/hedon/TiendaCTA'
import CierreHedon from '@/app/components/hedon/CierreHedon'
import Anatomia from '@/app/components/hedon/Anatomia'
import FranjaConfianza from '@/app/components/hedon/FranjaConfianza'
import LaHermandad from '@/app/components/hedon/LaHermandad'
import Footer from "@/app/components/Footer";
import FranjaFueraDeSerie from '@/app/components/hedon/FranjaFueraDeSerie'

// La franja Fuera de Serie depende del stock en vivo
export const revalidate = 60;

export const metadata = {
  title: 'Hedon — Cascos sin compromiso | Lhopital-moto',
  description:
    'Cascos Hedon: diseñados en Londres, curados en México. Certificación ECE 22.06; Psilo Explorer con doble certificación ECE 22.06 y DOT.',
}

export default function HedonPage() {
  return (
    <main className="bg-hedon-brown">
      <HeroHedon />
      <RitualDeSalida />
        <EnLaCarretera />
        <LaColeccion />
        <FranjaFueraDeSerie />
        <Anatomia />
        <FranjaConfianza />
        <LaHermandad />
        <TiendaCTA />
        <CierreHedon />
        <Footer bg="hedon" />
    </main>
  )
}
