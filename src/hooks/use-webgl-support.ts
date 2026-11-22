import { useSyncExternalStore } from "react";

import { supportsWebGL } from "@/features/scroll-hero/lib/supports-webgl";

function subscribe(): () => void {
  return () => {};
}

function getSnapshot(): boolean {
  return supportsWebGL();
}

function getServerSnapshot(): boolean {
  return false;
}

export function useWebGLSupport(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
