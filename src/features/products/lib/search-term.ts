const LIKE_WILDCARDS = /[%(),\\_]/g;

export function escapeLikeTerm(value: string): string {
  return value.replace(LIKE_WILDCARDS, " ").trim();
}
