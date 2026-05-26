import NavbarHome from './components/home/NavbarHome'
import HeroHome from './components/home/HeroHome'
import GaleriaMarcas from './components/home/GaleriaMarcas'
import Eventos from './components/home/Eventos'
import Nosotros from './components/home/Nosotros'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main className="bg-moto-black text-moto-bone">
      {/* El Navbar vive aquí, no dentro del Hero, para que sea fácil de mantener.
          Va en position:absolute encima del video (lo controla el propio Navbar). */}
      <div className="relative">
        <NavbarHome />
        <HeroHome />
      </div>

      <GaleriaMarcas />
      <Eventos />
      <Nosotros />

      <Footer bg="dark" />
    </main>
  )
}
