import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

const SKELETON_RADII = {
  sm: "rounded-sm",
  md: "rounded-md",
  full: "rounded-full",
} as const;

type SkeletonRadius = keyof typeof SKELETON_RADII;

type SkeletonProps = ComponentPropsWithoutRef<"div"> & {
  radius?: SkeletonRadius;
};

export function Skeleton({ className, radius = "md", ...props }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-surface-800 animate-pulse", SKELETON_RADII[radius], className)}
      {...props}
    />
  );
}
