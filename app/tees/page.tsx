import HeroTees from "@/app/components/tees/HeroTees";
import ElOrigen from "@/app/components/tees/ElOrigen";
import EnLaRuta from "@/app/components/tees/EnLaRuta";
import LaColeccion from "@/app/components/tees/LaColeccion";
import Anatomia from "@/app/components/tees/Anatomia";
import FranjaConfianza from "@/app/components/tees/FranjaConfianza";

export default function TeesPage() {
  return (
    <main>
      <HeroTees />
      <ElOrigen />
      <EnLaRuta />
      <LaColeccion />
      <Anatomia />
      <FranjaConfianza />
    </main>
  );
}