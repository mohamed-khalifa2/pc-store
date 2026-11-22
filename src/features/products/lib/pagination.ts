const VISIBLE_PAGES = 5;

export function buildPageNumbers(current: number, pageCount: number): number[] {
  const half = Math.floor(VISIBLE_PAGES / 2);
  let start = Math.max(1, current - half);
  const end = Math.min(pageCount, start + VISIBLE_PAGES - 1);
  start = Math.max(1, end - VISIBLE_PAGES + 1);

  return Array.from({ length: end - start + 1 }, (_, index) => start + index);
}
