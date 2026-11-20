import { cacheLife, cacheTag } from "next/cache";
import { z } from "zod";

import { CACHE_TAGS } from "@/lib/constants";
import { createPublicClient } from "@/lib/supabase/server";

import { DEFAULT_HOME_SECTIONS } from "@/features/home/config/defaults";
import { normalizeSection } from "@/features/home/lib/normalize-section";
import { homeSectionRowSchema } from "@/features/home/schemas/home-section";
import type { HomeSection } from "@/features/home/types";

export async function getHomeSections(): Promise<HomeSection[]> {
  "use cache";
  cacheTag(CACHE_TAGS.homeSections);
  cacheLife("hours");

  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("home_sections")
      .select("id, key, kind, title, subtitle, body, config, sort_order")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) return DEFAULT_HOME_SECTIONS.map((section) => ({ ...section }));

    const parsed = z.array(homeSectionRowSchema).safeParse(data ?? []);
    if (!parsed.success) return DEFAULT_HOME_SECTIONS.map((section) => ({ ...section }));

    const sections = parsed.data
      .map((row) => normalizeSection(row))
      .filter((section): section is HomeSection => section !== null);

    return sections.length > 0
      ? sections
      : DEFAULT_HOME_SECTIONS.map((section) => ({ ...section }));
  } catch {
    return DEFAULT_HOME_SECTIONS.map((section) => ({ ...section }));
  }
}
