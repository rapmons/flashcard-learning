import React from 'react';
import { useFlashcard } from '@context/FlashcardContext';
import { calculateDeckStats } from '@services/cardService';
import { calculateCumulativeStats } from '@services/statsService';
import { BookOpen, Target, TrendingUp, Flame } from 'lucide-react';

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color?: 'blue' | 'green' | 'orange' | 'red';
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, color = 'blue' }) => {
  const colorClasses: Record<'blue' | 'green' | 'orange' | 'red', string> = {
    blue: 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
    green: 'bg-green-50 dark:bg-green-900 text-green-600 dark:text-green-300',
    orange: 'bg-orange-50 dark:bg-orange-900 text-orange-600 dark:text-orange-300',
    red: 'bg-red-50 dark:bg-red-900 text-red-600 dark:text-red-300',
  };

  return (
    <div className={`${colorClasses[color]} rounded-lg p-6 flex items-center gap-4`}>
      <div className="text-2xl">{icon}</div>
      <div>
        <p className="text-sm font-medium opacity-75">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { cards, stats } = useFlashcard();
  const deckStats = calculateDeckStats(cards);
  const cumulativeStats = calculateCumulativeStats(stats);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen size={32} />}
          label="Total Cards"
          value={deckStats.totalCards}
          color="blue"
        />
        <StatCard
          icon={<Target size={32} />}
          label="Due Today"
          value={deckStats.dueToday}
          color="orange"
        />
        <StatCard
          icon={<TrendingUp size={32} />}
          label="Learned"
          value={deckStats.learnedToday}
          color="green"
        />
        <StatCard
          icon={<Flame size={32} />}
          label="Current Streak"
          value={cumulativeStats.currentStreak}
          color="red"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Learning Progress
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                Learning Progress: {Math.round(deckStats.accuracy * 100)}%
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${deckStats.accuracy * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Overall Statistics
          </h2>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Reviewed:</span>
              <span className="font-semibold">{cumulativeStats.totalCards}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Accuracy:</span>
              <span className="font-semibold">
                {Math.round(cumulativeStats.overallAccuracy * 100)}%
              </span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Sessions:</span>
              <span className="font-semibold">{cumulativeStats.totalSessions}</span>
            </p>
          </div>

          {cumulativeStats.synonymTotalCards > 0 && (
            <>
              <div className="border-t border-gray-200 dark:border-gray-700 my-4" />
              <h3 className="text-md font-semibold text-purple-600 dark:text-purple-400 mb-3">
                Synonym Quiz
              </h3>
              <div className="space-y-2 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Questions Answered:</span>
                  <span className="font-semibold text-purple-700 dark:text-purple-300">{cumulativeStats.synonymTotalCards}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Accuracy:</span>
                  <span className="font-semibold text-purple-700 dark:text-purple-300">
                    {Math.round(cumulativeStats.synonymOverallAccuracy * 100)}%
                  </span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const QuickStats: React.FC = () => {
  const { cards, stats } = useFlashcard();
  const deckStats = calculateDeckStats(cards);
  const cumulativeStats = calculateCumulativeStats(stats);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
      <StatCard
        icon={<BookOpen size={24} />}
        label="Total"
        value={deckStats.totalCards}
        color="blue"
      />
      <StatCard
        icon={<Target size={24} />}
        label="Due"
        value={deckStats.dueToday}
        color="orange"
      />
      <StatCard
        icon={<TrendingUp size={24} />}
        label="Learned"
        value={deckStats.learnedToday}
        color="green"
      />
      <StatCard
        icon={<Flame size={24} />}
        label="Streak"
        value={cumulativeStats.currentStreak}
        color="red"
      />
    </div>
  );
};
