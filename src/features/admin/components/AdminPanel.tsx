import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type AdminPanelProps = {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function AdminPanel({ title, description, children, className }: AdminPanelProps) {
  return (
    <section
      className={cn(
        "border-surface-800 bg-surface-900/50 rounded-card border p-5 sm:p-6",
        className,
      )}
    >
      {title ? <h2 className="text-lg font-black text-white">{title}</h2> : null}
      {description ? <p className="text-surface-400 mt-2 text-sm">{description}</p> : null}
      <div className={title || description ? "mt-6" : undefined}>{children}</div>
    </section>
  );
}
