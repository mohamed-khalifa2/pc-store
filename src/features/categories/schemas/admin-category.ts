import { z } from "zod";

export const CATEGORY_IMAGE_PREFIX = "categories";

export const CATEGORY_FORM_FIELDS = {
  id: "id",
  name: "name",
  slug: "slug",
  description: "description",
  parentId: "parentId",
  imagePath: "imagePath",
  sortOrder: "sortOrder",
  isPublished: "isPublished",
  publishedAt: "publishedAt",
} as const;

const optionalIdSchema = z.union([z.literal(""), z.uuid()]).transform((value) => value || null);

const imagePathSchema = z
  .string()
  .trim()
  .max(500, "Image path is too long.")
  .refine(
    (value) => value === "" || (!/^https?:\/\//i.test(value) && !value.includes("..")),
    "Invalid image path.",
  )
  .transform((value) => value || null);

const publishedAtSchema = z
  .union([
    z.literal(""),
    z
      .string()
      .refine((value) => !Number.isNaN(new Date(value).getTime()), "Enter a valid publish date."),
  ])
  .transform((value) => (value ? new Date(value).toISOString() : null));

export const categoryUpsertSchema = z
  .object({
    id: optionalIdSchema,
    name: z.string().trim().min(1, "Name is required.").max(120, "Name is too long."),
    slug: z
      .string()
      .trim()
      .min(1, "Slug is required.")
      .max(120, "Slug is too long.")
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
    description: z
      .string()
      .trim()
      .max(2000, "Description is too long.")
      .transform((value) => value || null),
    parentId: optionalIdSchema,
    imagePath: imagePathSchema,
    sortOrder: z.preprocess(
      (value) => value ?? 0,
      z
        .number()
        .int()
        .min(0, "Sort order cannot be negative.")
        .max(9999, "Sort order is too large."),
    ),
    isPublished: z.boolean(),
    publishedAt: publishedAtSchema,
  })
  .refine((value) => value.parentId !== value.id, {
    path: [CATEGORY_FORM_FIELDS.parentId],
    message: "A category cannot be its own parent.",
  });

export const categoryDeleteSchema = z.object({
  id: z.uuid(),
});

export const adminCategoryRowSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullable(),
  image_path: z.string().nullable(),
  parent_id: z.uuid().nullable(),
  sort_order: z.number().int(),
  is_published: z.boolean(),
  published_at: z.string().nullable(),
});
