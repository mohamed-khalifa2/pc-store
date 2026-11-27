"use client";

import { useEffect, useId, useRef } from "react";

import { CartIcon } from "@/components/ui/icons/CartIcon";
import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import { CartDetails } from "@/features/cart/components/CartDetails";
import { CART_COPY, CART_KEYBOARD } from "@/features/cart/config/cart-config";
import { useCartHydrated, useCartStore } from "@/features/cart/store/cart-store";

export function CartDrawer() {
  const hydrated = useCartHydrated();
  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const closeCart = useCartStore((state) => state.closeCart);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();

  useEffect(() => {
    if (!hydrated || !isOpen) return;

    const previouslyFocused = document.activeElement;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== CART_KEYBOARD.escape) return;
      event.preventDefault();
      closeCart();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previouslyFocused instanceof HTMLElement) previouslyFocused.focus();
    };
  }, [closeCart, hydrated, isOpen]);

  if (!hydrated || !isOpen) return null;

  return (
    <div className="animate-fade-in fixed inset-0 z-[60]">
      <button
        type="button"
        onClick={closeCart}
        className="bg-black-950/80 absolute inset-0 h-full w-full backdrop-blur-sm"
      >
        <span className="sr-only">{CART_COPY.closeCart}</span>
      </button>

      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="border-surface-800 bg-black-950 animate-drawer-in absolute inset-y-0 right-0 flex w-full max-w-xl flex-col border-l shadow-2xl shadow-black"
      >
        <div className="border-surface-800 flex items-center justify-between gap-4 border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="bg-accent/10 text-accent grid size-9 place-items-center rounded-lg">
              <CartIcon />
            </span>
            <h2 id={titleId} className="text-xl font-black tracking-tight text-white uppercase">
              {CART_COPY.title}
            </h2>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeCart}
            className="text-surface-400 hover:bg-surface-900 hover:text-accent grid size-9 place-items-center rounded-md transition-colors"
          >
            <span className="sr-only">{CART_COPY.closeCart}</span>
            <CloseIcon />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <CartDetails items={items} />
        </div>
      </aside>
    </div>
  );
}
