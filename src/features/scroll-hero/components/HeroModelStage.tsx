"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";

import {
  DESKTOP_CAMERA_DISTANCE,
  DRAG_LIMITS,
  DRAG_SENSITIVITY,
  KEYBOARD_ROTATION_STEP,
} from "@/features/scroll-hero/config/model-runtime";
import type { HeroRuntime } from "@/features/scroll-hero/lib/hero-runtime";
import { clamp } from "@/features/scroll-hero/lib/clamp";
import { HeroCameraRig } from "@/features/scroll-hero/components/HeroCameraRig";
import { HeroModelAssembly } from "@/features/scroll-hero/components/HeroModelAssembly";
import { HeroStage } from "@/features/scroll-hero/components/HeroStage";
import { RenderOnResume } from "@/features/scroll-hero/components/RenderOnResume";

type DragOrigin = {
  pointerId: number;
  x: number;
  y: number;
  rotationX: number;
  rotationY: number;
};

const KEY_DIRECTIONS: Record<string, readonly [number, number]> = {
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
  ArrowUp: [-1, 0],
};

type HeroModelStageProps = {
  runtime: HeroRuntime;
};

export function HeroModelStage({ runtime }: HeroModelStageProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragOrigin | null>(null);
  const [active, setActive] = useState(true);

  useEffect(() => {
    let visible = true;
    const update = () => setActive(visible && document.visibilityState === "visible");
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry?.isIntersecting ?? false;
        update();
      },
      { threshold: 0.01 },
    );

    if (rootRef.current) observer.observe(rootRef.current);
    document.addEventListener("visibilitychange", update);
    update();

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", update);
    };
  }, []);

  const handlePointerDown = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      dragRef.current = {
        pointerId: event.pointerId,
        x: event.clientX,
        y: event.clientY,
        rotationX: runtime.rotation.x,
        rotationY: runtime.rotation.y,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    },
    [runtime],
  );

  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      const origin = dragRef.current;
      if (!origin || origin.pointerId !== event.pointerId) return;

      const width = event.currentTarget.clientWidth;
      const height = event.currentTarget.clientHeight;
      const deltaX = (event.clientX - origin.x) / width;
      const deltaY = (event.clientY - origin.y) / height;

      runtime.setRotation(
        clamp(origin.rotationX + deltaY * DRAG_SENSITIVITY, -DRAG_LIMITS.x, DRAG_LIMITS.x),
        clamp(origin.rotationY + deltaX * DRAG_SENSITIVITY, -DRAG_LIMITS.y, DRAG_LIMITS.y),
      );
    },
    [runtime],
  );

  const handlePointerEnd = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      const direction = KEY_DIRECTIONS[event.key];
      if (!direction) return;

      event.preventDefault();
      runtime.setRotation(
        clamp(
          runtime.rotation.x + direction[0] * KEYBOARD_ROTATION_STEP,
          -DRAG_LIMITS.x,
          DRAG_LIMITS.x,
        ),
        clamp(
          runtime.rotation.y + direction[1] * KEYBOARD_ROTATION_STEP,
          -DRAG_LIMITS.y,
          DRAG_LIMITS.y,
        ),
      );
    },
    [runtime],
  );

  return (
    <div
      ref={rootRef}
      role="group"
      tabIndex={0}
      aria-label="Interactive 3D PC build. Drag or use arrow keys to rotate the assembly."
      className="absolute inset-0 touch-pan-y outline-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onKeyDown={handleKeyDown}
    >
      <p className="sr-only">Drag or use arrow keys to rotate the PC build within a small range.</p>
      <Suspense
        fallback={
          <div className="absolute inset-0" aria-hidden="true">
            <HeroStage />
          </div>
        }
      >
        <Canvas
          frameloop={active ? "demand" : "never"}
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, DESKTOP_CAMERA_DISTANCE], fov: 35, near: 0.1, far: 50 }}
          gl={{ alpha: true, antialias: false, powerPreference: "high-performance" }}
        >
          <RenderOnResume active={active} />
          <HeroCameraRig />
          <ambientLight intensity={1.1} />
          <directionalLight position={[4, 6, 8]} intensity={2.4} />
          <pointLight position={[-5, -2, 4]} intensity={8} />
          <HeroModelAssembly runtime={runtime} />
        </Canvas>
      </Suspense>
    </div>
  );
}
