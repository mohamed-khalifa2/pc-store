import Link from "next/link";

import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

import { buildPageNumbers } from "@/features/products/lib/pagination";
import type { ProductFilters } from "@/features/products/schemas/filters";
import { pageHref } from "@/features/products/lib/filter-url";

const LINK_CLASS =
  "border-surface-700 text-surface-400 hover:border-accent hover:text-accent inline-flex size-10 items-center justify-center rounded-md border text-sm font-black";

type ProductPaginationProps = {
  filters: ProductFilters;
  pageCount: number;
  basePath?: string;
};

export function ProductPagination({
  filters,
  pageCount,
  basePath = ROUTES.products,
}: ProductPaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Product pages" className="flex flex-wrap items-center justify-center gap-2">
      {buildPageNumbers(filters.page, pageCount).map((page) => (
        <Link
          key={page}
          href={pageHref(filters, page, basePath)}
          aria-current={page === filters.page ? "page" : undefined}
          className={cn(LINK_CLASS, page === filters.page && "border-accent text-accent")}
        >
          {page}
        </Link>
      ))}
    </nav>
  );
}
