export function formString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value : "";
}
