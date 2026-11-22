import { EmptyState } from "@/components/ui/EmptyState";
import { cn } from "@/lib/utils/cn";
import { DataTable, type DataTableColumn } from "@/features/admin/components/DataTable";
import { HomeSectionForm } from "@/features/home/components/admin/HomeSectionForm";
import { HomeSectionPublishButton } from "@/features/home/components/admin/HomeSectionPublishButton";
import type { AdminHomeSection } from "@/features/site-content/types.admin";

const COLUMNS: DataTableColumn<AdminHomeSection>[] = [
  {
    key: "order",
    label: "Order",
    cell: (section) => (
      <span className="text-accent font-mono text-xs">
        {String(section.sortOrder).padStart(2, "0")}
      </span>
    ),
  },
  {
    key: "kind",
    label: "Kind",
    cell: (section) => <span className="text-surface-300 text-xs font-bold">{section.kind}</span>,
  },
  {
    key: "title",
    label: "Title",
    cell: (section) => (
      <div className="space-y-1">
        <p className="text-sm font-bold text-white">{section.title || section.key}</p>
        {section.subtitle ? <p className="text-surface-500 text-xs">{section.subtitle}</p> : null}
      </div>
    ),
  },
  {
    key: "status",
    label: "Status",
    cell: (section) => (
      <div className="space-y-2">
        <p
          className={cn(
            "text-xs font-bold uppercase",
            section.isPublished ? "text-accent" : "text-surface-500",
          )}
        >
          {section.isPublished ? "Published" : "Draft"}
        </p>
        <HomeSectionPublishButton section={section} />
      </div>
    ),
  },
  {
    key: "editor",
    label: "Editor",
    cell: (section) => (
      <details className="min-w-[32rem]">
        <summary className="text-accent cursor-pointer text-xs font-black tracking-[0.16em] uppercase">
          Edit
        </summary>
        <div className="pt-6">
          <HomeSectionForm section={section} />
        </div>
      </details>
    ),
  },
];

export function HomeSectionTable({ sections }: { sections: readonly AdminHomeSection[] }) {
  if (sections.length === 0) {
    return (
      <EmptyState
        title="No home sections yet"
        description="Add a section below to start building the home page."
      />
    );
  }

  return (
    <div>
      <DataTable
        caption="Home page sections"
        columns={COLUMNS}
        rows={sections}
        getRowId={(section) => section.id}
      />
      <details className="border-surface-800 mt-6 rounded-lg border p-5">
        <summary className="text-accent cursor-pointer text-xs font-black tracking-[0.16em] uppercase">
          Add section
        </summary>
        <div className="mt-6">
          <HomeSectionForm />
        </div>
      </details>
    </div>
  );
}
