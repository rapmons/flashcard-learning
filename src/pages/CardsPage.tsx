import React, { useState } from 'react';
import { useFlashcard } from '@context/FlashcardContext';
import { searchCards, filterCards } from '@services/cardService';
import { FlashcardCard, Input } from '@components/index';
import { Trash2 } from 'lucide-react';

export const CardsPage: React.FC = () => {
  const { cards, deleteCard, showToast } = useFlashcard();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'learning' | 'remembered'>('all');

  const filteredCards = statusFilter === 'all'
    ? searchCards(cards, searchQuery)
    : filterCards(
      searchCards(cards, searchQuery),
      { status: statusFilter as any }
    );

  const handleDelete = (id: number) => {
    if (confirm('Bạn có chắc muốn xóa card này không?')) {
      deleteCard(id);
      showToast('Đã xóa card!', 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Cards
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Total cards: {cards.length}
        </p>
      </div>

      <div className="space-y-4">
        <Input
          placeholder="Search cards by word or meaning..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          {(['all', 'new', 'learning', 'remembered'] as const).map(status => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                statusFilter === status
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300'
              }`}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {filteredCards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            No cards found
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCards.map(card => (
            <div key={card.id} className="relative group">
              <FlashcardCard card={card} size="sm" interactive={true} />
              {/* Nút xóa luôn hiển thị — hoạt động cả mobile */}
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(card.id); }}
                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white
                  p-1.5 rounded-full shadow opacity-0 group-hover:opacity-100
                  focus:opacity-100 transition-opacity"
                title="Xóa card"
                aria-label="Xóa card"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
