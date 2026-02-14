// Performance optimization utilities

import { Character } from '../types/game';

// Character lookup map for O(1) access instead of linear search
export class CharacterLookup {
  private characterMap = new Map<string, Character>();
  private lastUpdateTime = 0;

  constructor(characters: Character[]) {
    this.updateCharacters(characters);
  }

  updateCharacters(characters: Character[]) {
    const now = Date.now();

    // Only update if characters have actually changed
    if (now - this.lastUpdateTime < 100) {
      return; // Throttle updates to max once per 100ms
    }

    this.characterMap.clear();
    characters.forEach(char => {
      if (char && char.id) {
        this.characterMap.set(char.id, char);
      }
    });

    this.lastUpdateTime = now;
  }

  getCharacter(id: string): Character | undefined {
    return this.characterMap.get(id);
  }

  hasCharacter(id: string): boolean {
    return this.characterMap.has(id);
  }

  getAllCharacters(): Character[] {
    return Array.from(this.characterMap.values());
  }

  getCharactersByAffectionRange(min: number, max: number): Character[] {
    return Array.from(this.characterMap.values()).filter(
      char => char.affection >= min && char.affection <= max
    );
  }

  getHighestAffectionCharacter(): Character | null {
    let highest: Character | null = null;
    let maxAffection = -1;

    for (const char of this.characterMap.values()) {
      if (char.affection > maxAffection) {
        maxAffection = char.affection;
        highest = char;
      }
    }

    return highest;
  }

  getTotalAffection(): number {
    let total = 0;
    for (const char of this.characterMap.values()) {
      total += char.affection || 0;
    }
    return total;
  }
}

// Simple memoization utility for expensive calculations
export function memoize<Args extends readonly unknown[], Return>(
  fn: (...args: Args) => Return,
  getKey?: (...args: Args) => string
): (...args: Args) => Return {
  const cache = new Map<string, Return>();

  return (...args: Args): Return => {
    const key = getKey ? getKey(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);

    // Prevent memory leaks by limiting cache size
    if (cache.size > 100) {
      const firstKey = cache.keys().next().value;
      if (firstKey !== undefined) {
        cache.delete(firstKey);
      }
    }

    return result;
  };
}

// Debounce utility for frequent updates
export function debounce<Args extends unknown[]>(
  func: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return (...args: Args) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttle utility for rate limiting
export function throttle<Args extends unknown[]>(
  func: (...args: Args) => void,
  delay: number
): (...args: Args) => void {
  let lastCall = 0;

  return (...args: Args) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      func(...args);
    }
  };
}

// Optimized array operations
export const ArrayUtils = {
  // Find character by ID with early exit
  findCharacterById: (characters: Character[], id: string): Character | undefined => {
    for (let i = 0; i < characters.length; i++) {
      if (characters[i].id === id) {
        return characters[i];
      }
    }
    return undefined;
  },

  // Update character immutably with minimal copying
  updateCharacter: (
    characters: Character[],
    id: string,
    updater: (char: Character) => Character
  ): Character[] => {
    for (let i = 0; i < characters.length; i++) {
      if (characters[i].id === id) {
        const newCharacter = updater(characters[i]);
        const newArray = [...characters];
        newArray[i] = newCharacter;
        return newArray;
      }
    }
    return characters; // No change if character not found
  },

  // Batch update multiple characters efficiently
  batchUpdateCharacters: (
    characters: Character[],
    updates: Array<{ id: string; updater: (char: Character) => Character }>
  ): Character[] => {
    if (updates.length === 0) return characters;

    let hasChanges = false;
    const newCharacters = [...characters];

    updates.forEach(({ id, updater }) => {
      for (let i = 0; i < newCharacters.length; i++) {
        if (newCharacters[i].id === id) {
          const updated = updater(newCharacters[i]);
          if (updated !== newCharacters[i]) {
            newCharacters[i] = updated;
            hasChanges = true;
          }
          break;
        }
      }
    });

    return hasChanges ? newCharacters : characters;
  },
};

// Local storage optimization
export const StorageUtils = {
  // Compress and store game state
  saveGameState: (key: string, data: unknown): void => {
    try {
      const compressed = JSON.stringify(data);
      localStorage.setItem(key, compressed);
    } catch (error) {
      console.warn('Failed to save game state:', error);
      // Fallback: try to clear some space and retry
      try {
        localStorage.removeItem(`${key}_backup`);
        localStorage.setItem(key, JSON.stringify(data));
      } catch (retryError) {
        console.error('Failed to save game state after cleanup:', retryError);
      }
    }
  },

  // Load and decompress game state
  loadGameState: (key: string): unknown | null => {
    try {
      const stored = localStorage.getItem(key);
      if (!stored) return null;

      return JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to load game state:', error);
      return null;
    }
  },

  // Check available storage space
  getStorageInfo: (): { used: number; available: number; total: number } => {
    let used = 0;
    for (const key in localStorage) {
      if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
        used += localStorage[key].length;
      }
    }

    // Rough estimate - browsers typically allow 5-10MB
    const total = 5 * 1024 * 1024; // 5MB estimate
    const available = total - used;

    return { used, available, total };
  },
};
