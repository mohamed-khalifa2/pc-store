import { Button } from "@/components/ui/Button";
import { ImageUploaderItem } from "@/features/admin/components/ImageUploaderItem";
import { ADMIN_COPY } from "@/features/admin/config/copy";
import { STORAGE_BUCKETS } from "@/lib/constants";
import { resolveAssetUrl } from "@/lib/format/asset-url";

type UploadBucket = (typeof STORAGE_BUCKETS)[keyof typeof STORAGE_BUCKETS];

export type PendingUpload = {
  id: string;
  file: File;
  preview: string;
  error?: string;
};

type ImageUploaderRowsProps = {
  name: string;
  bucket: UploadBucket;
  paths: readonly string[];
  pending: readonly PendingUpload[];
  multiple: boolean;
  max: number;
  fallback: string;
  fit: "cover" | "contain";
  busy: boolean;
  onChoose: () => void;
  onMove: (index: number, direction: -1 | 1) => void;
  onRemovePath: (index: number) => void;
  onRemovePending: (id: string) => void;
  onRetry: (item: PendingUpload) => void;
};

export function ImageUploaderRows({
  name,
  bucket,
  paths,
  pending,
  multiple,
  max,
  fallback,
  fit,
  busy,
  onChoose,
  onMove,
  onRemovePath,
  onRemovePending,
  onRetry,
}: ImageUploaderRowsProps) {
  return (
    <>
      {paths.map((path) => (
        <input key={path} type="hidden" name={name} value={path} readOnly />
      ))}
      <div className="space-y-3" aria-busy={busy}>
        {paths.map((path, index) => (
          <ImageUploaderItem
            key={path}
            src={resolveAssetUrl(path, bucket, fallback)}
            path={path}
            fit={fit}
            canMoveUp={index > 0}
            canMoveDown={index < paths.length - 1}
            onMove={(direction) => onMove(index, direction)}
            onRemove={() => onRemovePath(index)}
          />
        ))}
        {pending.map((item) => (
          <ImageUploaderItem
            key={item.id}
            src={item.preview}
            fit={fit}
            error={item.error}
            busy={!item.error}
            onRemove={() => onRemovePending(item.id)}
            onRetry={item.error ? () => onRetry(item) : undefined}
          />
        ))}
        {paths.length + pending.length < max ? (
          <Button type="button" variant="secondary" size="sm" onClick={onChoose} disabled={busy}>
            {busy ? ADMIN_COPY.saving : multiple ? ADMIN_COPY.addImages : ADMIN_COPY.chooseImage}
          </Button>
        ) : null}
      </div>
    </>
  );
}
