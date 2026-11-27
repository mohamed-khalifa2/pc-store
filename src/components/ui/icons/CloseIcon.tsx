import type { SVGProps } from "react";

import { cn } from "@/lib/utils/cn";

type CloseIconProps = SVGProps<SVGSVGElement>;

export function CloseIcon({ className, ...props }: CloseIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}
