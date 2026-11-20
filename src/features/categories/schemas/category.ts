import { z } from "zod";

export const categoryRowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable(),
  image_path: z.string().nullable(),
});
