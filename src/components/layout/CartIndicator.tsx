"use client";

import { buttonClassName } from "@/components/ui/button-styles";
import { CartIcon } from "@/components/ui/icons/CartIcon";
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
      className={buttonClassName("secondary", "sm", "h-11 rounded-full pr-2 pl-4")}
    >
      <CartIcon aria-hidden="true" />
      <span className="hidden text-xs sm:inline">{NAV_LABELS.cart}</span>
      <span className="bg-accent text-black-950 grid size-7 place-items-center rounded-full text-xs font-black tabular-nums">
        {count}
      </span>
    </button>
  );
}
