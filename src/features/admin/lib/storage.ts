import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { STORAGE_BUCKETS } from "@/lib/constants";
import type { Database } from "@/lib/supabase/types";

import {
  adminFailure,
  adminSuccess,
  type AdminActionResult,
} from "@/features/admin/lib/action-result";
import { ADMIN_UPLOAD_LIMITS } from "@/features/admin/config/uploads";

export type AdminSupabase = SupabaseClient<Database>;
export type AdminStorageBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

const MIME_EXTENSIONS: Record<string, string> = {
  "image/webp": "webp",
  "image/avif": "avif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/svg+xml": "svg",
};

export function storagePath(prefix: string, file: File): string {
  const extension = MIME_EXTENSIONS[file.type] ?? "bin";
  const safePrefix = prefix.replace(/[^a-zA-Z0-9/_-]/g, "-").replace(/^\/+|\/+$/g, "");
  return `${safePrefix}/${crypto.randomUUID()}.${extension}`;
}

export async function uploadImage(
  client: AdminSupabase,
  bucket: AdminStorageBucket,
  prefix: string,
  file: File,
): Promise<AdminActionResult<string>> {
  if (!(file instanceof File) || file.size === 0) {
    return adminFailure<string>("Choose a non-empty image file.");
  }
  const limits = ADMIN_UPLOAD_LIMITS[bucket];
  if (!limits.mimeTypes.includes(file.type) || !MIME_EXTENSIONS[file.type]) {
    return adminFailure<string>("That image type is not supported for this destination.");
  }
  if (file.size > limits.maxBytes) {
    return adminFailure<string>(
      `Images for this destination must be ${Math.floor(limits.maxBytes / (1024 * 1024))} MB or smaller.`,
    );
  }

  const path = storagePath(prefix, file);
  const { error } = await client.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  });

  return error
    ? adminFailure<string>("The image could not be uploaded.")
    : adminSuccess("Image uploaded.", path);
}

export async function removeImages(
  client: AdminSupabase,
  bucket: AdminStorageBucket,
  paths: readonly string[],
): Promise<void> {
  const valid = paths.filter((path) => path.length > 0 && !/^https?:\/\//i.test(path));
  if (valid.length === 0) return;
  await client.storage.from(bucket).remove([...valid]);
}
