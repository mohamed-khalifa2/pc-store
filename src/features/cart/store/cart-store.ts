"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { CART_STORAGE_KEY, CART_STORAGE_VERSION } from "@/features/cart/config/cart-config";
import { cartItemSchema, parseCartItems, type CartItem } from "@/features/cart/schemas/cart";
import { CART_MAX_ITEMS, CART_MAX_QUANTITY } from "@/lib/constants";

export type CartState = {
  items: CartItem[];
  isOpen: boolean;
  addItem: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

function persistedItems(value: unknown): CartItem[] {
  if (typeof value !== "object" || value === null || !("items" in value)) {
    return [];
  }

  return parseCartItems(value.items);
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (productId, quantity) => {
        const parsed = cartItemSchema.safeParse({ productId: productId.trim(), quantity });
        if (!parsed.success) return;

        const nextItem = parsed.data;
        set((state) => {
          const existing = state.items.find((item) => item.productId === nextItem.productId);
          const items = existing
            ? state.items.map((item) =>
                item.productId === nextItem.productId
                  ? {
                      ...item,
                      quantity: Math.min(item.quantity + nextItem.quantity, CART_MAX_QUANTITY),
                    }
                  : item,
              )
            : state.items.length < CART_MAX_ITEMS
              ? [...state.items, nextItem]
              : state.items;

          return { items, isOpen: true };
        });
      },
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId),
        })),
      setQuantity: (productId, quantity) => {
        if (quantity < 1) {
          set((state) => ({
            items: state.items.filter((item) => item.productId !== productId),
          }));
          return;
        }

        const parsed = cartItemSchema.safeParse({ productId: productId.trim(), quantity });
        if (!parsed.success) return;

        const nextItem = parsed.data;
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === nextItem.productId ? nextItem : item,
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: CART_STORAGE_KEY,
      version: CART_STORAGE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      migrate: (persistedState) => ({ items: persistedItems(persistedState) }),
      merge: (persistedState, currentState) => ({
        ...currentState,
        items: persistedItems(persistedState),
      }),
    },
  ),
);

export function selectCartCount(state: CartState): number {
  return state.items.reduce((total, item) => total + item.quantity, 0);
}

const noopSubscribe = () => () => undefined;

export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
