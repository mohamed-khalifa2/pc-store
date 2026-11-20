import { STORAGE_BUCKETS } from "@/lib/constants";
import { getPublicEnv } from "@/lib/env";

export type StorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export function isRemoteUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

export function resolveAssetUrl(
  path: string | null | undefined,
  bucket: StorageBucket,
  fallback: string,
): string {
  if (!path) return fallback;
  if (isRemoteUrl(path) || path.startsWith("/") || path.startsWith("data:")) return path;

  try {
    const env = getPublicEnv();
    const baseUrl = env.NEXT_PUBLIC_SUPABASE_URL.replace(/\/$/, "");
    const objectPath = path.replace(/^\/+/, "");
    return `${baseUrl}/storage/v1/object/public/${bucket}/${objectPath}`;
  } catch {
    return fallback;
  }
}
