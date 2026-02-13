import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import {
  getDailyResetInfo,
  getCurrentDateInTimezone,
  formatTimeUntilReset,
  getUserTimezone,
  createEnhancedDailyInteractions,
  migrateDailyInteractionData,
  type DailyResetInfo,
  type EnhancedDailyInteractionData,
} from '../utils/timezoneUtils';
import { calculateMaxInteractions } from '../data/characters';

interface DailyInteractionState {
  interactionsUsed: number;
  maxInteractions: number;
  canInteract: boolean;
  resetInfo: DailyResetInfo;
  timeUntilResetFormatted: string;
}

// Hook for managing daily interactions with timezone support
export const useDailyInteractions = (characterId: string) => {
  const { characters, updateCharacter } = useGameStore();
  const character = characters.find((c) => c.id === characterId);

  const [state, setState] = useState<DailyInteractionState>({
    interactionsUsed: 0,
    maxInteractions: 3,
    canInteract: true,
    resetInfo: {
      lastResetDate: getCurrentDateInTimezone(),
      nextResetTime: new Date(),
      timeUntilReset: 0,
      hasReset: false,
    },
    timeUntilResetFormatted: 'Now',
  });

  const [updateInterval, setUpdateInterval] = useState<ReturnType<
    typeof setInterval
  > | null>(null);

  // Initialize or update daily interaction state
  const updateDailyInteractionState = useCallback(() => {
    if (!character) return;

    let enhancedData: EnhancedDailyInteractionData;

    // Check if we need to migrate old data format
    if (!character.dailyInteractions.timezone) {
      // Migrate old format
      enhancedData = migrateDailyInteractionData(
        character.dailyInteractions,
        character.affection,
        calculateMaxInteractions
      );
    } else {
      // Use existing enhanced format or create new
      enhancedData = createEnhancedDailyInteractions(
        character.affection,
        calculateMaxInteractions,
        {
          lastResetDate: character.dailyInteractions.lastResetDate,
          interactionsUsed: character.dailyInteractions.interactionsUsed,
          timezone: character.dailyInteractions.timezone,
        }
      );
    }

    // Update character if reset occurred or migration happened
    if (
      enhancedData.resetInfo.hasReset ||
      !character.dailyInteractions.timezone
    ) {
      updateCharacter(characterId, {
        dailyInteractions: {
          lastResetDate: enhancedData.lastResetDate,
          interactionsUsed: enhancedData.interactionsUsed,
          maxInteractions: enhancedData.maxInteractions,
          timezone: enhancedData.timezone,
        },
      });
    }

    // Update local state
    setState({
      interactionsUsed: enhancedData.interactionsUsed,
      maxInteractions: enhancedData.maxInteractions,
      canInteract: enhancedData.interactionsUsed < enhancedData.maxInteractions,
      resetInfo: enhancedData.resetInfo,
      timeUntilResetFormatted: formatTimeUntilReset(
        enhancedData.resetInfo.timeUntilReset
      ),
    });
  }, [character, characterId, updateCharacter]);

  // Use an interaction (increments the counter)
  const useInteraction = useCallback(() => {
    if (!character || state.interactionsUsed >= state.maxInteractions) {
      return false;
    }

    const newInteractionsUsed = state.interactionsUsed + 1;

    updateCharacter(characterId, {
      dailyInteractions: {
        ...character.dailyInteractions,
        interactionsUsed: newInteractionsUsed,
      },
    });

    setState((prev) => ({
      ...prev,
      interactionsUsed: newInteractionsUsed,
      canInteract: newInteractionsUsed < prev.maxInteractions,
    }));

    return true;
  }, [
    character,
    characterId,
    state.interactionsUsed,
    state.maxInteractions,
    updateCharacter,
  ]);

  // Get remaining interactions
  const getRemainingInteractions = useCallback(() => {
    return Math.max(0, state.maxInteractions - state.interactionsUsed);
  }, [state.maxInteractions, state.interactionsUsed]);

  // Check if character can be talked to today (no interactions used or still has remaining)
  const canTalkToday = useCallback(() => {
    return state.canInteract;
  }, [state.canInteract]);

  // Get interaction progress as percentage
  const getInteractionProgress = useCallback(() => {
    if (state.maxInteractions === 0) return 100;
    return (state.interactionsUsed / state.maxInteractions) * 100;
  }, [state.interactionsUsed, state.maxInteractions]);

  // Force check for reset (useful for debugging or manual refresh)
  const checkForReset = useCallback(() => {
    updateDailyInteractionState();
  }, [updateDailyInteractionState]);

  // Set up real-time updates for countdown timer
  useEffect(() => {
    updateDailyInteractionState();

    // Clear existing interval
    if (updateInterval) {
      clearInterval(updateInterval);
    }

    // Set up new interval to update every second
    const interval = setInterval(() => {
      if (!character?.dailyInteractions) return;

      const resetInfo = getDailyResetInfo(
        character.dailyInteractions.lastResetDate,
        character.dailyInteractions.timezone || getUserTimezone().timezone
      );

      // If reset occurred, update everything
      if (resetInfo.hasReset) {
        updateDailyInteractionState();
      } else {
        // Just update the countdown
        setState((prev) => ({
          ...prev,
          resetInfo,
          timeUntilResetFormatted: formatTimeUntilReset(
            resetInfo.timeUntilReset
          ),
        }));
      }
    }, 1000);

    setUpdateInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    character?.dailyInteractions.lastResetDate,
    character?.dailyInteractions.timezone,
    updateDailyInteractionState,
  ]);

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    };
  }, [updateInterval]);

  return {
    // State
    interactionsUsed: state.interactionsUsed,
    maxInteractions: state.maxInteractions,
    canInteract: state.canInteract,
    timeUntilReset: state.resetInfo.timeUntilReset,
    timeUntilResetFormatted: state.timeUntilResetFormatted,
    nextResetTime: state.resetInfo.nextResetTime,

    // Actions
    useInteraction,
    checkForReset,

    // Computed values
    remainingInteractions: getRemainingInteractions(),
    canTalkToday: canTalkToday(),
    interactionProgress: getInteractionProgress(),

    // Debug info (useful for development)
    debugInfo: import.meta.env.DEV
      ? {
          lastResetDate: character?.dailyInteractions.lastResetDate,
          timezone: character?.dailyInteractions.timezone || 'Not set',
          hasReset: state.resetInfo.hasReset,
          currentDate: getCurrentDateInTimezone(),
        }
      : undefined,
  };
};

