'use client';

import { useActionState } from 'react';
import { avisarListoRecoger, cambiarEstado, type CambiarEstadoState } from './actions';

const initialState: CambiarEstadoState = {};

const ETIQUETA: Record<string, string> = {
  pago_pendiente: 'Pago pendiente',
  pagada: 'Pagada',
  preparando: 'Preparando',
  enviada: 'Enviada',
  entregada: 'Entregada',
  cancelada: 'Cancelada',
  reembolsada: 'Reembolsada',
};

const boton = (pending: boolean, secundario = false): React.CSSProperties => ({
  width: '100%',
  backgroundColor: secundario ? 'white' : '#020202',
  color: secundario ? '#020202' : '#F5EFE0',
  border: secundario ? '1px solid #020202' : 'none',
  borderRadius: '4px',
  padding: '10px 12px',
  fontSize: '13px',
  cursor: pending ? 'default' : 'pointer',
  opacity: pending ? 0.6 : 1,
});

function formatoFecha(iso: string): string {
  return new Date(iso).toLocaleString('es-MX', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Mexico_City',
  });
}

export function EstadoForm({
  orderId,
  estado,
  recoleccion,
  avisoListoEn,
}: {
  orderId: string;
  estado: string;
  recoleccion: boolean;
  /** Recolección: cuándo se mandó el correo "listo para recoger" (null si aún no). */
  avisoListoEn: string | null;
}) {
  const [estadoState, estadoAction, estadoPending] = useActionState(cambiarEstado.bind(null, orderId), initialState);
  const [avisoState, avisoAction, avisoPending] = useActionState(avisarListoRecoger.bind(null, orderId), initialState);
  const pending = estadoPending || avisoPending;

  const listoAvisado = recoleccion && estado === 'preparando' && !!avisoListoEn;
  const etiqueta = listoAvisado ? 'Listo para recoger' : ETIQUETA[estado] ?? estado;

  // Botón principal (y, en recolección, uno secundario) según el paso actual.
  const marcarPreparando = estado === 'pagada';
  const avisarListo = recoleccion && estado === 'preparando' && !avisoListoEn;
  const marcarEntregado = (recoleccion && estado === 'preparando') || estado === 'enviada';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <p style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>{etiqueta}</p>
      <p style={{ fontSize: '12px', color: '#888', margin: 0 }}>
        {recoleccion
          ? 'Recolección en showroom: Pagada → Preparando → Listo para recoger (se avisa al cliente) → Entregada (se le agradece)'
          : 'Envío: Pagada → Preparando → Enviada (al capturar la guía) → Entregada (se le agradece)'}
      </p>

      {listoAvisado && avisoListoEn && (
        <p style={{ fontSize: '12px', color: '#2e7d32', margin: 0 }}>
          Aviso enviado al cliente el {formatoFecha(avisoListoEn)}.
        </p>
      )}

      {marcarPreparando && (
        <form action={estadoAction}>
          <input type="hidden" name="estado" value="preparando" />
          <button type="submit" disabled={pending} style={boton(pending)}>
            {estadoPending ? 'Guardando…' : 'Marcar como preparando'}
          </button>
        </form>
      )}

      {avisarListo && (
        <form action={avisoAction}>
          <button type="submit" disabled={pending} style={boton(pending)}>
            {avisoPending ? 'Enviando correo…' : 'Listo para recoger · avisar al cliente'}
          </button>
        </form>
      )}

      {marcarEntregado && (
        <form action={estadoAction}>
          <input type="hidden" name="estado" value="entregada" />
          <button type="submit" disabled={pending} style={boton(pending, avisarListo)}>
            {estadoPending ? 'Guardando…' : recoleccion ? 'Marcar como entregado (recogió en showroom)' : 'Marcar como entregado'}
          </button>
        </form>
      )}

      {!recoleccion && estado === 'preparando' && (
        <p style={{ fontSize: '13px', color: '#555', margin: 0 }}>Captura la guía abajo para marcarlo como enviado.</p>
      )}

      {(estadoState.error || avisoState.error) && (
        <p style={{ color: '#c62828', fontSize: '13px', margin: 0 }}>{estadoState.error || avisoState.error}</p>
      )}
      {avisoState.success && !avisoState.error && (
        <p style={{ color: '#2e7d32', fontSize: '13px', margin: 0 }}>Correo enviado al cliente.</p>
      )}
      {estadoState.success && !estadoState.error && (
        <p style={{ color: '#2e7d32', fontSize: '13px', margin: 0 }}>
          {estado === 'entregada' ? 'Marcado como entregado. Correo de agradecimiento enviado.' : 'Estado actualizado.'}
        </p>
      )}
      {estadoState.avisoCorreo && <p style={{ color: '#c62828', fontSize: '13px', margin: 0 }}>{estadoState.avisoCorreo}</p>}
    </div>
  );
}
