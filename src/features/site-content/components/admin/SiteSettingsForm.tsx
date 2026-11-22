"use client";

import { useActionState } from "react";

import { Input } from "@/components/ui/Input";
import { AdminSubmitButton } from "@/features/admin/components/AdminSubmitButton";
import { AdminToast } from "@/features/admin/components/AdminToast";
import { FormField } from "@/features/admin/components/FormField";
import { initialAdminResult, type AdminActionResult } from "@/features/admin/lib/action-result";
import { updateSiteContent } from "@/features/site-content/actions/update-site-content";
import { DEFAULT_SITE_CONTENT } from "@/features/site-content/config/defaults";
import { SITE_CONTENT_KEYS, type SiteContentKey } from "@/features/site-content/config/keys";
import type { AdminSiteContentEntry } from "@/features/site-content/types.admin";

const TEXTAREA_CLASS = [
  "bg-surface-900 border-surface-700 w-full rounded-md border px-4 py-3 text-sm text-white",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-black-950",
].join(" ");

const FIELDS: readonly { key: SiteContentKey; label: string; multiline?: boolean }[] = [
  { key: SITE_CONTENT_KEYS.name, label: "Site name" },
  { key: SITE_CONTENT_KEYS.description, label: "Site description", multiline: true },
  { key: SITE_CONTENT_KEYS.email, label: "Contact email" },
  { key: SITE_CONTENT_KEYS.phone, label: "Contact phone" },
  { key: SITE_CONTENT_KEYS.address, label: "Contact address" },
  { key: SITE_CONTENT_KEYS.shippingNote, label: "Shipping note", multiline: true },
  { key: SITE_CONTENT_KEYS.homeTitle, label: "Home page title" },
  { key: SITE_CONTENT_KEYS.seoTitle, label: "SEO title" },
  { key: SITE_CONTENT_KEYS.seoDescription, label: "SEO description", multiline: true },
  { key: SITE_CONTENT_KEYS.footerText, label: "Footer text", multiline: true },
  { key: SITE_CONTENT_KEYS.socialFacebook, label: "Facebook URL" },
  { key: SITE_CONTENT_KEYS.socialInstagram, label: "Instagram URL" },
  { key: SITE_CONTENT_KEYS.socialX, label: "X URL" },
];

function fieldValue(entries: readonly AdminSiteContentEntry[], key: SiteContentKey): string {
  const entry = entries.find((item) => item.key === key);
  const value = entry?.value ?? DEFAULT_SITE_CONTENT[key];
  return typeof value === "string" ? value : String(value);
}

export function SiteSettingsForm({ entries }: { entries: readonly AdminSiteContentEntry[] }) {
  const [state, formAction] = useActionState<AdminActionResult, FormData>(
    (_previous, formData) => updateSiteContent(formData),
    initialAdminResult,
  );

  return (
    <form action={formAction} className="grid gap-5 sm:grid-cols-2">
      <input
        type="hidden"
        name="contentKeys"
        value={JSON.stringify(FIELDS.map((field) => field.key))}
      />
      {FIELDS.map((field) => {
        const value = fieldValue(entries, field.key);
        return (
          <FormField
            key={field.key}
            label={field.label}
            htmlFor={field.key}
            error={state.fieldErrors[field.key]?.[0]}
          >
            {field.multiline ? (
              <textarea
                id={field.key}
                name={`value.${field.key}`}
                defaultValue={value}
                rows={3}
                className={TEXTAREA_CLASS}
              />
            ) : (
              <Input id={field.key} name={`value.${field.key}`} defaultValue={value} />
            )}
          </FormField>
        );
      })}
      <div className="flex justify-end sm:col-span-2">
        <AdminSubmitButton
          label="Save settings"
          pendingLabel="Saving…"
          size="sm"
          variant="secondary"
        />
      </div>
      <AdminToast result={state} />
    </form>
  );
}
