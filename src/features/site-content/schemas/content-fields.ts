import { z } from "zod";

import { HERO_ARTWORK, HERO_IMAGE_PREFIX } from "@/features/scroll-hero/config/hero-artwork";
import { SITE_CONTENT_KEYS, type SiteContentKey } from "@/features/site-content/config/keys";

const IMAGE_NAME = "[a-zA-Z0-9/_-]+\\.(png|webp|avif|jpe?g|svg)";
const HERO_IMAGE_PATTERN = new RegExp(
  `^(/${HERO_IMAGE_PREFIX}/${IMAGE_NAME}|${HERO_IMAGE_PREFIX}/${IMAGE_NAME})$`,
);
const heroImageSchema = z
  .string()
  .trim()
  .min(1, "Choose a hero image.")
  .refine(
    (value) => value === HERO_ARTWORK.src || HERO_IMAGE_PATTERN.test(value),
    "Choose a valid hero image.",
  );

const FIELD_SCHEMAS: Partial<Record<SiteContentKey, z.ZodString>> = {
  [SITE_CONTENT_KEYS.heroImage]: heroImageSchema,
  [SITE_CONTENT_KEYS.heroImageAlt]: z
    .string()
    .trim()
    .min(3, "Describe the hero artwork in at least 3 characters.")
    .max(160, "Keep the description to 160 characters or fewer."),
};

export function validateContentField(key: SiteContentKey, value: string) {
  const schema = FIELD_SCHEMAS[key];
  return schema ? schema.safeParse(value) : { success: true as const, data: value };
}
