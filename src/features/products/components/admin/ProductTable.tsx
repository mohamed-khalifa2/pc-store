"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { EmptyState } from "@/components/ui/EmptyState";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/features/admin/components/DataTable";
import { deleteProduct } from "@/features/products/actions/delete-product";
import type { AdminProductListRow } from "@/features/products/queries/get-admin-products";
import { ADMIN_PRODUCT_FIELDS } from "@/features/products/schemas/admin-product";
import { formatEgp } from "@/lib/format/currency";

const BADGE_BASE =
  "inline-flex rounded px-2 py-1 text-[0.65rem] font-black tracking-widest uppercase";

export function ProductTable({ rows }: { rows: readonly AdminProductListRow[] }) {
  const router = useRouter();

  const columns: DataTableColumn<AdminProductListRow>[] = [
    {
      key: "name",
      label: "Product",
      cell: (row) => (
        <div className="flex items-center gap-3">
          <Image
            src={row.thumbnailUrl}
            alt=""
            width={48}
            height={48}
            sizes="48px"
            unoptimized
            className="bg-surface-800 h-12 w-12 rounded object-cover"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{row.name}</p>
            <p className="text-surface-500 truncate text-xs">/{row.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "sku",
      label: "SKU",
      cell: (row) => <span className="font-mono text-xs">{row.sku}</span>,
    },
    {
      key: "category",
      label: "Category",
      cell: (row) => <span className="text-surface-400 text-xs">{row.categoryName ?? "—"}</span>,
    },
    {
      key: "price",
      label: "Price",
      cell: (row) => (
        <span className="text-accent text-sm font-black">{formatEgp(row.priceEgp)}</span>
      ),
    },
    {
      key: "stock",
      label: "Stock",
      cell: (row) => (
        <span className={row.stock > 0 ? "text-sm text-white" : "text-danger text-sm font-bold"}>
          {row.stock}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          <span
            className={
              row.isPublished
                ? `${BADGE_BASE} bg-accent/15 text-accent`
                : `${BADGE_BASE} bg-surface-800 text-surface-400`
            }
          >
            {row.isPublished ? "Published" : "Draft"}
          </span>
          {row.isFeatured ? (
            <span className={`${BADGE_BASE} bg-surface-800 text-white`}>Featured</span>
          ) : null}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      cell: (row) => {
        const formData = new FormData();
        formData.set(ADMIN_PRODUCT_FIELDS.id, row.id);
        return (
          <div className="flex items-center gap-2">
            <Link
              href={ADMIN_ROUTES.product(row.id)}
              className="border-surface-700 text-surface-300 hover:border-accent hover:text-accent focus-visible:ring-accent rounded border px-3 py-2 text-xs font-black uppercase focus-visible:ring-2 focus-visible:outline-none"
            >
              {ADMIN_COPY.edit}
            </Link>
            <ConfirmDialog
              title="Delete product?"
              description={`Delete “${row.name}”? This cannot be undone.`}
              action={async () => {
                const result = await deleteProduct(formData);
                if (result.ok) router.refresh();
                return result;
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <DataTable
      caption="Store products"
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      empty={
        <EmptyState title={ADMIN_COPY.noRows} description="Add your first product to begin." />
      }
    />
  );
}
