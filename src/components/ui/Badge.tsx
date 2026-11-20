import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

const BADGE_TONES = {
  accent: "border-accent-strong bg-accent/10 text-accent",
  neutral: "border-surface-700 bg-surface-900 text-surface-200",
} as const;

type BadgeTone = keyof typeof BADGE_TONES;

type BadgeProps = ComponentPropsWithoutRef<"span"> & {
  tone?: BadgeTone;
};

export function Badge({ className, tone = "accent", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-black tracking-[0.16em] uppercase",
        BADGE_TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
