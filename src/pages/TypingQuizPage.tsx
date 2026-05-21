import React, { useState, useMemo } from 'react';
import { useFlashcard } from '@context/FlashcardContext';
import { getRandomCards } from '@services/cardService';
import type { Flashcard } from '@types';
import { TypingQuizCard } from '@components/ReviewCard';
import { Button } from '@components/UI';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

export const TypingQuizPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { cards, reviewCard, showToast, recordReview } = useFlashcard();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Chọn ngẫu nhiên tối đa 20 cards cho phiên học
  const questions = useMemo<Flashcard[]>(() => {
    if (cards.length === 0) return [];
    return getRandomCards(cards, Math.min(20, cards.length));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (cards.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          Cần ít nhất 1 flashcard để chơi Spelling Quiz!
        </p>
        <Button onClick={() => onNavigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          No cards available for quiz!
        </p>
        <Button onClick={() => onNavigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  if (isFinished) {
    const total = correct + incorrect;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-6">
        <Trophy size={64} className="mx-auto text-yellow-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Spelling Quiz Completed!
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-green-500">{correct}</p>
              <p className="text-sm text-gray-500">Correct</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-red-500">{incorrect}</p>
              <p className="text-sm text-gray-500">Incorrect</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-blue-500">{accuracy.toFixed(0)}%</p>
              <p className="text-sm text-gray-500">Accuracy</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-700"
              style={{ width: `${accuracy}%` }}
            />
          </div>
        </div>
        <div className="flex gap-4 justify-center">
          <Button
            variant="secondary"
            onClick={() => {
              setIsFinished(false);
              setCurrentIndex(0);
              setCorrect(0);
              setIncorrect(0);
            }}
          >
            Play Again
          </Button>
          <Button onClick={() => onNavigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const currentCard = questions[currentIndex];

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setCorrect(prev => prev + 1);
      reviewCard(currentCard.id, 5);
      recordReview(true);
      showToast('Correct! 🎉', 'success');
    } else {
      setIncorrect(prev => prev + 1);
      reviewCard(currentCard.id, 1);
      recordReview(false);
      showToast('Incorrect! 😅', 'error');
    }
  };

  const handleAdvance = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 relative">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Spelling Quiz
          </h1>
          <Button variant="secondary" size="sm" onClick={() => onNavigate('/')}>
            Exit Quiz
          </Button>
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <p>Questions: {questions.length}</p>
          <p className="text-green-500 font-medium">✓ Correct: {correct}</p>
          <p className="text-red-500 font-medium">✗ Incorrect: {incorrect}</p>
          {correct + incorrect > 0 && (
            <p>
              Accuracy:{' '}
              {((correct / (correct + incorrect)) * 100).toFixed(1)}%
            </p>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-4">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <TypingQuizCard
        key={currentCard.id}
        card={currentCard}
        onAnswer={handleAnswer}
        onAdvance={handleAdvance}
        currentIndex={currentIndex}
        totalCards={questions.length}
      />

      <div className="flex justify-between items-center mt-8">
        <Button
          onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
          disabled={currentIndex === 0}
          variant="secondary"
        >
          <ChevronLeft size={20} />
          Previous
        </Button>

        <span className="text-sm text-gray-600 dark:text-gray-400">
          {currentIndex + 1} / {questions.length}
        </span>

        <Button
          onClick={() => {
            if (currentIndex === questions.length - 1) {
              setIsFinished(true);
            } else {
              setCurrentIndex(i => i + 1);
            }
          }}
          variant="secondary"
        >
          {currentIndex === questions.length - 1 ? 'Finish' : 'Skip'}
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};
