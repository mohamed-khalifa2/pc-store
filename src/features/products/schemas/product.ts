import { z } from "zod";

export const productRowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable(),
  price_egp: z.number().nonnegative(),
  compare_at_price: z.number().nonnegative().nullable(),
  stock: z.number().int().nonnegative(),
});
