// Composed game store that combines all individual stores
import { useCharacterStore } from './characterStore';
import { useGameStateStore } from './gameStateStore';
import { useAchievementStore } from './achievementStore';
import { Logger } from '../services/Logger';
import { Validators } from '../utils/validators';

// Combined store interface for backward compatibility
export const useGameStore = () => {
  const characterStore = useCharacterStore();
  const gameStateStore = useGameStateStore();
  const achievementStore = useAchievementStore();

  // Combined actions that work across stores
  const composedActions = {
    // Batch update that triggers related updates across stores
    batchUpdate: (
      characterId: string,
      updates: {
        achievements?: boolean;
        knowledge?: boolean;
        storylines?: boolean;
      }
    ) => {
      try {
        if (updates.achievements) {
          const gameStats = gameStateStore.getGameStats();
          const characters = characterStore.characters;

          const achievementStats = {
            totalAffection: characters.reduce((sum, char) => sum + char.affection, 0),
            maxAffection: Math.max(...characters.map(char => char.affection)),
            totalDates: gameStats.totalDates,
            totalConversations: gameStats.totalConversations,
            unlockedPhotos: characters.reduce(
              (sum, char) => sum + char.photoGallery.filter(p => p.unlocked).length,
              0
            ),
            maxCompatibility: 75, // Would calculate this properly
            unlockedMilestones: characters.reduce(
              (sum, char) => sum + char.milestones.filter(m => m.achieved).length,
              0
            ),
            characterAffections: characters.reduce(
              (acc, char) => ({ ...acc, [char.id]: char.affection }),
              {} as Record<string, number>
            ),
          };

          achievementStore.updateAchievements(achievementStats);
        }

        if (updates.knowledge && characterId) {
          // Knowledge updates would be handled here
          Logger.debug(`Updating knowledge for character ${characterId}`);
        }

        if (updates.storylines && characterId) {
          // Storyline updates would be handled here
          Logger.debug(`Updating storylines for character ${characterId}`);
        }
      } catch (error) {
        Logger.error('Failed to perform batch update', error);
      }
    },

    // Complete game reset
    resetGame: () => {
      try {
        characterStore.resetCharacters();
        gameStateStore.resetGame();
        achievementStore.resetAchievements();
        Logger.info('Complete game reset performed');
      } catch (error) {
        Logger.error('Failed to reset game completely', error);
      }
    },

    // Enhanced dialogue interaction that updates multiple stores
    processDialogueInteraction: (characterId: string, affectionGain: number) => {
      try {
        const validCharacterId = Validators.validateCharacterId(characterId);
        // Update character affection
        characterStore.updateAffection(validCharacterId, affectionGain);

        // Increment conversation count
        gameStateStore.incrementConversations();

        // Update last interaction date
        characterStore.updateLastInteractionDate(validCharacterId);

        // Use daily interaction
        characterStore.useDailyInteraction(validCharacterId);

        // Trigger batch update for achievements
        composedActions.batchUpdate(characterId, { achievements: true });

        Logger.debug(
          `Processed dialogue interaction for ${characterId}: +${affectionGain} affection`
        );
      } catch (error) {
        Logger.error(`Failed to process dialogue interaction for ${characterId}`, error);
      }
    },

    // Enhanced date interaction
    processDateInteraction: (characterId: string, affectionGain: number, success: boolean) => {
      try {
        const validCharacterId = Validators.validateCharacterId(characterId);
        // Update character affection
        characterStore.updateAffection(validCharacterId, affectionGain);

        // Increment date count
        gameStateStore.incrementDates();

        // Update last interaction date
        characterStore.updateLastInteractionDate(validCharacterId);

        // Trigger batch update for achievements
        composedActions.batchUpdate(characterId, { achievements: true });

        Logger.info(
          `Processed date interaction for ${characterId}: success=${success}, +${affectionGain} affection`
        );
      } catch (error) {
        Logger.error(`Failed to process date interaction for ${characterId}`, error);
      }
    },
  };

  // Return combined store interface
  return {
    // Character store
    ...characterStore,

    // Game state store
    ...gameStateStore,

    // Achievement store
    ...achievementStore,

    // Composed actions
    ...composedActions,
  };
};

// Export individual stores for specific use cases
export { useCharacterStore } from './characterStore';
export { useGameStateStore } from './gameStateStore';
export { useAchievementStore } from './achievementStore';
