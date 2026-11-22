"use client";

import { useActionState } from "react";

import { Input } from "@/components/ui/Input";
import { AdminSubmitButton } from "@/features/admin/components/AdminSubmitButton";
import { AdminToast } from "@/features/admin/components/AdminToast";
import { FormField } from "@/features/admin/components/FormField";
import { initialAdminResult, type AdminActionResult } from "@/features/admin/lib/action-result";
import { BANNER_VARIANTS } from "@/features/banners/config/variants";
import { upsertHomeSection } from "@/features/home/actions/upsert-home-section";
import {
  DEFAULT_BANNER_VARIANTS,
  HOME_SECTION_KIND,
  VISIBLE_SECTION_KINDS,
} from "@/features/home/config/sections";
import type { AdminHomeSection } from "@/features/site-content/types.admin";

const SELECT_CLASS =
  "bg-surface-900 border-surface-700 h-11 w-full rounded-md border px-4 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black-950";
const CHECKBOX_CLASS = "accent-accent size-4";

type ConfigField = {
  name: "limit" | "items" | "href" | "label" | "publishedAt";
  label: string;
  value: string;
  type?: "number" | "datetime-local";
};

function toDateTimeLocal(value: string | null): string {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 16);
}

export function HomeSectionForm({ section }: { section?: AdminHomeSection }) {
  const [state, formAction] = useActionState<AdminActionResult, FormData>(
    (_previous, formData) => upsertHomeSection(formData),
    initialAdminResult,
  );
  const fieldId = (name: string) => `${section?.id ?? "new"}-${name}`;
  const errorFor = (name: string) => state.fieldErrors[name]?.[0];
  const selectedVariants = section?.config.variants ?? [...DEFAULT_BANNER_VARIANTS];
  const config = section?.config;
  const publishedAt = toDateTimeLocal(section?.publishedAt ?? null);

  const configFields: ConfigField[] = [
    {
      name: "limit",
      label: "Limit (1–12)",
      value: config?.limit?.toString() ?? "",
      type: "number",
    },
    { name: "items", label: "Items (comma-separated)", value: config?.items?.join(", ") ?? "" },
    { name: "href", label: "Link href", value: config?.href ?? "" },
    { name: "label", label: "Button label", value: config?.label ?? "" },
    { name: "publishedAt", label: "Published at", value: publishedAt, type: "datetime-local" },
  ];
  return (
    <form action={formAction} className="grid gap-5 sm:grid-cols-2">
      <input type="hidden" name="id" value={section?.id ?? ""} />
      <FormField label="Title" htmlFor={fieldId("title")} error={errorFor("title")}>
        <Input id={fieldId("title")} name="title" defaultValue={section?.title ?? ""} />
      </FormField>
      <FormField label="Subtitle" htmlFor={fieldId("subtitle")} error={errorFor("subtitle")}>
        <Input id={fieldId("subtitle")} name="subtitle" defaultValue={section?.subtitle ?? ""} />
      </FormField>
      <FormField label="Section key" htmlFor={fieldId("key")} error={errorFor("key")}>
        <Input id={fieldId("key")} name="key" defaultValue={section?.key ?? ""} required />
      </FormField>
      <FormField label="Kind" htmlFor={fieldId("kind")} error={errorFor("kind")}>
        <select
          id={fieldId("kind")}
          name="kind"
          defaultValue={section?.kind ?? HOME_SECTION_KIND.hero}
          className={SELECT_CLASS}
        >
          {VISIBLE_SECTION_KINDS.map((kind) => (
            <option key={kind} value={kind}>
              {kind.split("_").join(" ")}
            </option>
          ))}
        </select>
      </FormField>
      {configFields.map((field) => (
        <FormField
          key={field.name}
          label={field.label}
          htmlFor={fieldId(field.name)}
          error={errorFor(field.name)}
        >
          <Input
            id={fieldId(field.name)}
            name={field.name}
            type={field.type}
            min={field.type === "number" ? 1 : undefined}
            max={field.type === "number" ? 12 : undefined}
            defaultValue={field.value}
          />
        </FormField>
      ))}
      <fieldset className="space-y-3 sm:col-span-2">
        <legend className="text-surface-200 text-xs font-black tracking-[0.16em] uppercase">
          Banner variants
        </legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {BANNER_VARIANTS.map((variant) => (
            <label
              key={variant}
              className="text-surface-200 flex items-center gap-2 text-sm capitalize"
            >
              <input
                type="checkbox"
                name="variants"
                value={variant}
                defaultChecked={selectedVariants.includes(variant)}
                className={CHECKBOX_CLASS}
              />
              {variant}
            </label>
          ))}
        </div>
        {errorFor("variants") ? (
          <p className="text-danger text-xs font-semibold" role="alert">
            {errorFor("variants")}
          </p>
        ) : null}
      </fieldset>
      <label className="text-surface-200 flex items-center gap-3 text-sm sm:col-span-2">
        <input
          type="checkbox"
          name="isPublished"
          defaultChecked={section?.isPublished ?? true}
          className={CHECKBOX_CLASS}
        />
        Published
      </label>
      <div className="flex justify-end sm:col-span-2">
        <AdminSubmitButton
          label="Save section"
          pendingLabel="Saving…"
          size="sm"
          variant="secondary"
        />
      </div>
      <AdminToast result={state} />
    </form>
  );
}
