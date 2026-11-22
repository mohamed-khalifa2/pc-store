type HeroRuntimeListener = () => void;

export type HeroRuntime = {
  progress: number;
  rotation: { x: number; y: number };
  subscribe: (listener: HeroRuntimeListener) => () => void;
  setProgress: (progress: number) => void;
  setRotation: (x: number, y: number) => void;
};

export function createHeroRuntime(): HeroRuntime {
  const listeners = new Set<HeroRuntimeListener>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const runtime: HeroRuntime = {
    progress: 0,
    rotation: { x: 0, y: 0 },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    setProgress(progress) {
      if (runtime.progress === progress) return;
      runtime.progress = progress;
      notify();
    },
    setRotation(x, y) {
      if (runtime.rotation.x === x && runtime.rotation.y === y) return;
      runtime.rotation.x = x;
      runtime.rotation.y = y;
      notify();
    },
  };

  return runtime;
}
