"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

import type { HeroModelPartConfig } from "@/features/scroll-hero/config/model-parts";
import type { HeroRuntime } from "@/features/scroll-hero/lib/hero-runtime";
import { createNormalizedPart } from "@/features/scroll-hero/lib/normalize-model";

type HeroModelPartProps = {
  part: HeroModelPartConfig;
  gltf: GLTF;
  runtime: HeroRuntime;
};

export function HeroModelPart({ part, gltf, runtime }: HeroModelPartProps) {
  const groupRef = useRef<Group>(null);
  const normalized = useMemo(() => createNormalizedPart(part, gltf), [gltf, part]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    const progress = runtime.progress;
    group.position.set(
      part.position[0] + part.explode[0] * progress,
      part.position[1] + part.explode[1] * progress,
      part.position[2] + part.explode[2] * progress,
    );
  });

  return (
    <group ref={groupRef} rotation={part.rotation}>
      <primitive object={normalized} />
    </group>
  );
}
