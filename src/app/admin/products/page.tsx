import type { Metadata } from "next";
import Link from "next/link";

import { buttonClassName } from "@/components/ui/button-styles";
import { AdminPageHeader } from "@/features/admin/components/AdminPageHeader";
import { AdminPagination } from "@/features/admin/components/AdminPagination";
import { AdminPanel } from "@/features/admin/components/AdminPanel";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { ProductFilters } from "@/features/products/components/admin/ProductFilters";
import { ProductTable } from "@/features/products/components/admin/ProductTable";
import { getAdminCategoryOptions } from "@/features/products/queries/get-admin-category-options";
import { getAdminProducts } from "@/features/products/queries/get-admin-products";
import {
  ADMIN_PRODUCT_FIELDS as F,
  ADMIN_PUBLISHED_FILTER,
  adminProductFiltersSchema,
  type AdminProductFilters,
} from "@/features/products/schemas/admin-product";

export const metadata: Metadata = {
  title: "Products · Admin",
  robots: { index: false, follow: false },
};

type AdminProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function firstValue(value: string | string[] | undefined): string {
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

function hrefFor(filters: AdminProductFilters, page: number): string {
  const params = new URLSearchParams();
  if (filters.q) params.set(F.q, filters.q);
  if (filters.category) params.set(F.category, filters.category);
  if (filters.published !== ADMIN_PUBLISHED_FILTER.all) {
    params.set(F.published, filters.published);
  }
  if (page > 1) params.set(F.page, String(page));
  const query = params.toString();
  return query ? `${ADMIN_ROUTES.products}?${query}` : ADMIN_ROUTES.products;
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const raw = await searchParams;
  const requested = adminProductFiltersSchema.safeParse({
    [F.q]: firstValue(raw[F.q]) || undefined,
    [F.category]: firstValue(raw[F.category]) || undefined,
    [F.published]: firstValue(raw[F.published]) || undefined,
    [F.page]: firstValue(raw[F.page]) || undefined,
  });
  const filters = requested.success ? requested.data : adminProductFiltersSchema.parse({});

  const [result, categories] = await Promise.all([
    getAdminProducts(filters),
    getAdminCategoryOptions(),
  ]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Products"
        description="Manage catalog items, pricing, stock, and storefront visibility."
        action={
          <Link href={ADMIN_ROUTES.productNew} className={buttonClassName("primary", "sm")}>
            New product
          </Link>
        }
      />
      <AdminPanel>
        <ProductFilters categories={categories} filters={filters} />
      </AdminPanel>
      <ProductTable rows={result.items} />
      <AdminPagination
        page={result.page}
        pageCount={result.pageCount}
        hrefFor={(page) => hrefFor(filters, page)}
      />
    </div>
  );
}
