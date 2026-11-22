let cached: boolean | undefined;

export function supportsWebGL(): boolean {
  if (cached !== undefined) return cached;

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
  cached = context !== null;

  if (context) {
    context.getExtension("WEBGL_lose_context")?.loseContext();
  }

  return cached;
}
