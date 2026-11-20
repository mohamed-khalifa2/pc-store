import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils/cn";

export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      className={cn("max-w-container-store mx-auto w-full px-5 sm:px-8 lg:px-12", className)}
      {...props}
    />
  );
}
