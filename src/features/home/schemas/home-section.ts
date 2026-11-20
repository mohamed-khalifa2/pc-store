import { z } from "zod";

import { BANNER_VARIANTS } from "@/features/banners/config/variants";

export const homeSectionConfigSchema = z.object({
  limit: z.number().int().min(1).max(12).optional(),
  variants: z.array(z.enum(BANNER_VARIANTS)).optional(),
  items: z.array(z.string().min(1)).max(12).optional(),
  href: z.string().optional(),
  label: z.string().optional(),
});

export const homeSectionBodySchema = z.record(z.string(), z.unknown());

export const homeSectionRowSchema = z.object({
  id: z.string().min(1),
  key: z.string().min(1),
  kind: z.string().min(1),
  title: z.string().nullable(),
  subtitle: z.string().nullable(),
  body: homeSectionBodySchema,
  config: z.record(z.string(), z.unknown()),
  sort_order: z.number(),
});
