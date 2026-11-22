import type { CartItem } from "@/features/cart/schemas/cart";
import { CHECKOUT_COPY } from "@/features/checkout/config/copy";
import type { CheckoutProductData } from "@/features/products/types";

export type PricedCartItem = {
  productId: string;
  quantity: number;
  unitPriceEgp: number;
  lineTotalEgp: number;
};

export type PricingResult =
  { ok: true; items: PricedCartItem[]; totalEgp: number } | { ok: false; message: string };

const PIASTERS_PER_POUND = 100;

export function priceCartItems(items: CartItem[], products: CheckoutProductData[]): PricingResult {
  if (items.length === 0) {
    return { ok: false, message: CHECKOUT_COPY.cartEmpty };
  }

  const byId = new Map(products.map((product) => [product.id, product]));
  const seen = new Set<string>();
  const priced: PricedCartItem[] = [];
  let totalPiasters = 0;

  for (const item of items) {
    if (seen.has(item.productId)) {
      return { ok: false, message: CHECKOUT_COPY.duplicateItem };
    }
    seen.add(item.productId);

    const product = byId.get(item.productId);
    if (!product) {
      return { ok: false, message: CHECKOUT_COPY.unknownProduct };
    }
    if (product.stock < item.quantity) {
      return { ok: false, message: CHECKOUT_COPY.outOfStock };
    }

    const unitPiasters = Math.round(product.priceEgp * PIASTERS_PER_POUND);
    const linePiasters = unitPiasters * item.quantity;
    totalPiasters += linePiasters;
    priced.push({
      productId: item.productId,
      quantity: item.quantity,
      unitPriceEgp: unitPiasters / PIASTERS_PER_POUND,
      lineTotalEgp: linePiasters / PIASTERS_PER_POUND,
    });
  }

  return {
    ok: true,
    items: priced,
    totalEgp: totalPiasters / PIASTERS_PER_POUND,
  };
}
