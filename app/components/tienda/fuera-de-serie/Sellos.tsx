import type { MotivoUnico } from '@/lib/types';
import {
  SELLO_MOTIVO,
  AVISO_ELECTRICO_INTRO,
  AVISO_ELECTRICO_FUERTE,
} from '@/lib/fuera-de-serie';

/** Sello latón por motivo de pieza Fuera de Serie. */
export function SelloMotivo({ motivo, conMicro = true }: { motivo: MotivoUnico; conMicro?: boolean }) {
  const s = SELLO_MOTIVO[motivo];
  return (
    <div>
      <span className="inline-block border border-[#C9A961]/60 text-[#C9A961] px-2.5 py-1 text-[10px] tracking-[0.22em] uppercase">
        {s.sello}
      </span>
      {conMicro && s.micro && (
        <p className="mt-1.5 text-[11px] leading-snug text-[#F4F1EC]/55">{s.micro}</p>
      )}
    </div>
  );
}

/** Sello de pieza vendida. */
export function SelloVendida() {
  return (
    <span className="inline-block border border-[#F4F1EC]/50 text-[#F4F1EC] px-2.5 py-1 text-[10px] tracking-[0.22em] uppercase">
      Encontró dueño
    </span>
  );
}

/** Aviso obligatorio y visible del Edenist (NTA 8776). */
export function AvisoElectrico({ className = '' }: { className?: string }) {
  return (
    <p
      role="note"
      className={`border-l-2 border-[#C9A961] bg-[#C9A961]/10 px-3 py-2 text-[12px] leading-relaxed text-[#F4F1EC]/85 ${className}`}
    >
      {AVISO_ELECTRICO_INTRO}
      <strong className="font-semibold text-[#F4F1EC]">{AVISO_ELECTRICO_FUERTE}</strong>
    </p>
  );
}

/** Texto editorial del Hedonist × DGR 2026 (sección 3.2 del brief). */
export function TextoDGR({ conTitulo = true }: { conTitulo?: boolean }) {
  return (
    <div className="max-w-xl">
      {conTitulo && (
        <h2 className="font-cormorant italic text-4xl md:text-5xl text-[#F4F1EC] leading-[1] mb-6">
          Hedonist × DGR 2026
        </h2>
      )}
      <p className="font-cormorant italic text-xl md:text-2xl text-[#C9A961] leading-snug mb-5">
        Una vez al año, motociclistas de todo el mundo se ponen traje y salen a rodar en motos
        clásicas por la salud de los hombres. Es The Distinguished Gentleman’s Ride, y Hedon es su
        casco oficial desde hace más de una década.
      </p>
      <p className="text-[15px] leading-relaxed text-[#F4F1EC]/75 mb-5">
        Cada año diseñan juntos un Hedonist que solo existe durante una ventana breve antes de la
        rodada. El de 2026 es la edición del 15 aniversario. La venta cerró en mayo y no se volverá
        a fabricar.
      </p>
      <p className="text-[13px] tracking-[0.12em] uppercase text-[#F4F1EC] font-medium">
        Talla XL · ECE 22.06 · Una sola pieza.
      </p>
    </div>
  );
}
