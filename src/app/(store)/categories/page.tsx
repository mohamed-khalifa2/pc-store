import type { Metadata } from "next";
import { Suspense } from "react";

import { CATEGORY_COPY } from "@/features/categories/config/copy";
import { CategoriesIndex } from "@/features/categories/components/CategoriesIndex";
import { CategoriesSkeleton } from "@/features/categories/components/CategoriesSkeleton";

export const metadata: Metadata = {
  title: CATEGORY_COPY.indexTitle,
  description: CATEGORY_COPY.indexDescription,
};

export default function CategoriesPage() {
  return (
    <Suspense fallback={<CategoriesSkeleton />}>
      <CategoriesIndex />
    </Suspense>
  );
}
