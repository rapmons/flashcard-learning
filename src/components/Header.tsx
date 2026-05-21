import React, { useState } from 'react';
import { useFlashcard } from '@context/FlashcardContext';
import { Menu, X, Moon, Sun, Upload } from 'lucide-react';
import { Button } from './UI';
import { APP_TITLE } from '@constants/index';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/' },
  { id: 'learn', label: 'Learn', href: '/learn' },
  { id: 'review', label: 'Review', href: '/review' },
  { id: 'quiz', label: 'Quiz', href: '/quiz' },
  { id: 'quiz-typing', label: 'Spelling', href: '/quiz-typing' },
  { id: 'cards', label: 'Cards', href: '/cards' },
  { id: 'stats', label: 'Statistics', href: '/stats' },
];

interface HeaderProps {
  currentPage?: string;
  onNavigate: (href: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPage = '/', onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode, toggleDarkMode, showToast, mergeCards } = useFlashcard();

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          try {
            const parsed = JSON.parse(event.target.result);
            const cardsData = Array.isArray(parsed) ? parsed : parsed.cards;
            if (!Array.isArray(cardsData) || cardsData.length === 0) {
              showToast('File không hợp lệ hoặc không có card nào!', 'error');
              return;
            }
            // Luôn Merge: giữ progress cũ, chỉ thêm card mới chưa có
            mergeCards(cardsData);
            showToast(`Đã import ${cardsData.length} cards!`, 'success');
          } catch (error) {
            showToast('File JSON bị lỗi, không thể import!', 'error');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('/')}>
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">F</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">
              {APP_TITLE}
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.href)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === item.href
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">

            <Button
              variant="ghost"
              size="sm"
              onClick={handleImport}
              className="hidden sm:flex items-center gap-2"
            >
              <Upload size={18} />
              <span className="hidden lg:inline">Import</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleDarkMode}
              className="flex items-center gap-2"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 space-y-2">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.href);
                  setIsMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition ${
                  currentPage === item.href
                    ? 'bg-primary-500 text-white'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};
