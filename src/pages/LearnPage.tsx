import React, { useState } from 'react';
import { useFlashcard } from '@context/FlashcardContext';
import type { Flashcard } from '@types';
import { ReviewCard } from '@components/index';
import { Button } from '@components/UI';
import { ChevronLeft, ChevronRight, CheckCircle, RotateCcw } from 'lucide-react';

const BATCH_SIZE = 20;
const MAX_REINSERTS = 2; // Mỗi từ tối đa bị lặp lại 2 lần trong session

/** Sắp xếp theo độ khó: learning trước new, easeFactor thấp trước */
function sortByDifficulty(pool: Flashcard[]): Flashcard[] {
  return [...pool].sort((a, b) => {
    if (a.status !== b.status) return a.status === 'learning' ? -1 : 1;
    if (Math.abs(a.review.easeFactor - b.review.easeFactor) > 0.01)
      return a.review.easeFactor - b.review.easeFactor;
    return a.review.repetition - b.review.repetition;
  });
}

export const LearnPage: React.FC<{ onNavigate: (path: string) => void }> = ({ onNavigate }) => {
  const { cards, reviewCard, showToast, recordReview } = useFlashcard();

  // Tạo pool 1 lần khi mount (stable)
  const [pool] = useState<Flashcard[]>(() =>
    sortByDifficulty(cards.filter(c => c.status === 'new' || c.status === 'learning'))
  );

  // Queue chứa ID các từ trong session (có thể tăng khi re-insert từ sai)
  const [queue, setQueue] = useState<number[]>(() =>
    pool.slice(0, BATCH_SIZE).map(c => c.id)
  );
  const [position, setPosition] = useState(0);

  // Đếm số lần re-insert mỗi từ (để giới hạn)
  const [reinsertCount, setReinsertCount] = useState<Record<number, number>>({});

  // ID các từ đã trả lời ĐÚNG ít nhất 1 lần
  const [masteredIds, setMasteredIds] = useState<Set<number>>(new Set());

  // Thống kê session
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 });

  // Màn kết thúc session
  const [isSessionDone, setIsSessionDone] = useState(false);

  // Batch thứ mấy (để Continue load batch tiếp)
  const [batchIndex, setBatchIndex] = useState(0);

  if (pool.length === 0) {
    return (
      <div className="text-center py-16 space-y-4">
        <CheckCircle size={64} className="mx-auto text-green-400" />
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Tuyệt vời! Không còn từ nào cần học. 🎉
        </p>
        <Button onClick={() => onNavigate('/')}>Back to Dashboard</Button>
      </div>
    );
  }

  const currentCardId = queue[position];
  const currentCard = cards.find(c => c.id === currentCardId);

  // Số từ unique trong batch hiện tại (không tính re-insert)
  const batchStart = batchIndex * BATCH_SIZE;
  const batchIds = new Set(pool.slice(batchStart, batchStart + BATCH_SIZE).map(c => c.id));
  const uniqueInBatch = batchIds.size;
  const completedUnique = [...masteredIds].filter(id => batchIds.has(id)).length;

  const handleRate = (quality: number) => {
    if (!currentCard) return;
    const isCorrect = quality >= 3;
    reviewCard(currentCard.id, quality);
    recordReview(isCorrect);

    setStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
    }));

    showToast(
      isCorrect ? 'Great! Keep it up! 🎉' : 'Cần luyện thêm! 💪',
      isCorrect ? 'success' : 'info'
    );

    const newQueue = [...queue];

    if (!isCorrect) {
      const count = reinsertCount[currentCardId] ?? 0;
      if (count < MAX_REINSERTS) {
        // Từ sai → chèn lại vào vị trí +3
        const insertAt = Math.min(position + 3, newQueue.length);
        newQueue.splice(insertAt, 0, currentCardId);
        setQueue(newQueue);
        setReinsertCount(prev => ({ ...prev, [currentCardId]: count + 1 }));
      }
    } else {
      setMasteredIds(prev => new Set(prev).add(currentCardId));
    }

    if (position < newQueue.length - 1) {
      setPosition(position + 1);
    } else {
      setIsSessionDone(true);
    }
  };

  const handleContinue = () => {
    const nextBatchIndex = batchIndex + 1;
    const nextStart = nextBatchIndex * BATCH_SIZE;
    const nextBatch = pool.slice(nextStart, nextStart + BATCH_SIZE);

    if (nextBatch.length === 0) {
      showToast('Bạn đã học hết tất cả từ! 🎊', 'success');
      setTimeout(() => (window.location.href = '/'), 1500);
      return;
    }

    setQueue(nextBatch.map(c => c.id));
    setPosition(0);
    setReinsertCount({});
    setMasteredIds(new Set());
    setStats({ correct: 0, incorrect: 0 });
    setIsSessionDone(false);
    setBatchIndex(nextBatchIndex);
  };

  // Màn hình kết thúc session
  if (isSessionDone) {
    const total = stats.correct + stats.incorrect;
    const accuracy = total > 0 ? (stats.correct / total) * 100 : 0;
    const nextStart = (batchIndex + 1) * BATCH_SIZE;
    const hasMore = nextStart < pool.length;
    const remaining = pool.length - (batchIndex + 1) * BATCH_SIZE;

    return (
      <div className="max-w-lg mx-auto text-center py-16 space-y-6">
        <CheckCircle size={64} className="mx-auto text-green-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Session Complete!
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-3xl font-bold text-blue-500">{completedUnique}</p>
              <p className="text-sm text-gray-500">Từ đã học</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-green-500">{stats.correct}</p>
              <p className="text-sm text-gray-500">Đúng</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-purple-500">{accuracy.toFixed(0)}%</p>
              <p className="text-sm text-gray-500">Chính xác</p>
            </div>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-700"
              style={{ width: `${accuracy}%` }}
            />
          </div>

          {hasMore && (
            <p className="text-sm text-gray-500">
              Còn <span className="font-semibold text-primary-500">{remaining}</span> từ chưa học
            </p>
          )}
        </div>

        <div className="flex gap-4 justify-center flex-wrap">
          {hasMore && (
            <Button onClick={handleContinue}>
              <RotateCcw size={18} />
              Tiếp tục ({remaining} từ)
            </Button>
          )}
          <Button variant="secondary" onClick={() => onNavigate('/')}>
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Learn Mode
        </h1>
        <div className="flex flex-wrap gap-4 text-sm mb-3">
          <span className="text-gray-600 dark:text-gray-400">
            Batch {batchIndex + 1} · {completedUnique}/{uniqueInBatch} từ
          </span>
          <span className="text-green-500 font-medium">✓ {stats.correct}</span>
          <span className="text-red-500 font-medium">✗ {stats.incorrect}</span>
          {pool.length > BATCH_SIZE && (
            <span className="text-gray-400">
              Tổng còn: {pool.length - batchStart - completedUnique}
            </span>
          )}
        </div>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-primary-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedUnique / uniqueInBatch) * 100}%` }}
          />
        </div>
      </div>

      <ReviewCard
        key={`${currentCard.id}-${position}`}
        card={currentCard}
        onRate={handleRate}
        currentIndex={completedUnique}
        totalCards={uniqueInBatch}
      />

      <div className="flex justify-between items-center mt-8">
        <Button
          onClick={() => setPosition(p => Math.max(0, p - 1))}
          disabled={position === 0}
          variant="secondary"
        >
          <ChevronLeft size={20} />
          Previous
        </Button>

        <span className="text-sm text-gray-600 dark:text-gray-400">
          {position + 1} / {queue.length}
        </span>

        <Button
          onClick={() => setPosition(p => Math.min(queue.length - 1, p + 1))}
          disabled={position === queue.length - 1}
          variant="secondary"
        >
          Next
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
};
