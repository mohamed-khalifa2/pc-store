import { z } from "zod";

import { cartItemsSchema, type CartItem } from "@/features/cart/schemas/cart";
import { EGYPT_GOVERNORATES } from "@/features/checkout/config/governorates";
import { CHECKOUT_FIELDS, PAYMENT_PROVIDERS } from "@/lib/constants";

const phonePattern = /^01[0-25]\d{8}$/;

export const checkoutShippingSchema = z.object({
  [CHECKOUT_FIELDS.fullName]: z.string().trim().min(2).max(100),
  [CHECKOUT_FIELDS.phone]: z.string().trim().regex(phonePattern),
  [CHECKOUT_FIELDS.governorate]: z.enum(EGYPT_GOVERNORATES),
  [CHECKOUT_FIELDS.city]: z.string().trim().min(2).max(100),
  [CHECKOUT_FIELDS.address]: z.string().trim().min(5).max(300),
  [CHECKOUT_FIELDS.notes]: z.string().trim().max(1000),
});

export const checkoutFormSchema = checkoutShippingSchema.extend({
  [CHECKOUT_FIELDS.items]: z.string().min(1),
  [CHECKOUT_FIELDS.paymentProvider]: z.enum([
    PAYMENT_PROVIDERS.cod,
    PAYMENT_PROVIDERS.paymob,
  ] as const),
});

export type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export function parseCartInput(value: string): CartItem[] | null {
  try {
    const parsed = cartItemsSchema.safeParse(JSON.parse(value) as unknown);
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}
