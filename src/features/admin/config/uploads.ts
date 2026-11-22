import { STORAGE_BUCKETS } from "@/lib/constants";

export type UploadBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

const RASTER_TYPES = ["image/webp", "image/avif", "image/jpeg", "image/png"] as const;

export type UploadLimit = {
  maxBytes: number;
  mimeTypes: readonly string[];
};

export const ADMIN_UPLOAD_LIMITS: Record<UploadBucket, UploadLimit> = {
  [STORAGE_BUCKETS.banners]: {
    maxBytes: 5 * 1024 * 1024,
    mimeTypes: RASTER_TYPES,
  },
  [STORAGE_BUCKETS.productImages]: {
    maxBytes: 5 * 1024 * 1024,
    mimeTypes: RASTER_TYPES,
  },
  [STORAGE_BUCKETS.siteAssets]: {
    maxBytes: 2 * 1024 * 1024,
    mimeTypes: [...RASTER_TYPES, "image/svg+xml"],
  },
};
