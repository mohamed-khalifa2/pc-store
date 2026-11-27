import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { STORAGE_BUCKETS } from "@/lib/constants";
import type { Database } from "@/lib/supabase/types";

import {
  adminFailure,
  adminSuccess,
  type AdminActionResult,
} from "@/features/admin/lib/action-result";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { ADMIN_UPLOAD_ERRORS, ADMIN_UPLOAD_LIMITS } from "@/features/admin/config/uploads";

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

function uploadErrorMessage(message: string): string {
  const normalized = message.toLowerCase();
  if (normalized.includes("bucket not found") || normalized.includes("bucket does not exist")) {
    return ADMIN_UPLOAD_ERRORS.bucketMissing;
  }
  if (normalized.includes("row-level security") || normalized.includes("permission denied")) {
    return ADMIN_UPLOAD_ERRORS.permission;
  }
  if (normalized.includes("mime") || normalized.includes("media type")) {
    return ADMIN_UPLOAD_ERRORS.invalidType;
  }
  if (normalized.includes("size") || normalized.includes("limit")) {
    return ADMIN_UPLOAD_ERRORS.tooLarge;
  }
  return ADMIN_UPLOAD_ERRORS.failed;
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
    return adminFailure<string>(ADMIN_UPLOAD_ERRORS.invalidType);
  }
  if (file.size > limits.maxBytes) {
    return adminFailure<string>(ADMIN_UPLOAD_ERRORS.tooLarge);
  }

  const path = storagePath(prefix, file);
  const { error } = await client.storage.from(bucket).upload(path, file, {
    contentType: file.type,
    cacheControl: "3600",
    upsert: false,
  });

  return error
    ? adminFailure<string>(uploadErrorMessage(error.message))
    : adminSuccess(ADMIN_COPY.uploaded, path);
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
