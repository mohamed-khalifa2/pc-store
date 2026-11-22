type HeroTransform = {
  x: number;
  y: number;
  z: number;
  rotation: number;
  scale: number;
  opacity: number;
};

export type HeroPartConfig = {
  id: string;
  label: string;
  image: string;
  zIndex: number;
  mobile: boolean;
  range: readonly [number, number];
  start: HeroTransform;
  end: HeroTransform;
};

export const HERO_PART_SIZE = 900;

const ASSEMBLED: HeroTransform = { x: 0, y: 0, z: 0, rotation: 0, scale: 1, opacity: 1 };

export const HERO_PARTS: readonly HeroPartConfig[] = [
  {
    id: "frame",
    label: "Case frame",
    image: "/images/hero/parts/frame.svg",
    zIndex: 10,
    mobile: true,
    range: [0, 0.08],
    start: { ...ASSEMBLED },
    end: { ...ASSEMBLED },
  },
  {
    id: "motherboard",
    label: "Motherboard",
    image: "/images/hero/parts/motherboard.svg",
    zIndex: 20,
    mobile: true,
    range: [0.04, 0.46],
    start: { x: -80, y: 70, z: 120, rotation: -8, scale: 0.96, opacity: 0.9 },
    end: { ...ASSEMBLED },
  },
  {
    id: "gpu",
    label: "Graphics card",
    image: "/images/hero/parts/gpu.svg",
    zIndex: 30,
    mobile: true,
    range: [0.12, 0.56],
    start: { x: 240, y: 30, z: 260, rotation: 6, scale: 1.02, opacity: 0.92 },
    end: { ...ASSEMBLED },
  },
  {
    id: "psu",
    label: "Power supply",
    image: "/images/hero/parts/psu.svg",
    zIndex: 25,
    mobile: true,
    range: [0.18, 0.6],
    start: { x: -180, y: 180, z: 180, rotation: -6, scale: 0.92, opacity: 0.88 },
    end: { ...ASSEMBLED },
  },
  {
    id: "fans",
    label: "Case fans",
    image: "/images/hero/parts/fans.svg",
    zIndex: 35,
    mobile: true,
    range: [0.1, 0.5],
    start: { x: 0, y: -200, z: 220, rotation: 10, scale: 0.94, opacity: 0.9 },
    end: { ...ASSEMBLED },
  },
  {
    id: "ram",
    label: "Memory",
    image: "/images/hero/parts/ram.svg",
    zIndex: 40,
    mobile: true,
    range: [0.2, 0.58],
    start: { x: 140, y: -140, z: 160, rotation: -12, scale: 0.95, opacity: 0.9 },
    end: { ...ASSEMBLED },
  },
  {
    id: "front-panel",
    label: "Front panel",
    image: "/images/hero/parts/front-panel.svg",
    zIndex: 60,
    mobile: false,
    range: [0.05, 0.5],
    start: { x: 300, y: 0, z: 320, rotation: 14, scale: 1, opacity: 0.9 },
    end: { ...ASSEMBLED },
  },
  {
    id: "side-panel",
    label: "Side panel",
    image: "/images/hero/parts/side-panel.svg",
    zIndex: 70,
    mobile: false,
    range: [0, 0.48],
    start: { x: -320, y: -40, z: 360, rotation: -14, scale: 1.02, opacity: 0.8 },
    end: { ...ASSEMBLED },
  },
] as const;
