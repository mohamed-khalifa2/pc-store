import type { SVGProps } from "react";

import { cn } from "@/lib/utils/cn";

type ChevronRightIconProps = SVGProps<SVGSVGElement>;

export function ChevronRightIcon({ className, ...props }: ChevronRightIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-4", className)}
      {...props}
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}
