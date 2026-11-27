"use server";

import { z } from "zod";

import {
  adminFailure,
  adminValidation,
  type AdminActionResult,
} from "@/features/admin/lib/action-result";
import { requireAdmin } from "@/features/auth/lib/require-admin";
import { saveBundleDefinitions } from "@/features/bundles/lib/save-definitions";
import { getAdminBundles } from "@/features/bundles/queries/get-admin-bundles";

const bundleIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9-]+$/);

export async function deleteBundle(id: string): Promise<AdminActionResult> {
  await requireAdmin();

  const parsed = bundleIdSchema.safeParse(id);
  if (!parsed.success) return adminValidation(parsed.error);

  const definitions = await getAdminBundles();
  const next = definitions.filter((item) => item.id !== parsed.data);
  if (next.length === definitions.length) return adminFailure("That bundle no longer exists.");

  return saveBundleDefinitions(next);
}
