import React, { useState, useMemo } from 'react';
import { useFlashcard } from '@context/FlashcardContext';
import { getRandomCards } from '@services/cardService';
import type { Flashcard } from '@types';
import { Button } from '@components/UI';
import { Trophy } from 'lucide-react';

interface FillInQuestion {
  card: Flashcard;
  sentence: string;
  blankPosition: number;
}

export const FillInTheBlankQuizPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { cards, reviewCard, showToast, recordReview } = useFlashcard();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');

  // Create questions from cards with examples
  const questions = useMemo<FillInQuestion[]>(() => {
    if (cards.length < 2) return [];
    
    const cardsWithExamples = cards.filter(c => c.example && c.example.trim().length > 0);
    if (cardsWithExamples.length < 2) return [];
    
    const quizCards = getRandomCards(cardsWithExamples, Math.min(20, cardsWithExamples.length));
    return quizCards.map(card => {
      const sentence = card.example;
      // Find the position of the word in the example
      const wordRegex = new RegExp(`\\b${card.word}\\b`, 'i');
      const match = sentence.match(wordRegex);
      const blankPosition = match ? match.index || 0 : 0;

      return {
        card,
        sentence,
        blankPosition,
      };
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (cards.length < 2) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          Cần ít nhất 2 flashcard để chơi Fill-in Quiz!
        </p>
        <Button onClick={() => onNavigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const cardsWithExamples = cards.filter(c => c.example && c.example.trim().length > 0);
  if (cardsWithExamples.length < 2) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
          Cần ít nhất 2 flashcard có example để chơi Fill-in Quiz!
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
          No cards available for fill-in quiz!
        </p>
        <Button onClick={() => onNavigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  // Results screen
  if (isFinished) {
    const total = correct + incorrect;
    const accuracy = total > 0 ? (correct / total) * 100 : 0;
    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-6">
        <Trophy size={64} className="mx-auto text-yellow-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Fill-in Quiz Completed!
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
              setUserAnswer('');
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

  const currentQuestion = questions[currentIndex];
  const { card, sentence } = currentQuestion;

  const handleSubmit = () => {
    if (!userAnswer.trim()) {
      showToast('Please enter an answer!', 'error');
      return;
    }

    // Normalize answers for comparison (case-insensitive, trim whitespace)
    const normalizedAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrect = card.word.toLowerCase();
    const isCorrect = normalizedAnswer === normalizedCorrect;

    if (isCorrect) {
      setCorrect(prev => prev + 1);
      reviewCard(card.id, 5);
      recordReview(true);
      showToast('Correct! 🎉', 'success');
    } else {
      setIncorrect(prev => prev + 1);
      reviewCard(card.id, 1);
      recordReview(false);
      showToast(`Incorrect! The answer was: ${card.word} 😅`, 'error');
    }

    setTimeout(() => {
      setUserAnswer('');
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  // Create sentence with blank
  const wordRegex = new RegExp(`\\b${card.word}\\b`, 'i');
  const sentenceWithBlank = sentence.replace(wordRegex, '______');

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 relative">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Fill-in Vocabulary Quiz
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
            <p className="text-blue-500 font-medium">
              Accuracy: {(((correct) / (correct + incorrect)) * 100).toFixed(0)}%
            </p>
          )}
        </div>
      </div>

      <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">
        Question {currentIndex + 1} of {questions.length}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 space-y-8">
        {/* Meaning/Definition */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-4 rounded">
          <p className="text-sm text-gray-600 dark:text-gray-400">Meaning:</p>
          <p className="text-lg font-semibold text-gray-900 dark:text-white">
            {card.meaning}
          </p>
        </div>

        {/* Sentence with blank */}
        <div className="space-y-4">
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4">
            Fill in the missing word:
          </p>
          <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg text-center">
            <p className="text-lg leading-relaxed text-gray-900 dark:text-white">
              {sentenceWithBlank}
            </p>
          </div>
        </div>

        {/* Input field */}
        <div className="space-y-3">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer here..."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <p>Word type: <span className="font-medium text-gray-700 dark:text-gray-300">{card.type}</span></p>
          </div>
        </div>

        {/* Submit button */}
        <Button
          onClick={handleSubmit}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Check Answer
        </Button>

        {/* Example hint */}
        <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm">
          <p className="text-gray-600 dark:text-gray-400">
            <span className="font-semibold">Example sentence:</span> {sentence}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
          {currentIndex + 1} of {questions.length}
        </p>
      </div>
    </div>
  );
};
