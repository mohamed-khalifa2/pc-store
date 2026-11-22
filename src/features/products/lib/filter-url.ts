import { ROUTES } from "@/lib/constants";

import {
  DEFAULT_PRODUCT_FILTERS,
  PRODUCT_PARAM_ON,
  PRODUCT_SEARCH_PARAMS,
  PRODUCT_SORT,
  type ProductFilters,
} from "@/features/products/schemas/filters";

export function filtersToSearchParams(filters: ProductFilters): URLSearchParams {
  const params = new URLSearchParams();

  if (filters.categorySlug) params.set(PRODUCT_SEARCH_PARAMS.category, filters.categorySlug);
  if (filters.q) params.set(PRODUCT_SEARCH_PARAMS.q, filters.q);
  if (filters.min !== null) params.set(PRODUCT_SEARCH_PARAMS.min, String(filters.min));
  if (filters.max !== null) params.set(PRODUCT_SEARCH_PARAMS.max, String(filters.max));
  if (filters.inStock) params.set(PRODUCT_SEARCH_PARAMS.inStock, PRODUCT_PARAM_ON);
  if (filters.sort !== PRODUCT_SORT.newest) params.set(PRODUCT_SEARCH_PARAMS.sort, filters.sort);
  if (filters.page > 1) params.set(PRODUCT_SEARCH_PARAMS.page, String(filters.page));

  return params;
}

export function productsHref(filters: ProductFilters, basePath: string = ROUTES.products): string {
  const query = filtersToSearchParams(filters).toString();
  return query ? `${basePath}?${query}` : basePath;
}

export function pageHref(
  filters: ProductFilters,
  page: number,
  basePath: string = ROUTES.products,
): string {
  return productsHref({ ...filters, page }, basePath);
}

export function resetFiltersHref(
  basePath: string = ROUTES.products,
  categorySlug: string | null = null,
): string {
  return productsHref({ ...DEFAULT_PRODUCT_FILTERS, categorySlug }, basePath);
}
