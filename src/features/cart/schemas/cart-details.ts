import { z } from "zod";

export const cartDetailLineSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  imageUrl: z.string().min(1),
  priceEgp: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  quantity: z.number().int().min(1),
  lineTotalEgp: z.number().nonnegative(),
});

export const cartDetailLinesSchema = z.array(cartDetailLineSchema);

export type CartDetailLine = z.infer<typeof cartDetailLineSchema>;
