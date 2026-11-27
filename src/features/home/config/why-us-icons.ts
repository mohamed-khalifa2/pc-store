import type { ComponentType, SVGProps } from "react";

import { MessageCircleIcon } from "@/components/ui/icons/MessageCircleIcon";
import { ShieldCheckIcon } from "@/components/ui/icons/ShieldCheckIcon";
import { TruckIcon } from "@/components/ui/icons/TruckIcon";
import { WrenchIcon } from "@/components/ui/icons/WrenchIcon";

export const WHY_US_ICONS: readonly ComponentType<SVGProps<SVGSVGElement>>[] = [
  ShieldCheckIcon,
  TruckIcon,
  MessageCircleIcon,
  WrenchIcon,
];
