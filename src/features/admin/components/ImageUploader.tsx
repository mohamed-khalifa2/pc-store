"use client";

import { useEffect, useRef, useState } from "react";

import { FormField } from "@/features/admin/components/FormField";
import {
  ImageUploaderRows,
  type PendingUpload,
} from "@/features/admin/components/ImageUploaderRows";
import { uploadAdminImage } from "@/features/admin/actions/upload-image";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { ADMIN_UPLOAD_LIMITS } from "@/features/admin/config/uploads";
import { STORAGE_BUCKETS } from "@/lib/constants";

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
  fit?: "cover" | "contain";
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
  fit = "cover",
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingRef = useRef<PendingUpload[]>([]);
  const [paths, setPaths] = useState<string[]>([...initialPaths]);
  const [pending, setPending] = useState<PendingUpload[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    pendingRef.current = pending;
  }, [pending]);

  useEffect(
    () => () => {
      pendingRef.current.forEach((item) => URL.revokeObjectURL(item.preview));
    },
    [],
  );

  async function uploadOne(item: PendingUpload) {
    const payload = new FormData();
    payload.set("bucket", bucket);
    payload.set("prefix", prefix);
    payload.set("file", item.file);

    const result = await uploadAdminImage(payload);
    if (!result.ok || !result.data) {
      const message = result.error ?? ADMIN_COPY.unexpectedError;
      setPending((current) =>
        current.map((entry) => (entry.id === item.id ? { ...entry, error: message } : entry)),
      );
      setError(message);
      return;
    }

    const path = result.data;
    setPaths((current) => [...current, path]);
    URL.revokeObjectURL(item.preview);
    setPending((current) => current.filter((entry) => entry.id !== item.id));
  }

  function retry(item: PendingUpload) {
    setError("");
    setBusy(true);
    void uploadOne(item).finally(() => setBusy(false));
  }

  function removePending(id: string) {
    const item = pending.find((entry) => entry.id === id);
    if (item) URL.revokeObjectURL(item.preview);
    setPending((current) => current.filter((entry) => entry.id !== id));
  }

  async function handleFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;

    const slots = Math.max(0, max - paths.length - pending.length);
    const next = files.slice(0, slots).map((file) => ({
      id: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
    }));
    if (next.length === 0) return;

    setPending((current) => [...current, ...next]);
    setBusy(true);
    setError("");
    for (const item of next) await uploadOne(item);
    setBusy(false);
  }

  function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= paths.length) return;
    const next = [...paths];
    [next[index], next[target]] = [next[target]!, next[index]!];
    setPaths(next);
  }

  function removePath(index: number) {
    setPaths((current) => current.filter((_path, position) => position !== index));
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
      <ImageUploaderRows
        name={name}
        bucket={bucket}
        paths={paths}
        pending={pending}
        multiple={multiple}
        max={max}
        fallback={fallback}
        fit={fit}
        busy={busy}
        onChoose={() => inputRef.current?.click()}
        onMove={move}
        onRemovePath={removePath}
        onRemovePending={removePending}
        onRetry={retry}
      />
    </FormField>
  );
}
