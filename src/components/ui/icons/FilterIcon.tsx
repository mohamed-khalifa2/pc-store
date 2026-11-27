import type { SVGProps } from "react";

import { cn } from "@/lib/utils/cn";

type FilterIconProps = SVGProps<SVGSVGElement>;

export function FilterIcon({ className, ...props }: FilterIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M4 7h9m4 0h3M4 17h3m4 0h9" />
      <circle cx="15" cy="7" r="2" />
      <circle cx="9" cy="17" r="2" />
    </svg>
  );
}
