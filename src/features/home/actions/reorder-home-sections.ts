"use server";

import { z } from "zod";

import {
  adminFailure,
  adminSuccess,
  adminValidation,
  type AdminActionResult,
} from "@/features/admin/lib/action-result";
import { formString } from "@/features/admin/lib/form-data";
import { revalidatePublic } from "@/features/admin/lib/revalidate-public";
import { requireAdmin } from "@/features/auth/lib/require-admin";
import { CACHE_TAGS } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";

const SAVE_ERROR = "Section order could not be saved.";
const ORDER_STEP = 10;

const orderSchema = z
  .array(z.string().min(1))
  .min(1)
  .max(100)
  .refine((ids) => new Set(ids).size === ids.length, "Duplicate section in order.");

export async function reorderHomeSections(formData: FormData): Promise<AdminActionResult> {
  await requireAdmin();

  let rawIds: unknown;
  try {
    rawIds = JSON.parse(formString(formData, "sectionIds"));
  } catch {
    return adminFailure("Invalid section order.");
  }

  const parsed = orderSchema.safeParse(rawIds);
  if (!parsed.success) return adminValidation(parsed.error, "Invalid section order.");

  const supabase = createAdminClient();
  for (const [index, id] of parsed.data.entries()) {
    const { error } = await supabase
      .from("home_sections")
      .update({ sort_order: (index + 1) * ORDER_STEP })
      .eq("id", id);
    if (error) return adminFailure(SAVE_ERROR);
  }

  revalidatePublic([CACHE_TAGS.homeSections]);
  return adminSuccess<null>("Section order saved.");
}
