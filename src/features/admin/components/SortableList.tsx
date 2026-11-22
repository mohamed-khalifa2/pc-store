"use client";

import { useState } from "react";

import { ADMIN_COPY } from "@/features/admin/config/copy";
import { cn } from "@/lib/utils/cn";

export type SortableItem = {
  id: string;
  label: string;
  meta?: string;
};

type SortableListProps = {
  items: readonly SortableItem[];
  name: string;
};

export function SortableList({ items, name }: SortableListProps) {
  const [ordered, setOrdered] = useState<SortableItem[]>([...items]);

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= ordered.length) return;
    const next = [...ordered];
    [next[index], next[target]] = [next[target]!, next[index]!];
    setOrdered(next);
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={JSON.stringify(ordered.map((item) => item.id))} />
      {ordered.map((item, index) => (
        <div
          key={item.id}
          className="border-surface-800 bg-surface-900/60 flex items-center gap-4 rounded-lg border px-4 py-3"
        >
          <span className="text-accent font-mono text-xs">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-white">{item.label}</p>
            {item.meta ? <p className="text-surface-500 truncate text-xs">{item.meta}</p> : null}
          </div>
          <div className="flex gap-1">
            <SortButton label={ADMIN_COPY.moveUp} onClick={() => move(index, -1)}>
              ↑
            </SortButton>
            <SortButton label={ADMIN_COPY.moveDown} onClick={() => move(index, 1)}>
              ↓
            </SortButton>
          </div>
        </div>
      ))}
    </div>
  );
}

function SortButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "border-surface-700 text-surface-300 hover:border-accent hover:text-accent",
        "flex h-8 w-8 items-center justify-center rounded border text-sm",
      )}
    >
      {children}
    </button>
  );
}
