// services/srs.ts

export type ReviewItem = { id: string; dueAt: number };

/**
 * Safe stub for the build. Returns an empty list for now.
 * We'll replace this with real SRS logic using the user's attempts.
 */
export function getDueForReviewItems(): ReviewItem[] {
  return [];
}
