import type { Metadata } from "next";
import Link from "next/link";

import { buttonClassName } from "@/components/ui/button-styles";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { ProductForm } from "@/features/products/components/admin/ProductForm";
import { getAdminCategoryOptions } from "@/features/products/queries/get-admin-category-options";

export const metadata: Metadata = {
  title: "New product · Admin",
  robots: { index: false, follow: false },
};

const NEW_PRODUCT_PREFIX = "products/draft";

export default async function NewProductPage() {
  const categories = await getAdminCategoryOptions();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="New product"
        description="Add a part to the catalog with pricing, specs, and storefront images."
        action={
          <Link href={ADMIN_ROUTES.products} className={buttonClassName("secondary", "sm")}>
            Back to products
          </Link>
        }
      />
      <ProductForm categories={categories} prefix={NEW_PRODUCT_PREFIX} />
    </div>
  );
}
