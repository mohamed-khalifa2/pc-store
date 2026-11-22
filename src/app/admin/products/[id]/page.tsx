import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { buttonClassName } from "@/components/ui/button-styles";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { ProductForm } from "@/features/products/components/admin/ProductForm";
import { getAdminCategoryOptions } from "@/features/products/queries/get-admin-category-options";
import { getAdminProduct } from "@/features/products/queries/get-admin-product";

export const metadata: Metadata = {
  title: "Edit product · Admin",
  robots: { index: false, follow: false },
};

type EditProductPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getAdminProduct(id), getAdminCategoryOptions()]);
  if (!product) notFound();

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Edit product"
        description={`Update ${product.name} and its storefront presentation.`}
        action={
          <Link href={ADMIN_ROUTES.products} className={buttonClassName("secondary", "sm")}>
            Back to products
          </Link>
        }
      />
      <ProductForm product={product} categories={categories} prefix={`products/${id}`} />
    </div>
  );
}
