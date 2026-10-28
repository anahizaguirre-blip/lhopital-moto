'use client';

import { useActionState } from 'react';
import { ajustarStock, type AjusteState } from './actions';

export function AjusteStock({ variantId, stock }: { variantId: string; stock: number }) {
  const [estado, accion, enviando] = useActionState<AjusteState, FormData>(ajustarStock, {});

  return (
    <form action={accion} style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
      <input type="hidden" name="variant_id" value={variantId} />
      <input type="hidden" name="stock_anterior" value={stock} />
      <input
        name="stock_nuevo"
        type="number"
        min={0}
        max={9999}
        defaultValue={stock}
        aria-label="Nuevo stock"
        style={{ width: '64px', padding: '6px 8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '14px' }}
      />
      <select
        name="motivo"
        defaultValue=""
        aria-label="Motivo"
        style={{ padding: '6px 8px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px', backgroundColor: 'white' }}
      >
        <option value="" disabled>Motivo…</option>
        <option value="recepcion">Llegó mercancía</option>
        <option value="conteo">Conteo físico</option>
        <option value="dano">Daño / merma</option>
      </select>
      <button
        type="submit"
        disabled={enviando}
        style={{
          padding: '6px 12px',
          border: 'none',
          borderRadius: '4px',
          backgroundColor: '#020202',
          color: '#F5EFE0',
          fontSize: '13px',
          cursor: 'pointer',
          opacity: enviando ? 0.5 : 1,
        }}
      >
        {enviando ? 'Guardando…' : 'Guardar'}
      </button>
      {estado.ok && <span style={{ fontSize: '12px', color: '#2f7a3b' }}>{estado.ok}</span>}
      {estado.error && <span style={{ fontSize: '12px', color: '#b42318' }}>{estado.error}</span>}
    </form>
  );
}
