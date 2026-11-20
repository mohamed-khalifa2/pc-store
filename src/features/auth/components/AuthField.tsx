import { Input } from "@/components/ui/Input";

type AuthFieldProps = {
  id: string;
  name: string;
  label: string;
  type: "text" | "email" | "password";
  autoComplete: string;
  errors?: string[];
};

export function AuthField({ id, name, label, type, autoComplete, errors }: AuthFieldProps) {
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
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        required
      />
      {error ? (
        <p id={`${id}-error`} className="text-danger text-xs font-semibold">
          {error}
        </p>
      ) : null}
    </div>
  );
}
