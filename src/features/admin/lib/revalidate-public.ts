import { revalidateTag, updateTag } from "next/cache";

import { CACHE_TAGS } from "@/lib/constants";

export type PublicCacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

export function revalidatePublic(tags: readonly PublicCacheTag[]): void {
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
}

export function refreshAdminTag(tag: PublicCacheTag): void {
  updateTag(tag);
}

export function refreshAndRevalidate(tag: PublicCacheTag, publicTags: readonly PublicCacheTag[]) {
  refreshAdminTag(tag);
  revalidatePublic(publicTags);
}
