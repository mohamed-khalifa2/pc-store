import type { SVGProps } from "react";

import { cn } from "@/lib/utils/cn";

type SearchIconProps = SVGProps<SVGSVGElement>;

export function SearchIcon({ className, ...props }: SearchIconProps) {
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
      <circle cx="11" cy="11" r="7" />
      <path d="m16.5 16.5 4 4" />
    </svg>
  );
}
