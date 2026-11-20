import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

const HEADING_TAGS = {
  1: "h1",
  2: "h2",
  3: "h3",
} as const;

const HEADING_SIZES = {
  display: "text-5xl leading-[0.92] sm:text-7xl lg:text-8xl",
  section: "text-3xl leading-tight sm:text-5xl",
  card: "text-xl leading-snug sm:text-2xl",
} as const;

const HEADING_TONES = {
  default: "text-white",
  inverse: "text-black-950",
} as const;

const DEFAULT_SIZE_BY_LEVEL = {
  1: "display",
  2: "section",
  3: "card",
} as const;

type HeadingLevel = keyof typeof HEADING_TAGS;
type HeadingSize = keyof typeof HEADING_SIZES;
type HeadingTone = keyof typeof HEADING_TONES;

type HeadingProps = {
  level?: HeadingLevel;
  size?: HeadingSize;
  tone?: HeadingTone;
  className?: string;
  children: ReactNode;
  id?: string;
};

export function Heading({
  level = 2,
  size,
  tone = "default",
  className,
  children,
  id,
}: HeadingProps) {
  const Tag = HEADING_TAGS[level];
  const resolvedSize = size ?? DEFAULT_SIZE_BY_LEVEL[level];

  return (
    <Tag
      id={id}
      className={cn(
        "font-black tracking-tight",
        HEADING_TONES[tone],
        HEADING_SIZES[resolvedSize],
        className,
      )}
    >
      {children}
    </Tag>
  );
}
