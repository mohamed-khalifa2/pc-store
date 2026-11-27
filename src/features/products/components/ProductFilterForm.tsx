import Link from "next/link";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FilterIcon } from "@/components/ui/icons/FilterIcon";
import { ROUTES } from "@/lib/constants";

import type { CategoryCardData } from "@/features/categories/types";
import { FilterSearchField } from "@/features/products/components/FilterSearchField";
import { FilterSelect } from "@/features/products/components/FilterSelect";
import { PRODUCT_COPY } from "@/features/products/config/copy";
import { resetFiltersHref } from "@/features/products/lib/filter-url";
import {
  PRODUCT_PARAM_ON,
  PRODUCT_SEARCH_PARAMS,
  PRODUCT_SORT_OPTIONS,
  type ProductFilters,
} from "@/features/products/schemas/filters";

const FIELD_CLASS = "space-y-2 text-xs font-black tracking-[0.12em] text-surface-400 uppercase";

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
  const categoryOptions = [
    { value: "", label: PRODUCT_COPY.allCategories },
    ...categories.map((category) => ({ value: category.slug, label: category.name })),
  ];

  return (
    <form
      method="get"
      action={action}
      aria-label={PRODUCT_COPY.filters}
      className="border-surface-800 bg-surface-900/50 rounded-card border p-5 sm:p-6"
    >
      <div className="mb-6 flex items-center gap-3">
        <span className="bg-accent/10 text-accent grid size-9 place-items-center rounded-lg">
          <FilterIcon />
        </span>
        <h2 className="text-sm font-black tracking-[0.16em] text-white uppercase">
          {PRODUCT_COPY.filters}
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {fixedCategorySlug ? (
          <input type="hidden" name={PRODUCT_SEARCH_PARAMS.category} value={fixedCategorySlug} />
        ) : (
          <FilterSelect
            name={PRODUCT_SEARCH_PARAMS.category}
            label={PRODUCT_COPY.categoryLabel}
            defaultValue={filters.categorySlug ?? ""}
            options={categoryOptions}
          />
        )}

        <FilterSearchField
          name={PRODUCT_SEARCH_PARAMS.q}
          label={PRODUCT_COPY.searchLabel}
          placeholder={PRODUCT_COPY.searchPlaceholder}
          defaultValue={filters.q}
          className="sm:col-span-2"
        />

        <label className={FIELD_CLASS} htmlFor={PRODUCT_SEARCH_PARAMS.min}>
          <span>{PRODUCT_COPY.minPriceLabel}</span>
          <Input
            id={PRODUCT_SEARCH_PARAMS.min}
            type="number"
            min={0}
            name={PRODUCT_SEARCH_PARAMS.min}
            defaultValue={filters.min ?? ""}
          />
        </label>

        <label className={FIELD_CLASS} htmlFor={PRODUCT_SEARCH_PARAMS.max}>
          <span>{PRODUCT_COPY.maxPriceLabel}</span>
          <Input
            id={PRODUCT_SEARCH_PARAMS.max}
            type="number"
            min={0}
            name={PRODUCT_SEARCH_PARAMS.max}
            defaultValue={filters.max ?? ""}
          />
        </label>

        <FilterSelect
          name={PRODUCT_SEARCH_PARAMS.sort}
          label={PRODUCT_COPY.sortLabel}
          defaultValue={filters.sort}
          options={PRODUCT_SORT_OPTIONS}
        />

        <label
          htmlFor={PRODUCT_SEARCH_PARAMS.inStock}
          className="border-surface-700 bg-surface-900/40 flex h-11 items-center gap-3 self-end rounded-md border px-4 text-sm text-white"
        >
          <input
            id={PRODUCT_SEARCH_PARAMS.inStock}
            type="checkbox"
            name={PRODUCT_SEARCH_PARAMS.inStock}
            value={PRODUCT_PARAM_ON}
            defaultChecked={filters.inStock}
            className="accent-accent size-5"
          />
          {PRODUCT_COPY.inStockLabel}
        </label>

        <div className="flex items-center gap-5 lg:col-span-4">
          <Button type="submit" size="sm">
            {PRODUCT_COPY.applyFilters}
          </Button>
          <Link
            href={resetFiltersHref(action, fixedCategorySlug)}
            className="text-surface-400 hover:text-accent text-xs font-black tracking-[0.12em] uppercase transition-colors"
          >
            {PRODUCT_COPY.resetFilters}
          </Link>
        </div>
      </div>
    </form>
  );
}
