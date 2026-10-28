'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { CheckoutSchema, ESTADOS_MX } from '@/lib/checkout-schema';
import { costoEnvio, formatoMXN, SHOWROOM, ETIQUETA_DISPONIBILIDAD, type MetodoEntrega } from '@/lib/venta';
import { LEGAL_RUTAS } from '@/lib/legal-rutas';
import type { LineaResuelta } from '@/lib/carrito-server';

type Errores = Record<string, string>;

interface ErrorProducto {
  sku: string;
  nombre: string;
  mensaje: string;
}

const DIRECCION_VACIA = { calle: '', colonia: '', cp: '', alcaldia: '', ciudad: '', estado: '', referencias: '' };

export function CheckoutCliente({ pagosActivos }: { pagosActivos: boolean }) {
  const router = useRouter();
  const { items, hydrated } = useCart();

  const [lineas, setLineas] = useState<Record<string, LineaResuelta>>({});
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(false);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [metodo, setMetodo] = useState<MetodoEntrega | ''>('');
  const [direccion, setDireccion] = useState(DIRECCION_VACIA);
  const [acepto, setAcepto] = useState(false);

  const [errores, setErrores] = useState<Errores>({});
  const [errorGeneral, setErrorGeneral] = useState<string | null>(null);
  const [erroresProducto, setErroresProducto] = useState<ErrorProducto[]>([]);
  const [enviando, setEnviando] = useState(false);

  const claveSkus = useMemo(() => items.map((i) => i.sku).sort().join('|'), [items]);

  useEffect(() => {
    if (!hydrated) return;
    if (!claveSkus) {
      setCargando(false);
      return;
    }
    let cancelado = false;
    setCargando(true);
    fetch('/api/carrito', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ skus: claveSkus.split('|') }),
    })
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then((d: { lineas: Record<string, LineaResuelta> }) => {
        if (!cancelado) {
          setLineas(d.lineas);
          setErrorCarga(false);
        }
      })
      .catch(() => !cancelado && setErrorCarga(true))
      .finally(() => !cancelado && setCargando(false));
    return () => {
      cancelado = true;
    };
  }, [claveSkus, hydrated]);

  const filas = items
    .map((item) => ({ item, linea: lineas[item.sku] }))
    .filter((f): f is { item: typeof f.item; linea: LineaResuelta } => Boolean(f.linea));
  const carritoConProblemas =
    filas.length !== items.length ||
    filas.some((f) => f.linea.disponibilidad === 'no_disponible' || f.item.qty > f.linea.maxCantidad);

  const subtotal = filas.reduce((s, f) => s + f.linea.precio * f.item.qty, 0);
  const envio = metodo ? costoEnvio(metodo, filas.map((f) => f.linea)) : null;
  const total = subtotal + (envio ?? 0);

  const setDir = (campo: keyof typeof DIRECCION_VACIA, valor: string) =>
    setDireccion((d) => ({ ...d, [campo]: valor }));

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (enviando) return;
    setErrorGeneral(null);
    setErroresProducto([]);

    const payload = {
      nombre,
      email,
      telefono,
      metodo,
      direccion: metodo === 'envio' ? direccion : undefined,
      acepto,
      items: items.map((i) => ({ sku: i.sku, qty: i.qty })),
    };

    const check = CheckoutSchema.safeParse(payload);
    if (!check.success) {
      const errs: Errores = {};
      for (const issue of check.error.issues) {
        const clave = issue.path.join('.');
        if (!errs[clave]) errs[clave] = issue.message;
      }
      setErrores(errs);
      document.querySelector('[aria-invalid="true"]')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
      return;
    }
    setErrores({});
    setEnviando(true);

    try {
      const r = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await r.json().catch(() => ({}));
      if (r.ok && data.orden) {
        router.push(`/checkout/pago?orden=${encodeURIComponent(data.orden)}`);
        return;
      }
      if (r.status === 409 && Array.isArray(data.productos)) setErroresProducto(data.productos);
      setErrorGeneral(data.error ?? 'No pudimos crear tu pedido. Intenta de nuevo.');
    } catch {
      setErrorGeneral('Sin conexión. Revisa tu internet e intenta de nuevo.');
    }
    setEnviando(false);
  }

  // ─── Estados previos al formulario ───────────────────────────────────────

  if (!hydrated || (cargando && filas.length === 0 && items.length > 0)) {
    return (
      <Marco>
        <p className="font-inter text-[15px] text-[#F4F1EC]/55">Cargando tu pedido…</p>
      </Marco>
    );
  }

  if (items.length === 0) {
    return (
      <Marco>
        <p className="font-inter text-[17px] text-[#F4F1EC]/75 mb-6">Tu carrito está vacío.</p>
        <Link href="/tienda" className="font-inter text-[15px] text-[#C9A961] underline underline-offset-4">
          Ir a la tienda
        </Link>
      </Marco>
    );
  }

  if (errorCarga) {
    return (
      <Marco>
        <p className="font-inter text-[15px] text-red-200">
          No pudimos cargar precios y existencias. Recarga la página para intentar de nuevo.
        </p>
      </Marco>
    );
  }

  if (carritoConProblemas) {
    return (
      <Marco>
        <p className="font-inter text-[17px] text-[#F4F1EC]/80 mb-6 max-w-xl">
          Algunos productos de tu carrito cambiaron de disponibilidad. Revísalo antes de continuar.
        </p>
        <Link
          href="/carrito"
          className="inline-block bg-[#F4F1EC] text-[#0A0A0A] px-8 py-4 font-sora font-bold text-[13px] tracking-[0.1em] uppercase hover:bg-[#C9A961] transition"
        >
          Revisar carrito
        </Link>
      </Marco>
    );
  }

  // ─── Formulario ──────────────────────────────────────────────────────────

  return (
    <Marco>
      <form onSubmit={enviar} noValidate className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-10 lg:gap-16 items-start">
        <div className="space-y-12 min-w-0">
          {/* A. Contacto */}
          <Bloque titulo="Contacto" numero="01">
            <Campo id="nombre" label="Nombre completo" error={errores.nombre}>
              <input
                id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)}
                autoComplete="name" className={claseInput(errores.nombre)} aria-invalid={!!errores.nombre}
              />
            </Campo>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Campo id="email" label="Correo electrónico" error={errores.email}>
                <input
                  id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email" inputMode="email" className={claseInput(errores.email)} aria-invalid={!!errores.email}
                />
              </Campo>
              <Campo id="telefono" label="Teléfono (10 dígitos)" error={errores.telefono}>
                <input
                  id="telefono" type="tel" value={telefono} onChange={(e) => setTelefono(e.target.value)}
                  autoComplete="tel-national" inputMode="tel" maxLength={16}
                  className={claseInput(errores.telefono)} aria-invalid={!!errores.telefono}
                />
              </Campo>
            </div>
          </Bloque>

          {/* B. Entrega */}
          <Bloque titulo="Entrega" numero="02">
            <fieldset>
              <legend className="sr-only">Método de entrega</legend>
              <div role="radiogroup" aria-label="Método de entrega" className="grid grid-cols-1 sm:grid-cols-2 gap-3" aria-invalid={!!errores.metodo}>
                <OpcionEntrega
                  activa={metodo === 'envio'} onClick={() => setMetodo('envio')}
                  titulo="Envío a domicilio"
                  detalle={filas.some((f) => f.linea.esCasco) ? '$400 MXN · incluye casco' : '$200 MXN'}
                />
                <OpcionEntrega
                  activa={metodo === 'recoleccion'} onClick={() => setMetodo('recoleccion')}
                  titulo="Recoger en showroom" detalle="Gratis · CDMX"
                />
              </div>
              {errores.metodo && <MensajeError texto={errores.metodo} />}
            </fieldset>

            {metodo === 'envio' && (
              <div className="space-y-5 pt-2">
                <Campo id="calle" label="Calle y número" error={errores['direccion.calle']}>
                  <input id="calle" value={direccion.calle} onChange={(e) => setDir('calle', e.target.value)}
                    autoComplete="address-line1" className={claseInput(errores['direccion.calle'])} aria-invalid={!!errores['direccion.calle']} />
                </Campo>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px] gap-5">
                  <Campo id="colonia" label="Colonia" error={errores['direccion.colonia']}>
                    <input id="colonia" value={direccion.colonia} onChange={(e) => setDir('colonia', e.target.value)}
                      autoComplete="address-line2" className={claseInput(errores['direccion.colonia'])} aria-invalid={!!errores['direccion.colonia']} />
                  </Campo>
                  <Campo id="cp" label="Código postal" error={errores['direccion.cp']}>
                    <input id="cp" value={direccion.cp} onChange={(e) => setDir('cp', e.target.value.replace(/\D/g, '').slice(0, 5))}
                      autoComplete="postal-code" inputMode="numeric" className={claseInput(errores['direccion.cp'])} aria-invalid={!!errores['direccion.cp']} />
                  </Campo>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Campo id="alcaldia" label="Alcaldía o municipio" error={errores['direccion.alcaldia']}>
                    <input id="alcaldia" value={direccion.alcaldia} onChange={(e) => setDir('alcaldia', e.target.value)}
                      autoComplete="address-level3" className={claseInput(errores['direccion.alcaldia'])} aria-invalid={!!errores['direccion.alcaldia']} />
                  </Campo>
                  <Campo id="ciudad" label="Ciudad" error={errores['direccion.ciudad']}>
                    <input id="ciudad" value={direccion.ciudad} onChange={(e) => setDir('ciudad', e.target.value)}
                      autoComplete="address-level2" className={claseInput(errores['direccion.ciudad'])} aria-invalid={!!errores['direccion.ciudad']} />
                  </Campo>
                </div>
                <Campo id="estado" label="Estado" error={errores['direccion.estado']}>
                  <select id="estado" value={direccion.estado} onChange={(e) => setDir('estado', e.target.value)}
                    autoComplete="address-level1" className={claseInput(errores['direccion.estado'])} aria-invalid={!!errores['direccion.estado']}>
                    <option value="">Elige un estado</option>
                    {ESTADOS_MX.map((e) => (
                      <option key={e} value={e}>{e}</option>
                    ))}
                  </select>
                </Campo>
                <Campo id="referencias" label="Referencias (opcional)" error={errores['direccion.referencias']}>
                  <textarea id="referencias" value={direccion.referencias} onChange={(e) => setDir('referencias', e.target.value)}
                    rows={2} placeholder="Entre calles, color de fachada, indicaciones para la paquetería"
                    className={`${claseInput(errores['direccion.referencias'])} resize-y`} />
                </Campo>
              </div>
            )}

            {metodo === 'recoleccion' && (
              <div className="border border-[#F4F1EC]/12 p-5 font-inter text-[15px] leading-relaxed space-y-2">
                <p className="text-[#F4F1EC]">{SHOWROOM.direccion}</p>
                <p className="text-[#F4F1EC]/70">
                  {SHOWROOM.horario[0]}
                  <br />
                  {SHOWROOM.horario[1]} ·{' '}
                  {/* Pestaña nueva para no perder lo capturado en el checkout */}
                  <a
                    href={SHOWROOM.citasHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C9A961] underline underline-offset-4 hover:text-[#F4F1EC] transition"
                  >
                    previa cita
                  </a>
                </p>
                <p className="text-[#F4F1EC]/70">{SHOWROOM.aviso}</p>
              </div>
            )}
          </Bloque>
        </div>

        {/* C. Resumen + consentimiento + botón */}
        <aside className="border border-[#F4F1EC]/10 p-6 lg:sticky lg:top-28">
          <h2 className="font-sora font-bold text-[18px] mb-5">
            <span className="font-mono text-[12px] text-[#C9A961] mr-3">03</span>Resumen
          </h2>

          <ul className="divide-y divide-[#F4F1EC]/8 mb-5">
            {filas.map(({ item, linea }) => (
              <li key={item.sku} className="flex gap-3 py-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- miniatura de Cloudinary */}
                <img src={linea.imagen} alt="" width={56} height={56} className="w-14 h-14 object-cover bg-[#1a1a1a] shrink-0" />
                <div className="flex-1 min-w-0 font-inter">
                  <p className="text-[14px] text-[#F4F1EC] leading-snug">{linea.nombre}</p>
                  <p className="text-[12px] text-[#F4F1EC]/55">
                    {[linea.detalle, `Cant. ${item.qty}`].filter(Boolean).join(' · ')}
                  </p>
                  {linea.disponibilidad === 'bajo_pedido' && (
                    <p className="text-[12px] text-[#9DC5F0]">{ETIQUETA_DISPONIBILIDAD.bajo_pedido}</p>
                  )}
                </div>
                <p className="font-inter text-[14px] whitespace-nowrap">{formatoMXN(linea.precio * item.qty)}</p>
              </li>
            ))}
          </ul>

          <dl className="font-inter text-[15px] space-y-3 border-t border-[#F4F1EC]/10 pt-5">
            <div className="flex justify-between gap-4">
              <dt className="text-[#F4F1EC]/65">Subtotal</dt>
              <dd>{formatoMXN(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-[#F4F1EC]/65">Envío</dt>
              <dd className={envio === null ? 'text-[#F4F1EC]/50' : ''}>
                {envio === null ? 'Elige entrega' : envio === 0 ? 'Gratis' : formatoMXN(envio)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 pt-3 border-t border-[#F4F1EC]/10 text-[17px] font-semibold">
              <dt>Total</dt>
              <dd>{formatoMXN(total)}</dd>
            </div>
          </dl>

          {erroresProducto.length > 0 && (
            <div role="alert" className="mt-6 border border-red-400/40 bg-red-400/5 p-4 font-inter text-[14px] text-red-100 space-y-1">
              {erroresProducto.map((p) => (
                <p key={p.sku}><strong>{p.nombre}:</strong> {p.mensaje}</p>
              ))}
              <Link href="/carrito" className="inline-block mt-2 text-[#C9A961] underline underline-offset-4">
                Ajustar carrito
              </Link>
            </div>
          )}
          {errorGeneral && erroresProducto.length === 0 && (
            <p role="alert" className="mt-6 font-inter text-[14px] text-red-200">{errorGeneral}</p>
          )}

          {/* Consentimiento — justo arriba del botón */}
          <label className="mt-6 flex gap-3 items-start cursor-pointer font-inter text-[14px] leading-relaxed text-[#F4F1EC]/85">
            <input
              type="checkbox" checked={acepto} onChange={(e) => setAcepto(e.target.checked)}
              className="mt-1 w-4 h-4 shrink-0 accent-[#C9A961]" aria-invalid={!!errores.acepto}
            />
            <span>
              He leído y acepto los{' '}
              <a href={LEGAL_RUTAS.terminos} target="_blank" rel="noopener noreferrer" className="text-[#C9A961] underline underline-offset-4">
                Términos y condiciones
              </a>{' '}
              y el{' '}
              <a href={LEGAL_RUTAS.privacidad} target="_blank" rel="noopener noreferrer" className="text-[#C9A961] underline underline-offset-4">
                Aviso de privacidad
              </a>
              .
            </span>
          </label>
          {errores.acepto && <MensajeError texto={errores.acepto} />}

          <button
            type="submit"
            disabled={!acepto || enviando}
            className="mt-6 w-full bg-[#F4F1EC] text-[#0A0A0A] py-4 font-sora font-bold text-[13px] tracking-[0.1em] uppercase hover:bg-[#C9A961] transition disabled:bg-[#F4F1EC]/20 disabled:text-[#0A0A0A]/60 disabled:cursor-not-allowed"
          >
            {enviando
              ? 'Creando tu pedido…'
              : pagosActivos
              ? `Continuar al pago · ${formatoMXN(total)}`
              : `Apartar mi pedido · ${formatoMXN(total)}`}
          </button>
          {!pagosActivos && (
            <p className="mt-3 font-inter text-[13px] leading-relaxed text-[#F4F1EC]/65 text-center">
              El pago en línea estará disponible muy pronto. Al apartar tu pedido te damos un número para terminar la
              compra por WhatsApp.
            </p>
          )}
          <p className="mt-3 font-inter text-[12px] text-[#F4F1EC]/45 text-center">
            Precios en MXN con IVA incluido.
          </p>
        </aside>
      </form>
    </Marco>
  );
}

// ─── Piezas de UI ──────────────────────────────────────────────────────────

function Marco({ children }: { children: ReactNode }) {
  return (
    <section className="pt-32 pb-20">
      <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-10 lg:px-16">
        <Link href="/carrito" className="font-inter text-[13px] text-[#F4F1EC]/55 hover:text-[#C9A961] transition">
          ← Volver al carrito
        </Link>
        <h1 className="font-sora font-bold text-[32px] md:text-[44px] tracking-[-0.02em] leading-tight mt-4 mb-10">
          Checkout
        </h1>
        {children}
      </div>
    </section>
  );
}

function Bloque({ titulo, numero, children }: { titulo: string; numero: string; children: ReactNode }) {
  return (
    <section className="space-y-5">
      <h2 className="font-sora font-bold text-[20px] border-b border-[#F4F1EC]/10 pb-3">
        <span className="font-mono text-[12px] text-[#C9A961] mr-3">{numero}</span>
        {titulo}
      </h2>
      {children}
    </section>
  );
}

function Campo({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="block font-inter text-[13px] text-[#F4F1EC]/70 mb-2">
        {label}
      </label>
      {children}
      {error && <MensajeError texto={error} />}
    </div>
  );
}

function MensajeError({ texto }: { texto: string }) {
  return <p className="mt-2 font-inter text-[13px] text-red-300">{texto}</p>;
}

function claseInput(error?: string) {
  return `w-full bg-[#111] border ${
    error ? 'border-red-400/70' : 'border-[#F4F1EC]/20 focus:border-[#C9A961]'
  } px-4 py-3 font-inter text-[16px] text-[#F4F1EC] placeholder:text-[#F4F1EC]/30 outline-none transition`;
}

function OpcionEntrega({
  activa, onClick, titulo, detalle,
}: {
  activa: boolean; onClick: () => void; titulo: string; detalle: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={activa}
      onClick={onClick}
      className={`text-left p-5 border transition ${
        activa ? 'border-[#C9A961] bg-[#C9A961]/5' : 'border-[#F4F1EC]/15 hover:border-[#F4F1EC]/35'
      }`}
    >
      <span className="flex items-center gap-3">
        <span className={`w-4 h-4 rounded-full border ${activa ? 'border-[#C9A961] bg-[#C9A961]' : 'border-[#F4F1EC]/40'}`} />
        <span className="font-sora font-bold text-[15px]">{titulo}</span>
      </span>
      <span className="block mt-2 pl-7 font-inter text-[13px] text-[#F4F1EC]/60">{detalle}</span>
    </button>
  );
}
