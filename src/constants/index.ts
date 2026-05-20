export * from './mockData';

export const APP_TITLE = 'Flashcard Learning';
export const APP_VERSION = '1.0.0';

export const QUALITY_RATINGS = {
  BLACKOUT: 0, // Complete blackout
  INCORRECT: 1, // Incorrect, serious difficulty
  INCORRECT_EASY: 2, // Incorrect, easy
  CORRECT_DIFFICULT: 3, // Correct, difficult
  CORRECT: 4, // Correct
  CORRECT_EASY: 5, // Correct, easy
};

export const QUALITY_LABELS: Record<number, string> = {
  0: 'Blackout',
  1: 'Incorrect',
  2: 'Incorrect (Easy)',
  3: 'Correct (Difficult)',
  4: 'Correct',
  5: 'Correct (Easy)',
};

export const KEYBOARD_SHORTCUTS = {
  FLIP_CARD: 'Space',
  CORRECT: 'C',
  INCORRECT: 'I',
  NEXT_CARD: 'N',
  PREVIOUS_CARD: 'P',
  TOGGLE_DARK_MODE: 'D',
};
