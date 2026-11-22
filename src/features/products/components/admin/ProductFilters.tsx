import Link from "next/link";

import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { AdminSubmitButton } from "@/features/admin/components/AdminSubmitButton";
import { FormField } from "@/features/admin/components/FormField";
import {
  ADMIN_PRODUCT_FIELDS,
  ADMIN_PUBLISHED_FILTER,
  type AdminCategoryOption,
  type AdminProductFilters,
} from "@/features/products/schemas/admin-product";

const INPUT =
  "border-surface-700 bg-surface-900 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent h-11 w-full rounded-md border px-4 text-sm";
const RESET_LINK =
  "border-surface-700 text-surface-300 hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent inline-flex h-9 items-center rounded border px-4 text-xs font-black uppercase tracking-[0.12em]";

const STATUS_OPTIONS = [
  { value: ADMIN_PUBLISHED_FILTER.all, label: "All statuses" },
  { value: ADMIN_PUBLISHED_FILTER.true, label: "Published" },
  { value: ADMIN_PUBLISHED_FILTER.false, label: "Drafts" },
] as const;

type ProductFiltersProps = {
  categories: readonly AdminCategoryOption[];
  filters: AdminProductFilters;
};

export function ProductFilters({ categories, filters }: ProductFiltersProps) {
  return (
    <form method="get" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto]">
      <FormField label="Search" htmlFor="admin-product-search">
        <input
          id="admin-product-search"
          name="q"
          type="search"
          defaultValue={filters.q}
          placeholder="Name or SKU"
          className={INPUT}
        />
      </FormField>
      <FormField label="Category" htmlFor="admin-product-category">
        <select
          id="admin-product-category"
          name={ADMIN_PRODUCT_FIELDS.category}
          defaultValue={filters.category}
          className={INPUT}
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </FormField>
      <FormField label="Status" htmlFor="admin-product-published">
        <select
          id="admin-product-published"
          name={ADMIN_PRODUCT_FIELDS.published}
          defaultValue={filters.published}
          className={INPUT}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </FormField>
      <div className="flex items-end gap-3">
        <AdminSubmitButton label="Apply" pendingLabel="Applying" size="sm" />
        <Link href={ADMIN_ROUTES.products} className={RESET_LINK}>
          Reset
        </Link>
      </div>
    </form>
  );
}
