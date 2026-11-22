import { Box3, Group, Mesh, Vector3 } from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";

import type { HeroModelPartConfig } from "@/features/scroll-hero/config/model-parts";

export function createNormalizedPart(part: HeroModelPartConfig, gltf: GLTF): Group {
  const wrapper = new Group();
  wrapper.add(gltf.scene);

  const bounds = new Box3().setFromObject(wrapper);
  const size = bounds.getSize(new Vector3());
  const center = bounds.getCenter(new Vector3());
  const scale = new Vector3(part.fit[0] / size.x, part.fit[1] / size.y, part.fit[2] / size.z);

  wrapper.scale.copy(scale);
  wrapper.position.set(-center.x * scale.x, -center.y * scale.y, -center.z * scale.z);

  if (part.opacity !== undefined) {
    wrapper.traverse((object) => {
      if (!(object instanceof Mesh)) return;
      const materials = Array.isArray(object.material) ? object.material : [object.material];
      materials.forEach((material) => {
        material.transparent = true;
        material.opacity = part.opacity ?? 1;
        material.depthWrite = false;
      });
    });
  }

  return wrapper;
}
