import { Input } from "@/components/ui/Input";
import { SearchIcon } from "@/components/ui/icons/SearchIcon";
import { cn } from "@/lib/utils/cn";

type FilterSearchFieldProps = {
  name: string;
  label: string;
  placeholder: string;
  defaultValue: string;
  className?: string;
};

export function FilterSearchField({
  name,
  label,
  placeholder,
  defaultValue,
  className,
}: FilterSearchFieldProps) {
  return (
    <label
      htmlFor={name}
      className={cn(
        "text-surface-400 space-y-2 text-xs font-black tracking-[0.12em] uppercase",
        className,
      )}
    >
      <span>{label}</span>
      <span className="relative block">
        <SearchIcon className="text-surface-500 pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2" />
        <Input
          id={name}
          type="search"
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="pl-11"
        />
      </span>
    </label>
  );
}
