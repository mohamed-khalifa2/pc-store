import type { Metadata } from "next";

import { LinkButton } from "@/components/ui/LinkButton";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminPanel } from "@/features/admin/components/AdminPanel";
import { CategoryTable } from "@/features/categories/components/admin/CategoryTable";
import { getAdminCategories } from "@/features/categories/queries/get-admin-categories";

export const metadata: Metadata = {
  title: "Categories · Admin",
  robots: { index: false, follow: false },
};

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Categories"
        description="Organize the store taxonomy, visibility, and display order."
        action={<LinkButton href={ADMIN_ROUTES.categoryNew}>New category</LinkButton>}
      />
      <AdminPanel>
        <CategoryTable rows={categories} />
      </AdminPanel>
    </div>
  );
}
