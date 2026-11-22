export type HeroModelPartConfig = {
  id: string;
  label: string;
  url: string;
  fit: readonly [number, number, number];
  rotation: readonly [number, number, number];
  position: readonly [number, number, number];
  explode: readonly [number, number, number];
  opacity?: number;
};

const VERTICAL = Math.PI / 2;
const FLAT = -Math.PI / 2;

export const HERO_MODEL_PARTS: readonly HeroModelPartConfig[] = [
  {
    id: "case",
    label: "Case",
    url: "/models/case.glb",
    fit: [3.7, 4.2, 1.9],
    rotation: [0, 0, 0],
    position: [0, 0, 0],
    explode: [0, 0.2, -1.3],
    opacity: 0.32,
  },
  {
    id: "motherboard",
    label: "Motherboard",
    url: "/models/motherboard.glb",
    fit: [3.2, 0.16, 3.9],
    rotation: [VERTICAL, 0, 0],
    position: [-0.05, 0.1, -0.72],
    explode: [-1.5, 0.3, -1.1],
  },
  {
    id: "cpu",
    label: "Processor",
    url: "/models/cpu.glb",
    fit: [0.82, 0.12, 0.82],
    rotation: [VERTICAL, 0, 0],
    position: [-0.5, 0.7, -0.48],
    explode: [0.8, 1.25, 0.8],
  },
  {
    id: "gpu",
    label: "Graphics card",
    url: "/models/gpu.glb",
    fit: [3, 1.25, 0.3],
    rotation: [FLAT, 0, 0],
    position: [0.1, -0.75, 0.1],
    explode: [1.7, -0.75, 1.3],
  },
  {
    id: "ram",
    label: "Memory",
    url: "/models/ram.glb",
    fit: [1.25, 0.08, 0.26],
    rotation: [VERTICAL, 0, 0],
    position: [0.6, 0.75, -0.48],
    explode: [-0.8, 1.45, 0.9],
  },
  {
    id: "ssd",
    label: "Storage",
    url: "/models/ssd.glb",
    fit: [0.55, 0.08, 1.25],
    rotation: [0, 0, 0],
    position: [1.05, -1.55, 0.25],
    explode: [-1.4, -1.2, 1.1],
  },
] as const;

export const HERO_MODEL_URLS: string[] = HERO_MODEL_PARTS.map((part) => part.url);
