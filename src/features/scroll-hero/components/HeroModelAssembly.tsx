"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import type { Group } from "three";

import {
  BASE_ASSEMBLY_ROTATION,
  DESKTOP_ASSEMBLY_SCALE,
  MOBILE_ASSEMBLY_SCALE,
  MOBILE_BREAKPOINT,
} from "@/features/scroll-hero/config/model-runtime";
import { HERO_MODEL_PARTS } from "@/features/scroll-hero/config/model-parts";
import { useHeroModels } from "@/features/scroll-hero/hooks/use-hero-models";
import type { HeroRuntime } from "@/features/scroll-hero/lib/hero-runtime";
import { HeroModelPart } from "@/features/scroll-hero/components/HeroModelPart";

type HeroModelAssemblyProps = {
  runtime: HeroRuntime;
};

export function HeroModelAssembly({ runtime }: HeroModelAssemblyProps) {
  const models = useHeroModels();
  const groupRef = useRef<Group>(null);
  const invalidate = useThree((state) => state.invalidate);
  const width = useThree((state) => state.size.width);

  useEffect(() => runtime.subscribe(invalidate), [invalidate, runtime]);

  useEffect(() => {
    invalidate();
  }, [invalidate]);

  useEffect(() => {
    groupRef.current?.scale.setScalar(
      width < MOBILE_BREAKPOINT ? MOBILE_ASSEMBLY_SCALE : DESKTOP_ASSEMBLY_SCALE,
    );
    invalidate();
  }, [invalidate, width]);

  useFrame(() => {
    const group = groupRef.current;
    if (!group) return;

    group.rotation.set(
      BASE_ASSEMBLY_ROTATION[0] + runtime.rotation.x,
      BASE_ASSEMBLY_ROTATION[1] + runtime.rotation.y,
      BASE_ASSEMBLY_ROTATION[2],
    );
  });

  return (
    <group ref={groupRef}>
      {HERO_MODEL_PARTS.map((part, index) => {
        const gltf = models[index];
        return gltf ? (
          <HeroModelPart key={part.id} part={part} gltf={gltf} runtime={runtime} />
        ) : null;
      })}
    </group>
  );
}
