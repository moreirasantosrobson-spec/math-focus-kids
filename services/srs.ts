
import { Attempt } from '../types';
import { SRS_INTERVALS } from '../constants';

export const getDueForReviewItems = (attempts: Attempt[]): Attempt[] => {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;

  const incorrectAttempts = attempts.filter(a => !a.isCorrect);
  const dueItems: Attempt[] = [];
  const reviewedIds = new Set<string>();

  // Sort by most recent first to prioritize latest attempts on a given exercise
  incorrectAttempts.sort((a, b) => b.timestamp - a.timestamp);

  for (const attempt of incorrectAttempts) {
    if (reviewedIds.has(attempt.exerciseId)) {
      continue;
    }

    const daysSince = (now - attempt.timestamp) / oneDay;

    for (const interval of SRS_INTERVALS) {
      if (daysSince >= interval) {
        dueItems.push(attempt);
        reviewedIds.add(attempt.exerciseId);
        break; // Move to the next unique exercise
      }
    }
  }

  // A real SRS would be more complex, tracking review stages.
  // This is a simplified version: review anything wrong after 1, 3, or 7 days.
  // We'll return just the original attempt info to regenerate a similar problem.
  return dueItems;
};
