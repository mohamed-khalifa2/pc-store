import { z } from "zod";

import { categoryRowSchema } from "@/features/categories/schemas/category";

export const categoryDetailRowSchema = categoryRowSchema.extend({
  parent_id: z.string().nullable(),
  sort_order: z.number().int(),
});

export const categorySlugSchema = z
  .string()
  .trim()
  .regex(/^[a-zA-Z0-9_-]+$/)
  .min(1)
  .max(200);

export type CategoryDetailRow = z.infer<typeof categoryDetailRowSchema>;
