import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor?: string;
  error?: string;
  hint?: string;
  children: ReactNode;
};

export function FormField({ label, htmlFor, error, hint, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="text-surface-200 block text-xs font-black tracking-[0.16em] uppercase"
      >
        {label}
      </label>
      {children}
      {hint ? <p className="text-surface-500 text-xs">{hint}</p> : null}
      {error ? (
        <p className="text-danger text-xs font-semibold" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
