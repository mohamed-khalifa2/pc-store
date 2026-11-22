"use client";

import { useActionState } from "react";

import { AdminSubmitButton } from "@/features/admin/components/AdminSubmitButton";
import { AdminToast } from "@/features/admin/components/AdminToast";
import { SortableList, type SortableItem } from "@/features/admin/components/SortableList";
import { initialAdminResult, type AdminActionResult } from "@/features/admin/lib/action-result";
import { reorderHomeSections } from "@/features/home/actions/reorder-home-sections";
import type { AdminHomeSection } from "@/features/site-content/types.admin";

export function SectionSortControls({ sections }: { sections: readonly AdminHomeSection[] }) {
  const [state, formAction] = useActionState<AdminActionResult, FormData>(
    (_previous, formData) => reorderHomeSections(formData),
    initialAdminResult,
  );

  if (sections.length === 0) return null;

  const items: SortableItem[] = sections.map((section) => ({
    id: section.id,
    label: section.title || section.key,
    meta: section.kind,
  }));

  return (
    <form action={formAction} className="space-y-4">
      <SortableList items={items} name="sectionIds" />
      <div className="flex justify-end">
        <AdminSubmitButton
          label="Save order"
          pendingLabel="Saving…"
          size="sm"
          variant="secondary"
        />
      </div>
      <AdminToast result={state} />
    </form>
  );
}
