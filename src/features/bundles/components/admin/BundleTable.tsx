"use client";

import Link from "next/link";

import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/features/admin/components/DataTable";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { deleteBundle } from "@/features/bundles/actions/delete-bundle";
import type { BundleDefinition } from "@/features/bundles/config/bundles";

const columns: DataTableColumn<BundleDefinition>[] = [
  {
    key: "name",
    label: "Bundle",
    cell: (bundle) => (
      <div className="space-y-1">
        <p className="font-bold text-white">{bundle.name}</p>
        <p className="text-surface-500 max-w-xs text-xs">{bundle.description}</p>
      </div>
    ),
  },
  {
    key: "slug",
    label: "Slug",
    cell: (bundle) => <span className="text-surface-300 font-mono text-xs">{bundle.slug}</span>,
  },
  {
    key: "products",
    label: "Products",
    cell: (bundle) => (
      <span className="text-surface-300 font-mono text-xs">
        {String(bundle.productSlugs.length).padStart(2, "0")}
      </span>
    ),
  },
  {
    key: "discount",
    label: "Discount",
    cell: (bundle) => (
      <span className="text-accent font-mono text-xs font-bold">{bundle.discountPercent}%</span>
    ),
  },
  {
    key: "actions",
    label: "Actions",
    cell: (bundle) => (
      <div className="flex items-center gap-4">
        <Link
          href={ADMIN_ROUTES.bundle(bundle.id)}
          className="text-accent text-xs font-black uppercase"
        >
          Edit
        </Link>
        <ConfirmDialog
          action={() => deleteBundle(bundle.id)}
          title={`Delete ${bundle.name}?`}
          description="This removes the bundle from the storefront. Products are not deleted."
        />
      </div>
    ),
  },
];

export function BundleTable({ rows }: { rows: readonly BundleDefinition[] }) {
  return (
    <DataTable
      caption="Admin bundles"
      columns={columns}
      rows={rows}
      getRowId={(bundle) => bundle.id}
      empty={
        <EmptyState
          title="No bundles yet"
          description="Create a bundle to group compatible products with a discount."
        />
      }
    />
  );
}
