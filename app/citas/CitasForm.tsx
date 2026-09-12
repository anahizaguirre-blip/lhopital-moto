'use client';

import { useMemo, useState } from 'react';
import { useActionState } from 'react';
import { enviarSolicitudCita, type EnviarSolicitudCitaState } from './actions';
import { BLOQUES, MARCAS_INTERES, MODELOS_HEDON, TALLAS, VENTANA_DIAS, type Bloque, type DisponibilidadPorFecha } from '@/lib/citas';

const initialState: EnviarSolicitudCitaState = {};

const DIAS_SEMANA = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

function toISO(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function CitasForm({ disponibilidad, hoyISO }: { disponibilidad: DisponibilidadPorFecha; hoyISO: string }) {
  const [state, formAction, pending] = useActionState(enviarSolicitudCita, initialState);

  const [marcas, setMarcas] = useState<string[]>([]);
  const [modeloInteres, setModeloInteres] = useState('');
  const [tallaModo, setTallaModo] = useState<'select' | 'ayuda'>('select');
  const [tallaAprox, setTallaAprox] = useState('');
  const [fecha, setFecha] = useState<string | null>(null);
  const [bloque, setBloque] = useState<Bloque | null>(null);

  const hoy = useMemo(() => {
    const d = new Date(`${hoyISO}T00:00:00Z`);
    return d;
  }, [hoyISO]);
  const finVentana = useMemo(() => {
    const d = new Date(hoy);
    d.setUTCDate(d.getUTCDate() + VENTANA_DIAS - 1);
    return d;
  }, [hoy]);

  const mesesEnVentana = useMemo(() => {
    const meses: { year: number; month: number }[] = [];
    const cursor = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), 1));
    const limite = new Date(Date.UTC(finVentana.getUTCFullYear(), finVentana.getUTCMonth(), 1));
    while (cursor <= limite) {
      meses.push({ year: cursor.getUTCFullYear(), month: cursor.getUTCMonth() });
      cursor.setUTCMonth(cursor.getUTCMonth() + 1);
    }
    return meses;
  }, [hoy, finVentana]);

  const [mesIndex, setMesIndex] = useState(0);
  const { year, month } = mesesEnVentana[mesIndex];

  const diasGrid = useMemo(() => {
    const primerDia = new Date(Date.UTC(year, month, 1));
    const diasEnMes = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const offset = primerDia.getUTCDay();
    const celdas: (Date | null)[] = Array(offset).fill(null);
    for (let i = 1; i <= diasEnMes; i++) celdas.push(new Date(Date.UTC(year, month, i)));
    return celdas;
  }, [year, month]);

  const incluyeHedon = marcas.includes('Hedon');

  const bloqueDisponible = (b: Bloque) => (fecha ? disponibilidad[fecha]?.[b] === true : false);

  function toggleMarca(marca: string) {
    setMarcas((prev) => {
      const next = prev.includes(marca) ? prev.filter((m) => m !== marca) : [...prev, marca];
      if (marca === 'Hedon' && prev.includes('Hedon')) {
        setModeloInteres('');
        setTallaAprox('');
      }
      return next;
    });
  }

  function seleccionarFecha(d: Date) {
    const iso = toISO(d);
    if (!disponibilidad[iso]) return;
    const tieneAlgunBloque = disponibilidad[iso].manana || disponibilidad[iso].tarde;
    if (!tieneAlgunBloque) return;
    setFecha(iso);
    setBloque(null);
  }

  if (state.success) {
    return (
      <div className="text-center py-16">
        <p className="font-rider text-2xl md:text-3xl uppercase text-moto-bone mb-4">Recibida.</p>
        <p className="font-cormorant italic text-lg md:text-xl text-moto-bone/70 max-w-md mx-auto">
          Te confirmamos por correo en menos de 24 horas.
          <br />
          Nos vemos en el camino.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-10">
      {/* Contacto */}
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Nombre</span>
          <input name="nombre" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Correo</span>
          <input type="email" name="correo" required className={inputClass} />
        </label>
        <label className="flex flex-col gap-2 sm:col-span-2">
          <span className={labelClass}>Teléfono</span>
          <input type="tel" name="telefono" required className={inputClass} />
        </label>
      </div>

      {/* Interés */}
      <div>
        <span className={`${labelClass} block mb-3`}>¿Qué te interesa ver?</span>
        <div className="flex flex-wrap gap-3">
          {MARCAS_INTERES.map((marca) => {
            const activo = marcas.includes(marca);
            return (
              <button
                type="button"
                key={marca}
                onClick={() => toggleMarca(marca)}
                className={activo ? pillActiveClass : pillClass}
              >
                {marca}
              </button>
            );
          })}
        </div>
        {marcas.map((marca) => (
          <input key={marca} type="hidden" name="marcas_interes" value={marca} />
        ))}
      </div>

      {/* Modelo (solo Hedon) */}
      {incluyeHedon && (
        <label className="flex flex-col gap-2">
          <span className={labelClass}>Modelo</span>
          <select
            name="modelo_interes"
            value={modeloInteres}
            onChange={(e) => setModeloInteres(e.target.value)}
            className={inputClass}
            required
          >
            <option value="" disabled className="bg-moto-black">
              Elige un modelo
            </option>
            {MODELOS_HEDON.map((m) => (
              <option key={m} value={m} className="bg-moto-black">
                {m}
              </option>
            ))}
          </select>
        </label>
      )}

      {/* Talla (solo si hay modelo) */}
      {incluyeHedon && modeloInteres && (
        <div>
          <span className={`${labelClass} block mb-3`}>
            ¿Ya sabes tu talla, o prefieres que te ayudemos a calcularla?
          </span>
          <div className="flex flex-wrap gap-3 mb-3">
            <button
              type="button"
              onClick={() => setTallaModo('select')}
              className={tallaModo === 'select' ? pillActiveClass : pillClass}
            >
              Ya sé mi talla
            </button>
            <button
              type="button"
              onClick={() => {
                setTallaModo('ayuda');
                setTallaAprox('');
              }}
              className={tallaModo === 'ayuda' ? pillActiveClass : pillClass}
            >
              Ayúdenme a calcularla
            </button>
          </div>
          {tallaModo === 'select' && (
            <select
              name="talla_aprox"
              value={tallaAprox}
              onChange={(e) => setTallaAprox(e.target.value)}
              className={inputClass}
              required
            >
              <option value="" disabled className="bg-moto-black">
                Elige tu talla
              </option>
              {TALLAS.map((t) => (
                <option key={t} value={t} className="bg-moto-black">
                  {t}
                </option>
              ))}
            </select>
          )}
        </div>
      )}

      {/* Calendario */}
      <div>
        <span className={`${labelClass} block mb-3`}>Fecha</span>
        <div className="border border-moto-bone/15 rounded-lg p-4 max-w-sm bg-white/[0.02]">
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              disabled={mesIndex === 0}
              onClick={() => setMesIndex((i) => Math.max(0, i - 1))}
              className="px-2 py-1 text-moto-bone disabled:opacity-20"
              aria-label="Mes anterior"
            >
              ←
            </button>
            <span className="font-almaq text-sm tracking-[0.15em] uppercase text-moto-bone">
              {MESES[month]} {year}
            </span>
            <button
              type="button"
              disabled={mesIndex === mesesEnVentana.length - 1}
              onClick={() => setMesIndex((i) => Math.min(mesesEnVentana.length - 1, i + 1))}
              className="px-2 py-1 text-moto-bone disabled:opacity-20"
              aria-label="Mes siguiente"
            >
              →
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1 text-center">
            {DIAS_SEMANA.map((d, i) => (
              <span key={i} className="font-almaq text-xs text-moto-bone/40 py-1">
                {d}
              </span>
            ))}
            {diasGrid.map((d, i) => {
              if (!d) return <span key={i} />;
              const iso = toISO(d);
              const fueraDeVentana = d < hoy || d > finVentana;
              const disp = disponibilidad[iso];
              const habilitado = !fueraDeVentana && disp && (disp.manana || disp.tarde);
              const seleccionado = fecha === iso;
              return (
                <button
                  type="button"
                  key={i}
                  disabled={!habilitado}
                  onClick={() => seleccionarFecha(d)}
                  className={`font-almaq text-base py-2 rounded-md transition-colors ${
                    seleccionado
                      ? 'bg-brass text-moto-black font-bold'
                      : habilitado
                        ? 'text-moto-bone hover:bg-moto-bone/10'
                        : 'text-moto-bone/20 cursor-not-allowed'
                  }`}
                >
                  {d.getUTCDate()}
                </button>
              );
            })}
          </div>
        </div>
        <input type="hidden" name="fecha" value={fecha ?? ''} />
      </div>

      {/* Bloque */}
      {fecha && (
        <div>
          <span className={`${labelClass} block mb-3`}>Horario</span>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(BLOQUES) as Bloque[]).map((b) => {
              const disponible = bloqueDisponible(b);
              return (
                <label
                  key={b}
                  className={
                    !disponible
                      ? `${pillClass} opacity-30 cursor-not-allowed`
                      : bloque === b
                        ? pillActiveClass
                        : pillClass
                  }
                >
                  <input
                    type="radio"
                    name="bloque"
                    value={b}
                    disabled={!disponible}
                    checked={bloque === b}
                    onChange={() => setBloque(b)}
                    className="sr-only"
                    required
                  />
                  {BLOQUES[b].label}
                </label>
              );
            })}
          </div>
        </div>
      )}

      {state.error && <p className="text-base text-moto-signal font-almaq">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full sm:w-auto px-10 py-4 rounded-full bg-brass text-moto-black font-almaq text-base tracking-[0.15em] uppercase disabled:opacity-60 hover:opacity-90 transition-opacity"
      >
        {pending ? 'Enviando…' : 'Enviar solicitud'}
      </button>
    </form>
  );
}

const labelClass = 'font-almaq text-xs tracking-[0.2em] uppercase text-moto-bone/50';

const inputClass =
  'font-almaq text-base border border-moto-bone/25 rounded-md px-4 py-3.5 bg-white/5 text-moto-bone placeholder:text-moto-bone/30 focus:outline-none focus:border-brass';

const pillClass =
  'px-5 py-2.5 rounded-full text-base font-almaq tracking-wide border cursor-pointer text-moto-bone border-moto-bone/25 hover:border-moto-bone/60 transition-colors';

const pillActiveClass =
  'px-5 py-2.5 rounded-full text-base font-almaq tracking-wide border cursor-pointer bg-brass text-moto-black border-brass transition-colors';
