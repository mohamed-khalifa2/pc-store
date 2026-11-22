import { z } from "zod";

import { ADMIN_IMAGES_MAX, ADMIN_PRODUCT_FIELDS } from "@/features/products/schemas/admin-product";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATETIME_LOCAL_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const STORAGE_PATH_PATTERN = /^[a-zA-Z0-9/_-]+(?:\.[a-zA-Z0-9]+)?$/;

export const adminSpecsInputSchema = z
  .object({ keys: z.array(z.string().trim()), values: z.array(z.string().trim()) })
  .superRefine((input, context) => {
    const seen = new Set<string>();
    const length = Math.max(input.keys.length, input.values.length);
    for (let index = 0; index < length; index += 1) {
      const key = input.keys[index] ?? "";
      const value = input.values[index] ?? "";
      if (!key && !value) continue;
      const issue = !key
        ? "A specification needs a key."
        : seen.has(key.toLowerCase())
          ? "Duplicate specification key."
          : null;
      if (issue) context.addIssue({ code: "custom", path: ["keys", index], message: issue });
      if (key) seen.add(key.toLowerCase());
    }
  })
  .transform((input) => {
    const result: Record<string, string> = {};
    input.keys.forEach((key, index) => {
      if (key) result[key] = input.values[index] ?? "";
    });
    return result;
  });

const uploadedPathSchema = z
  .string()
  .trim()
  .min(1)
  .max(500)
  .refine(
    (value) =>
      !/^https?:\/\//i.test(value) &&
      !value.startsWith("/") &&
      !value.includes("..") &&
      STORAGE_PATH_PATTERN.test(value),
    "Only uploaded image paths are accepted.",
  );

export const adminProductFormSchema = z
  .object({
    [ADMIN_PRODUCT_FIELDS.id]: z.string().trim().max(100),
    [ADMIN_PRODUCT_FIELDS.name]: z.string().trim().min(1, "Enter a product name.").max(200),
    [ADMIN_PRODUCT_FIELDS.slug]: z
      .string()
      .trim()
      .min(1, "Enter a URL slug.")
      .max(200)
      .regex(SLUG_PATTERN, "Use lowercase letters, numbers, and hyphens."),
    [ADMIN_PRODUCT_FIELDS.sku]: z.string().trim().min(1, "Enter an SKU.").max(100),
    [ADMIN_PRODUCT_FIELDS.description]: z.string().trim().max(5000),
    [ADMIN_PRODUCT_FIELDS.categoryId]: z.string().trim().max(100),
    [ADMIN_PRODUCT_FIELDS.priceEgp]: z
      .number({ error: "Enter a price." })
      .finite()
      .nonnegative("Price cannot be negative."),
    [ADMIN_PRODUCT_FIELDS.compareAtPrice]: z.union([
      z.number({ error: "Enter a valid compare-at price." }).finite().nonnegative(),
      z.null(),
    ]),
    [ADMIN_PRODUCT_FIELDS.stock]: z
      .number({ error: "Enter a stock quantity." })
      .int("Stock must be a whole number.")
      .nonnegative("Stock cannot be negative."),
    [ADMIN_PRODUCT_FIELDS.sortOrder]: z.number().int("Sort order must be a whole number."),
    [ADMIN_PRODUCT_FIELDS.isPublished]: z.boolean(),
    [ADMIN_PRODUCT_FIELDS.isFeatured]: z.boolean(),
    [ADMIN_PRODUCT_FIELDS.publishedAt]: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || DATETIME_LOCAL_PATTERN.test(value),
        "Use a valid date and time.",
      )
      .transform((value) => (value === "" ? null : value)),
    specs: z.record(z.string(), z.string()),
    imagePaths: z.array(uploadedPathSchema).max(ADMIN_IMAGES_MAX, "Choose up to 10 images."),
  })
  .refine((value) => value.compareAtPrice === null || value.compareAtPrice >= value.priceEgp, {
    path: ["compareAtPrice"],
    message: "Compare-at price cannot be lower than price.",
  });
