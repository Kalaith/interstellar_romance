// Optimized game hooks with memoization

import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { Character, GameScreen } from '../types/game';
import { CharacterLookup, memoize, debounce } from '../utils/performanceUtils';

// Optimized character selection with memoization
export const useOptimizedCharacters = () => {
  const characters = useGameStore((state) => state.characters);
  const characterLookupRef = useRef<CharacterLookup | null>(null);

  // Create or update character lookup map
  const characterLookup = useMemo(() => {
    if (!characterLookupRef.current) {
      characterLookupRef.current = new CharacterLookup(characters);
    } else {
      characterLookupRef.current.updateCharacters(characters);
    }
    return characterLookupRef.current;
  }, [characters]);

  const getCharacter = useCallback(
    (id: string): Character | undefined => {
      return characterLookup.getCharacter(id);
    },
    [characterLookup]
  );

  const getCharactersByAffectionRange = useCallback(
    (min: number, max: number): Character[] => {
      return characterLookup.getCharactersByAffectionRange(min, max);
    },
    [characterLookup]
  );

  const getHighestAffectionCharacter = useCallback((): Character | null => {
    return characterLookup.getHighestAffectionCharacter();
  }, [characterLookup]);

  const getTotalAffection = useCallback((): number => {
    return characterLookup.getTotalAffection();
  }, [characterLookup]);

  return {
    characters: characterLookup.getAllCharacters(),
    getCharacter,
    getCharactersByAffectionRange,
    getHighestAffectionCharacter,
    getTotalAffection,
    hasCharacter: characterLookup.hasCharacter.bind(characterLookup),
  };
};

// Memoized dialogue options calculation
export const useDialogueOptions = () => {
  const selectedCharacter = useGameStore((state) => state.selectedCharacter);

  // Memoize expensive dialogue calculations
  const getAvailableOptions = useMemo(() => {
    return memoize(
      (character: Character | null) => {
        if (!character) return [];

        // This would normally call getAvailableDialogueOptions
        // For now, return empty array as placeholder
        return [];
      },
      (character) =>
        `${character?.id || 'none'}-${character?.affection || 0}-${character?.mood || 'none'}`
    );
  }, []);

  return useMemo(() => {
    return getAvailableOptions(selectedCharacter);
  }, [getAvailableOptions, selectedCharacter]);
};

// Debounced affection updates
export const useDebouncedAffectionUpdate = (delay: number = 300) => {
  const updateAffection = useGameStore((state) => state.updateAffection);

  const debouncedUpdate = useMemo(() => {
    return debounce((characterId: string, amount: number) => {
      updateAffection(characterId, amount);
    }, delay);
  }, [updateAffection, delay]);

  return debouncedUpdate;
};

// Optimized screen navigation
export const useOptimizedNavigation = () => {
  const setScreen = useGameStore((state) => state.setScreen);
  const currentScreen = useGameStore((state) => state.currentScreen);

  const navigateToScreen = useCallback(
    (screen: GameScreen) => {
      if (currentScreen !== screen) {
        setScreen(screen);
      }
    },
    [setScreen, currentScreen]
  );

  const canNavigate = useCallback(
    (screen: GameScreen) => {
      return currentScreen !== screen;
    },
    [currentScreen]
  );

  return {
    navigateToScreen,
    canNavigate,
    currentScreen,
  };
};

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    const now = Date.now();
    const timeSinceLastRender = now - lastRenderTime.current;
    lastRenderTime.current = now;

    if (process.env.NODE_ENV === 'development') {
      console.debug(
        `${componentName} render #${renderCount.current}, time since last: ${timeSinceLastRender}ms`
      );
    }
  });

  const logSlowOperation = useCallback(
    (operationName: string, startTime: number) => {
      const duration = Date.now() - startTime;
      if (duration > 16) {
        // Slower than 60fps
        console.warn(
          `Slow operation in ${componentName}: ${operationName} took ${duration}ms`
        );
      }
    },
    [componentName]
  );

  return { logSlowOperation };
};

// Optimized storyline management
export const useOptimizedStorylines = () => {
  const availableStorylines = useGameStore(
    (state) => state.availableStorylines
  );
  const selectedCharacter = useGameStore((state) => state.selectedCharacter);

  const characterStorylines = useMemo(() => {
    if (!selectedCharacter) return [];
    return availableStorylines[selectedCharacter.id] || [];
  }, [availableStorylines, selectedCharacter?.id]);

  const unlockedStorylines = useMemo(() => {
    return characterStorylines.filter(
      (storyline) => storyline.unlocked && !storyline.completed
    );
  }, [characterStorylines]);

  const completedStorylines = useMemo(() => {
    return characterStorylines.filter((storyline) => storyline.completed);
  }, [characterStorylines]);

  return {
    allStorylines: characterStorylines,
    unlockedStorylines,
    completedStorylines,
    hasUnlockedStorylines: unlockedStorylines.length > 0,
    completionRate:
      characterStorylines.length > 0
        ? (completedStorylines.length / characterStorylines.length) * 100
        : 0,
  };
};

// Memoized achievement calculations
export const useOptimizedAchievements = () => {
  const achievements = useGameStore((state) => state.achievements);
  const characters = useGameStore((state) => state.characters);
  const totalDates = useGameStore((state) => state.totalDates);
  const totalConversations = useGameStore((state) => state.totalConversations);

  const achievementStats = useMemo(() => {
    const unlockedAchievements = achievements.filter((a) => a.achieved);
    // Note: points system not implemented yet, setting to 0
    const totalPoints = 0;
    const completionRate =
      achievements.length > 0
        ? (unlockedAchievements.length / achievements.length) * 100
        : 0;

    return {
      unlocked: unlockedAchievements,
      total: achievements,
      totalPoints,
      completionRate,
      unlockedCount: unlockedAchievements.length,
      totalCount: achievements.length,
    };
  }, [achievements]);

  const gameStats = useMemo(() => {
    const totalAffection = characters.reduce(
      (sum, char) => sum + char.affection,
      0
    );
    const maxAffection = Math.max(...characters.map((char) => char.affection));
    const averageAffection =
      characters.length > 0 ? totalAffection / characters.length : 0;

    return {
      totalAffection,
      maxAffection,
      averageAffection,
      totalDates,
      totalConversations,
      charactersAtMaxAffection: characters.filter((c) => c.affection >= 100)
        .length,
    };
  }, [characters, totalDates, totalConversations]);

  return {
    achievements: achievementStats,
    gameStats,
  };
};
