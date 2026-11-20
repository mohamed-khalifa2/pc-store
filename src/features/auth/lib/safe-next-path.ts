export function safeNextPath(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  if (!value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return null;
  }

  if (/[\u0000-\u001f\u007f]/.test(value)) {
    return null;
  }

  return value;
}
