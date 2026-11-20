export function safeHref(value: string | null | undefined, fallback: string): string {
  if (!value) return fallback;
  if (value.startsWith("/") && !value.startsWith("//") && !value.includes("\\")) return value;

  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") return url.toString();
  } catch {
    return fallback;
  }

  return fallback;
}
