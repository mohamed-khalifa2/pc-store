import { z } from "zod";

export const bannerRowSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  image_path: z.string().min(1),
  mobile_image_path: z.string().nullable().catch(null),
  placement: z.string().catch("home"),
  headline: z.string().nullable(),
  subheadline: z.string().nullable(),
  cta_label: z.string().nullable(),
  cta_href: z.string().nullable(),
  sort_order: z.number().catch(0),
  is_active: z.boolean().catch(false),
  published_at: z.string().nullable().catch(null),
  starts_at: z.string().nullable().catch(null),
  ends_at: z.string().nullable().catch(null),
});
