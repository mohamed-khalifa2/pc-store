"use server";

import { z } from "zod";

import {
  adminFailure,
  adminSuccess,
  adminValidation,
  type AdminActionResult,
} from "@/features/admin/lib/action-result";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { formBoolean, formString } from "@/features/admin/lib/form-data";
import { refreshAndRevalidate } from "@/features/admin/lib/revalidate-public";
import { removeImages } from "@/features/admin/lib/storage";
import { requireAdmin } from "@/features/auth/lib/require-admin";
import { BANNER_PLACEMENTS } from "@/features/banners/config/placements";
import { bannerRowSchema } from "@/features/banners/schemas/banner";
import { CACHE_TAGS, STORAGE_BUCKETS } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/lib/supabase/types";

type UpsertBannerData = { id: string };
type BannerWrite = Database["public"]["Tables"]["banners"]["Insert"];

const dateTimeSchema = z
  .string()
  .nullable()
  .refine(
    (value) => value === null || !Number.isNaN(Date.parse(value)),
    "Enter a valid date and time.",
  );

const bannerSchema = z.object({
  id: z
    .string()
    .trim()
    .refine((value) => value === "" || z.uuid().safeParse(value).success, "Invalid banner id.")
    .transform((value) => (value === "" ? undefined : value)),
  name: z.string().trim().min(1, "Give the banner a name.").max(120),
  imagePath: z.string().min(1, "Upload a desktop image."),
  mobileImagePath: z.string().nullable(),
  placement: z.enum([
    BANNER_PLACEMENTS.home,
    BANNER_PLACEMENTS.category,
    BANNER_PLACEMENTS.cart,
    BANNER_PLACEMENTS.checkout,
  ]),
  headline: z.string().nullable(),
  subheadline: z.string().nullable(),
  ctaLabel: z.string().nullable(),
  ctaHref: z
    .string()
    .nullable()
    .refine(
      (value) => value === null || value.startsWith("/") || URL.canParse(value),
      "Use a relative path or a full URL.",
    ),
  sortOrder: z.number().int().nonnegative(),
  isActive: z.boolean(),
  publishedAt: dateTimeSchema,
  startsAt: dateTimeSchema,
  endsAt: dateTimeSchema,
});

function nullableText(value: string): string | null {
  return value.length > 0 ? value : null;
}

function dateTimeValue(value: string): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toISOString();
}

export async function upsertBanner(
  formData: FormData,
): Promise<AdminActionResult<UpsertBannerData>> {
  await requireAdmin();

  const rawSortOrder = formString(formData, "sortOrder");
  const parsed = bannerSchema.safeParse({
    id: formString(formData, "id"),
    name: formString(formData, "name"),
    imagePath: formString(formData, "imagePath"),
    mobileImagePath: nullableText(formString(formData, "mobileImagePath")),
    placement: formString(formData, "placement"),
    headline: nullableText(formString(formData, "headline")),
    subheadline: nullableText(formString(formData, "subheadline")),
    ctaLabel: nullableText(formString(formData, "ctaLabel")),
    ctaHref: nullableText(formString(formData, "ctaHref")),
    sortOrder: rawSortOrder === "" ? 0 : Number(rawSortOrder),
    isActive: formBoolean(formData, "isActive"),
    publishedAt: dateTimeValue(formString(formData, "publishedAt")),
    startsAt: dateTimeValue(formString(formData, "startsAt")),
    endsAt: dateTimeValue(formString(formData, "endsAt")),
  });

  if (!parsed.success) return adminValidation<UpsertBannerData>(parsed.error);
  const values = parsed.data;

  const payload: BannerWrite = {
    name: values.name,
    image_path: values.imagePath,
    mobile_image_path: values.mobileImagePath,
    placement: values.placement,
    headline: values.headline,
    subheadline: values.subheadline,
    cta_label: values.ctaLabel,
    cta_href: values.ctaHref,
    sort_order: values.sortOrder,
    is_active: values.isActive,
    published_at: values.publishedAt,
    starts_at: values.startsAt,
    ends_at: values.endsAt,
  };

  const client = createAdminClient();
  let bannerId = "";
  let message = "";
  let stalePaths: string[] = [];

  try {
    if (values.id) {
      const { data: existing, error: existingError } = await client
        .from("banners")
        .select("*")
        .eq("id", values.id)
        .maybeSingle();

      if (existingError) return adminFailure<UpsertBannerData>("The banner could not be loaded.");
      const existingRow = existing ? bannerRowSchema.safeParse(existing) : null;
      if (!existingRow?.success) {
        return adminFailure<UpsertBannerData>(ADMIN_COPY.invalidId);
      }

      const { data, error } = await client
        .from("banners")
        .update(payload)
        .eq("id", values.id)
        .select("id")
        .single();

      if (error || !data) return adminFailure<UpsertBannerData>("The banner could not be saved.");
      bannerId = data.id;
      message = "Banner saved.";
      stalePaths = [existingRow.data.image_path, existingRow.data.mobile_image_path].filter(
        (path): path is string =>
          Boolean(path) && path !== values.imagePath && path !== values.mobileImagePath,
      );
    } else {
      const { data, error } = await client.from("banners").insert(payload).select("id").single();
      if (error || !data) return adminFailure<UpsertBannerData>("The banner could not be created.");
      bannerId = data.id;
      message = "Banner created.";
    }
  } catch {
    return adminFailure<UpsertBannerData>(ADMIN_COPY.unexpectedError);
  }

  await removeImages(client, STORAGE_BUCKETS.banners, stalePaths).catch(() => undefined);
  refreshAndRevalidate(CACHE_TAGS.banners, [CACHE_TAGS.banners]);
  return adminSuccess(message, { id: bannerId });
}
