import "server-only";

import { z } from "zod";

import { requireAdmin } from "@/features/auth/lib/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  adminCategoryOptionRowSchema,
  type AdminCategoryOption,
} from "@/features/products/schemas/admin-product";

export async function getAdminCategoryOptions(): Promise<AdminCategoryOption[]> {
  await requireAdmin();

  try {
    const client = createAdminClient();
    const { data, error } = await client
      .from("categories")
      .select("id, name, slug")
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });
    if (error) return [];

    const parsed = z.array(adminCategoryOptionRowSchema).safeParse(data ?? []);
    return parsed.success ? parsed.data : [];
  } catch {
    return [];
  }
}
