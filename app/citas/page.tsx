import { createSupabaseAdmin } from '@/lib/supabase/admin';
import { getDisponibilidad, VENTANA_DIAS, toISODate } from '@/lib/citas';
import { CitasForm } from './CitasForm';
import Footer from '@/app/components/Footer';

export const metadata = {
  title: 'Haz una cita · Showroom Lhopital Moto',
  description: 'Agenda tu visita al showroom para probarte cascos Hedon y ver Moto II / Tees antes de comprar.',
};

export const revalidate = 0;

export default async function CitasPage() {
  const supabase = createSupabaseAdmin();
  const hoy = new Date();
  hoy.setUTCHours(0, 0, 0, 0);
  const fin = new Date(hoy);
  fin.setUTCDate(fin.getUTCDate() + VENTANA_DIAS - 1);

  const { disponibilidad } = await getDisponibilidad(supabase, hoy, fin);

  return (
    <main className="min-h-screen bg-moto-black">
      <div className="w-full max-w-2xl mx-auto px-6 pt-32 pb-24">
        <p className="font-almaq text-brass text-xs md:text-sm tracking-[0.35em] uppercase mb-3">Showroom</p>
        <h1 className="font-rider text-moto-bone text-4xl sm:text-5xl uppercase leading-[0.9] mb-4">
          Cuéntanos qué{' '}
          <span className="font-cormorant italic lowercase text-brass tracking-wide">quieres probarte.</span>
        </h1>
        <p className="font-cormorant italic text-moto-bone/60 text-lg md:text-xl max-w-lg mb-12">
          El showroom es por cita. Así nos aseguramos de tener listo justo lo que quieres ver, en tu talla.
        </p>

        <CitasForm disponibilidad={disponibilidad} hoyISO={toISODate(hoy)} />
      </div>

      <Footer bg="dark" />
    </main>
  );
}
