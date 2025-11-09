// services/srs.ts

// Representa um item que precisa ser revisado (SRS - Spaced Repetition System)
export type ReviewItem = {
  id: string;
  dueAt: number;
};

/**
 * Retorna uma lista vazia por enquanto (stub).
 * Depois implementaremos a lógica real de SRS, conectando com os attempts do usuário.
 */
export function getDueForReviewItems(): ReviewItem[] {
  return [];
}
