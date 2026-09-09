'use client';

/**
 * Carrito del sitio — primera versión.
 *
 * Context API + localStorage, sin Supabase ni autenticación: es un
 * carrito de sesión/dispositivo. No incluye checkout ni Mercado Pago,
 * eso es una entrega aparte — esto solo expone agregar/ver artículos
 * para que esa siguiente entrega (drawer o página /carrito) se
 * conecte sin refactor.
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
  nombre: string;
  marca: string;
  color?: string;
  precio: number;
  imagen?: string;
  cantidad: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'cantidad'> & { cantidad?: number }) => void;
  removeItem: (sku: string) => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = 'lhopital-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Lee localStorage después del primer render (no en el render inicial)
  // para no generar un mismatch de hidratación entre server y cliente.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage no disponible o JSON corrupto — arranca con carrito vacío
    }
    setHydrated(true);
  }, []);

  // Persiste cambios, pero solo después de que la hidratación inicial
  // terminó — si no, este efecto correría primero con el estado inicial
  // vacío y sobreescribiría lo que ya había guardado en localStorage.
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // localStorage lleno o bloqueado — el carrito sigue funcionando en memoria
    }
  }, [items, hydrated]);

  const addItem = useCallback((item: Omit<CartItem, 'cantidad'> & { cantidad?: number }) => {
    const cantidad = item.cantidad ?? 1;
    setItems((prev) => {
      const existente = prev.find((i) => i.sku === item.sku);
      if (existente) {
        return prev.map((i) =>
          i.sku === item.sku ? { ...i, cantidad: i.cantidad + cantidad } : i
        );
      }
      return [...prev, { ...item, cantidad }];
    });
  }, []);

  const removeItem = useCallback((sku: string) => {
    setItems((prev) => prev.filter((i) => i.sku !== sku));
  }, []);

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.precio * i.cantidad, 0),
    [items]
  );

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.cantidad, 0),
    [items]
  );

  const value = useMemo(
    () => ({ items, addItem, removeItem, subtotal, itemCount }),
    [items, addItem, removeItem, subtotal, itemCount]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return ctx;
}
