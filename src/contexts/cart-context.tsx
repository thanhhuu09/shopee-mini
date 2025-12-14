"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  calculateSubtotal,
  clampQuantity,
  sanitizeCartItems,
  type CartItem,
} from "@/domain/cart/types";

const STORAGE_KEY = "shopee-mini/cart";

export type CartContextValue = {
  items: CartItem[];
  ready: boolean;
  totalQuantity: number;
  subtotal: number;
  addItem: (
    item: Omit<CartItem, "quantity" | "inventory">,
    quantity: number,
    inventory: number,
  ) => void;
  getItemQuantity: (productId: string) => number;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const stored = window.sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as { items?: unknown };
        const localItems = sanitizeCartItems(parsed?.items ?? []);
        if (localItems.length) {
          setItems(localItems);
        }
      }
    } catch (error) {
      console.error("Failed to read cart from sessionStorage", error);
    }

    let cancelled = false;
    async function hydrateFromServer() {
      try {
        const response = await fetch("/api/cart", { cache: "no-store" });
        if (!response.ok) {
          return;
        }
        const payload = (await response.json()) as { items?: unknown };
        if (!cancelled) {
          const serverItems = sanitizeCartItems(payload?.items ?? []);
          if (serverItems.length) {
            setItems(serverItems);
          }
        }
      } catch (error) {
        console.error("Failed to load cart from server", error);
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    }

    hydrateFromServer();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready || typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ items }),
      );
    } catch (error) {
      console.error("Failed to persist cart", error);
    }

    const persist = async () => {
      try {
        await fetch("/api/cart", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items }),
        });
      } catch (error) {
        console.error("Failed to sync cart to server", error);
      }
    };

    void persist();
  }, [items, ready]);

  const addItem = useCallback(
    (
      item: Omit<CartItem, "quantity" | "inventory">,
      quantity: number,
      inventory: number,
    ) => {
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
              ? {
                  ...cartItem,
                  inventory,
                  quantity: cartItem.quantity + allowedQuantity,
                }
              : cartItem,
          );
        }

        return [
          ...current,
          {
            ...item,
            inventory,
            quantity: allowedQuantity,
          },
        ];
      });
    },
    [],
  );

  const updateQuantity = useCallback((productId: string, desiredQuantity: number) => {
    setItems((current) =>
      current.map((item) => {
        if (item.productId !== productId) {
          return item;
        }

        const normalized = clampQuantity(desiredQuantity, item.inventory);
        return { ...item, quantity: normalized || 1 };
      }),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const getItemQuantity = useCallback(
    (productId: string) => items.find((item) => item.productId === productId)?.quantity ?? 0,
    [items],
  );

  const totalQuantity = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(() => calculateSubtotal(items), [items]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      ready,
      totalQuantity,
      subtotal,
      addItem,
      getItemQuantity,
      updateQuantity,
      removeItem,
    }),
    [items, ready, totalQuantity, subtotal, addItem, getItemQuantity, updateQuantity, removeItem],
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
