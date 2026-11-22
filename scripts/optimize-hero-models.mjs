import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SOURCE_DIR = path.join(ROOT, "public", "images", "hero", "parts");
const OUTPUT_DIR = path.join(ROOT, "public", "models");
const CLI = path.join(ROOT, "node_modules", "@gltf-transform", "cli", "bin", "cli.js");

const MODELS = [
  { name: "case", simplifyRatio: 0.2, textureSize: 1024 },
  { name: "cpu", simplifyRatio: 0.08, textureSize: 1024 },
  { name: "gpu", simplifyRatio: 0.2, textureSize: 1024 },
  { name: "motherboard", simplifyRatio: 0.1, textureSize: 1024 },
  { name: "ram", simplifyRatio: 0.5, textureSize: 1024 },
  { name: "ssd", simplifyRatio: 1, textureSize: 512 },
];

mkdirSync(OUTPUT_DIR, { recursive: true });

for (const model of MODELS) {
  const input = path.join(SOURCE_DIR, `${model.name}.glb`);
  const output = path.join(OUTPUT_DIR, `${model.name}.glb`);

  execFileSync(
    process.execPath,
    [
      CLI,
      "optimize",
      input,
      output,
      "--compress",
      "meshopt",
      "--texture-compress",
      "webp",
      "--texture-size",
      String(model.textureSize),
      "--simplify-ratio",
      String(model.simplifyRatio),
      "--simplify-error",
      "0.01",
    ],
    { stdio: "inherit" },
  );
}
