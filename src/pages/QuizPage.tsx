import React, { useState, useMemo } from 'react';
import { useFlashcard } from '@context/FlashcardContext';
import { getRandomCards } from '@services/cardService';
import type { Flashcard } from '@types';
import { QuizCard } from '@components/ReviewCard';
import { Button } from '@components/UI';
import { ChevronLeft, ChevronRight, Trophy } from 'lucide-react';

interface QuizQuestion {
  card: Flashcard;
  options: Flashcard[];
}

export const QuizPage: React.FC = () => {
  const { cards, reviewCard, showToast, recordReview } = useFlashcard();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // Tạo bộ câu hỏi 1 lần duy nhất khi mount (không shuffle lại mỗi render)
  const questions = useMemo<QuizQuestion[]>(() => {
    if (cards.length < 2) return [];
    const quizCards = getRandomCards(cards, Math.min(10, cards.length));
    return quizCards.map(card => {
      const others = cards.filter(c => c.id !== card.id);
      const wrongOptions = getRandomCards(others, Math.min(3, others.length));
      const options = [card, ...wrongOptions].sort(() => Math.random() - 0.5);
      return { card, options };
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (cards.length < 2) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          Cần ít nhất 2 flashcard để chơi Quiz!
        </p>
        <Button onClick={() => (window.location.href = '/')}>
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
        <Button onClick={() => (window.location.href = '/')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Màn hình kết quả
  if (isFinished) {
    const total = correct + incorrect;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-6">
        <Trophy size={64} className="mx-auto text-yellow-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Quiz Completed!
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
          <Button variant="secondary" onClick={() => window.location.reload()}>
            Play Again
          </Button>
          <Button onClick={() => (window.location.href = '/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const { card: currentCard, options } = questions[currentIndex];

  const handleAnswer = (_selectedCard: Flashcard, isCorrect: boolean) => {
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

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 1000);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Quiz Mode
        </h1>
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

      <QuizCard
        key={currentCard.id}
        card={currentCard}
        options={options}
        onAnswer={handleAnswer}
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
          onClick={() => setCurrentIndex(i => Math.min(questions.length - 1, i + 1))}
          disabled={currentIndex === questions.length - 1}
          variant="secondary"
        >
          Next
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};
