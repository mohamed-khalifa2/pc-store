import { z } from "zod";

import type { Json } from "@/lib/supabase/types";

import { checkoutProductRowSchema } from "@/features/products/schemas/product";

const jsonValueSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema),
    z.record(z.string(), jsonValueSchema),
  ]),
);

export const checkoutCatalogRowSchema = checkoutProductRowSchema.extend({
  specs: jsonValueSchema,
});