// Hook for managing global daily interaction settings
export const useDailyInteractionSettings = () => {
  const { characters, updateCharacter } = useGameStore();
  const userTimezone = getUserTimezone();

  // Update all characters to use current timezone
  const updateAllCharacterTimezones = useCallback(() => {
    characters.forEach((character) => {
      if (!character.dailyInteractions.timezone) {
        updateCharacter(character.id, {
          dailyInteractions: {
            ...character.dailyInteractions,
            timezone: userTimezone.timezone,
          },
        });
      }
    });
  }, [characters, updateCharacter, userTimezone.timezone]);

  // Reset all daily interactions (for testing purposes)
  const resetAllDailyInteractions = useCallback(() => {
    const currentDate = getCurrentDateInTimezone();
    characters.forEach((character) => {
      updateCharacter(character.id, {
        dailyInteractions: {
          lastResetDate: currentDate,
          interactionsUsed: 0,
          maxInteractions: calculateMaxInteractions(character.affection),
          timezone: userTimezone.timezone,
        },
      });
    });
  }, [characters, updateCharacter, userTimezone.timezone]);

  return {
    userTimezone,
    updateAllCharacterTimezones,
    resetAllDailyInteractions,

    // Character counts for overview
    totalCharacters: characters.length,
    charactersWithInteractions: characters.filter(
      (c) => c.dailyInteractions.interactionsUsed > 0
    ).length,
    charactersAtMaxInteractions: characters.filter(
      (c) =>
        c.dailyInteractions.interactionsUsed >=
        c.dailyInteractions.maxInteractions
    ).length,
  };
};
