"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

type RenderOnResumeProps = {
  active: boolean;
};

export function RenderOnResume({ active }: RenderOnResumeProps) {
  const invalidate = useThree((state) => state.invalidate);

  useEffect(() => {
    if (active) invalidate();
  }, [active, invalidate]);

  return null;
}
