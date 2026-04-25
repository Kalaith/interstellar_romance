import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { AchievementCategory } from '../types/game';
import { getAchievementsByCategory } from '../data/achievements';
import { Button } from './ui/Button';
import { ProgressBar } from './ui/ProgressBar';

export const Achievements: React.FC = () => {
  const { player, setScreen, achievements } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all');

  if (!player || !achievements) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-8 text-center">
          <p className="text-xl text-[var(--text-primary)] mb-4">Achievements not available!</p>
          <Button onClick={() => setScreen('main-hub')} variant="primary">
            Back to Hub
          </Button>
        </div>
      </div>
    );
  }

  const filteredAchievements =
    selectedCategory === 'all'
      ? achievements
      : getAchievementsByCategory(achievements, selectedCategory);

  const achievedCount = achievements.filter(a => a.achieved).length;
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
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] uppercase tracking-wide">
                  Achievements
                </h1>
                <p className="text-[var(--text-secondary)]">
                  {achievedCount} of {totalCount} achievements unlocked (
                  {Math.round((achievedCount / totalCount) * 100)}%)
                </p>
              </div>
              <Button onClick={() => setScreen('main-hub')} variant="secondary">
                Back to Hub
              </Button>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4 text-[var(--accent-cyan)] uppercase tracking-wide">
              Overall Progress
            </h3>
            <ProgressBar
              value={(achievedCount / totalCount) * 100}
              variant="progress"
              size="lg"
              showValue
              label={`${achievedCount} / ${totalCount} achievements completed`}
            />
          </div>

          {/* Category Filter */}
          <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map(category => {
                const categoryAchievements =
                  category.key === 'all'
                    ? achievements
                    : getAchievementsByCategory(achievements, category.key as AchievementCategory);
                const categoryAchieved = categoryAchievements.filter(a => a.achieved).length;

                return (
                  <button
                    key={category.key}
                    onClick={() => setSelectedCategory(category.key)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--bg-space)] ${
                      selectedCategory === category.key
                        ? 'bg-[var(--accent-cyan)] text-[var(--bg-space)]'
                        : 'bg-[var(--bg-section)] text-[var(--text-secondary)] hover:bg-[var(--bg-item)] border border-[var(--border-inner)]'
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
          </div>

          {/* Achievements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAchievements.map(achievement => (
              <div
                key={achievement.id}
                className={`rounded-lg p-6 border-2 transition-all duration-300 ${
                  achievement.achieved
                    ? 'bg-[var(--bg-section)] border-[var(--state-available)] shadow-lg shadow-[rgba(46,213,115,0.16)]'
                    : 'bg-[var(--bg-section)] border-[var(--border-inner)] hover:border-[var(--accent-cyan)]'
                }`}
              >
                <div className="flex items-start space-x-4">
                  <div
                    className={`text-4xl flex-shrink-0 ${
                      achievement.achieved ? 'grayscale-0' : 'grayscale opacity-50'
                    }`}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className={`text-lg font-semibold mb-2 ${
                        achievement.achieved
                          ? 'text-[var(--text-primary)]'
                          : 'text-[var(--text-secondary)]'
                      }`}
                    >
                      {achievement.name}
                    </h3>
                    <p
                      className={`text-sm mb-3 ${
                        achievement.achieved
                          ? 'text-[var(--text-secondary)]'
                          : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {achievement.description}
                    </p>

                    {/* Progress Bar */}
                    {!achievement.achieved && (
                      <div className="mb-3">
                        <ProgressBar
                          value={achievement.progress}
                          variant="compatibility"
                          size="sm"
                          showValue
                          label="Progress"
                        />
                      </div>
                    )}

                    {/* Achievement Date */}
                    {achievement.achieved && achievement.achievedDate && (
                      <div className="text-xs text-[var(--accent-teal)] mb-2">
                        ✨ Unlocked: {achievement.achievedDate.toLocaleDateString()}
                      </div>
                    )}

                    {/* Reward */}
                    {achievement.reward && (
                      <div
                        className={`text-xs p-2 rounded border-l-4 ${
                          achievement.achieved
                            ? 'bg-green-900/30 border-green-400 text-green-300'
                            : 'bg-[var(--resource-influence)]/10 border-[var(--resource-influence)] text-[var(--resource-energy)]'
                        }`}
                      >
                        <div className="font-semibold mb-1">
                          {achievement.achieved ? '🎁 Reward Unlocked:' : '🎁 Reward:'}
                        </div>
                        <div>{achievement.reward.description}</div>
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="mt-3">
                      <span className="px-2 py-1 bg-[var(--bg-item)] border border-[var(--border-inner)] text-[var(--text-secondary)] text-xs rounded capitalize">
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
              <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                No achievements in this category
              </h3>
              <p className="text-[var(--text-muted)]">
                Try a different category to see more achievements.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
