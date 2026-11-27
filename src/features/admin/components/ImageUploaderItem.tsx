import Image from "next/image";

import { ADMIN_COPY } from "@/features/admin/config/copy";
import { cn } from "@/lib/utils/cn";

type ImageUploaderItemProps = {
  src: string;
  fit: "cover" | "contain";
  path?: string;
  error?: string;
  busy?: boolean;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  onMove?: (direction: -1 | 1) => void;
  onRemove: () => void;
  onRetry?: () => void;
};

export function ImageUploaderItem({
  src,
  fit,
  path,
  error,
  busy = false,
  canMoveUp = false,
  canMoveDown = false,
  onMove,
  onRemove,
  onRetry,
}: ImageUploaderItemProps) {
  return (
    <div className="border-surface-800 bg-surface-900/60 flex items-center gap-3 rounded-lg border p-2">
      <Image
        src={src}
        alt=""
        width={72}
        height={48}
        unoptimized
        className={cn(
          "bg-surface-800 h-12 w-[4.5rem] rounded",
          fit === "contain" ? "object-contain" : "object-cover",
        )}
      />
      <div className="min-w-0 flex-1">
        {error ? (
          <p className="text-danger truncate text-xs font-semibold" role="alert">
            {error}
          </p>
        ) : busy ? (
          <p className="text-surface-400 text-xs font-semibold">{ADMIN_COPY.uploading}</p>
        ) : (
          <p className="text-surface-400 truncate font-mono text-xs">{path}</p>
        )}
      </div>
      {onMove ? (
        <>
          <button
            type="button"
            aria-label={ADMIN_COPY.moveUp}
            disabled={!canMoveUp}
            onClick={() => onMove(-1)}
            className="text-surface-300 hover:text-accent disabled:text-surface-600 px-1"
          >
            ↑
          </button>
          <button
            type="button"
            aria-label={ADMIN_COPY.moveDown}
            disabled={!canMoveDown}
            onClick={() => onMove(1)}
            className="text-surface-300 hover:text-accent disabled:text-surface-600 px-1"
          >
            ↓
          </button>
        </>
      ) : null}
      {onRetry ? (
        <button type="button" onClick={onRetry} className="text-accent px-1 text-xs font-bold">
          {ADMIN_COPY.retry}
        </button>
      ) : null}
      <button
        type="button"
        aria-label={ADMIN_COPY.delete}
        onClick={onRemove}
        className="text-danger px-1 text-xs font-bold"
      >
        ✕
      </button>
    </div>
  );
}
