import {
  DEFAULT_BUNDLE_DEFINITIONS,
  type BundleDefinition,
} from "@/features/bundles/config/bundles";
import { bundleDefinitionsSchema } from "@/features/bundles/schemas/bundle";

export function parseBundleDefinitions(value: unknown): BundleDefinition[] {
  let candidate: unknown = value;

  if (typeof value === "string") {
    try {
      candidate = JSON.parse(value);
    } catch {
      return [...DEFAULT_BUNDLE_DEFINITIONS];
    }
  }

  const parsed = bundleDefinitionsSchema.safeParse(candidate);
  return parsed.success ? [...parsed.data] : [...DEFAULT_BUNDLE_DEFINITIONS];
}
