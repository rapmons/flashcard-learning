import React, { useEffect } from 'react';
import { useFlashcard } from '@context/FlashcardContext';
import { MOCK_CARDS } from '@constants/mockData';
import { Dashboard, Button } from '@components/index';
import { loadCards } from '@utils/localStorage';

export const HomePage: React.FC<{ onNavigate: (href: string) => void }> = ({
  onNavigate,
}) => {
  const { cards, isLoading, importCards, showToast } = useFlashcard();

  useEffect(() => {
    // Load mock data if no cards exist
    if (!isLoading && cards.length === 0) {
      const savedCards = loadCards();
      if (savedCards.length === 0) {
        importCards(MOCK_CARDS);
        showToast(
          'Sample flashcards loaded. You can add your own or import from JSON.',
          'info'
        );
      }
    }
  }, [isLoading, cards.length, importCards, showToast]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Dashboard />

      <div className="bg-primary-50 dark:bg-primary-900 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-4">
          Ready to learn?
        </h2>
        <p className="text-primary-800 dark:text-primary-200 mb-6">
          Choose a mode to start learning your flashcards with spaced repetition algorithm.
        </p>
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => onNavigate('/learn')}>
            Start Learning
          </Button>
          <Button onClick={() => onNavigate('/review')} variant="secondary">
            Daily Review
          </Button>
          <Button onClick={() => onNavigate('/quiz')} variant="secondary">
            Quiz Mode
          </Button>
        </div>
      </div>
    </div>
  );
};
