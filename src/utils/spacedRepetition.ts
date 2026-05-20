import type { ReviewData } from '@types';

/**
 * SM-2 Algorithm Implementation for Spaced Repetition
 * Used by popular tools like Anki
 */

const INITIAL_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const INITIAL_INTERVAL = 1;

export interface ReviewResult {
  quality: 0 | 1 | 2 | 3 | 4 | 5; // 0-5 rating, 3+ is correct
}

/**
 * Calculate the next review date based on SM-2 algorithm
 * @param currentReview - Current review data
 * @param quality - Quality of response (0-5, where 3+ is correct)
 * @returns Updated review data
 */
export function calculateNextReview(
  currentReview: ReviewData,
  quality: number
): ReviewData {
  const isCorrect = quality >= 3;
  const now = new Date();
  
  let newInterval: number;
  let newRepetition: number;
  let newEaseFactor: number;

  if (isCorrect) {
    // Correct answer - increase interval
    newRepetition = (currentReview.repetition || 0) + 1;
    
    if (newRepetition === 1) {
      newInterval = 1;
    } else if (newRepetition === 2) {
      newInterval = 3;
    } else {
      newInterval = Math.round(currentReview.interval * currentReview.easeFactor);
    }
    
    // Increase ease factor slightly
    newEaseFactor = Math.max(
      MIN_EASE_FACTOR,
      currentReview.easeFactor + 0.1 * (quality - 3)
    );
  } else {
    // Incorrect answer - reset repetition and reduce interval
    newRepetition = 0;
    newInterval = 1;
    
    // Decrease ease factor
    newEaseFactor = Math.max(
      MIN_EASE_FACTOR,
      currentReview.easeFactor + 0.1 * (quality - 5)
    );
  }

  const nextReviewDate = new Date(now);
  nextReviewDate.setDate(nextReviewDate.getDate() + newInterval);

  return {
    lastReviewed: now.toISOString(),
    nextReview: nextReviewDate.toISOString(),
    interval: newInterval,
    easeFactor: Number(newEaseFactor.toFixed(2)),
    repetition: newRepetition,
  };
}

/**
 * Check if a card is due for review
 */
export function isCardDue(review: ReviewData): boolean {
  const nextReview = new Date(review.nextReview);
  const now = new Date();
  return now >= nextReview;
}

/**
 * Get cards due for review in a date range
 */
export function getCardsDueInRange(
  cards: ReviewData[],
  startDate: Date,
  endDate: Date
): ReviewData[] {
  return cards.filter(card => {
    const nextReview = new Date(card.nextReview);
    return nextReview >= startDate && nextReview < endDate;
  });
}

/**
 * Calculate days until review
 */
export function daysUntilReview(review: ReviewData): number {
  const nextReview = new Date(review.nextReview);
  const now = new Date();
  const diffTime = nextReview.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

/**
 * Get today's date at midnight
 */
export function getTodayMidnight(): Date {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

/**
 * Get tomorrow's date at midnight
 */
export function getTomorrowMidnight(): Date {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);
  return tomorrow;
}

/**
 * Create initial review data for a new card
 */
export function createInitialReview(): ReviewData {
  const now = new Date();
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + 1);

  return {
    lastReviewed: now.toISOString(),
    nextReview: nextReview.toISOString(),
    interval: INITIAL_INTERVAL,
    easeFactor: INITIAL_EASE_FACTOR,
    repetition: 0,
  };
}
