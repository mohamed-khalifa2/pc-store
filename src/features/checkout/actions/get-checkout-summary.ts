"use server";

import { CHECKOUT_COPY } from "@/features/checkout/config/copy";
import { parseCartInput } from "@/features/checkout/schemas/checkout";
import { priceCartItems } from "@/features/checkout/lib/pricing";
import type { CheckoutSummaryItem, CheckoutSummaryState } from "@/features/checkout/types";
import { getProductsByIds } from "@/features/products/queries/get-products-by-ids";

export async function getCheckoutSummary(itemsJson: string): Promise<CheckoutSummaryState> {
  const items = parseCartInput(itemsJson);

  if (!items || items.length === 0) {
    return { status: "empty", items: [], totalEgp: 0, message: CHECKOUT_COPY.cartEmpty };
  }

  try {
    const products = await getProductsByIds(items.map((item) => item.productId));
    const pricing = priceCartItems(items, products);

    if (!pricing.ok) {
      return { status: "error", items: [], totalEgp: 0, message: pricing.message };
    }

    const byId = new Map(products.map((product) => [product.id, product]));
    const summaryItems: CheckoutSummaryItem[] = pricing.items.map((item) => {
      const product = byId.get(item.productId);
      return { ...item, name: product?.name ?? "", sku: product?.sku ?? "" };
    });

    return { status: "ready", items: summaryItems, totalEgp: pricing.totalEgp, message: null };
  } catch {
    return { status: "error", items: [], totalEgp: 0, message: CHECKOUT_COPY.placeOrderError };
  }
}
