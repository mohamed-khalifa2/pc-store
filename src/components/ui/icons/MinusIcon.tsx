import type { SVGProps } from "react";

import { cn } from "@/lib/utils/cn";

type MinusIconProps = SVGProps<SVGSVGElement>;

export function MinusIcon({ className, ...props }: MinusIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      className={cn("size-4", className)}
      {...props}
    >
      <path d="M5 12h14" />
    </svg>
  );
}
