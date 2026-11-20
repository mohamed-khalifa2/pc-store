import type { ComponentPropsWithRef } from "react";

import { cn } from "@/lib/utils/cn";

const INPUT_CLASS_NAME = [
  "bg-surface-900 border-surface-700 h-11 w-full rounded-md border px-4 text-sm text-white",
  "placeholder:text-surface-500 focus-visible:outline-none focus-visible:ring-2",
  "focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black-950",
  "aria-[invalid=true]:border-danger disabled:opacity-50",
].join(" ");

export function Input({ className, ...props }: ComponentPropsWithRef<"input">) {
  return <input className={cn(INPUT_CLASS_NAME, className)} {...props} />;
}
