import type { SessionStats } from '@types';
import { formatDate } from '@utils/formatters';

/**
 * Service for managing statistics and session data
 */

/**
 * Create a new session entry for today
 */
export function createSessionEntry(
  correct: number,
  incorrect: number,
  synonymCorrect: number = 0,
  synonymIncorrect: number = 0
): SessionStats {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const cardsReviewed = correct + incorrect;
  const accuracy = cardsReviewed > 0 ? correct / cardsReviewed : 0;

  return {
    date: today.toISOString(),
    correct,
    incorrect,
    cardsReviewed,
    accuracy,
    synonymCorrect,
    synonymIncorrect,
  };
}

/**
 * Get or create today's session
 */
export function getTodaySession(stats: SessionStats[]): SessionStats | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();

  return (
    stats.find(s => {
      const sDate = new Date(s.date);
      sDate.setHours(0, 0, 0, 0);
      return sDate.toISOString() === todayStr;
    }) || null
  );
}

/**
 * Update today's session stats
 */
export function updateTodaySession(
  stats: SessionStats[],
  correct: number,
  incorrect: number,
  synonymCorrect: number = 0,
  synonymIncorrect: number = 0
): SessionStats[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayStr = today.toISOString();

  const existingIndex = stats.findIndex(s => {
    const sDate = new Date(s.date);
    sDate.setHours(0, 0, 0, 0);
    return sDate.toISOString() === todayStr;
  });

  if (existingIndex >= 0) {
    const existing = stats[existingIndex];
    const newCorrect = existing.correct + correct;
    const newIncorrect = existing.incorrect + incorrect;
    const newSynonymCorrect = (existing.synonymCorrect || 0) + synonymCorrect;
    const newSynonymIncorrect = (existing.synonymIncorrect || 0) + synonymIncorrect;
    
    const updated = [...stats];
    updated[existingIndex] = createSessionEntry(newCorrect, newIncorrect, newSynonymCorrect, newSynonymIncorrect);
    return updated;
  }

  const newSession = createSessionEntry(correct, incorrect, synonymCorrect, synonymIncorrect);

  return [...stats, newSession];
}

/**
 * Calculate cumulative statistics
 */
export function calculateCumulativeStats(stats: SessionStats[]) {
  if (stats.length === 0) {
    return {
      totalCards: 0,
      totalCorrect: 0,
      totalIncorrect: 0,
      overallAccuracy: 0,
      currentStreak: 0,
      longestStreak: 0,
      totalSessions: 0,
      synonymTotalCards: 0,
      synonymTotalCorrect: 0,
      synonymTotalIncorrect: 0,
      synonymOverallAccuracy: 0,
    };
  }

  const totalCards = stats.reduce((sum, s) => sum + s.cardsReviewed, 0);
  const totalCorrect = stats.reduce((sum, s) => sum + s.correct, 0);
  const totalIncorrect = stats.reduce((sum, s) => sum + s.incorrect, 0);
  const overallAccuracy = totalCards > 0 ? totalCorrect / totalCards : 0;

  const synonymTotalCorrect = stats.reduce((sum, s) => sum + (s.synonymCorrect || 0), 0);
  const synonymTotalIncorrect = stats.reduce((sum, s) => sum + (s.synonymIncorrect || 0), 0);
  const synonymTotalCards = synonymTotalCorrect + synonymTotalIncorrect;
  const synonymOverallAccuracy = synonymTotalCards > 0 ? synonymTotalCorrect / synonymTotalCards : 0;

  // Calculate streaks
  const sortedStats = [...stats].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  for (const session of sortedStats) {
    if (session.cardsReviewed > 0) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
  }

  // Current streak is from most recent sessions
  currentStreak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const session = stats.find(s => {
      const sDate = new Date(s.date);
      sDate.setHours(0, 0, 0, 0);
      return sDate.toISOString() === checkDate.toISOString();
    });

    if (session && session.cardsReviewed > 0) {
      currentStreak++;
    } else if (i > 0) {
      break;
    }
  }

  return {
    totalCards,
    totalCorrect,
    totalIncorrect,
    overallAccuracy,
    currentStreak,
    longestStreak,
    totalSessions: stats.length,
    synonymTotalCards,
    synonymTotalCorrect,
    synonymTotalIncorrect,
    synonymOverallAccuracy,
  };
}

/**
 * Get stats for a date range
 */
export function getStatsInRange(
  stats: SessionStats[],
  startDate: Date,
  endDate: Date
): SessionStats[] {
  return stats.filter(s => {
    const date = new Date(s.date);
    return date >= startDate && date <= endDate;
  });
}

/**
 * Get weekly statistics
 */
export function getWeeklyStats(stats: SessionStats[]): Record<string, number> {
  const weekly: Record<string, number> = {};

  stats.forEach(s => {
    const date = new Date(s.date);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const weekKey = formatDate(weekStart);

    weekly[weekKey] = (weekly[weekKey] || 0) + s.cardsReviewed;
  });

  return weekly;
}

/**
 * Get monthly statistics
 */
export function getMonthlyStats(stats: SessionStats[]): Record<string, number> {
  const monthly: Record<string, number> = {};

  stats.forEach(s => {
    const date = new Date(s.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

    monthly[monthKey] = (monthly[monthKey] || 0) + s.cardsReviewed;
  });

  return monthly;
}
