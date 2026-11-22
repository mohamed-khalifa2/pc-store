import { z } from "zod";

import type { createPublicClient } from "@/lib/supabase/server";

type PublicClient = ReturnType<typeof createPublicClient>;
type CategoryRef = { name: string; slug: string };

export type CategoryRefLookup = { available: true; ref: CategoryRef | null } | { available: false };

const refRowSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
});

export async function findCategoryRefById(
  client: PublicClient,
  categoryId: string | null,
): Promise<CategoryRefLookup> {
  if (!categoryId) return { available: true, ref: null };

  try {
    const { data, error } = await client
      .from("categories")
      .select("name, slug")
      .eq("id", categoryId)
      .maybeSingle();

    if (error) return { available: false };
    if (!data) return { available: true, ref: null };

    const parsed = refRowSchema.safeParse(data);
    if (!parsed.success) return { available: false };

    return { available: true, ref: parsed.data };
  } catch {
    return { available: false };
  }
}
