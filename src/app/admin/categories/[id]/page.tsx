import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminPanel } from "@/features/admin/components/AdminPanel";
import { CategoryForm } from "@/features/categories/components/admin/CategoryForm";
import { getAdminCategories } from "@/features/categories/queries/get-admin-categories";
import { getAdminCategory } from "@/features/categories/queries/get-admin-category";

export const metadata: Metadata = {
  title: "Edit category · Admin",
  robots: { index: false, follow: false },
};

type CategoryPageProps = { params: Promise<{ id: string }> };

export default async function EditAdminCategoryPage({ params }: CategoryPageProps) {
  const { id } = await params;
  const [category, categories] = await Promise.all([getAdminCategory(id), getAdminCategories()]);

  if (!category) notFound();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title={`Edit ${category.name}`}
        description="Update category details, parent, image, and publishing state."
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
        <CategoryForm category={category} categories={categories} />
      </AdminPanel>
    </div>
  );
}
