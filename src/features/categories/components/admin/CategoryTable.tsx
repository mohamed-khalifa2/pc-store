"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { LinkButton } from "@/components/ui/LinkButton";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/features/admin/components/DataTable";
import { deleteCategory } from "@/features/categories/actions/delete-category";
import { CATEGORY_FORM_FIELDS } from "@/features/categories/schemas/admin-category";
import type { AdminCategory } from "@/features/categories/types.admin";

function deletePayload(id: string): FormData {
  const formData = new FormData();
  formData.set(CATEGORY_FORM_FIELDS.id, id);
  return formData;
}

type CategoryTableProps = { rows: AdminCategory[] };

export function CategoryTable({ rows }: CategoryTableProps) {
  const columns: DataTableColumn<AdminCategory>[] = [
    {
      key: "sortOrder",
      label: "Order",
      cell: (row) => <span className="text-surface-400 font-mono">{row.sortOrder}</span>,
    },
    {
      key: "name",
      label: "Category",
      cell: (row) => (
        <div>
          <p className="font-bold text-white">{row.name}</p>
          <p className="text-surface-500 font-mono text-xs">/{row.slug}</p>
        </div>
      ),
    },
    {
      key: "parent",
      label: "Parent",
      cell: (row) => (
        <span className="text-surface-400 text-xs">
          {rows.find((item) => item.id === row.parentId)?.name ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      cell: (row) => (
        <Badge tone={row.isPublished ? "accent" : "neutral"}>
          {row.isPublished ? "Published" : "Draft"}
        </Badge>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <LinkButton href={ADMIN_ROUTES.category(row.id)} variant="ghost" size="sm">
            {ADMIN_COPY.edit}
          </LinkButton>
          <ConfirmDialog
            action={() => deleteCategory(deletePayload(row.id))}
            title="Delete category?"
            description="Child categories will become top-level. This cannot be undone."
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      caption="Admin categories"
      columns={columns}
      rows={rows}
      getRowId={(row) => row.id}
      empty={
        <EmptyState
          title={ADMIN_COPY.noRows}
          description="Create a category to start organizing the catalog."
          action={
            <Link
              href={ADMIN_ROUTES.categoryNew}
              className="text-accent text-sm font-black uppercase"
            >
              New category
            </Link>
          }
        />
      }
    />
  );
}
