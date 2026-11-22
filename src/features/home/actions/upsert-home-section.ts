"use server";

import { z } from "zod";

import {
  adminFailure,
  adminSuccess,
  adminValidation,
  type AdminActionResult,
} from "@/features/admin/lib/action-result";
import { formBoolean, formString } from "@/features/admin/lib/form-data";
import { revalidatePublic } from "@/features/admin/lib/revalidate-public";
import { requireAdmin } from "@/features/auth/lib/require-admin";
import { CACHE_TAGS } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";

import { BANNER_VARIANTS } from "@/features/banners/config/variants";
import { VISIBLE_SECTION_KINDS } from "@/features/home/config/sections";
import type { HomeSectionConfig } from "@/features/home/types";

const SAVE_ERROR = "Home section could not be saved.";
const TOGGLE_ERROR = "Publication status could not be updated.";
const NEW_SECTION_SORT_ORDER = 1000;
const VISIBLE_KINDS = new Set<string>(VISIBLE_SECTION_KINDS);

const publishedAtSchema = z
  .string()
  .trim()
  .max(40)
  .refine((value) => value === "" || !Number.isNaN(Date.parse(value)), "Enter a valid date.");

const homeSectionFormSchema = z.object({
  id: z.string(),
  key: z.string().min(1, "A section key is required.").max(120),
  kind: z.string().refine((kind) => VISIBLE_KINDS.has(kind), "Choose a section kind."),
  title: z.string().max(200),
  subtitle: z.string().max(300),
  isPublished: z.boolean(),
  publishedAt: publishedAtSchema,
  limit: z.number().int().min(1).max(12).nullable(),
  variants: z.array(z.enum(BANNER_VARIANTS)),
  items: z.array(z.string().min(1)).max(12),
  href: z.string().max(300),
  label: z.string().max(120),
});

const toggleSchema = z.object({
  id: z.string().min(1),
  isPublished: z.boolean(),
});

function toRow(input: z.infer<typeof homeSectionFormSchema>) {
  const config: HomeSectionConfig = {};
  if (input.limit !== null) config.limit = input.limit;
  if (input.variants.length > 0) config.variants = [...input.variants];
  if (input.items.length > 0) config.items = input.items;
  if (input.href) config.href = input.href;
  if (input.label) config.label = input.label;

  let publishedAt: string | null = null;
  if (input.isPublished) {
    publishedAt = input.publishedAt
      ? new Date(input.publishedAt).toISOString()
      : new Date().toISOString();
  }

  return {
    key: input.key,
    kind: input.kind,
    title: input.title || null,
    subtitle: input.subtitle || null,
    config,
    is_published: input.isPublished,
    published_at: publishedAt,
  };
}

export async function upsertHomeSection(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();

  const rawLimit = formString(formData, "limit");
  const parsed = homeSectionFormSchema.safeParse({
    id: formString(formData, "id"),
    key: formString(formData, "key"),
    kind: formString(formData, "kind"),
    title: formString(formData, "title"),
    subtitle: formString(formData, "subtitle"),
    isPublished: formBoolean(formData, "isPublished"),
    publishedAt: formString(formData, "publishedAt"),
    limit: rawLimit === "" ? null : Number(rawLimit),
    variants: formData
      .getAll("variants")
      .filter((value): value is string => typeof value === "string"),
    items: formString(formData, "items")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    href: formString(formData, "href"),
    label: formString(formData, "label"),
  });
  if (!parsed.success) return adminValidation(parsed.error);

  const input = parsed.data;
  const row = toRow(input);
  const supabase = createAdminClient();

  const result = input.id
    ? await supabase.from("home_sections").update(row).eq("id", input.id)
    : await supabase.from("home_sections").insert({
        ...row,
        body: {},
        sort_order: NEW_SECTION_SORT_ORDER,
      });

  if (result.error) return adminFailure(SAVE_ERROR);

  revalidatePublic([CACHE_TAGS.homeSections]);
  return adminSuccess<null>("Home section saved.");
}

export async function toggleHomeSectionPublication(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = toggleSchema.safeParse({
    id: formString(formData, "id"),
    isPublished: formBoolean(formData, "isPublished"),
  });
  if (!parsed.success) return adminValidation(parsed.error, "Invalid publication request.");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("home_sections")
    .update({
      is_published: parsed.data.isPublished,
      published_at: parsed.data.isPublished ? new Date().toISOString() : null,
    })
    .eq("id", parsed.data.id);

  if (error) return adminFailure(TOGGLE_ERROR);

  revalidatePublic([CACHE_TAGS.homeSections]);
  return adminSuccess<null>("Publication updated.");
}
