"use client";

import { useRef } from "react";

import { AdminActionButton } from "@/features/admin/components/AdminActionButton";
import { SortableList } from "@/features/admin/components/SortableList";
import { adminFailure } from "@/features/admin/lib/action-result";
import { reorderBanners } from "@/features/banners/actions/reorder-banners";
import type { AdminBanner } from "@/features/banners/types.admin";

const SAVE_ORDER = "Save order";
const NOT_READY = "The banner list is not ready.";

export function BannerSortControls({ banners }: { banners: readonly AdminBanner[] }) {
  const formRef = useRef<HTMLFormElement>(null);

  function saveOrder() {
    const form = formRef.current;
    if (!form) return Promise.resolve(adminFailure(NOT_READY));
    return reorderBanners(new FormData(form));
  }

  return (
    <form ref={formRef} className="space-y-5">
      <SortableList
        name="orderedIds"
        items={banners.map((banner) => ({
          id: banner.id,
          label: banner.name,
          meta: `Sort order ${banner.sortOrder}`,
        }))}
      />
      <AdminActionButton action={saveOrder} label={SAVE_ORDER} />
    </form>
  );
}
