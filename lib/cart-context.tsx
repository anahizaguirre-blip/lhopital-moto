'use client';

/**
 * Carrito del sitio — Context + localStorage.
 *
 * Solo guarda { sku, qty } por línea (sku = product_variants.sku_variante).
 * Nombre, precio, imagen y stock se leen siempre del servidor
 * (/api/carrito), nunca de lo que haya en el navegador.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export interface CartItem {
  sku: string;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  hydrated: boolean;
  /** Suma qty a la línea; `max` recorta al tope conocido (stock o 1 para pieza única). */
  addItem: (sku: string, qty?: number, max?: number) => void;
  setQty: (sku: string, qty: number) => void;
  removeItem: (sku: string) => void;
  clear: () => void;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'lhopital-cart';
const QTY_MAX_ABSOLUTO = 99;

function limpiarQty(n: unknown): number {
  const v = Math.floor(Number(n));
  return Number.isFinite(v) ? Math.min(Math.max(v, 0), QTY_MAX_ABSOLUTO) : 0;
}

/** Acepta el formato nuevo ({sku, qty}) y el anterior ({sku, cantidad, precio...}). */
function leerGuardado(raw: string | null): CartItem[] {
  if (!raw) return [];
  const data: unknown = JSON.parse(raw);
  if (!Array.isArray(data)) return [];
  const porSku = new Map<string, number>();
  for (const entry of data) {
    if (!entry || typeof entry !== 'object') continue;
    const e = entry as Record<string, unknown>;
    if (typeof e.sku !== 'string' || !e.sku) continue;
    const qty = limpiarQty(e.qty ?? e.cantidad);
    if (qty > 0) porSku.set(e.sku, limpiarQty((porSku.get(e.sku) ?? 0) + qty));
  }
  return [...porSku].map(([sku, qty]) => ({ sku, qty }));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Lee localStorage después del primer render para no romper la
  // hidratación entre servidor y cliente.
  useEffect(() => {
    try {
      setItems(leerGuardado(window.localStorage.getItem(STORAGE_KEY)));
    } catch {
      // localStorage bloqueado o JSON corrupto: carrito vacío
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage lleno o bloqueado: el carrito sigue en memoria
    }
  }, [items, hydrated]);

  // Otra pestaña cambió el carrito
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      try {
        setItems(leerGuardado(e.newValue));
      } catch {
        // ignorar
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const addItem = useCallback((sku: string, qty = 1, max?: number) => {
    setItems((prev) => {
      const tope = Math.min(max ?? QTY_MAX_ABSOLUTO, QTY_MAX_ABSOLUTO);
      const actual = prev.find((i) => i.sku === sku)?.qty ?? 0;
      const nueva = Math.min(actual + limpiarQty(qty), tope);
      if (nueva <= 0) return prev;
      if (actual > 0) return prev.map((i) => (i.sku === sku ? { ...i, qty: nueva } : i));
      return [...prev, { sku, qty: nueva }];
    });
  }, []);

  const setQty = useCallback((sku: string, qty: number) => {
    const q = limpiarQty(qty);
    setItems((prev) =>
      q <= 0 ? prev.filter((i) => i.sku !== sku) : prev.map((i) => (i.sku === sku ? { ...i, qty: q } : i))
    );
  }, []);

  const removeItem = useCallback((sku: string) => {
    setItems((prev) => prev.filter((i) => i.sku !== sku));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);

  const value = useMemo(
    () => ({ items, hydrated, addItem, setQty, removeItem, clear, itemCount }),
    [items, hydrated, addItem, setQty, removeItem, clear, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
