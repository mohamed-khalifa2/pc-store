import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

export type HeroIconName = "cpu" | "gpu" | "cooling" | "delivery";

const ICON_PATHS: Record<HeroIconName, ReactNode> = {
  cpu: (
    <>
      <rect x="7" y="7" width="10" height="10" rx="1.5" />
      <path d="M10 2v3m4-3v3m-4 14v3m4-3v3M2 10h3m-3 4h3m14-4h3m-3 4h3" />
    </>
  ),
  gpu: (
    <>
      <rect x="2.5" y="7" width="19" height="10" rx="2" />
      <circle cx="8" cy="12" r="2.5" />
      <circle cx="15" cy="12" r="2.5" />
      <path d="M6 17v2m12-2v2" />
    </>
  ),
  cooling: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2" />
      <path d="M12 10c0-3 1.5-5 4-5M14 12c3 0 5 1.5 5 4M12 14c0 3-1.5 5-4 5M10 12c-3 0-5-1.5-5-4" />
    </>
  ),
  delivery: (
    <>
      <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7z" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="17.5" cy="18" r="1.8" />
    </>
  ),
};

type HeroIconProps = {
  name: HeroIconName;
  className?: string;
};

export function HeroIcon({ name, className }: HeroIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-6", className)}
    >
      {ICON_PATHS[name]}
    </svg>
  );
}
