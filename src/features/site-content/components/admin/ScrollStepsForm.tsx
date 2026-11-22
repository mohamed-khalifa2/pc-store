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
  { key: SITE_CONTENT_KEYS.step1Eyebrow, label: "Step 1 eyebrow" },
  { key: SITE_CONTENT_KEYS.step1Title, label: "Step 1 title" },
  { key: SITE_CONTENT_KEYS.step1Accent, label: "Step 1 accent" },
  { key: SITE_CONTENT_KEYS.step1Body, label: "Step 1 body", multiline: true },
  { key: SITE_CONTENT_KEYS.step2Eyebrow, label: "Step 2 eyebrow" },
  { key: SITE_CONTENT_KEYS.step2Title, label: "Step 2 title" },
  { key: SITE_CONTENT_KEYS.step2Accent, label: "Step 2 accent" },
  { key: SITE_CONTENT_KEYS.step2Body, label: "Step 2 body", multiline: true },
  { key: SITE_CONTENT_KEYS.step3Eyebrow, label: "Step 3 eyebrow" },
  { key: SITE_CONTENT_KEYS.step3Title, label: "Step 3 title" },
  { key: SITE_CONTENT_KEYS.step3Accent, label: "Step 3 accent" },
  { key: SITE_CONTENT_KEYS.step3Body, label: "Step 3 body", multiline: true },
  { key: SITE_CONTENT_KEYS.step3Cta, label: "Step 3 CTA label" },
];

function fieldValue(entries: readonly AdminSiteContentEntry[], key: SiteContentKey): string {
  const entry = entries.find((item) => item.key === key);
  const value = entry?.value ?? DEFAULT_SITE_CONTENT[key];
  return typeof value === "string" ? value : String(value);
}

export function ScrollStepsForm({ entries }: { entries: readonly AdminSiteContentEntry[] }) {
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
          label="Save scroll steps"
          pendingLabel="Saving…"
          size="sm"
          variant="secondary"
        />
      </div>
      <AdminToast result={state} />
    </form>
  );
}
