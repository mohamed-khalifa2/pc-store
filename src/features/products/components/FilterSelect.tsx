import { cn } from "@/lib/utils/cn";

const SELECT_CLASS = [
  "bg-surface-900 border-surface-700 h-11 w-full rounded-md border px-4 text-sm text-white",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent",
  "focus-visible:ring-offset-2 focus-visible:ring-offset-black-950",
].join(" ");

type FilterOption = {
  value: string;
  label: string;
};

type FilterSelectProps = {
  name: string;
  label: string;
  defaultValue: string;
  options: readonly FilterOption[];
  className?: string;
};

export function FilterSelect({ name, label, defaultValue, options, className }: FilterSelectProps) {
  return (
    <label
      htmlFor={name}
      className={cn(
        "text-surface-400 space-y-2 text-xs font-black tracking-[0.12em] uppercase",
        className,
      )}
    >
      <span>{label}</span>
      <select id={name} name={name} defaultValue={defaultValue} className={SELECT_CLASS}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
