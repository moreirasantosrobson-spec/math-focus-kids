// services/srs.ts

export type ReviewItem = {
  id: string;
  dueAt: number;
};

/**
 * Retorna uma lista vazia por enquanto (stub).
 * Depois implementaremos a lógica real de SRS usando os attempts do usuário.
 */
export function getDueForReviewItems(): ReviewItem[] {
  return [];
}
