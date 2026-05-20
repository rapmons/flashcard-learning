import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { Flashcard, SessionStats, Toast } from '@types';
import { loadCards, saveCards, loadStats, saveStats } from '@utils/localStorage';
import { calculateNextReview } from '@utils/spacedRepetition';
import { updateCardStatus } from '@services/cardService';
import { updateTodaySession, getTodaySession } from '@services/statsService';

interface FlashcardContextType {
  cards: Flashcard[];
  stats: SessionStats[];
  toasts: Toast[];
  isDarkMode: boolean;
  isLoading: boolean;

  // Card actions
  addCard: (card: Flashcard) => void;
  updateCard: (card: Flashcard) => void;
  deleteCard: (id: number) => void;
  importCards: (cards: Flashcard[]) => void;   // replace all
  mergeCards: (cards: Flashcard[]) => void;    // merge, giữ progress cũ
  resetAllCards: () => void;

  // Review actions
  reviewCard: (cardId: number, quality: number) => void;

  // Toast actions
  showToast: (message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  removeToast: (id: string) => void;

  // Stats actions
  recordReview: (isCorrect: boolean) => void;

  // Theme actions
  toggleDarkMode: () => void;
}

const FlashcardContext = createContext<FlashcardContextType | undefined>(undefined);

interface State {
  cards: Flashcard[];
  stats: SessionStats[];
  toasts: Toast[];
  isDarkMode: boolean;
  isLoading: boolean;
}

type Action =
  | { type: 'SET_CARDS'; payload: Flashcard[] }
  | { type: 'ADD_CARD'; payload: Flashcard }
  | { type: 'UPDATE_CARD'; payload: Flashcard }
  | { type: 'DELETE_CARD'; payload: number }
  | { type: 'MERGE_CARDS'; payload: Flashcard[] }
  | { type: 'REVIEW_CARD'; payload: { cardId: number; quality: number } }
  | { type: 'SET_STATS'; payload: SessionStats[] }
  | { type: 'ADD_TOAST'; payload: Toast }
  | { type: 'REMOVE_TOAST'; payload: string }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'RESET_ALL' };

const initialState: State = {
  cards: [],
  stats: [],
  toasts: [],
  isDarkMode: localStorage.getItem('flashcard_theme') === 'dark',
  isLoading: true,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_CARDS':
      return { ...state, cards: action.payload };

    case 'ADD_CARD':
      return { ...state, cards: [...state.cards, action.payload] };

    case 'UPDATE_CARD':
      return {
        ...state,
        cards: state.cards.map(card =>
          card.id === action.payload.id ? action.payload : card
        ),
      };

    case 'DELETE_CARD':
      return {
        ...state,
        cards: state.cards.filter(card => card.id !== action.payload),
      };

    case 'MERGE_CARDS': {
      // Tránh trùng từ (theo word, không theo id)
      const existingWords = new Set(state.cards.map(c => c.word.toLowerCase().trim()));
      // ID lớn nhất hiện có để cấp ID mới tránh trùng
      const maxId = state.cards.reduce((max, c) => Math.max(max, c.id), 0);
      let nextId = maxId + 1;

      const newCards: Flashcard[] = [];
      for (const card of action.payload) {
        if (!existingWords.has(card.word.toLowerCase().trim())) {
          newCards.push({ ...card, id: nextId++ }); // cấp lại ID mới
          existingWords.add(card.word.toLowerCase().trim());
        }
      }
      return { ...state, cards: [...state.cards, ...newCards] };
    }

    case 'REVIEW_CARD': {
      const { cardId, quality } = action.payload;
      const cardIndex = state.cards.findIndex(c => c.id === cardId);
      if (cardIndex === -1) return state;

      const card = state.cards[cardIndex];
      const newReview = calculateNextReview(card.review, quality);
      const updatedCard = updateCardStatus({
        ...card,
        review: newReview,
      });

      const newCards = [...state.cards];
      newCards[cardIndex] = updatedCard;

      return { ...state, cards: newCards };
    }

    case 'SET_STATS':
      return { ...state, stats: action.payload };

    case 'ADD_TOAST':
      return { ...state, toasts: [...state.toasts, action.payload] };

    case 'REMOVE_TOAST':
      return {
        ...state,
        toasts: state.toasts.filter(t => t.id !== action.payload),
      };

    case 'TOGGLE_DARK_MODE': {
      const newDarkMode = !state.isDarkMode;
      localStorage.setItem('flashcard_theme', newDarkMode ? 'dark' : 'light');
      return { ...state, isDarkMode: newDarkMode };
    }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'RESET_ALL':
      return initialState;

    default:
      return state;
  }
}

