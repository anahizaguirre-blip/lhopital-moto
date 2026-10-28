'use client';

/**
 * Card Payment Brick de Mercado Pago con el tema del sitio.
 * La tarjeta se captura en los campos seguros de MP; aquí solo recibimos
 * el token y lo mandamos a /api/pagos/procesar, que cobra el total de la
 * orden guardado en Supabase (el `amount` de aquí es solo visual).
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CardPayment, initMercadoPago } from '@mercadopago/sdk-react';
import { LEGAL_RUTAS } from '@/lib/legal-rutas';

interface Props {
  ordenId: string;
  total: number;
  email: string;
  publicKey: string;
  maxInstallments: number;
}

let mpIniciado: string | null = null;

// Fuera del componente: el Brick se reinicia si estos objetos cambian.
const VISUAL = {
  font: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap',
  hideFormTitle: true,
  texts: {
    formSubmit: 'Pagar',
  },
  style: {
    theme: 'dark' as const,
    customVariables: {
      textPrimaryColor: '#F4F1EC',
      textSecondaryColor: 'rgba(244,241,236,0.62)',
      inputBackgroundColor: '#111111',
      formBackgroundColor: '#0A0A0A',
      baseColor: '#C9A961',
      baseColorFirstVariant: '#B8954F',
      baseColorSecondVariant: '#8F7340',
      errorColor: '#FCA5A5',
      successColor: '#6EE7B7',
      outlinePrimaryColor: 'rgba(244,241,236,0.22)',
      outlineSecondaryColor: 'rgba(244,241,236,0.12)',
      buttonTextColor: '#0A0A0A',
      fontSizeExtraSmall: '12px',
      fontSizeSmall: '13px',
      fontSizeMedium: '16px',
      fontSizeLarge: '18px',
      fontSizeExtraLarge: '22px',
      fontWeightNormal: '400',
      fontWeightSemiBold: '600',
      inputVerticalPadding: '12px',
      inputHorizontalPadding: '16px',
      inputBorderWidth: '1px',
      inputFocusedBorderWidth: '1px',
      inputFocusedBoxShadow: '0 0 0 1px #C9A961',
      inputErrorFocusedBoxShadow: '0 0 0 1px #FCA5A5',
      borderRadiusSmall: '0px',
      borderRadiusMedium: '0px',
      borderRadiusLarge: '0px',
      borderRadiusFull: '0px',
      formPadding: '0px',
    },
  },
};

type Respuesta =
  | { result: 'approved' | 'pending' }
  | { result: 'rejected'; reason: string }
  | { error: string };

export function PagoBrick({ ordenId, total, email, publicKey, maxInstallments }: Props) {
  if (mpIniciado !== publicKey) {
    initMercadoPago(publicKey, { locale: 'es-MX' });
    mpIniciado = publicKey;
  }

  const router = useRouter();
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [listo, setListo] = useState(false);
  const enviandoRef = useRef(false);

  const initialization = useMemo(() => ({ amount: total, payer: { email } }), [total, email]);
  const customization = useMemo(
    () => ({
      paymentMethods: {
        maxInstallments,
        types: { included: ['credit_card' as const, 'debit_card' as const] },
      },
      visual: VISUAL,
    }),
    [maxInstallments]
  );

  const onSubmit = useCallback(
    async (
      formData: { token: string; payment_method_id: string; installments: number; payer: { email?: string } },
      additional?: { paymentTypeId?: string; lastFourDigits?: string }
    ) => {
      if (enviandoRef.current) return; // sin doble envío
      enviandoRef.current = true;
      setMensaje(null);
      setProcesando(true);

      try {
        const r = await fetch('/api/pagos/procesar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: ordenId,
            token: formData.token,
            payment_method_id: formData.payment_method_id,
            payment_type: additional?.paymentTypeId,
            installments: formData.installments,
            payer: { email: formData.payer?.email || email },
            last4: additional?.lastFourDigits,
          }),
        });
        const data: Respuesta = await r.json().catch(() => ({ error: 'Respuesta inválida' }));

        if ('result' in data && (data.result === 'approved' || data.result === 'pending')) {
          router.replace(`/checkout/confirmacion?orden=${ordenId}`);
          return; // la pantalla de "procesando" se queda hasta que cambie la página
        }
        setMensaje(
          'result' in data && data.result === 'rejected'
            ? data.reason
            : 'error' in data
            ? data.error
            : 'No pudimos procesar el pago. Intenta de nuevo.'
        );
      } catch {
        setMensaje('Sin conexión. Revisa tu internet e intenta de nuevo; no se hizo ningún cargo.');
      }
      setProcesando(false);
      enviandoRef.current = false;
    },
    [ordenId, email, router]
  );

  const onReady = useCallback(() => setListo(true), []);
  const onError = useCallback((e: unknown) => {
    console.error('[Brick]', e);
  }, []);

  return (
    <div className="relative">
      <h2 className="font-sora font-bold text-[18px] mb-5">Tarjeta de crédito o débito</h2>

      {mensaje && (
        <div role="alert" className="mb-5 border border-red-400/40 bg-red-400/5 p-4 font-inter text-[14px] text-red-100">
          {mensaje}
        </div>
      )}

      {!listo && <p className="font-inter text-[14px] text-[#F4F1EC]/55 mb-4">Cargando formulario seguro…</p>}

      {/* font-inter: el Brick hereda la fuente del contenedor (el body usa Almaq, de títulos) */}
      <div aria-busy={procesando} className={`font-inter ${procesando ? 'pointer-events-none opacity-40' : ''}`}>
        <CardPayment
          initialization={initialization}
          customization={customization}
          onSubmit={onSubmit}
          onReady={onReady}
          onError={onError}
          locale="es-MX"
        />
      </div>

      {procesando && (
        <div
          role="status"
          className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0A0A0A]/85 text-center px-6"
        >
          <span className="w-8 h-8 border-2 border-[#C9A961] border-t-transparent rounded-full animate-spin mb-4" />
          <p className="font-sora font-bold text-[18px]">Procesando tu pago…</p>
          <p className="font-inter text-[14px] text-[#F4F1EC]/60 mt-2">No cierres ni recargues esta página.</p>
        </div>
      )}

      <p className="mt-6 font-inter text-[12px] leading-relaxed text-[#F4F1EC]/50">
        Pago seguro procesado por Mercado Pago. Lhopital no almacena los datos de tu tarjeta.{' '}
        <Link href={LEGAL_RUTAS.devoluciones} target="_blank" className="underline underline-offset-4 hover:text-[#C9A961]">
          Política de devoluciones
        </Link>
      </p>
    </div>
  );
}
