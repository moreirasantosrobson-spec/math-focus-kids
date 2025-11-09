// services/srs.ts
import type { Attempt } from '../types';

/**
 * Retorna itens “vencidos” para revisão com uma lógica simples:
 * considera devido 1h após a última tentativa do item.
 * Você pode melhorar os intervalos depois (SM-2, etc.).
 */
export type ReviewItem = { id: string; dueAt: number };

export function getDueForReviewItems(
  attempts: Attempt[],
  now: number = Date.now()
): ReviewItem[] {
  // Agrupa pela chave do item (ajuste se seu Attempt tiver outro identificador)
  const latestByKey = new Map<string, Attempt>();

  for (const a of attempts || []) {
    // tente usar um identificador estável; ajuste conforme seu modelo
    const key =
      (a as any).itemId ??
      (a as any).questionId ??
      (a as any).skill ??
      (a as any).id ??
      JSON.stringify(a);

    const prev = latestByKey.get(key);
    const createdAt = (a as any).createdAt ?? 0;
    const prevCreatedAt = (prev as any)?.createdAt ?? -1;

    if (!prev || createdAt > prevCreatedAt) {
      latestByKey.set(key, a);
    }
  }

  const result: ReviewItem[] = [];
  // regra simples: 1 hora após a última tentativa
  const ONE_HOUR = 60 * 60 * 1000;

  latestByKey.forEach((a, key) => {
    const last = (a as any).createdAt ?? 0;
    const dueAt = last + ONE_HOUR;
    if (dueAt <= now) {
      result.push({ id: String(key), dueAt });
    }
  });

  return result;
}
