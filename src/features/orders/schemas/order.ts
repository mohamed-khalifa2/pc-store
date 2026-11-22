import { z } from "zod";

import { SHIPPING_KEYS } from "@/features/checkout/config/shipping-keys";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

export type OrderStatus = keyof typeof ORDER_STATUS_LABELS;

export const orderStatusSchema = z.custom<OrderStatus>(
  (value): value is OrderStatus => typeof value === "string" && value in ORDER_STATUS_LABELS,
);

export const shippingAddressSchema = z
  .object({
    [SHIPPING_KEYS.fullName]: z.string(),
    [SHIPPING_KEYS.phone]: z.string(),
    [SHIPPING_KEYS.governorate]: z.string(),
    [SHIPPING_KEYS.city]: z.string(),
    [SHIPPING_KEYS.address]: z.string(),
    [SHIPPING_KEYS.notes]: z.string().optional(),
  })
  .passthrough();

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

const fallbackAddress: ShippingAddress = {
  [SHIPPING_KEYS.fullName]: "",
  [SHIPPING_KEYS.phone]: "",
  [SHIPPING_KEYS.governorate]: "",
  [SHIPPING_KEYS.city]: "",
  [SHIPPING_KEYS.address]: "",
};

const addressFromJson = z.unknown().transform((value) => {
  const parsed = shippingAddressSchema.safeParse(value);
  return parsed.success ? parsed.data : fallbackAddress;
});

export const orderRowSchema = z.object({
  id: z.uuid(),
  order_number: z.string().min(1),
  user_id: z.uuid(),
  status: orderStatusSchema,
  total_egp: z.number().nonnegative(),
  currency: z.string(),
  placed_at: z.string(),
  customer_email: z.string().nullable(),
  customer_phone: z.string().nullable(),
  shipping_address: addressFromJson,
});

export const orderItemRowSchema = z.object({
  id: z.uuid(),
  order_id: z.uuid(),
  product_id: z.uuid().nullable(),
  product_name: z.string(),
  sku: z.string().nullable(),
  unit_price_egp: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  line_total_egp: z.number().nullable(),
  selected_specs: z.unknown(),
});

export const orderWithItemsSchema = orderRowSchema.extend({
  order_items: z.array(orderItemRowSchema),
});
