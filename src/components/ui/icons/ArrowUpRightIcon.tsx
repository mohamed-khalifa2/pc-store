import type { SVGProps } from "react";

import { cn } from "@/lib/utils/cn";

type ArrowUpRightIconProps = SVGProps<SVGSVGElement>;

export function ArrowUpRightIcon({ className, ...props }: ArrowUpRightIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-4", className)}
      {...props}
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}
