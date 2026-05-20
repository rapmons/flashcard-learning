import type { Flashcard, CardStatus, DeckStats } from '@types';
import {
  isCardDue,
  getTodayMidnight,
  getTomorrowMidnight,
  daysUntilReview,
} from '@utils/spacedRepetition';

/**
 * Service for managing flashcard operations
 */

/**
 * Get all cards due for today
 */
export function getCardsDueToday(cards: Flashcard[]): Flashcard[] {
  const today = getTodayMidnight();
  const tomorrow = getTomorrowMidnight();

  return cards.filter(card => {
    const nextReview = new Date(card.review.nextReview);
    return nextReview >= today && nextReview < tomorrow;
  });
}

/**
 * Get all new cards
 */
export function getNewCards(cards: Flashcard[]): Flashcard[] {
  return cards.filter(card => card.status === 'new');
}

/**
 * Get all cards that need learning
 */
export function getLearningCards(cards: Flashcard[]): Flashcard[] {
  return cards.filter(card => card.status === 'learning');
}

/**
 * Get all remembered cards
 */
export function getRememberedCards(cards: Flashcard[]): Flashcard[] {
  return cards.filter(card => card.status === 'remembered');
}

/**
 * Get cards due for review (overdue or due today)
 */
export function getCardsDueForReview(cards: Flashcard[]): Flashcard[] {
  return cards.filter(card => isCardDue(card.review));
}

/**
 * Get cards for Review page:
 * - Tất cả 'learning' cards (luôn cần ôn tập)
 * - 'remembered' cards đã đến hạn ôn (isCardDue)
 * Sắp xếp: quá hạn lâu nhất lên trước, sau đó theo easeFactor thấp
 */
export function getCardsForReview(cards: Flashcard[]): Flashcard[] {
  const now = new Date().getTime();
  return cards
    .filter(card => {
      if (card.status === 'new') return false;
      if (card.status === 'learning') return true;
      if (card.status === 'remembered') return isCardDue(card.review);
      return false;
    })
    .sort((a, b) => {
      const aNext = new Date(a.review.nextReview).getTime();
      const bNext = new Date(b.review.nextReview).getTime();
      // Quá hạn lâu nhất (nextReview nhỏ nhất) lên trước
      const aOverdue = now - aNext;
      const bOverdue = now - bNext;
      if (Math.abs(aOverdue - bOverdue) > 60000) return bOverdue - aOverdue;
      // Cùng mức quá hạn → từ khó hơn (easeFactor thấp) lên trước
      return a.review.easeFactor - b.review.easeFactor;
    });
}

/**
 * Get cards due in the next N days
 */
export function getCardsDueInDays(cards: Flashcard[], days: number): Flashcard[] {
  return cards.filter(card => {
    const daysUntil = daysUntilReview(card.review);
    return daysUntil >= 0 && daysUntil <= days;
  });
}

/**
 * Search cards by word or meaning
 */
export function searchCards(cards: Flashcard[], query: string): Flashcard[] {
  const lowerQuery = query.toLowerCase();
  return cards.filter(
    card =>
      card.word.toLowerCase().includes(lowerQuery) ||
      card.meaning.toLowerCase().includes(lowerQuery) ||
      card.example.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Filter cards by type and status
 */
export function filterCards(
  cards: Flashcard[],
  options: {
    type?: string;
    status?: CardStatus;
    tags?: string[];
  }
): Flashcard[] {
  return cards.filter(card => {
    if (options.type && card.type !== options.type) return false;
    if (options.status && card.status !== options.status) return false;
    if (options.tags && options.tags.length > 0) {
      if (!card.tags || !options.tags.some(tag => card.tags?.includes(tag))) {
        return false;
      }
    }
    return true;
  });
}

/**
 * Calculate deck statistics
 */
export function calculateDeckStats(cards: Flashcard[]): DeckStats {
  const dueToday = getCardsDueToday(cards).length;
  const newCards = getNewCards(cards).length;
  const learnedCards = getRememberedCards(cards).length;

  return {
    totalCards: cards.length,
    dueToday,
    newToday: newCards,
    learnedToday: learnedCards,
    accuracy: cards.length > 0 
      ? learnedCards / cards.length 
      : 0,
    currentStreak: 0, // Will be calculated from session stats
    longestStreak: 0, // Will be calculated from session stats
  };
}

/**
 * Get random cards from array
 */
export function getRandomCards(cards: Flashcard[], count: number): Flashcard[] {
  const shuffled = [...cards].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, cards.length));
}

/**
 * Sort cards by review status
 */
export function sortCardsByStatus(cards: Flashcard[]): Flashcard[] {
  return [...cards].sort((a, b) => {
    const statusOrder = { new: 0, learning: 1, remembered: 2 };
    return statusOrder[a.status] - statusOrder[b.status];
  });
}

/**
 * Update card status based on review count
 */
export function updateCardStatus(card: Flashcard): Flashcard {
  const { repetition } = card.review;

  let newStatus: CardStatus = 'new';
  if (repetition === 0) {
    newStatus = 'new';
  } else if (repetition < 3) {
    newStatus = 'learning';
  } else {
    newStatus = 'remembered';
  }

  return {
    ...card,
    status: newStatus,
  };
}

/**
 * Get upcoming review schedule
 */
export function getUpcomingSchedule(
  cards: Flashcard[],
  days: number = 7
): { date: string; count: number }[] {
  const schedule: Record<string, number> = {};

  cards.forEach(card => {
    const upcomingDays = daysUntilReview(card.review);
    if (upcomingDays >= 0 && upcomingDays <= days) {
      const reviewDate = new Date();
      reviewDate.setDate(reviewDate.getDate() + upcomingDays);
      reviewDate.setHours(0, 0, 0, 0);
      const dateStr = reviewDate.toISOString().split('T')[0];

      schedule[dateStr] = (schedule[dateStr] || 0) + 1;
    }
  });

  return Object.entries(schedule)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
