import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import {
  buttonClassName,
  type ButtonSize,
  type ButtonVariant,
} from "@/components/ui/button-styles";

type LinkButtonProps = ComponentPropsWithoutRef<typeof Link> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function LinkButton({
  className,
  variant = "primary",
  size = "md",
  ...props
}: LinkButtonProps) {
  return <Link className={buttonClassName(variant, size, className)} {...props} />;
}
