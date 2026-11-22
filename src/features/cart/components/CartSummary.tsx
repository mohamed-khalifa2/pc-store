"use client";

import { useId } from "react";

import { Button } from "@/components/ui/Button";
import { LinkButton } from "@/components/ui/LinkButton";
import { CART_COPY } from "@/features/cart/config/cart-config";
import { getCartSubtotal, hasStockIssues } from "@/features/cart/lib/cart-totals";
import type { CartDetailLine } from "@/features/cart/schemas/cart-details";
import { useCartStore } from "@/features/cart/store/cart-store";
import { ROUTES } from "@/lib/constants";
import { formatEgp } from "@/lib/format/currency";

type CartSummaryProps = {
  lines: CartDetailLine[];
};

export function CartSummary({ lines }: CartSummaryProps) {
  const closeCart = useCartStore((state) => state.closeCart);
  const warningId = useId();
  const stockBlocked = hasStockIssues(lines);

  return (
    <div className="border-surface-800 bg-surface-900/50 rounded-card border p-6">
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-black tracking-[0.12em] text-white uppercase">
          {CART_COPY.subtotal}
        </span>
        <span className="text-accent text-2xl font-black">{formatEgp(getCartSubtotal(lines))}</span>
      </div>

      {stockBlocked && (
        <p id={warningId} role="status" className="text-danger mt-4 text-xs font-bold">
          {CART_COPY.stockIssue}
        </p>
      )}

      <div className="mt-6">
        {stockBlocked ? (
          <Button disabled size="lg" className="w-full" aria-describedby={warningId}>
            {CART_COPY.checkout}
          </Button>
        ) : (
          <LinkButton href={ROUTES.checkout} size="lg" className="w-full" onClick={closeCart}>
            {CART_COPY.checkout}
          </LinkButton>
        )}
      </div>
    </div>
  );
}
