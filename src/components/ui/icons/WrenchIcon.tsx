import type { SVGProps } from "react";

import { cn } from "@/lib/utils/cn";

type WrenchIconProps = SVGProps<SVGSVGElement>;

export function WrenchIcon({ className, ...props }: WrenchIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <path d="M14.5 6.5a4 4 0 0 0-5.2 5L4 17.3 6.7 20l5.8-5.3a4 4 0 0 0 5-5.2L14.5 13 11 9.5l3.5-3Z" />
    </svg>
  );
}
