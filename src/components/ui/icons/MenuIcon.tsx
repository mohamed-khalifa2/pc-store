import type { SVGProps } from "react";

import { cn } from "@/lib/utils/cn";

type MenuIconProps = SVGProps<SVGSVGElement>;

export function MenuIcon({ className, ...props }: MenuIconProps) {
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
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}
