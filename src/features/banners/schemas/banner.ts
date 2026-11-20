import { z } from "zod";

export const bannerRowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  image_path: z.string().min(1),
  headline: z.string().nullable(),
  subheadline: z.string().nullable(),
  cta_label: z.string().nullable(),
  cta_href: z.string().nullable(),
});
