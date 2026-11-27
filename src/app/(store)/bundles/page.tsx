import type { Metadata } from "next";
import { Suspense } from "react";

import { BundlesCatalog } from "@/features/bundles/components/BundlesCatalog";
import { BundlesSkeleton } from "@/features/bundles/components/BundlesSkeleton";
import { BUNDLE_COPY } from "@/features/bundles/config/copy";

export const metadata: Metadata = {
  title: BUNDLE_COPY.title,
  description: BUNDLE_COPY.description,
};

export default function BundlesPage() {
  return (
    <Suspense fallback={<BundlesSkeleton />}>
      <BundlesCatalog />
    </Suspense>
  );
}
