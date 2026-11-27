import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/LinkButton";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminPanel } from "@/features/admin/components/AdminPanel";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { BundleTable } from "@/features/bundles/components/admin/BundleTable";
import { getAdminBundles } from "@/features/bundles/queries/get-admin-bundles";

export const metadata: Metadata = {
  title: "Bundles · Admin",
  robots: { index: false, follow: false },
};

export default async function AdminBundlesPage() {
  const bundles = await getAdminBundles();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Bundles"
        description="Build discounted product groups for the storefront bundles section."
        action={
          <LinkButton href={ADMIN_ROUTES.bundleNew} size="sm">
            New bundle
          </LinkButton>
        }
      />
      <AdminPanel title="All bundles" description="Changes appear on the public bundles page.">
        <BundleTable rows={bundles} />
      </AdminPanel>
    </div>
  );
}
