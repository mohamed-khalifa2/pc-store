"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import { Button } from "@/components/ui/Button";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { ADMIN_UPLOAD_LIMITS } from "@/features/admin/config/uploads";
import { uploadAdminImage } from "@/features/admin/actions/upload-image";
import { FormField } from "@/features/admin/components/FormField";
import type { AdminActionResult } from "@/features/admin/lib/action-result";
import { STORAGE_BUCKETS } from "@/lib/constants";
import { resolveAssetUrl } from "@/lib/format/asset-url";

type UploadBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

type ImageUploaderProps = {
  name: string;
  label: string;
  bucket: UploadBucket;
  prefix: string;
  initialPaths?: readonly string[];
  multiple?: boolean;
  max?: number;
  fallback?: string;
};

export function ImageUploader({
  name,
  label,
  bucket,
  prefix,
  initialPaths = [],
  multiple = false,
  max = multiple ? 10 : 1,
  fallback = "/images/products/generic.svg",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [paths, setPaths] = useState<string[]>([...initialPaths]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    setBusy(true);
    setError("");
    for (const file of files.slice(0, Math.max(0, max - paths.length))) {
      const payload = new FormData();
      payload.set("bucket", bucket);
      payload.set("prefix", prefix);
      payload.set("file", file);

      const result: AdminActionResult<string> = await uploadAdminImage(payload);
      if (!result.ok || !result.data) {
        setError(result.error ?? ADMIN_COPY.unexpectedError);
        continue;
      }
      setPaths((current) => [...current, result.data!]);
    }
    setBusy(false);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= paths.length) return;
    const next = [...paths];
    [next[index], next[target]] = [next[target]!, next[index]!];
    setPaths(next);
  }

  return (
    <FormField label={label} error={error}>
      <input
        ref={inputRef}
        type="file"
        accept={ADMIN_UPLOAD_LIMITS[bucket].mimeTypes.join(",")}
        multiple={multiple}
        onChange={handleFiles}
        className="hidden"
      />
      {paths.map((path) => (
        <input key={path} type="hidden" name={name} value={path} readOnly />
      ))}
      <div className="space-y-3" aria-busy={busy}>
        {paths.map((path, index) => (
          <div
            key={path}
            className="border-surface-800 bg-surface-900/60 flex items-center gap-3 rounded-lg border p-2"
          >
            <Image
              src={resolveAssetUrl(path, bucket, fallback)}
              alt=""
              width={72}
              height={48}
              unoptimized
              className="bg-surface-800 h-12 w-[4.5rem] rounded object-cover"
            />
            <p className="text-surface-400 min-w-0 flex-1 truncate font-mono text-xs">{path}</p>
            <button
              type="button"
              aria-label={ADMIN_COPY.moveUp}
              onClick={() => move(index, -1)}
              className="text-surface-300 hover:text-accent px-1"
            >
              ↑
            </button>
            <button
              type="button"
              aria-label={ADMIN_COPY.moveDown}
              onClick={() => move(index, 1)}
              className="text-surface-300 hover:text-accent px-1"
            >
              ↓
            </button>
            <button
              type="button"
              aria-label={ADMIN_COPY.delete}
              onClick={() => setPaths(paths.filter((item) => item !== path))}
              className="text-danger px-1 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        ))}
        {paths.length < max ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
          >
            {busy ? ADMIN_COPY.saving : multiple ? "Add images" : "Choose image"}
          </Button>
        ) : null}
      </div>
    </FormField>
  );
}
