// services/srs.ts

/**
 * Define a estrutura de um item que está pronto ou agendado para revisão.
 */
export type ReviewItem = {
  /** Identificador único do item. */
  id: string;
  /** Carimbo de data/hora (timestamp) quando o item deve ser revisado. */
  dueAt: number;
};

/**
 * Retorna a lista de itens que estão prontos para revisão pelo usuário.
 *
 * NOTA: Por enquanto, esta é apenas uma função stub que retorna uma lista vazia.
 * Será substituída pela lógica real do Sistema de Repetição Espaçada (SRS)
 * que usará o histórico de tentativas do usuário.
 */
export function getDueForReviewItems(): ReviewItem[] {
  return [];
}
