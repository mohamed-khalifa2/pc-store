"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/features/admin/components/FormField";
import { ADMIN_PRODUCT_FIELDS, ADMIN_SPECS_MAX } from "@/features/products/schemas/admin-product";

export type AdminSpecFormRow = { key: string; value: string };

const CELL_INPUT =
  "border-surface-700 bg-surface-900 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent h-10 w-full rounded-md border px-3 text-sm";

type SpecsEditorProps = {
  initialSpecs: readonly AdminSpecFormRow[];
  error?: string;
};

export function SpecsEditor({ initialSpecs, error }: SpecsEditorProps) {
  const [rows, setRows] = useState<AdminSpecFormRow[]>([...initialSpecs]);

  function update(index: number, patch: Partial<AdminSpecFormRow>) {
    setRows((current) =>
      current.map((row, position) => (position === index ? { ...row, ...patch } : row)),
    );
  }

  function remove(index: number) {
    setRows((current) => current.filter((_, position) => position !== index));
  }

  return (
    <FormField label="Specifications" hint="Up to 30 key/value pairs." error={error}>
      <div className="space-y-3">
        {rows.map((row, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
            <input
              type="hidden"
              name={`${ADMIN_PRODUCT_FIELDS.specKey}${index}`}
              value={row.key}
              readOnly
            />
            <input
              type="hidden"
              name={`${ADMIN_PRODUCT_FIELDS.specValue}${index}`}
              value={row.value}
              readOnly
            />
            <input
              type="text"
              value={row.key}
              onChange={(event) => update(index, { key: event.target.value })}
              placeholder="Key (e.g. socket)"
              aria-label={`Specification ${index + 1} key`}
              className={CELL_INPUT}
            />
            <input
              type="text"
              value={row.value}
              onChange={(event) => update(index, { value: event.target.value })}
              placeholder="Value (e.g. AM5)"
              aria-label={`Specification ${index + 1} value`}
              className={CELL_INPUT}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => remove(index)}
              aria-label={`Remove specification ${index + 1}`}
            >
              ✕
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => setRows((current) => [...current, { key: "", value: "" }])}
          disabled={rows.length >= ADMIN_SPECS_MAX}
        >
          Add specification
        </Button>
      </div>
    </FormField>
  );
}
