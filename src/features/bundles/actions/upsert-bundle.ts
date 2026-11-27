"use server";

import {
  adminFailure,
  adminSuccess,
  adminValidation,
  type AdminActionResult,
} from "@/features/admin/lib/action-result";
import { formString } from "@/features/admin/lib/form-data";
import { requireAdmin } from "@/features/auth/lib/require-admin";
import type { BundleDefinition } from "@/features/bundles/config/bundles";
import { saveBundleDefinitions } from "@/features/bundles/lib/save-definitions";
import { getAdminBundles } from "@/features/bundles/queries/get-admin-bundles";
import { bundleFormSchema } from "@/features/bundles/schemas/bundle";

export async function upsertBundle(formData: FormData): Promise<AdminActionResult<{ id: string }>> {
  await requireAdmin();

  const parsed = bundleFormSchema.safeParse({
    id: formString(formData, "id"),
    slug: formString(formData, "slug"),
    name: formString(formData, "name"),
    description: formString(formData, "description"),
    tag: formString(formData, "tag"),
    discountPercent: formString(formData, "discountPercent"),
    productSlugs: formString(formData, "productSlugs"),
  });
  if (!parsed.success) return adminValidation(parsed.error);

  const definition: BundleDefinition = parsed.data;
  const definitions = await getAdminBundles();
  const existingIndex = definitions.findIndex((item) => item.id === definition.id);
  const slugTaken = definitions.some(
    (item) => item.slug === definition.slug && item.id !== definition.id,
  );
  const idTakenWithoutEdit =
    existingIndex < 0 && definitions.some((item) => item.id === definition.id);

  if (slugTaken || idTakenWithoutEdit) {
    return adminFailure("That id or slug is already in use.", {
      [slugTaken ? "slug" : "id"]: ["Choose a unique value."],
    });
  }

  const next =
    existingIndex >= 0
      ? definitions.map((item, index) => (index === existingIndex ? definition : item))
      : [...definitions, definition];

  const saved = await saveBundleDefinitions(next);
  if (!saved.ok)
    return adminFailure(saved.error ?? "Bundle could not be saved.", saved.fieldErrors);

  return adminSuccess<{ id: string }>("Bundle saved.", { id: definition.id });
}
