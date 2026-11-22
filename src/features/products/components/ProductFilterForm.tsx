import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ROUTES } from "@/lib/constants";

import type { CategoryCardData } from "@/features/categories/types";
import { PRODUCT_COPY } from "@/features/products/config/copy";
import { resetFiltersHref } from "@/features/products/lib/filter-url";
import {
  PRODUCT_PARAM_ON,
  PRODUCT_SEARCH_PARAMS,
  PRODUCT_SORT_OPTIONS,
  type ProductFilters,
} from "@/features/products/schemas/filters";

const FIELD_CLASS = "space-y-2 text-xs font-black tracking-[0.12em] text-surface-400 uppercase";
const CONTROL_CLASS =
  "bg-surface-900 border-surface-700 h-11 w-full rounded-md border px-3 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

type ProductFilterFormProps = {
  categories: CategoryCardData[];
  filters: ProductFilters;
  action?: string;
  fixedCategorySlug?: string | null;
};

export function ProductFilterForm({
  categories,
  filters,
  action = ROUTES.products,
  fixedCategorySlug = null,
}: ProductFilterFormProps) {
  return (
    <form
      method="get"
      action={action}
      aria-label={PRODUCT_COPY.filters}
      className="border-surface-800 bg-surface-900/50 rounded-card grid gap-4 border p-5 sm:grid-cols-2 lg:grid-cols-4"
    >
      {fixedCategorySlug ? (
        <input type="hidden" name={PRODUCT_SEARCH_PARAMS.category} value={fixedCategorySlug} />
      ) : (
        <label className={FIELD_CLASS}>
          <span>{PRODUCT_COPY.categoryLabel}</span>
          <select
            name={PRODUCT_SEARCH_PARAMS.category}
            defaultValue={filters.categorySlug ?? ""}
            className={CONTROL_CLASS}
          >
            <option value="">{PRODUCT_COPY.allCategories}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      )}

      <label className={`${FIELD_CLASS} sm:col-span-2`}>
        <span>{PRODUCT_COPY.searchLabel}</span>
        <Input
          type="search"
          name={PRODUCT_SEARCH_PARAMS.q}
          defaultValue={filters.q}
          placeholder={PRODUCT_COPY.searchPlaceholder}
        />
      </label>

      <label className={FIELD_CLASS}>
        <span>{PRODUCT_COPY.minPriceLabel}</span>
        <Input
          type="number"
          min={0}
          name={PRODUCT_SEARCH_PARAMS.min}
          defaultValue={filters.min ?? ""}
        />
      </label>

      <label className={FIELD_CLASS}>
        <span>{PRODUCT_COPY.maxPriceLabel}</span>
        <Input
          type="number"
          min={0}
          name={PRODUCT_SEARCH_PARAMS.max}
          defaultValue={filters.max ?? ""}
        />
      </label>

      <label className={FIELD_CLASS}>
        <span>{PRODUCT_COPY.sortLabel}</span>
        <select
          name={PRODUCT_SEARCH_PARAMS.sort}
          defaultValue={filters.sort}
          className={CONTROL_CLASS}
        >
          {PRODUCT_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-3 self-end text-sm text-white">
        <input
          type="checkbox"
          name={PRODUCT_SEARCH_PARAMS.inStock}
          value={PRODUCT_PARAM_ON}
          defaultChecked={filters.inStock}
          className="accent-accent size-5"
        />
        {PRODUCT_COPY.inStockLabel}
      </label>

      <div className="flex items-end gap-4 sm:col-span-2 lg:col-span-4">
        <Button type="submit" size="sm">
          {PRODUCT_COPY.applyFilters}
        </Button>
        <Link
          href={resetFiltersHref(action, fixedCategorySlug)}
          className="text-surface-400 hover:text-accent text-xs font-black tracking-[0.12em] uppercase"
        >
          {PRODUCT_COPY.resetFilters}
        </Link>
      </div>
    </form>
  );
}
