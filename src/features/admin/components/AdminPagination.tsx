import Link from "next/link";

type AdminPaginationProps = {
  page: number;
  pageCount: number;
  hrefFor: (page: number) => string;
};

export function AdminPagination({ page, pageCount, hrefFor }: AdminPaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-4">
      <span className="text-surface-400 text-xs">
        Page {page} of {pageCount}
      </span>
      <div className="flex gap-2">
        {page > 1 ? (
          <Link
            href={hrefFor(page - 1)}
            className="border-surface-700 text-surface-300 hover:border-accent hover:text-accent rounded border px-4 py-2 text-xs font-bold uppercase"
          >
            Previous
          </Link>
        ) : null}
        {page < pageCount ? (
          <Link
            href={hrefFor(page + 1)}
            className="border-surface-700 text-surface-300 hover:border-accent hover:text-accent rounded border px-4 py-2 text-xs font-bold uppercase"
          >
            Next
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
