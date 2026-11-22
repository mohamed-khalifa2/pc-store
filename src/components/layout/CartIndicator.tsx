"use client";

import { cartAccessibleLabel } from "@/features/cart/config/cart-config";
import { selectCartCount, useCartHydrated, useCartStore } from "@/features/cart/store/cart-store";
import { CART_COUNT_PLACEHOLDER, NAV_LABELS } from "@/lib/constants";

export function CartIndicator() {
  const hydrated = useCartHydrated();
  const storedCount = useCartStore(selectCartCount);
  const openCart = useCartStore((state) => state.openCart);
  const count = hydrated ? storedCount : CART_COUNT_PLACEHOLDER;

  return (
    <button
      type="button"
      onClick={openCart}
      className="hover:text-accent inline-flex items-center gap-2 text-sm font-bold tracking-[0.12em] text-white uppercase"
    >
      <span className="sr-only">{cartAccessibleLabel(count)}</span>
      <span aria-hidden="true" className="hidden sm:inline">
        {NAV_LABELS.cart}
      </span>
      <span
        aria-hidden="true"
        className="bg-accent text-black-950 grid size-6 place-items-center rounded-full text-xs font-black"
      >
        {count}
      </span>
    </button>
  );
}
