"use client";

import { CartDetails } from "@/features/cart/components/CartDetails";
import { CartSkeleton } from "@/features/cart/components/CartSkeleton";
import { useCartHydrated, useCartStore } from "@/features/cart/store/cart-store";

export function CartPageContent() {
  const hydrated = useCartHydrated();
  const items = useCartStore((state) => state.items);

  if (!hydrated) return <CartSkeleton />;

  return <CartDetails items={items} />;
}
