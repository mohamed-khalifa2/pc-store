import { Badge } from "@/components/ui/Badge";
import { Heading } from "@/components/ui/Heading";

type CatalogHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  count: string;
};

export function CatalogHeader({ eyebrow, title, description, count }: CatalogHeaderProps) {
  return (
    <header className="border-surface-800 flex flex-col gap-6 border-b pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-3">
        <p className="text-accent flex items-center gap-3 text-xs font-black tracking-[0.35em] uppercase">
          <span aria-hidden="true" className="bg-accent h-px w-8" />
          {eyebrow}
        </p>
        <Heading level={1}>{title}</Heading>
        <p className="text-surface-400 max-w-2xl">{description}</p>
      </div>
      <Badge tone="neutral" className="self-start px-4 py-2 sm:self-end">
        {count}
      </Badge>
    </header>
  );
}
