import type { z } from "zod";

import {
  LEGACY_SECTION_KINDS,
  VISIBLE_SECTION_KINDS,
  type HomeSectionKind,
} from "@/features/home/config/sections";
import {
  homeSectionConfigSchema,
  type homeSectionRowSchema,
} from "@/features/home/schemas/home-section";
import type { HomeSection } from "@/features/home/types";

type HomeSectionRow = z.infer<typeof homeSectionRowSchema>;

const VISIBLE_KINDS = new Set<string>(VISIBLE_SECTION_KINDS);

function normalizeKind(kind: string): HomeSectionKind | null {
  if (VISIBLE_KINDS.has(kind)) return kind as HomeSectionKind;
  return LEGACY_SECTION_KINDS[kind] ?? null;
}

export function normalizeSection(row: HomeSectionRow): HomeSection | null {
  const kind = normalizeKind(row.kind);
  if (!kind) return null;

  const config = homeSectionConfigSchema.safeParse(row.config);

  return {
    id: row.id,
    key: row.key,
    kind,
    title: row.title,
    subtitle: row.subtitle,
    body: row.body,
    config: config.success ? config.data : {},
    sortOrder: row.sort_order,
  };
}
