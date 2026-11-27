import { z } from "zod";

const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/);

export const bundleDefinitionSchema = z.object({
  id: slugSchema,
  slug: slugSchema,
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(240),
  tag: z.string().trim().min(1).max(40),
  discountPercent: z.number().int().min(1).max(50),
  productSlugs: z.array(slugSchema).min(2).max(6),
});

export const bundleDefinitionsSchema = z
  .array(bundleDefinitionSchema)
  .min(1, "Keep at least one bundle.")
  .max(12)
  .refine(
    (definitions) => new Set(definitions.map((item) => item.id)).size === definitions.length,
    {
      message: "Bundle ids must be unique.",
    },
  )
  .refine(
    (definitions) => new Set(definitions.map((item) => item.slug)).size === definitions.length,
    {
      message: "Bundle slugs must be unique.",
    },
  );

const productSlugsInput = z
  .string()
  .trim()
  .min(1, "Add at least two product slugs.")
  .transform((value) =>
    value
      .split(/[\n,]+/)
      .map((slug) => slug.trim())
      .filter(Boolean),
  )
  .pipe(z.array(slugSchema).min(2, "Add at least two product slugs.").max(6));

export const bundleFormSchema = z.object({
  id: slugSchema,
  slug: slugSchema,
  name: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(240),
  tag: z.string().trim().min(1).max(40),
  discountPercent: z.coerce.number().int().min(1).max(50),
  productSlugs: productSlugsInput,
});
