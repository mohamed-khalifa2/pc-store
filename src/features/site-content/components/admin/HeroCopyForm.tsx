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

const FIELDS: readonly { key: SiteContentKey; label: string }[] = [
  { key: SITE_CONTENT_KEYS.heroTitle, label: "Hero title" },
  { key: SITE_CONTENT_KEYS.heroSubtitle, label: "Hero subtitle" },
];

function fieldValue(entries: readonly AdminSiteContentEntry[], key: SiteContentKey): string {
  const entry = entries.find((item) => item.key === key);
  const value = entry?.value ?? DEFAULT_SITE_CONTENT[key];
  return typeof value === "string" ? value : String(value);
}

export function HeroCopyForm({ entries }: { entries: readonly AdminSiteContentEntry[] }) {
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
      {FIELDS.map((field) => (
        <FormField
          key={field.key}
          label={field.label}
          htmlFor={field.key}
          error={state.fieldErrors[field.key]?.[0]}
        >
          <Input
            id={field.key}
            name={`value.${field.key}`}
            defaultValue={fieldValue(entries, field.key)}
          />
        </FormField>
      ))}
      <div className="flex justify-end sm:col-span-2">
        <AdminSubmitButton
          label="Save hero copy"
          pendingLabel="Saving…"
          size="sm"
          variant="secondary"
        />
      </div>
      <AdminToast result={state} />
    </form>
  );
}
