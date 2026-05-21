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
            Vocabulary Quiz
          </Button>
          <Button onClick={() => onNavigate('/quiz-synonym')} variant="secondary" className="bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/40 dark:text-purple-300 dark:hover:bg-purple-900/60 border-purple-200 dark:border-purple-800">
            Synonym Quiz
          </Button>
          <Button onClick={() => onNavigate('/quiz-typing')} variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 dark:bg-indigo-900/40 dark:text-indigo-300 dark:hover:bg-indigo-900/60 border-indigo-200 dark:border-indigo-800">
            Spelling Quiz
          </Button>
          <Button onClick={() => onNavigate('/quiz-fill-in')} variant="secondary" className="bg-cyan-100 text-cyan-700 hover:bg-cyan-200 dark:bg-cyan-900/40 dark:text-cyan-300 dark:hover:bg-cyan-900/60 border-cyan-200 dark:border-cyan-800">
            Fill-in Vocabulary
          </Button>
        </div>
      </div>
    </div>
  );
};
