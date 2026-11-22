export function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function formBoolean(formData: FormData, key: string): boolean {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

export function formNumber(formData: FormData, key: string): number | null {
  const value = formString(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function formFiles(formData: FormData, key: string): File[] {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

export function formIndexedStrings(formData: FormData, prefix: string): string[] {
  const values: string[] = [];
  for (let index = 0; index < 100; index += 1) {
    const value = formString(formData, `${prefix}${index}`);
    if (!value) continue;
    values.push(value);
  }
  return values;
}
