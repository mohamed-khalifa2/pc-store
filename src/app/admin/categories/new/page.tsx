import type { Metadata } from "next";
import Link from "next/link";

import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminPanel } from "@/features/admin/components/AdminPanel";
import { CategoryForm } from "@/features/categories/components/admin/CategoryForm";
import { getAdminCategories } from "@/features/categories/queries/get-admin-categories";

export const metadata: Metadata = {
  title: "New category · Admin",
  robots: { index: false, follow: false },
};

export default async function NewAdminCategoryPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="New category"
        description="Add a category, choose its place in the tree, and control when it goes live."
        action={
          <Link
            href={ADMIN_ROUTES.categories}
            className="text-surface-400 hover:text-accent text-xs font-black tracking-widest uppercase"
          >
            Back to categories
          </Link>
        }
      />
      <AdminPanel>
        <CategoryForm categories={categories} />
      </AdminPanel>
    </div>
  );
}
