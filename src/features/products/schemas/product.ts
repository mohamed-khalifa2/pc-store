import { z } from "zod";

import type { ProductSpec } from "@/features/products/types";

export const productRowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable(),
  price_egp: z.number().nonnegative(),
  compare_at_price: z.number().nonnegative().nullable(),
  stock: z.number().int().nonnegative(),
});

export const checkoutProductRowSchema = productRowSchema.extend({
  sku: z.string().min(1),
  specs: z.record(z.string(), z.unknown()),
});

export const productImageRowSchema = z.object({
  product_id: z.string().min(1),
  storage_path: z.string().min(1),
  alt_text: z.string().nullable(),
  sort_order: z.number().int(),
});

export const productSpecsSchema = z.record(z.string(), z.unknown());

function specLabel(key: string): string {
  const spaced = key.replaceAll("_", " ");
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function specValue(value: unknown): string {
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (value === null || value === undefined) return "—";
  return JSON.stringify(value);
}

export function parseProductSpecs(value: unknown): ProductSpec[] {
  const parsed = productSpecsSchema.safeParse(value);
  if (!parsed.success) return [];

  return Object.entries(parsed.data)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, entry]) => ({ label: specLabel(key), value: specValue(entry) }));
}
