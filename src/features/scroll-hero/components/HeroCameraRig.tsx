"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import { PerspectiveCamera } from "three";

import {
  DESKTOP_CAMERA_DISTANCE,
  MOBILE_BREAKPOINT,
  MOBILE_CAMERA_DISTANCE,
} from "@/features/scroll-hero/config/model-runtime";

export function HeroCameraRig() {
  const camera = useThree((state) => state.camera);
  const width = useThree((state) => state.size.width);
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (!(camera instanceof PerspectiveCamera)) return;

    camera.position.set(
      0,
      0,
      width < MOBILE_BREAKPOINT ? MOBILE_CAMERA_DISTANCE : DESKTOP_CAMERA_DISTANCE,
    );
    camera.updateProjectionMatrix();
    invalidate();
  }, [camera, invalidate, width]);

  return null;
}
