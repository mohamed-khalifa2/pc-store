import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { BundleForm } from "@/features/bundles/components/admin/BundleForm";
import { getAdminBundles } from "@/features/bundles/queries/get-admin-bundles";

export const metadata: Metadata = {
  title: "Edit bundle · Admin",
  robots: { index: false, follow: false },
};

type AdminBundlePageProps = { params: Promise<{ id: string }> };

export default async function AdminBundlePage({ params }: AdminBundlePageProps) {
  const { id } = await params;
  const bundles = await getAdminBundles();
  const definition = bundles.find((bundle) => bundle.id === id);
  if (!definition) notFound();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={definition.name}
        description="Update the bundle copy, products, and discount."
      />
      <BundleForm definition={definition} />
    </div>
  );
}
