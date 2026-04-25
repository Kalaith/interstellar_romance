import { useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';
import {
  formatTimeUntilReset,
  getCurrentDateInTimezone,
  getDailyResetInfo,
  getUserTimezone,
} from '../utils/timezoneUtils';

export const useDailyInteractions = (characterId: string) => {
  const characters = useGameStore(state => state.characters);
  const refreshDailyMoods = useGameStore(state => state.refreshDailyMoods);
  const character = characters.find(candidate => candidate.id === characterId);

  const resetInfo = useMemo(() => {
    if (!character) {
      return getDailyResetInfo(getCurrentDateInTimezone(), getUserTimezone().timezone);
    }

    return getDailyResetInfo(
      character.dailyInteractions.lastResetDate,
      character.dailyInteractions.timezone || getUserTimezone().timezone
    );
  }, [character]);

  const interactionsUsed = character?.dailyInteractions.interactionsUsed ?? 0;
  const maxInteractions = character?.dailyInteractions.maxInteractions ?? 0;
  const remainingInteractions = Math.max(0, maxInteractions - interactionsUsed);
  const canInteract = remainingInteractions > 0;

  return {
    interactionsUsed,
    maxInteractions,
    canInteract,
    timeUntilReset: resetInfo.timeUntilReset,
    timeUntilResetFormatted: formatTimeUntilReset(resetInfo.timeUntilReset),
    nextResetTime: resetInfo.nextResetTime,
    useInteraction: () => canInteract,
    checkForReset: () => void refreshDailyMoods(),
    remainingInteractions,
    canTalkToday: canInteract,
    interactionProgress: maxInteractions === 0 ? 100 : (interactionsUsed / maxInteractions) * 100,
    debugInfo: import.meta.env.DEV
      ? {
          lastResetDate: character?.dailyInteractions.lastResetDate,
          timezone: character?.dailyInteractions.timezone || 'Not set',
          hasReset: resetInfo.hasReset,
          currentDate: getCurrentDateInTimezone(),
        }
      : undefined,
  };
};

export const useDailyInteractionSettings = () => {
  const characters = useGameStore(state => state.characters);
  const refreshDailyMoods = useGameStore(state => state.refreshDailyMoods);
  const userTimezone = getUserTimezone();

  return {
    userTimezone,
    updateAllCharacterTimezones: () => undefined,
    resetAllDailyInteractions: () => void refreshDailyMoods(),
    totalCharacters: characters.length,
    charactersWithInteractions: characters.filter(c => c.dailyInteractions.interactionsUsed > 0)
      .length,
    charactersAtMaxInteractions: characters.filter(
      c => c.dailyInteractions.interactionsUsed >= c.dailyInteractions.maxInteractions
    ).length,
  };
};