export function FlashcardProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadedCards = loadCards();
    const loadedStats = loadStats();
    dispatch({ type: 'SET_CARDS', payload: loadedCards });
    dispatch({ type: 'SET_STATS', payload: loadedStats });
    dispatch({ type: 'SET_LOADING', payload: false });
  }, []);

  // Save cards to localStorage whenever they change
  useEffect(() => {
    if (!state.isLoading) {
      saveCards(state.cards);
    }
  }, [state.cards, state.isLoading]);

  // Save stats to localStorage whenever they change
  useEffect(() => {
    if (!state.isLoading) {
      saveStats(state.stats);
    }
  }, [state.stats, state.isLoading]);

  const addCard = useCallback((card: Flashcard) => {
    dispatch({ type: 'ADD_CARD', payload: card });
  }, []);

  const updateCard = useCallback((card: Flashcard) => {
    dispatch({ type: 'UPDATE_CARD', payload: card });
  }, []);

  const deleteCard = useCallback((id: number) => {
    dispatch({ type: 'DELETE_CARD', payload: id });
  }, []);

  const importCards = useCallback((cards: Flashcard[]) => {
    dispatch({ type: 'SET_CARDS', payload: cards });
  }, []);

  const mergeCards = useCallback((cards: Flashcard[]) => {
    dispatch({ type: 'MERGE_CARDS', payload: cards });
  }, []);

  const resetAllCards = useCallback(() => {
    dispatch({ type: 'RESET_ALL' });
  }, []);

  const reviewCard = useCallback((cardId: number, quality: number) => {
    dispatch({ type: 'REVIEW_CARD', payload: { cardId, quality } });
  }, []);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' | 'warning') => {
      const id = Math.random().toString(36).substr(2, 9);
      const toast: Toast = {
        id,
        message,
        type,
        duration: 3000,
      };
      dispatch({ type: 'ADD_TOAST', payload: toast });

      if (toast.duration) {
        setTimeout(() => {
          dispatch({ type: 'REMOVE_TOAST', payload: id });
        }, toast.duration);
      }
    },
    []
  );

  const removeToast = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_TOAST', payload: id });
  }, []);

  const recordReview = useCallback(
    (isCorrect: boolean) => {
      const todaySession = getTodaySession(state.stats);
      const correct = (todaySession?.correct ?? 0) + (isCorrect ? 1 : 0);
      const incorrect = (todaySession?.incorrect ?? 0) + (isCorrect ? 0 : 1);
      const updated = updateTodaySession(state.stats, correct, incorrect);
      dispatch({ type: 'SET_STATS', payload: updated });
    },
    [state.stats]
  );

  const toggleDarkMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_DARK_MODE' });
  }, []);

  const value: FlashcardContextType = {
    ...state,
    addCard,
    updateCard,
    deleteCard,
    importCards,
    mergeCards,
    resetAllCards,
    reviewCard,
    showToast,
    removeToast,
    recordReview,
    toggleDarkMode,
  };

  return (
    <FlashcardContext.Provider value={value}>
      {children}
    </FlashcardContext.Provider>
  );
}

export function useFlashcard() {
  const context = useContext(FlashcardContext);
  if (context === undefined) {
    throw new Error('useFlashcard must be used within FlashcardProvider');
  }
  return context;
}
