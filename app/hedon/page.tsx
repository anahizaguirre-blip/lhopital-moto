import HeroHedon from '../components/hedon/HeroHedon'
import RitualDeSalida from '../components/hedon/RitualDeSalida'

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
      {/* Próximas secciones:
          <EnLaCarretera />
          <CuatroModelos />
          <Tienda />
          <CierreBelstaff />
      */}
    </main>
  )
}
