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
            <div key={card.id} className="group flex flex-col gap-2">
              <FlashcardCard card={card} size="sm" interactive={true} />
              {/* Nút xóa nằm bên dưới card, không che nội dung */}
              <button
                onClick={(e) => { e.stopPropagation(); handleDelete(card.id); }}
                className="flex items-center justify-center gap-1 text-sm text-red-500
                  hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/30
                  py-1 rounded-lg opacity-0 group-hover:opacity-100
                  focus:opacity-100 transition-opacity w-full"
                title="Xóa card"
                aria-label="Xóa card"
              >
                <Trash2 size={14} />
                <span>Xóa</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
