import Link from "next/link";

import { ChevronLeftIcon } from "@/components/ui/icons/ChevronLeftIcon";
import { ChevronRightIcon } from "@/components/ui/icons/ChevronRightIcon";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

import { PRODUCT_COPY } from "@/features/products/config/copy";
import { pageHref } from "@/features/products/lib/filter-url";
import { buildPageNumbers } from "@/features/products/lib/pagination";
import type { ProductFilters } from "@/features/products/schemas/filters";

const LINK_CLASS =
  "border-surface-700 text-surface-400 hover:border-accent hover:text-accent inline-flex size-10 items-center justify-center rounded-md border text-sm font-black transition-colors duration-[var(--duration-normal)]";

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

  const hasPrevious = filters.page > 1;
  const hasNext = filters.page < pageCount;

  return (
    <nav
      aria-label={PRODUCT_COPY.pagination}
      className="flex flex-wrap items-center justify-center gap-2"
    >
      {hasPrevious ? (
        <Link
          href={pageHref(filters, filters.page - 1, basePath)}
          aria-label={PRODUCT_COPY.previousPage}
          className={LINK_CLASS}
        >
          <ChevronLeftIcon />
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(LINK_CLASS, "cursor-not-allowed opacity-40")}>
          <ChevronLeftIcon />
        </span>
      )}

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

      {hasNext ? (
        <Link
          href={pageHref(filters, filters.page + 1, basePath)}
          aria-label={PRODUCT_COPY.nextPage}
          className={LINK_CLASS}
        >
          <ChevronRightIcon />
        </Link>
      ) : (
        <span aria-hidden="true" className={cn(LINK_CLASS, "cursor-not-allowed opacity-40")}>
          <ChevronRightIcon />
        </span>
      )}
    </nav>
  );
}
