import React from 'react';
import { useFlashcard } from '@context/FlashcardContext';
import { calculateCumulativeStats, getWeeklyStats } from '@services/statsService';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const StatsPage: React.FC = () => {
  const { cards, stats } = useFlashcard();
  const cumulativeStats = calculateCumulativeStats(stats);
  const weeklyStats = getWeeklyStats(stats);

  const chartData = Object.entries(weeklyStats).map(([date, count]) => ({
    date: date.substring(0, 10),
    cards: count,
  }));

  const statusDistribution = [
    {
      name: 'New',
      value: cards.filter(c => c.status === 'new').length,
      color: '#3b82f6',
    },
    {
      name: 'Learning',
      value: cards.filter(c => c.status === 'learning').length,
      color: '#f59e0b',
    },
    {
      name: 'Remembered',
      value: cards.filter(c => c.status === 'remembered').length,
      color: '#10b981',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Statistics
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Track your learning progress
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total Cards Reviewed</p>
          <p className="text-3xl font-bold text-primary-500">{cumulativeStats.totalCards}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Overall Accuracy</p>
          <p className="text-3xl font-bold text-green-500">
            {(cumulativeStats.overallAccuracy * 100).toFixed(1)}%
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Current Streak</p>
          <p className="text-3xl font-bold text-orange-500">{cumulativeStats.currentStreak}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Longest Streak</p>
          <p className="text-3xl font-bold text-red-500">{cumulativeStats.longestStreak}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {chartData.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Weekly Activity
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="cards" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {statusDistribution.some(s => s.value > 0) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Card Status Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusDistribution.filter(s => s.value > 0)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Summary
          </h2>
          <div className="space-y-3 text-sm">
            <p className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Correct:</span>
              <span className="font-semibold">{cumulativeStats.totalCorrect}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Incorrect:</span>
              <span className="font-semibold">{cumulativeStats.totalIncorrect}</span>
            </p>
            <p className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Total Sessions:</span>
              <span className="font-semibold">{cumulativeStats.totalSessions}</span>
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Card Status Breakdown
          </h2>
          <div className="space-y-3 text-sm">
            {statusDistribution.map(status => (
              <p key={status.name} className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">{status.name}:</span>
                <span className="font-semibold">{status.value}</span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
