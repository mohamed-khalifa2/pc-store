"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Input } from "@/components/ui/Input";
import { LinkButton } from "@/components/ui/LinkButton";
import { AdminPanel } from "@/features/admin/components/AdminPanel";
import { AdminSubmitButton } from "@/features/admin/components/AdminSubmitButton";
import { AdminToast } from "@/features/admin/components/AdminToast";
import { FormField } from "@/features/admin/components/FormField";
import { ImageUploader } from "@/features/admin/components/ImageUploader";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { ADMIN_ROUTES } from "@/features/admin/config/routes";
import type { AdminActionResult } from "@/features/admin/lib/action-result";
import { upsertBanner } from "@/features/banners/actions/upsert-banner";
import { BANNER_PLACEMENTS, BANNER_PLACEMENT_OPTIONS } from "@/features/banners/config/placements";
import type { AdminBanner } from "@/features/banners/types.admin";
import { STORAGE_BUCKETS } from "@/lib/constants";

type UpsertResult = AdminActionResult<{ id: string }>;
type BannerFormProps = { banner?: AdminBanner | null };

const CONTROL_CLASS =
  "border-surface-700 bg-surface-900 h-11 w-full rounded-md border px-4 text-sm text-white";

function toDateTimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
}

export function BannerForm({ banner }: BannerFormProps) {
  const router = useRouter();
  const [result, setResult] = useState<UpsertResult | null>(null);
  const errorFor = (key: string) => result?.fieldErrors[key]?.[0];

  const detailFields = [
    ["name", "Name", banner?.name ?? "", "text", true],
    ["headline", "Headline", banner?.headline ?? "", "text", false],
    ["subheadline", "Subheadline", banner?.subheadline ?? "", "text", false],
    ["ctaLabel", "CTA label", banner?.ctaLabel ?? "", "text", false],
    ["ctaHref", "CTA link", banner?.ctaHref ?? "", "text", false],
    ["sortOrder", "Sort order", String(banner?.sortOrder ?? 0), "number", false],
  ] as const;
  const scheduleFields = [
    ["publishedAt", "Published at", toDateTimeLocal(banner?.publishedAt ?? null)],
    ["startsAt", "Starts at", toDateTimeLocal(banner?.startsAt ?? null)],
    ["endsAt", "Ends at", toDateTimeLocal(banner?.endsAt ?? null)],
  ] as const;
  const imageFields = [
    ["imagePath", "Desktop image", banner ? [banner.imagePath] : []],
    ["mobileImagePath", "Mobile image", banner?.mobileImagePath ? [banner.mobileImagePath] : []],
  ] as const;
  const imageError = errorFor("imagePath") ?? errorFor("mobileImagePath");
  const submitLabel = banner ? ADMIN_COPY.save : ADMIN_COPY.create;

  async function handleSubmit(formData: FormData) {
    const next = await upsertBanner(formData);
    setResult(next);
    if (next.ok && next.data) {
      if (banner) router.refresh();
      else router.push(ADMIN_ROUTES.banner(next.data.id));
    }
  }

  return (
    <form action={handleSubmit} className="space-y-8">
      {banner ? <input type="hidden" name="id" value={banner.id} readOnly /> : null}

      <AdminPanel title="Campaign details" description="How this banner appears across the store.">
        <div className="grid gap-5 md:grid-cols-2">
          <FormField label="Placement" htmlFor="placement" error={errorFor("placement")}>
            <select
              id="placement"
              name="placement"
              defaultValue={banner?.placement ?? BANNER_PLACEMENTS.home}
              className={CONTROL_CLASS}
            >
              {BANNER_PLACEMENT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </FormField>
          {detailFields.map(([name, label, value, type, required]) => (
            <FormField key={name} label={label} htmlFor={name} error={errorFor(name)}>
              <Input
                id={name}
                name={name}
                type={type}
                required={required}
                defaultValue={value ?? ""}
              />
            </FormField>
          ))}
        </div>
      </AdminPanel>

      <AdminPanel title="Schedule" description="Optional timing controls for this campaign.">
        <div className="grid gap-5 md:grid-cols-3">
          {scheduleFields.map(([name, label, value]) => (
            <FormField key={name} label={label} htmlFor={name} error={errorFor(name)}>
              <Input id={name} name={name} type="datetime-local" defaultValue={value ?? ""} />
            </FormField>
          ))}
        </div>
        <label className="mt-6 flex items-center gap-3 text-sm text-white">
          <input
            type="checkbox"
            name="isActive"
            defaultChecked={banner?.isActive ?? false}
            className="border-surface-700 bg-surface-900 accent-accent h-5 w-5 rounded"
          />
          Active
        </label>
      </AdminPanel>

      <AdminPanel title="Artwork" description="Upload desktop and mobile versions of the banner.">
        <div className="grid gap-6 md:grid-cols-2">
          {imageFields.map(([name, label, paths]) => (
            <ImageUploader
              key={name}
              name={name}
              label={label}
              bucket={STORAGE_BUCKETS.banners}
              prefix="banners"
              initialPaths={paths}
            />
          ))}
        </div>
        {imageError ? (
          <p className="text-danger mt-3 text-xs font-semibold" role="alert">
            {imageError}
          </p>
        ) : null}
      </AdminPanel>

      <div className="flex flex-wrap gap-3">
        <AdminSubmitButton label={submitLabel} pendingLabel={ADMIN_COPY.saving} />
        <LinkButton href={ADMIN_ROUTES.banners} variant="ghost">
          {ADMIN_COPY.cancel}
        </LinkButton>
      </div>
      <AdminToast result={result} onDismiss={() => setResult(null)} />
    </form>
  );
}
