import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Achievement } from '../types/game';
import { ACHIEVEMENTS, checkAchievements } from '../data/achievements';
import { Logger } from '../services/Logger';
import { AsyncOperationManager } from '../utils/AsyncOperationManager';
import { ASYNC_OPERATION_KEYS, ASYNC_DELAYS } from '../constants/gameConstants';

interface AchievementStore {
  achievements: Achievement[];
  
  // Actions
  updateAchievements: (gameStats: {
    totalAffection: number;
    maxAffection: number;
    totalDates: number;
    totalConversations: number;
    unlockedPhotos: number;
    maxCompatibility: number;
    unlockedMilestones: number;
    characterAffections: Record<string, number>;
  }) => void;
  resetAchievements: () => void;
  
  // Queries
  getUnlockedAchievements: () => Achievement[];
  getLockedAchievements: () => Achievement[];
  getAchievementById: (id: string) => Achievement | null;
  getTotalAchievementProgress: () => number;
}

export const useAchievementStore = create<AchievementStore>()(
  persist(
    (set, get) => ({
      achievements: [...ACHIEVEMENTS],

      updateAchievements: (gameStats) => {
        try {
          // Use async operation to prevent blocking UI
          AsyncOperationManager.scheduleOperation(
            ASYNC_OPERATION_KEYS.ACHIEVEMENT_UPDATE,
            () => {
              const updatedAchievements = checkAchievements(get().achievements, gameStats);
              
              // Check for newly unlocked achievements
              const previousAchievements = get().achievements;
              const newlyUnlocked = updatedAchievements.filter((achievement, index) => 
                achievement.achieved && !previousAchievements[index].achieved
              );
              
              if (newlyUnlocked.length > 0) {
                newlyUnlocked.forEach(achievement => {
                  Logger.info(`Achievement unlocked: ${achievement.name}`);
                });
              }
              
              set({ achievements: updatedAchievements });
            },
            ASYNC_DELAYS.DEBOUNCE_SHORT
          );
        } catch (error) {
          Logger.error('Failed to update achievements', error);
        }
      },

      resetAchievements: () => {
        try {
          Logger.info('Resetting achievements');
          set({ achievements: [...ACHIEVEMENTS] });
        } catch (error) {
          Logger.error('Failed to reset achievements', error);
        }
      },

      // Query methods
      getUnlockedAchievements: () => {
        return get().achievements.filter(achievement => achievement.achieved);
      },

      getLockedAchievements: () => {
        return get().achievements.filter(achievement => !achievement.achieved);
      },

      getAchievementById: (id) => {
        return get().achievements.find(achievement => achievement.id === id) || null;
      },

      getTotalAchievementProgress: () => {
        const achievements = get().achievements;
        const totalProgress = achievements.reduce((sum, achievement) => sum + achievement.progress, 0);
        return achievements.length > 0 ? Math.round(totalProgress / achievements.length) : 0;
      }
    }),
    {
      name: 'achievement-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);