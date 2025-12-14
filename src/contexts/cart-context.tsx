"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "shopee-mini/cart";

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  price: number;
  currency: string;
  thumbnailUrl?: string;
  quantity: number;
};

export type CartContextValue = {
  items: CartItem[];
  totalQuantity: number;
  addItem: (
    item: Omit<CartItem, "quantity">,
    quantity: number,
    inventory: number,
  ) => void;
  getItemQuantity: (productId: string) => number;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") {
      return [];
    }

    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      const parsed = JSON.parse(stored) as { items?: CartItem[] };
      return parsed?.items ?? [];
    } catch (error) {
      console.error("Failed to read cart from sessionStorage", error);
      return [];
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items }),
      );
    } catch (error) {
      console.error("Failed to persist cart", error);
    }
  }, [items]);

  const addItem = useCallback(
    (item: Omit<CartItem, "quantity">, quantity: number, inventory: number) => {
      setItems((current) => {
        const existing = current.find((cartItem) => cartItem.productId === item.productId);
        const existingQuantity = existing?.quantity ?? 0;
        const available = Math.max(inventory - existingQuantity, 0);
        const allowedQuantity = Math.min(quantity, available);

        if (allowedQuantity <= 0) {
          return current;
        }

        if (existing) {
          return current.map((cartItem) =>
            cartItem.productId === item.productId
              ? { ...cartItem, quantity: cartItem.quantity + allowedQuantity }
              : cartItem,
          );
        }

        return [...current, { ...item, quantity: allowedQuantity }];
      });
    },
    [],
  );

  const getItemQuantity = useCallback(
    (productId: string) => items.find((item) => item.productId === productId)?.quantity ?? 0,
    [items],
  );

  const totalQuantity = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const value = useMemo<CartContextValue>(
    () => ({ items, totalQuantity, addItem, getItemQuantity }),
    [items, totalQuantity, addItem, getItemQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
