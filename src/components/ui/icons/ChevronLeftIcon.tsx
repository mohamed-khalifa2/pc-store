import type { SVGProps } from "react";

import { cn } from "@/lib/utils/cn";

type ChevronLeftIconProps = SVGProps<SVGSVGElement>;

export function ChevronLeftIcon({ className, ...props }: ChevronLeftIconProps) {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
