import { z } from "zod";

import { CART_MAX_ITEMS, CART_MAX_QUANTITY } from "@/lib/constants";

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(CART_MAX_QUANTITY),
});

export const cartItemsSchema = z.array(cartItemSchema).max(CART_MAX_ITEMS);

export type CartItem = z.infer<typeof cartItemSchema>;

export function parseCartItems(value: unknown): CartItem[] {
  const parsed = cartItemsSchema.safeParse(value);
  return parsed.success ? parsed.data : [];
}

export function parseCartItemsJson(value: string): CartItem[] {
  try {
    return parseCartItems(JSON.parse(value) as unknown);
  } catch {
    return [];
  }
}
