const MISSING_RELATION_CODES = new Set(["PGRST205", "42P01"]);

type QueryError = {
  code?: string | null;
};

export function isMissingRelationError(error: QueryError | null | undefined): boolean {
  if (!error) return false;
  return MISSING_RELATION_CODES.has(error.code ?? "");
}
