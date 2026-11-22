import { PRODUCTS_PER_PAGE } from "@/lib/constants";

import { DEFAULT_PRODUCT_DETAILS } from "@/features/products/config/detail-defaults";
import { toDefaultCard } from "@/features/products/lib/map-product-row";
import {
  PRODUCT_SORT,
  type ProductFilters,
  type ProductSort,
} from "@/features/products/schemas/filters";
import type { ProductCardData, ProductListResult } from "@/features/products/types";

function sortItems(items: ProductCardData[], sort: ProductSort): ProductCardData[] {
  const sorted = [...items];

  switch (sort) {
    case PRODUCT_SORT.priceAsc:
      return sorted.sort((left, right) => left.priceEgp - right.priceEgp);
    case PRODUCT_SORT.priceDesc:
      return sorted.sort((left, right) => right.priceEgp - left.priceEgp);
    case PRODUCT_SORT.nameAsc:
      return sorted.sort((left, right) => left.name.localeCompare(right.name));
    default:
      return sorted;
  }
}

export function filterDefaultProducts(filters: ProductFilters): ProductListResult {
  const matches = DEFAULT_PRODUCT_DETAILS.filter((detail) => {
    if (filters.categorySlug && detail.category?.slug !== filters.categorySlug) return false;

    const haystack = `${detail.name} ${detail.description ?? ""}`.toLowerCase();
    if (filters.q && !haystack.includes(filters.q.toLowerCase())) return false;
    if (filters.min !== null && detail.priceEgp < filters.min) return false;
    if (filters.max !== null && detail.priceEgp > filters.max) return false;
    if (filters.inStock && detail.stock <= 0) return false;

    return true;
  });

  const items = sortItems(matches.map(toDefaultCard), filters.sort);
  const total = items.length;
  const from = (filters.page - 1) * PRODUCTS_PER_PAGE;

  return {
    items: items.slice(from, from + PRODUCTS_PER_PAGE),
    total,
    page: filters.page,
    pageCount: Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE)),
  };
}
