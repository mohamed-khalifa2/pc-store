import type { SVGProps } from "react";

import { cn } from "@/lib/utils/cn";

type MessageCircleIconProps = SVGProps<SVGSVGElement>;

export function MessageCircleIcon({ className, ...props }: MessageCircleIconProps) {
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
      <path d="M20 15a3 3 0 0 1-3 3H9l-5 3V7a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3Z" />
      <path d="M8 10h8M8 13h5" />
    </svg>
  );
}
