import { cn } from "@/lib/utils/cn";

export const BUTTON_VARIANTS = {
  primary: "bg-accent text-black-950 hover:bg-accent-strong",
  secondary:
    "border border-surface-700 bg-surface-900 text-white hover:border-accent-strong hover:text-accent",
  ghost: "text-white hover:bg-surface-900 hover:text-accent",
} as const;

export const BUTTON_SIZES = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-14 px-8 text-base",
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;

const BASE_BUTTON_CLASSES = [
  "inline-flex items-center justify-center gap-2 rounded-md font-black uppercase tracking-[0.12em]",
  "transition-[transform,opacity,background-color,border-color,color]",
  "duration-[var(--duration-normal)] ease-[var(--ease-out-expo)]",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black-950",
  "disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
].join(" ");

export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(BASE_BUTTON_CLASSES, BUTTON_VARIANTS[variant], BUTTON_SIZES[size], className);
}
