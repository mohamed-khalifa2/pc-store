import { z } from "zod";

import type { createPublicClient } from "@/lib/supabase/server";

type PublicClient = ReturnType<typeof createPublicClient>;

export type CategoryIdLookup = { available: true; id: string | null } | { available: false };

const idRowSchema = z.object({ id: z.string().min(1) });

export async function findCategoryId(
  client: PublicClient,
  slug: string,
): Promise<CategoryIdLookup> {
  try {
    const { data, error } = await client
      .from("categories")
      .select("id")
      .eq("slug", slug)
      .maybeSingle();

    if (error) return { available: false };
    if (!data) return { available: true, id: null };

    const parsed = idRowSchema.safeParse(data);
    if (!parsed.success) return { available: false };

    return { available: true, id: parsed.data.id };
  } catch {
    return { available: false };
  }
}
