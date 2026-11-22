"use client";

import { Input } from "@/components/ui/Input";

type CheckoutFieldProps = {
  id: string;
  name: string;
  label: string;
  type?: "text" | "tel";
  autoComplete?: string;
  list?: string;
  required?: boolean;
  errors?: string[];
};

export function CheckoutField({
  id,
  name,
  label,
  type = "text",
  autoComplete,
  list,
  required = true,
  errors,
}: CheckoutFieldProps) {
  const error = errors?.[0];

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-surface-200 block text-xs font-bold tracking-widest uppercase"
      >
        {label}
      </label>
      <Input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        list={list}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error ? (
        <p id={`${id}-error`} className="text-danger text-xs font-semibold">
          {error}
        </p>
      ) : null}
    </div>
  );
}
