"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
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
      <QuantityStepper
        value={quantity}
        max={max}
        size="md"
        decreaseLabel={PRODUCT_COPY.decreaseQuantity}
        increaseLabel={PRODUCT_COPY.increaseQuantity}
        onChange={setQuantity}
      />
      <Button type="button" onClick={() => addItem(productId, quantity)}>
        {PRODUCT_COPY.addToCart}
      </Button>
    </div>
  );
}
