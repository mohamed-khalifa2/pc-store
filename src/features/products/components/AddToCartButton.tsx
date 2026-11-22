"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { CART_MAX_QUANTITY } from "@/lib/constants";

import { useCartStore } from "@/features/cart/store/cart-store";
import { PRODUCT_COPY } from "@/features/products/config/copy";

type AddToCartButtonProps = {
  productId: string;
  stock: number;
};

export function AddToCartButton({ productId, stock }: AddToCartButtonProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [quantity, setQuantity] = useState(1);

  if (stock <= 0) return <Button disabled>{PRODUCT_COPY.outOfStock}</Button>;

  const max = Math.min(stock, CART_MAX_QUANTITY);

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="border-surface-700 flex items-center rounded-md border">
        <button
          type="button"
          onClick={() => setQuantity((current) => Math.max(1, current - 1))}
          disabled={quantity <= 1}
          aria-label={PRODUCT_COPY.decreaseQuantity}
          className="text-surface-400 hover:text-accent size-10 font-black disabled:opacity-40"
        >
          −
        </button>
        <span aria-live="polite" className="w-10 text-center text-sm font-black">
          {quantity}
        </span>
        <button
          type="button"
          onClick={() => setQuantity((current) => Math.min(max, current + 1))}
          disabled={quantity >= max}
          aria-label={PRODUCT_COPY.increaseQuantity}
          className="text-surface-400 hover:text-accent size-10 font-black disabled:opacity-40"
        >
          +
        </button>
      </div>
      <Button type="button" onClick={() => addItem(productId, quantity)}>
        {PRODUCT_COPY.addToCart}
      </Button>
    </div>
  );
}
