import React from 'react';
import type { Flashcard } from '@types';
import { Button, Input } from './UI';
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

export interface SynonymQuizCardProps {
  card: Flashcard;
  options: string[];
  correctOption: string;
  onAnswer: (selectedSynonym: string, isCorrect: boolean) => void;
  currentIndex: number;
  totalCards: number;
}

export const SynonymQuizCard: React.FC<SynonymQuizCardProps> = ({
  card,
  options,
  correctOption,
  onAnswer,
  currentIndex,
  totalCards,
}) => {
  const [answered, setAnswered] = React.useState(false);
  const [selectedSynonym, setSelectedSynonym] = React.useState<string | null>(null);

  const handleSelect = (synonym: string) => {
    if (answered) return;
    const isCorrect = synonym === correctOption;
    setSelectedSynonym(synonym);
    setAnswered(true);
    setTimeout(() => {
      onAnswer(synonym, isCorrect);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Question {currentIndex + 1} of {totalCards}
      </div>

      <div className="bg-primary-50 dark:bg-primary-900 p-8 rounded-xl text-center shadow-sm border border-primary-100 dark:border-primary-800">
        <p className="text-sm font-semibold uppercase text-primary-600 dark:text-primary-300 mb-2">
          Find a synonym for:
        </p>
        <p className="text-4xl font-bold text-gray-900 dark:text-white">
          {card.word}
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 italic">
          {card.phonetic}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option, idx) => {
          const isSelected = selectedSynonym === option;
          const isCorrect = option === correctOption;

          let btnClass = 'border-gray-300 dark:border-gray-600 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20';
          
          if (answered) {
            if (isCorrect) {
              btnClass = 'border-green-500 bg-green-50 dark:bg-green-900/40';
            } else if (isSelected && !isCorrect) {
              btnClass = 'border-red-500 bg-red-50 dark:bg-red-900/40';
            } else {
              btnClass = 'border-gray-200 dark:border-gray-700 opacity-40';
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(option)}
              disabled={answered}
              className={`p-4 rounded-lg border-2 transition text-center ${btnClass}`}
            >
              <p className="font-semibold text-lg text-gray-900 dark:text-white">{option}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export interface TypingQuizCardProps {
  card: Flashcard;
  onAnswer: (isCorrect: boolean) => void;
  onAdvance: () => void;
  currentIndex: number;
  totalCards: number;
}

export const TypingQuizCard: React.FC<TypingQuizCardProps> = ({
  card,
  onAnswer,
  onAdvance,
  currentIndex,
  totalCards,
}) => {
  const [typedWord, setTypedWord] = React.useState('');
  const [answered, setAnswered] = React.useState(false);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [hasAttempted, setHasAttempted] = React.useState(false);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (answered && isCorrect) return;
    if (!typedWord.trim()) return;

    const correct = typedWord.trim().toLowerCase() === card.word.trim().toLowerCase();
    setIsCorrect(correct);
    setAnswered(true);

    if (!hasAttempted) {
      setHasAttempted(true);
      onAnswer(correct);
    }

    if (correct) {
      setTimeout(() => {
        onAdvance();
      }, 1000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTypedWord(e.target.value);
    if (answered && !isCorrect) {
      setAnswered(false);
      setIsCorrect(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center text-sm text-gray-600 dark:text-gray-400">
        Question {currentIndex + 1} of {totalCards}
      </div>

      <div className="bg-primary-50 dark:bg-primary-900 p-8 rounded-xl text-center shadow-sm border border-primary-100 dark:border-primary-800">
        <p className="text-sm font-semibold uppercase text-primary-600 dark:text-primary-300 mb-2">
          Type the English word for:
        </p>
        <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {card.meaning}
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 italic">
          {card.phonetic}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="text"
            value={typedWord}
            onChange={handleChange}
            placeholder="Type the word here..."
            disabled={answered && isCorrect === true}
            className={`text-center text-xl font-bold p-4 ${
              answered
                ? isCorrect
                  ? 'border-green-500 text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20'
                  : 'border-red-500 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                : ''
            }`}
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {answered && isCorrect === false && (
          <div className="text-center p-3 rounded-lg bg-red-100 dark:bg-red-900/40 border border-red-200 dark:border-red-800 animate-fade-in">
            <p className="text-sm text-red-600 dark:text-red-400 mb-1">Incorrect. The correct word is:</p>
            <p className="text-xl font-bold text-red-700 dark:text-red-300 tracking-wide">{card.word}</p>
            <p className="text-sm text-red-500 dark:text-red-400 mt-2">Please type it correctly to continue.</p>
          </div>
        )}

        <Button
          type="submit"
          className="w-full h-12 text-lg"
          variant={answered ? (isCorrect ? 'primary' : 'danger') : 'primary'}
          disabled={!typedWord.trim() || (answered && isCorrect === true)}
        >
          {answered && isCorrect ? 'Correct! 🎉' : 'Submit'}
        </Button>
      </form>
    </div>
  );
};
