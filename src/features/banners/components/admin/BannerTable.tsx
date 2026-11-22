"use client";

import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { LinkButton } from "@/components/ui/LinkButton";
import { AdminActionButton } from "@/features/admin/components/AdminActionButton";
import { ConfirmDialog } from "@/features/admin/components/ConfirmDialog";
import { DataTable, type DataTableColumn } from "@/features/admin/components/DataTable";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import { deleteBanner } from "@/features/banners/actions/delete-banner";
import { toggleBanner } from "@/features/banners/actions/toggle-banner";
import { BANNER_PLACEMENT_OPTIONS } from "@/features/banners/config/placements";
import type { AdminBanner } from "@/features/banners/types.admin";

const ALWAYS_LABEL = "Always";
const LIVE_LABEL = "Live";
const PAUSED_LABEL = "Paused";
const PAUSE_ACTION = "Pause";
const ACTIVATE_ACTION = "Activate";
const DELETE_TITLE = "Delete banner";

function placementLabel(value: string): string {
  return BANNER_PLACEMENT_OPTIONS.find((option) => option.value === value)?.label ?? value;
}

function scheduleLabel(banner: AdminBanner): string {
  if (banner.startsAt) return banner.startsAt.slice(0, 10);
  if (banner.publishedAt) return banner.publishedAt.slice(0, 10);
  return ALWAYS_LABEL;
}

export function BannerTable({ banners }: { banners: readonly AdminBanner[] }) {
  const columns: DataTableColumn<AdminBanner>[] = [
    {
      key: "name",
      label: "Banner",
      cell: (banner) => (
        <div>
          <Link
            href={ADMIN_ROUTES.banner(banner.id)}
            className="hover:text-accent font-bold text-white"
          >
            {banner.name}
          </Link>
          <p className="text-surface-500 truncate text-xs">{banner.headline ?? "No headline"}</p>
        </div>
      ),
    },
    {
      key: "placement",
      label: "Placement",
      cell: (banner) => (
        <span className="text-surface-200 text-xs">{placementLabel(banner.placement)}</span>
      ),
    },
    {
      key: "order",
      label: "Order",
      cell: (banner) => <span className="font-mono text-xs text-white">{banner.sortOrder}</span>,
    },
    {
      key: "status",
      label: "Status",
      cell: (banner) => (
        <Badge tone={banner.isActive ? "accent" : "neutral"}>
          {banner.isActive ? LIVE_LABEL : PAUSED_LABEL}
        </Badge>
      ),
    },
    {
      key: "schedule",
      label: "Starts",
      cell: (banner) => <span className="text-surface-400 text-xs">{scheduleLabel(banner)}</span>,
    },
    {
      key: "actions",
      label: "Actions",
      className: "px-4 py-4 align-middle text-right",
      cell: (banner) => (
        <div className="flex justify-end gap-2">
          <AdminActionButton
            action={() => {
              const payload = new FormData();
              payload.set("id", banner.id);
              return toggleBanner(payload);
            }}
            label={banner.isActive ? PAUSE_ACTION : ACTIVATE_ACTION}
          />
          <LinkButton href={ADMIN_ROUTES.banner(banner.id)} variant="secondary" size="sm">
            {ADMIN_COPY.edit}
          </LinkButton>
          <ConfirmDialog
            title={DELETE_TITLE}
            description={`Remove "${banner.name}" and its images? This cannot be undone.`}
            action={() => {
              const payload = new FormData();
              payload.set("id", banner.id);
              return deleteBanner(payload);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <DataTable
      caption="Admin banner list"
      columns={columns}
      rows={banners}
      getRowId={(banner) => banner.id}
    />
  );
}
