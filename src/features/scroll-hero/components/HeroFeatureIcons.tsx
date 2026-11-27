import { HeroIcon, type HeroIconName } from "@/features/scroll-hero/components/HeroIcon";

const FEATURES: readonly { icon: HeroIconName; label: string }[] = [
  { icon: "cpu", label: "Latest generation CPUs" },
  { icon: "gpu", label: "Graphics that deliver" },
  { icon: "cooling", label: "Quiet, focused cooling" },
  { icon: "delivery", label: "Fast, careful delivery" },
];

export function HeroFeatureIcons() {
  return (
    <div className="border-surface-800 max-w-container-store relative mx-auto grid grid-cols-2 border-t px-5 sm:grid-cols-4 sm:px-8 lg:px-12">
      {FEATURES.map((feature) => (
        <div
          key={feature.label}
          className="border-surface-800/60 flex items-center gap-3 border-b py-5 sm:border-b-0"
        >
          <span className="text-accent">
            <HeroIcon name={feature.icon} />
          </span>
          <span className="text-surface-200 text-[0.7rem] font-black tracking-[0.14em] uppercase">
            {feature.label}
          </span>
        </div>
      ))}
    </div>
  );
}
