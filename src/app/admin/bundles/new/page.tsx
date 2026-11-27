import type { Metadata } from "next";

import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { BundleForm } from "@/features/bundles/components/admin/BundleForm";

export const metadata: Metadata = {
  title: "New bundle · Admin",
  robots: { index: false, follow: false },
};

export default function AdminNewBundlePage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="New bundle"
        description="Group two or more products and choose a discount percentage."
      />
      <BundleForm />
    </div>
  );
}
