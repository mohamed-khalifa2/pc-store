"use client";

import { useCartHydrated, useCartStore } from "@/features/cart/store/cart-store";

export function useCheckoutCart() {
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const hydrated = useCartHydrated();

  return { items, hydrated, clearCart };
}
