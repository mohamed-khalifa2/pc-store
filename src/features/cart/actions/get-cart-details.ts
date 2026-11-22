"use server";

import { cartItemsSchema, type CartItem } from "@/features/cart/schemas/cart";
import { cartDetailLinesSchema, type CartDetailLine } from "@/features/cart/schemas/cart-details";
import { DEFAULT_PRODUCT_IMAGE } from "@/features/products/config/defaults";
import { getProductsByIds } from "@/features/products/queries/get-products-by-ids";
import type { CheckoutProductData } from "@/features/products/types";

export async function getCartDetails(items: CartItem[]): Promise<CartDetailLine[]> {
  const parsed = cartItemsSchema.safeParse(items);
  if (!parsed.success || parsed.data.length === 0) {
    return [];
  }

  const safeItems = uniqueCartItems(parsed.data);
  const products = await getProductsByIds(safeItems.map((item) => item.productId)).catch(() => []);
  const productsById = new Map<string, CheckoutProductData>(
    products.map((product) => [product.id, product] as const),
  );

  const lines = safeItems.flatMap<CartDetailLine>((item) => {
    const product = productsById.get(item.productId);
    if (!product) return [];

    return [
      {
        id: product.id,
        name: product.name,
        imageUrl: DEFAULT_PRODUCT_IMAGE,
        priceEgp: product.priceEgp,
        stock: product.stock,
        quantity: item.quantity,
        lineTotalEgp: product.priceEgp * item.quantity,
      },
    ];
  });

  const validated = cartDetailLinesSchema.safeParse(lines);
  return validated.success ? validated.data : [];
}

function uniqueCartItems(items: CartItem[]): CartItem[] {
  const unique = new Map<string, CartItem>();

  for (const item of items) {
    const existing = unique.get(item.productId);
    if (!existing || item.quantity > existing.quantity) {
      unique.set(item.productId, item);
    }
  }

  return [...unique.values()];
}
