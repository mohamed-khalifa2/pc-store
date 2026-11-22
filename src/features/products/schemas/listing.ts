import { z } from "zod";

import { productRowSchema, productSpecsSchema } from "@/features/products/schemas/product";

export const listedProductRowSchema = productRowSchema.extend({
  category_id: z.string().nullable(),
  sort_order: z.number().int(),
  created_at: z.string(),
});

export const detailProductRowSchema = productRowSchema.extend({
  category_id: z.string().nullable(),
  sku: z.string().min(1),
  specs: productSpecsSchema,
});
