import React, { useState } from 'react';
import { FlashcardProvider, useFlashcard } from '@context/FlashcardContext';
import { Header, ToastContainer } from '@components/index';
import {
  HomePage,
  LearnPage,
  ReviewPage,
  QuizPage,
  CardsPage,
  StatsPage,
  SynonymQuizPage,
} from '@pages/index';

function AppContent() {
  const [currentPage, setCurrentPage] = useState('/');
  const { toasts, isDarkMode } = useFlashcard();

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderPage = () => {
    switch (currentPage) {
      case '/':
        return <HomePage onNavigate={setCurrentPage} />;
      case '/learn':
        return <LearnPage onNavigate={setCurrentPage} />;
      case '/review':
        return <ReviewPage onNavigate={setCurrentPage} />;
      case '/quiz':
        return <QuizPage onNavigate={setCurrentPage} />;
      case '/quiz-synonym':
        return <SynonymQuizPage onNavigate={setCurrentPage} />;
      case '/cards':
        return <CardsPage />;
      case '/stats':
        return <StatsPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderPage()}
      </main>
      <ToastContainer toasts={toasts} />
    </div>
  );
}

export default function App() {
  return (
    <FlashcardProvider>
      <AppContent />
    </FlashcardProvider>
  );
}
