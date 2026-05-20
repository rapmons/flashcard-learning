export type CardStatus = 'new' | 'learning' | 'remembered';
export type WordType = 'noun' | 'verb' | 'adjective' | 'adverb' | 'preposition' | 'pronoun' | 'conjunction' | 'interjection';
export type ReviewMode = 'learn' | 'review' | 'quiz';

export interface ReviewData {
  lastReviewed?: string; // ISO 8601 datetime
  nextReview: string; // ISO 8601 datetime
  interval: number; // days
  easeFactor: number; // 1.3 - 2.5+
  repetition: number; // consecutive correct answers
}

export interface Flashcard {
  id: number;
  word: string;
  meaning: string;
  example: string;
  phonetic: string;
  type: WordType;
  status: CardStatus;
  review: ReviewData;
  createdAt: string;
  tags?: string[];
  notes?: string;
}

export interface DeckStats {
  totalCards: number;
  dueToday: number;
  newToday: number;
  learnedToday: number;
  accuracy: number;
  currentStreak: number;
  longestStreak: number;
}

export interface SessionStats {
  date: string;
  correct: number;
  incorrect: number;
  cardsReviewed: number;
  accuracy: number;
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export interface ImportExportData {
  version: string;
  exportDate: string;
  cards: Flashcard[];
  stats?: {
    totalLearned: number;
    totalSessions: number;
  };
}
