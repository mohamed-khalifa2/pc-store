import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

const SECTION_SPACING = {
  default: "py-24 sm:py-32",
  tight: "py-14 sm:py-20",
  none: "",
} as const;

type SectionSpacing = keyof typeof SECTION_SPACING;

type SectionProps = ComponentPropsWithoutRef<"section"> & {
  spacing?: SectionSpacing;
};

export function Section({ className, spacing = "default", ...props }: SectionProps) {
  return <section className={cn(SECTION_SPACING[spacing], className)} {...props} />;
}
