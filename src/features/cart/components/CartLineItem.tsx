"use client";

import Image from "next/image";

import { CloseIcon } from "@/components/ui/icons/CloseIcon";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { CART_COPY } from "@/features/cart/config/cart-config";
import { getStockWarning } from "@/features/cart/lib/stock-warning";
import type { CartDetailLine } from "@/features/cart/schemas/cart-details";
import { useCartStore } from "@/features/cart/store/cart-store";
import { BLUR_PLACEHOLDER, CART_MAX_QUANTITY } from "@/lib/constants";
import { isRemoteUrl } from "@/lib/format/asset-url";
import { formatEgp } from "@/lib/format/currency";

type CartLineItemProps = {
  line: CartDetailLine;
};

export function CartLineItem({ line }: CartLineItemProps) {
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const stockWarning = getStockWarning(line.stock, line.quantity);

  return (
    <li className="border-surface-800 flex gap-4 border-b py-5 first:pt-0 last:border-b-0 last:pb-0">
      <div className="bg-black-900 size-20 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={line.imageUrl}
          alt={line.name}
          width={80}
          height={80}
          sizes="80px"
          placeholder="blur"
          blurDataURL={BLUR_PLACEHOLDER}
          unoptimized={isRemoteUrl(line.imageUrl)}
          className="size-20 object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-black text-white">{line.name}</h3>
          <button
            type="button"
            onClick={() => removeItem(line.id)}
            className="text-surface-400 hover:bg-danger/10 hover:text-danger grid size-8 shrink-0 place-items-center rounded-md transition-colors"
          >
            <span className="sr-only">{`${CART_COPY.remove} ${line.name}`}</span>
            <CloseIcon className="size-4" />
          </button>
        </div>
        <p className="text-surface-400 mt-1 text-xs">
          {formatEgp(line.priceEgp)} {CART_COPY.each}
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <QuantityStepper
            value={line.quantity}
            max={CART_MAX_QUANTITY}
            decreaseLabel={`${CART_COPY.decreaseQuantity} ${line.name}`}
            increaseLabel={`${CART_COPY.increaseQuantity} ${line.name}`}
            onChange={(quantity) => setQuantity(line.id, quantity)}
          />
          <span className="text-accent text-base font-black">{formatEgp(line.lineTotalEgp)}</span>
        </div>

        {stockWarning && (
          <p role="status" className="text-danger mt-2 text-xs font-bold">
            {stockWarning}
          </p>
        )}
      </div>
    </li>
  );
}
