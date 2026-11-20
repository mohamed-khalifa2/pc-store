const Z_INDEX_CLASSES = {
  10: "z-10",
  20: "z-20",
  25: "z-20",
  30: "z-30",
  35: "z-30",
  40: "z-40",
  60: "z-50",
  70: "z-50",
} as const;

type ZIndexValue = keyof typeof Z_INDEX_CLASSES;

export function heroZIndexClass(value: number): string {
  return Z_INDEX_CLASSES[value as ZIndexValue] ?? "z-0";
}
