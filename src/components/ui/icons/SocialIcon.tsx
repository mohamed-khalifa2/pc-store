import type { ReactNode, SVGProps } from "react";

import { cn } from "@/lib/utils/cn";

export type SocialIconName = "facebook" | "instagram" | "x";

const FACEBOOK_PATH =
  "M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.1H7.4V13h2.7v8h3.4Z";

const X_PATH =
  "M18.9 1.2h3.7l-8 9.1 9.4 12.5h-7.4l-5.8-7.6-6.6 7.6H.5l8.6-9.8L0 1.2h7.6l5.2 6.9 6.1-6.9Zm-1.3 19.5h2L6.5 3.2H4.3l13.3 17.5Z";

const ICONS: Record<SocialIconName, ReactNode> = {
  facebook: <path fill="currentColor" d={FACEBOOK_PATH} />,
  instagram: (
    <g fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  x: <path fill="currentColor" d={X_PATH} />,
};

type SocialIconProps = SVGProps<SVGSVGElement> & {
  name: SocialIconName;
};

export function SocialIcon({ name, className, ...props }: SocialIconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={cn("size-5", className)} {...props}>
      {ICONS[name]}
    </svg>
  );
}
