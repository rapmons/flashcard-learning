import type { Flashcard, SessionStats, ImportExportData } from '@types';

const CARDS_KEY = 'flashcard_cards';
const STATS_KEY = 'flashcard_stats';
const THEME_KEY = 'flashcard_theme';

/**
 * Load all flashcards from localStorage
 */
export function loadCards(): Flashcard[] {
  try {
    const data = localStorage.getItem(CARDS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading cards:', error);
    return [];
  }
}

/**
 * Save all flashcards to localStorage
 */
export function saveCards(cards: Flashcard[]): void {
  try {
    localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
  } catch (error) {
    console.error('Error saving cards:', error);
  }
}

/**
 * Load session statistics from localStorage
 */
export function loadStats(): SessionStats[] {
  try {
    const data = localStorage.getItem(STATS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading stats:', error);
    return [];
  }
}

/**
 * Save session statistics to localStorage
 */
export function saveStats(stats: SessionStats[]): void {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error('Error saving stats:', error);
  }
}

/**
 * Load theme preference from localStorage
 */
export function loadTheme(): 'light' | 'dark' | 'auto' {
  try {
    const data = localStorage.getItem(THEME_KEY);
    return (data as 'light' | 'dark' | 'auto') || 'auto';
  } catch (error) {
    console.error('Error loading theme:', error);
    return 'auto';
  }
}

/**
 * Save theme preference to localStorage
 */
export function saveTheme(theme: 'light' | 'dark' | 'auto'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error('Error saving theme:', error);
  }
}

/**
 * Export cards as JSON file
 */
export function exportCardsToJSON(cards: Flashcard[]): string {
  const data: ImportExportData = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    cards,
    stats: {
      totalLearned: cards.filter(c => c.status === 'remembered').length,
      totalSessions: 0,
    },
  };
  return JSON.stringify(data, null, 2);
}

/**
 * Import cards from JSON file
 */
export function importCardsFromJSON(jsonString: string): Flashcard[] {
  try {
    const data: ImportExportData = JSON.parse(jsonString);
    
    if (!Array.isArray(data.cards)) {
      throw new Error('Invalid data format: cards must be an array');
    }

    return data.cards.map(card => ({
      ...card,
      review: {
        ...card.review,
        lastReviewed: card.review.lastReviewed || new Date().toISOString(),
        nextReview: card.review.nextReview || new Date().toISOString(),
      },
    }));
  } catch (error) {
    throw new Error(`Failed to import cards: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Clear all data from localStorage
 */
export function clearAllData(): void {
  try {
    localStorage.removeItem(CARDS_KEY);
    localStorage.removeItem(STATS_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}
