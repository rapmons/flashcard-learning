import React from 'react';
import type { Flashcard } from '@types';
import { Button } from './UI';
import { QUALITY_LABELS } from '@constants/index';
import { FlashcardCard } from './FlashcardCard';

interface ReviewCardProps {
  card: Flashcard;
  onRate: (quality: number) => void;
  currentIndex: number;
  totalCards: number;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({
  card,
  onRate,
  currentIndex,
  totalCards,
}) => {
  const [isFlipped, setIsFlipped] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Card {currentIndex + 1} of {totalCards}
      </div>

      <FlashcardCard
        card={card}
        showAnswer={isFlipped}
        onFlip={setIsFlipped}
        size="lg"
      />

      <div className="space-y-3">
        <p className="text-center text-gray-700 dark:text-gray-300 text-sm">
          {isFlipped
            ? 'How well did you remember this card?'
            : 'Click the card to reveal the answer'}
        </p>

        {isFlipped && (
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2, 3, 4, 5].map(quality => (
              <Button
                key={quality}
                onClick={() => onRate(quality)}
                variant={quality <= 2 ? 'danger' : 'primary'}
                size="sm"
                className="text-xs"
              >
                <div className="flex flex-col items-center">
                  <span className="font-bold">{quality}</span>
                  <span className="text-xs">{QUALITY_LABELS[quality].split(' ')[0]}</span>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface QuizCardProps {
  card: Flashcard;
  options: Flashcard[];
  onAnswer: (selectedCard: Flashcard, isCorrect: boolean) => void;
  currentIndex: number;
  totalCards: number;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  card,
  options,
  onAnswer,
  currentIndex,
  totalCards,
}) => {
  const [answered, setAnswered] = React.useState(false);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);

  const handleSelect = (selectedCard: Flashcard) => {
    const isCorrect = selectedCard.id === card.id;
    setSelectedId(selectedCard.id);
    setAnswered(true);
    setTimeout(() => {
      onAnswer(selectedCard, isCorrect);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Question {currentIndex + 1} of {totalCards}
      </div>

      <div className="bg-primary-50 dark:bg-primary-900 p-8 rounded-xl text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
          What is the meaning of:
        </p>
        <p className="text-3xl font-bold text-primary-600 dark:text-primary-300">
          {card.word}
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 italic">
          {card.phonetic}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map(option => (
          <button
            key={option.id}
            onClick={() => handleSelect(option)}
            disabled={answered}
            className={`p-4 rounded-lg border-2 transition text-left
              ${
                answered && option.id === card.id
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/40'
                  : selectedId === option.id && option.id !== card.id
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/40'
                  : answered && selectedId !== option.id
                  ? 'border-gray-200 dark:border-gray-700 opacity-40'
                  : 'border-gray-300 dark:border-gray-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20'
              }
            `}
          >
            <p className="font-semibold text-gray-900 dark:text-white">{option.meaning}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
