import { z } from "zod";

export const PRODUCT_SORT = {
  newest: "newest",
  priceAsc: "price-asc",
  priceDesc: "price-desc",
  nameAsc: "name-asc",
} as const;

export type ProductSort = (typeof PRODUCT_SORT)[keyof typeof PRODUCT_SORT];

export const PRODUCT_SORT_OPTIONS = [
  { value: PRODUCT_SORT.newest, label: "Newest" },
  { value: PRODUCT_SORT.priceAsc, label: "Price: low to high" },
  { value: PRODUCT_SORT.priceDesc, label: "Price: high to low" },
  { value: PRODUCT_SORT.nameAsc, label: "Name: A to Z" },
] as const;

export const PRODUCT_SEARCH_PARAMS = {
  category: "category",
  q: "q",
  min: "min",
  max: "max",
  inStock: "inStock",
  sort: "sort",
  page: "page",
} as const;

export const PRODUCT_PARAM_ON = "on";

export type ProductFilters = {
  categorySlug: string | null;
  q: string;
  min: number | null;
  max: number | null;
  inStock: boolean;
  sort: ProductSort;
  page: number;
};

export const DEFAULT_PRODUCT_FILTERS: ProductFilters = {
  categorySlug: null,
  q: "",
  min: null,
  max: null,
  inStock: false,
  sort: PRODUCT_SORT.newest,
  page: 1,
};

type RawSearchParams = Record<string, string | string[] | undefined>;

const SLUG_PATTERN = /^[a-zA-Z0-9_-]+$/;

const productSortSchema = z
  .enum([PRODUCT_SORT.newest, PRODUCT_SORT.priceAsc, PRODUCT_SORT.priceDesc, PRODUCT_SORT.nameAsc])
  .catch(PRODUCT_SORT.newest);

export const productFiltersSchema = z.object({
  categorySlug: z.string().trim().regex(SLUG_PATTERN).nullable().catch(null),
  q: z.string().trim().max(200).catch(""),
  min: z.number().nonnegative().nullable().catch(null),
  max: z.number().nonnegative().nullable().catch(null),
  inStock: z.boolean().catch(false),
  sort: productSortSchema,
  page: z.coerce.number().int().min(1).max(10000).catch(1),
});

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parseOptionalNumber(value: string | undefined): number | null {
  if (!value) return null;
  const parsed = z.coerce.number().finite().nonnegative().safeParse(value);
  return parsed.success ? parsed.data : null;
}

function parseCheckbox(value: string | undefined): boolean {
  return value === PRODUCT_PARAM_ON || value === "true" || value === "1";
}

export function parseProductSearchParams(params: RawSearchParams): ProductFilters {
  return productFiltersSchema.parse({
    categorySlug: firstValue(params[PRODUCT_SEARCH_PARAMS.category]) || null,
    q: firstValue(params[PRODUCT_SEARCH_PARAMS.q]) ?? "",
    min: parseOptionalNumber(firstValue(params[PRODUCT_SEARCH_PARAMS.min])),
    max: parseOptionalNumber(firstValue(params[PRODUCT_SEARCH_PARAMS.max])),
    inStock: parseCheckbox(firstValue(params[PRODUCT_SEARCH_PARAMS.inStock])),
    sort: firstValue(params[PRODUCT_SEARCH_PARAMS.sort]) ?? PRODUCT_SORT.newest,
    page: firstValue(params[PRODUCT_SEARCH_PARAMS.page]) ?? 1,
  });
}
