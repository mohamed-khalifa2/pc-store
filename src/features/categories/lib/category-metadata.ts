import type { Metadata } from "next";

import { CATEGORY_COPY } from "@/features/categories/config/copy";
import { getCategoryBySlug } from "@/features/categories/queries/get-category-by-slug";

export async function buildCategoryMetadata(slug: string): Promise<Metadata> {
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return {
      title: CATEGORY_COPY.notFoundTitle,
      robots: { index: false, follow: false },
    };
  }

  const description = category.description ?? CATEGORY_COPY.indexDescription;

  return {
    title: category.name,
    description,
    openGraph: {
      title: category.name,
      description,
      images: [{ url: category.imageUrl }],
    },
  };
}
