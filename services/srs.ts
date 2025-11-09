// services/srs.ts
export type ReviewItem = { id: string; dueAt: number };

/**
 * Stub seguro para o build. Retorna lista vazia.
 * Depois trocamos pela lógica real.
 */
export function getDueForReviewItems(): ReviewItem[] {
  return [];
}
