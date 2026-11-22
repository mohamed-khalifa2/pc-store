import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "meshoptimizer/decoder";

import { HERO_MODEL_URLS } from "@/features/scroll-hero/config/model-parts";

export function useHeroModels(): GLTF[] {
  return useLoader(GLTFLoader, HERO_MODEL_URLS, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
}
