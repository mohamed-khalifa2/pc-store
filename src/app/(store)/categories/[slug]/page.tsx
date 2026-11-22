import type { Metadata } from "next";
import { Suspense } from "react";

import { DEFAULT_CATEGORIES } from "@/features/categories/config/defaults";
import { CategoryDetail } from "@/features/categories/components/CategoryDetail";
import { CategoryDetailSkeleton } from "@/features/categories/components/CategoryDetailSkeleton";
import { buildCategoryMetadata } from "@/features/categories/lib/category-metadata";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export function generateStaticParams() {
  return DEFAULT_CATEGORIES.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  return buildCategoryMetadata(slug);
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;

  return (
    <Suspense fallback={<CategoryDetailSkeleton />}>
      <CategoryDetail slug={slug} searchParams={searchParams} />
    </Suspense>
  );
}
