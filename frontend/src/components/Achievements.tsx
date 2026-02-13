import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { AchievementCategory } from '../types/game';
import { getAchievementsByCategory } from '../data/achievements';

export const Achievements: React.FC = () => {
  const { player, setScreen, achievements } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<
    AchievementCategory | 'all'
  >('all');

  if (!player || !achievements) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Achievements not available!</p>
          <button
            onClick={() => setScreen('main-hub')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            Back to Hub
          </button>
        </div>
      </div>
    );
  }

  const filteredAchievements =
    selectedCategory === 'all'
      ? achievements
      : getAchievementsByCategory(achievements, selectedCategory);

  const achievedCount = achievements.filter((a) => a.achieved).length;
  const totalCount = achievements.length;

  const categories: {
    key: AchievementCategory | 'all';
    name: string;
    icon: string;
  }[] = [
    { key: 'all', name: 'All', icon: '🏆' },
    { key: 'relationship', name: 'Relationships', icon: '💕' },
    { key: 'dating', name: 'Dating', icon: '🌹' },
    { key: 'conversation', name: 'Social', icon: '💬' },
    { key: 'collection', name: 'Collection', icon: '📸' },
    { key: 'exploration', name: 'Exploration', icon: '🗺️' },
    { key: 'mastery', name: 'Mastery', icon: '⭐' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Achievements</h1>
              <p className="text-gray-300">
                {achievedCount} of {totalCount} achievements unlocked (
                {Math.round((achievedCount / totalCount) * 100)}%)
              </p>
            </div>
            <button
              onClick={() => setScreen('main-hub')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Back to Hub
            </button>
          </div>

          {/* Overall Progress */}
          <div className="bg-slate-900 rounded-lg p-6 mb-8 text-white">
            <h3 className="text-lg font-semibold mb-4 text-purple-300">
              Overall Progress
            </h3>
            <div className="w-full bg-gray-700 rounded-full h-4 mb-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(achievedCount / totalCount) * 100}%` }}
              ></div>
            </div>
            <div className="text-center text-sm text-gray-300">
              {achievedCount} / {totalCount} achievements completed
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => {
              const categoryAchievements =
                category.key === 'all'
                  ? achievements
                  : getAchievementsByCategory(
                      achievements,
                      category.key as AchievementCategory
                    );
              const categoryAchieved = categoryAchievements.filter(
                (a) => a.achieved
              ).length;

              return (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    selectedCategory === category.key
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                  <span className="text-xs bg-black/20 px-2 py-1 rounded">
                    {categoryAchieved}/{categoryAchievements.length}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`rounded-lg p-6 border-2 transition-all duration-300 ${
                  achievement.achieved
                    ? 'bg-gradient-to-br from-purple-900/50 to-pink-900/50 border-purple-400 shadow-lg shadow-purple-500/20'
                    : 'bg-slate-900 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`text-4xl flex-shrink-0 ${
                      achievement.achieved
                        ? 'grayscale-0'
                        : 'grayscale opacity-50'
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-lg font-semibold mb-2 ${
                        achievement.achieved ? 'text-white' : 'text-gray-300'
                      }`}
                    >
                      {achievement.name}
                    </h3>
                    <p
                      className={`text-sm mb-3 ${
                        achievement.achieved ? 'text-gray-200' : 'text-gray-400'
                      }`}
                    >
                      {achievement.description}
                    </p>

                    {/* Progress Bar */}
                    {!achievement.achieved && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                          <span>Progress</span>
                          <span>{achievement.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Achievement Date */}
                    {achievement.achieved && achievement.achievedDate && (
                      <div className="text-xs text-purple-300 mb-2">
                        ✨ Unlocked:{' '}
                        {achievement.achievedDate.toLocaleDateString()}
                      </div>
                    )}

                    {/* Reward */}
                    {achievement.reward && (
                      <div
                        className={`text-xs p-2 rounded border-l-4 ${
                          achievement.achieved
                            ? 'bg-green-900/30 border-green-400 text-green-300'
                            : 'bg-yellow-900/30 border-yellow-400 text-yellow-300'
                        }`}
                      >
                        <div className="font-semibold mb-1">
                          {achievement.achieved
                            ? '🎁 Reward Unlocked:'
                            : '🎁 Reward:'}
                        </div>
                        <div>{achievement.reward.description}</div>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="mt-3">
                      <span className="px-2 py-1 bg-slate-700 text-gray-300 text-xs rounded capitalize">
                        {achievement.category}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredAchievements.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏆</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No achievements in this category
              </h3>
              <p className="text-gray-400">
                Try a different category to see more achievements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
