import { Button } from "@/components/ui/Button";
import type { ButtonSize } from "@/components/ui/button-styles";
import { MinusIcon } from "@/components/ui/icons/MinusIcon";
import { PlusIcon } from "@/components/ui/icons/PlusIcon";
import { cn } from "@/lib/utils/cn";

type QuantityStepperSize = Extract<ButtonSize, "sm" | "md">;

type QuantityStepperProps = {
  value: number;
  max: number;
  min?: number;
  size?: QuantityStepperSize;
  decreaseLabel: string;
  increaseLabel: string;
  onChange: (value: number) => void;
};

export function QuantityStepper({
  value,
  max,
  min = 1,
  size = "sm",
  decreaseLabel,
  increaseLabel,
  onChange,
}: QuantityStepperProps) {
  const isCompact = size === "sm";

  return (
    <div className="border-surface-700 bg-surface-900/40 inline-flex items-center rounded-md border">
      <Button
        variant="ghost"
        size={size}
        className={cn("px-0", isCompact ? "size-9" : "size-11")}
        disabled={value <= min}
        aria-label={decreaseLabel}
        onClick={() => onChange(value - 1)}
      >
        <MinusIcon className={isCompact ? "size-4" : "size-5"} />
      </Button>
      <span
        aria-live="polite"
        className={cn(
          "text-center font-black tabular-nums",
          isCompact ? "w-8 text-sm" : "w-10 text-base",
        )}
      >
        {value}
      </span>
      <Button
        variant="ghost"
        size={size}
        className={cn("px-0", isCompact ? "size-9" : "size-11")}
        disabled={value >= max}
        aria-label={increaseLabel}
        onClick={() => onChange(value + 1)}
      >
        <PlusIcon className={isCompact ? "size-4" : "size-5"} />
      </Button>
    </div>
  );
}
