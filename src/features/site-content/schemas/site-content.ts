import { z } from "zod";

export const siteContentEntrySchema = z.object({
  key: z.string().min(1),
  value: z.union([z.string(), z.number(), z.boolean()]),
});
