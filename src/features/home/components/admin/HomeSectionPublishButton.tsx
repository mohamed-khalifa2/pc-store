"use client";

import { AdminActionButton } from "@/features/admin/components/AdminActionButton";
import type { AdminHomeSection } from "@/features/site-content/types.admin";
import { toggleHomeSectionPublication } from "@/features/home/actions/upsert-home-section";

type HomeSectionPublishButtonProps = { section: AdminHomeSection };

export function HomeSectionPublishButton({ section }: HomeSectionPublishButtonProps) {
  async function toggle() {
    const formData = new FormData();
    formData.set("id", section.id);
    formData.set("isPublished", section.isPublished ? "false" : "true");
    return toggleHomeSectionPublication(formData);
  }

  return (
    <AdminActionButton
      action={toggle}
      label={section.isPublished ? "Unpublish" : "Publish"}
      pendingLabel="Saving…"
    />
  );
}
