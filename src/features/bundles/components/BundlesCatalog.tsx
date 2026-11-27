import { BundlesSection } from "@/features/bundles/components/BundlesSection";
import { getBundles } from "@/features/bundles/queries/get-bundles";

export async function BundlesCatalog() {
  const bundles = await getBundles();

  return <BundlesSection bundles={bundles} headingLevel={1} />;
}
