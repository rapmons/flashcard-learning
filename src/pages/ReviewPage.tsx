import React, { useState } from 'react';
import { useFlashcard } from '@context/FlashcardContext';
import { getCardsForReview } from '@services/cardService';
import { ReviewCard } from '@components/index';
import { Button } from '@components/UI';
import { ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react';

export const ReviewPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { cards, reviewCard, showToast, recordReview } = useFlashcard();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewed, setReviewed] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const reviewCards = getCardsForReview(cards);

  // Phân loại để hiển thị thông tin rõ hơn
  const newCount = cards.filter(c => c.status === 'new').length;

  if (reviewCards.length === 0) {
    return (
      <div className="text-center py-16 space-y-4 max-w-lg mx-auto">
        <CheckCircle size={64} className="mx-auto text-green-400" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Không có gì cần ôn hôm nay!
        </h2>

        {newCount > 0 ? (
          <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 text-left space-y-2">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-medium">
              <Clock size={18} />
              <span>Bạn còn {newCount} từ mới chưa học</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Hãy vào <strong>Learn Mode</strong> để học trước. Sau khi học xong, 
              các từ sẽ xuất hiện ở đây để ôn tập.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onNavigate('/learn')}
              className="mt-2"
            >
              Đi đến Learn Mode
            </Button>
          </div>
        ) : (
          <p className="text-gray-600 dark:text-gray-400">
            Tất cả từ vựng đều đã được ôn đúng lịch. Hãy quay lại sau nhé!
          </p>
        )}

        <Button variant="secondary" onClick={() => onNavigate('/')}>
          Back to Dashboard
        </Button>
      </div>
    );
  }

  const currentCard = reviewCards[currentIndex];

  const handleRate = (quality: number) => {
    const isCorrect = quality >= 3;
    reviewCard(currentCard.id, quality);
    recordReview(isCorrect);
    const newReviewed = reviewed + 1;
    const newCorrect = correct + (isCorrect ? 1 : 0);

    showToast(
      isCorrect ? 'Great! Keep it up! 🎉' : 'Cần luyện thêm! 💪',
      isCorrect ? 'success' : 'info'
    );

    if (currentIndex < reviewCards.length - 1) {
      setReviewed(newReviewed);
      if (isCorrect) setCorrect(newCorrect);
      setCurrentIndex(currentIndex + 1);
    } else {
      // Ôn tập xong - hiển thị màn hình kết quả
      setReviewed(newReviewed);
      if (isCorrect) setCorrect(newCorrect);
      setIsComplete(true);
    }
  };

  const learningCount = reviewCards.filter(c => c.status === 'learning').length;
  const overdueCount = reviewCards.filter(c => c.status === 'remembered').length;
// Màn hình kết quả sau khi hoàn thành
  if (isComplete) {
    const totalCards = reviewed;
    const accuracy = totalCards > 0 ? ((correct / totalCards) * 100).toFixed(1) : 0;
    
    return (
      <div className="text-center py-16 space-y-6 max-w-lg mx-auto">
        <CheckCircle size={80} className="mx-auto text-green-500 animate-bounce" />
        
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
            Ôn Tập Xong! 🎉
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Bạn đã hoàn thành bài ôn tập
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-8 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tổng ôn tập</p>
              <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                {totalCards}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Đúng</p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {correct}
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Chính xác</p>
            <p className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">
              {accuracy}%
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={() => onNavigate('/')}
            className="w-full"
          >
            Quay Lại Dashboard
          </Button>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => {
              setCurrentIndex(0);
              setReviewed(0);
              setCorrect(0);
              setIsComplete(false);
            }}
            className="w-full"
          >
            Ôn Tập Lại
          </Button>
        </div>
      </div>
    );
  }

  
  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Daily Review
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400 mb-1">
          {learningCount > 0 && <span>🟡 Đang học: {learningCount}</span>}
          {overdueCount > 0 && <span>🟢 Ôn định kỳ: {overdueCount}</span>}
          <span>Đã ôn: {reviewed}</span>
          <span className="text-green-500">✓ {correct}</span>
          {reviewed > 0 && (
            <span>Chính xác: {((correct / reviewed) * 100).toFixed(1)}%</span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentIndex / reviewCards.length) * 100}%` }}
          />
        </div>
      </div>

      <ReviewCard
        key={currentCard.id}
        card={currentCard}
        onRate={handleRate}
        currentIndex={currentIndex}
        totalCards={reviewCards.length}
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
          {currentIndex + 1} / {reviewCards.length}
        </span>

        <Button
          onClick={() => setCurrentIndex(i => Math.min(reviewCards.length - 1, i + 1))}
          disabled={currentIndex === reviewCards.length - 1}
          variant="secondary"
        >
          Next
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};
