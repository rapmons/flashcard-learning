import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2 } from 'lucide-react';
import type { Flashcard } from '@types';

interface FlashcardProps {
  card: Flashcard;
  showAnswer?: boolean;
  onFlip?: (flipped: boolean) => void;
  interactive?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const FlashcardCard: React.FC<FlashcardProps> = ({
  card,
  showAnswer = false,
  onFlip,
  interactive = true,
  size = 'md',
}) => {
  const [isFlipped, setIsFlipped] = useState(showAnswer);

  const handleFlip = () => {
    const newFlipped = !isFlipped;
    setIsFlipped(newFlipped);
    onFlip?.(newFlipped);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(card.word);
      utterance.lang = 'en-US';
      speechSynthesis.cancel();
      speechSynthesis.speak(utterance);
    }
  };

  const sizeClasses = {
    sm: 'h-56',
    md: 'h-64',
    lg: 'h-96',
  };

  return (
    <motion.div
      className={`cursor-pointer perspective`}
      onClick={interactive ? handleFlip : undefined}
      whileHover={interactive ? { scale: 1.02 } : {}}
    >
      <motion.div
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 80 }}
        className={`${sizeClasses[size]} relative w-full`}
        style={{ transformStyle: 'preserve-3d' as any }}
      >
        {/* Front side */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 
            rounded-xl shadow-lg p-6 flex flex-col justify-center items-center text-white`}
          style={{ backfaceVisibility: 'hidden' as any }}
        >
          <div className="text-center">
            <p className="text-sm font-medium opacity-75 mb-2">Từ vựng</p>
            <h2 className="text-4xl font-bold mb-3 break-words">{card.word}</h2>
            <p className="text-lg opacity-90 italic mb-3">{card.phonetic}</p>
            {card.example && (
              <div className="bg-white bg-opacity-10 rounded-lg p-3 mt-2">
                <p className="text-xs font-semibold opacity-75 mb-1 uppercase">Ví dụ</p>
                <p className="text-sm italic opacity-90">{card.example}</p>
              </div>
            )}
          </div>
          <div className="absolute bottom-4 right-4">
            <button
              onClick={handleSpeak}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 p-2 rounded-full transition"
            >
              <Volume2 size={24} />
            </button>
          </div>
          <div className="absolute bottom-4 left-4 text-sm opacity-75">
            {card.type}
          </div>
        </motion.div>

        {/* Back side */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br from-green-400 to-green-600 
            rounded-xl shadow-lg p-6 flex flex-col justify-between text-white`}
          style={{ backfaceVisibility: 'hidden', rotateY: 180 } as any}
        >
          <div>
            <p className="text-sm font-medium opacity-75 mb-2">Nghĩa tiếng Việt</p>
            <h2 className="text-2xl font-bold mb-4">{card.meaning}</h2>
          </div>

          {card.synonyms && card.synonyms.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-semibold opacity-75 mb-1 uppercase">Từ đồng nghĩa</p>
              <div className="flex flex-wrap gap-2">
                {card.synonyms.map(syn => (
                  <span
                    key={syn}
                    className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs font-medium"
                  >
                    {syn}
                  </span>
                ))}
              </div>
            </div>
          )}

          {card.tags && card.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {card.tags.map(tag => (
                <span
                  key={tag}
                  className="bg-white bg-opacity-20 px-2 py-1 rounded text-xs font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="absolute bottom-4 right-4 text-sm opacity-75">
            Status: {card.status}
          </div>
        </motion.div>
      </motion.div>

      {interactive && (
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-4">
          {isFlipped ? 'Click to see word' : 'Click to see meaning'}
        </p>
      )}
    </motion.div>
  );
};

interface CardGridProps {
  cards: Flashcard[];
  onCardClick?: (card: Flashcard) => void;
}

export const CardGrid: React.FC<CardGridProps> = ({ cards, onCardClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {cards.map(card => (
        <div
          key={card.id}
          onClick={() => onCardClick?.(card)}
          className="cursor-pointer hover:shadow-lg transition-shadow"
        >
          <FlashcardCard card={card} size="sm" interactive={true} />
        </div>
      ))}
    </div>
  );
};
