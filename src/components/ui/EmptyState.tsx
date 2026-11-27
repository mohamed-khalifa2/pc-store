import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
};

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <div className="border-surface-800 bg-surface-900/50 rounded-card border px-6 py-16 text-center">
      {icon && (
        <div className="bg-accent/10 text-accent mx-auto mb-5 grid size-12 place-items-center rounded-full">
          {icon}
        </div>
      )}
      <p className="text-lg font-black text-white">{title}</p>
      {description && (
        <p className="text-surface-400 mx-auto mt-3 max-w-md text-sm">{description}</p>
      )}
      {action && <div className="mt-8 flex justify-center">{action}</div>}
    </div>
  );
}
