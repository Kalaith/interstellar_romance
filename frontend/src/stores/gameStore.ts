import { create } from 'zustand';
import { GameScreen, PlayerCharacter, Character, CharacterMood, Achievement, DateHistoryEntry } from '../types/game';
import { CHARACTERS } from '../data/characters';
import { getRandomMood } from '../data/moods';
import { checkMilestones } from '../data/milestones';
import { ACHIEVEMENTS, checkAchievements } from '../data/achievements';
import { checkPhotoUnlocks } from '../data/photo-galleries';

interface GameState {
  currentScreen: GameScreen;
  currentWeek: number;
  player: PlayerCharacter | null;
  characters: Character[];
  selectedCharacter: Character | null;
  selectedActivities: string[];
  achievements: Achievement[];
  totalConversations: number;
  totalDates: number;

  // Actions
  setScreen: (screen: GameScreen) => void;
  createPlayer: (player: PlayerCharacter) => void;
  selectCharacter: (characterId: string) => void;
  updateAffection: (characterId: string, amount: number) => void;
  updateMood: (characterId: string, mood: CharacterMood) => void;
  refreshDailyMoods: () => void;
  checkAndUpdateMilestones: (characterId: string) => void;
  updateLastInteraction: (characterId: string) => void;
  addDateToHistory: (characterId: string, datePlanId: string, affectionGained: number, success: boolean) => void;
  incrementConversations: () => void;
  updateAchievements: () => void;
  isCharacterAvailable: (characterId: string) => boolean;
  getTimeUntilAvailable: (characterId: string) => number;
  toggleActivity: (activityId: string) => void;
  confirmActivities: () => void;
  nextWeek: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
  currentScreen: 'main-menu',
  currentWeek: 1,
  player: null,
  characters: [...CHARACTERS],
  selectedCharacter: null,
  selectedActivities: [],
  achievements: [...ACHIEVEMENTS],
  totalConversations: 0,
  totalDates: 0,

  setScreen: (screen) => set({ currentScreen: screen }),

  createPlayer: (player) => set({ 
    player,
    currentScreen: 'main-hub'
  }),

  selectCharacter: (characterId) => {
    const character = get().characters.find(c => c.id === characterId);
    set({
      selectedCharacter: character || null,
      currentScreen: 'character-profile'
    });
  },

  updateAffection: (characterId, amount) => set((state) => {
    const character = state.characters.find(c => c.id === characterId);
    if (!character) return state;

    const newAffection = Math.max(0, Math.min(100, character.affection + amount));

    const updatedCharacters = state.characters.map(char => {
      if (char.id === characterId) {
        const updatedChar = { ...char, affection: newAffection };
        // Check milestones when affection changes
        updatedChar.milestones = checkMilestones(newAffection, char.milestones);
        // Check photo unlocks
        updatedChar.photoGallery = checkPhotoUnlocks(char.photoGallery, newAffection);
        return updatedChar;
      }
      return char;
    });

    const updatedSelectedCharacter = state.selectedCharacter?.id === characterId
      ? updatedCharacters.find(c => c.id === characterId) || state.selectedCharacter
      : state.selectedCharacter;

    // Update achievements after affection change
    setTimeout(() => get().updateAchievements(), 0);

    return {
      characters: updatedCharacters,
      selectedCharacter: updatedSelectedCharacter
    };
  }),

  updateMood: (characterId, mood) => set((state) => ({
    characters: state.characters.map(char =>
      char.id === characterId ? { ...char, mood } : char
    ),
    selectedCharacter: state.selectedCharacter?.id === characterId
      ? { ...state.selectedCharacter, mood }
      : state.selectedCharacter
  })),

  refreshDailyMoods: () => set((state) => ({
    characters: state.characters.map(char => ({
      ...char,
      mood: getRandomMood()
    })),
    selectedCharacter: state.selectedCharacter
      ? { ...state.selectedCharacter, mood: getRandomMood() }
      : state.selectedCharacter
  })),

  checkAndUpdateMilestones: (characterId) => set((state) => {
    const character = state.characters.find(c => c.id === characterId);
    if (!character) return state;

    const updatedMilestones = checkMilestones(character.affection, character.milestones);

    return {
      characters: state.characters.map(char =>
        char.id === characterId ? { ...char, milestones: updatedMilestones } : char
      ),
      selectedCharacter: state.selectedCharacter?.id === characterId
        ? { ...state.selectedCharacter, milestones: updatedMilestones }
        : state.selectedCharacter
    };
  }),

  updateLastInteraction: (characterId) => set((state) => ({
    characters: state.characters.map(char =>
      char.id === characterId ? { ...char, lastInteraction: new Date() } : char
    ),
    selectedCharacter: state.selectedCharacter?.id === characterId
      ? { ...state.selectedCharacter, lastInteraction: new Date() }
      : state.selectedCharacter
  })),

  isCharacterAvailable: (characterId) => {
    const state = get();
    const character = state.characters.find(c => c.id === characterId);
    if (!character || !character.lastInteraction || !character.interactionCooldown) return true;

    const timeSinceLastInteraction = Date.now() - character.lastInteraction.getTime();
    const cooldownMs = character.interactionCooldown * 60 * 1000; // Convert minutes to milliseconds
    return timeSinceLastInteraction >= cooldownMs;
  },

  getTimeUntilAvailable: (characterId) => {
    const state = get();
    const character = state.characters.find(c => c.id === characterId);
    if (!character || !character.lastInteraction || !character.interactionCooldown) return 0;

    const timeSinceLastInteraction = Date.now() - character.lastInteraction.getTime();
    const cooldownMs = character.interactionCooldown * 60 * 1000;
    const timeRemaining = cooldownMs - timeSinceLastInteraction;
    return Math.max(0, Math.ceil(timeRemaining / (60 * 1000))); // Return minutes remaining
  },

  addDateToHistory: (characterId, datePlanId, affectionGained, success) => set((state) => {
    const dateEntry: DateHistoryEntry = {
      id: `date_${Date.now()}`,
      datePlanId,
      date: new Date(),
      success,
      affectionGained,
      compatibilityAtTime: 75, // Would calculate this properly
      playerLevel: 1, // Would track this
      notes: undefined
    };

    const updatedCharacters = state.characters.map(char =>
      char.id === characterId
        ? { ...char, dateHistory: [...char.dateHistory, dateEntry] }
        : char
    );

    const updatedSelectedCharacter = state.selectedCharacter?.id === characterId
      ? updatedCharacters.find(c => c.id === characterId) || state.selectedCharacter
      : state.selectedCharacter;

    // Update achievements after date
    setTimeout(() => get().updateAchievements(), 0);

    return {
      characters: updatedCharacters,
      selectedCharacter: updatedSelectedCharacter,
      totalDates: state.totalDates + 1
    };
  }),

  incrementConversations: () => set((state) => {
    // Update achievements after conversation
    setTimeout(() => get().updateAchievements(), 0);
    return { totalConversations: state.totalConversations + 1 };
  }),

  updateAchievements: () => set((state) => {
    if (!state.player) return state;

    const stats = {
      totalAffection: state.characters.reduce((sum, char) => sum + char.affection, 0),
      maxAffection: Math.max(...state.characters.map(char => char.affection)),
      totalDates: state.totalDates,
      totalConversations: state.totalConversations,
      unlockedPhotos: state.characters.reduce((sum, char) => sum + char.photoGallery.filter(p => p.unlocked).length, 0),
      maxCompatibility: 75, // Would calculate this properly
      unlockedMilestones: state.characters.reduce((sum, char) => sum + char.milestones.filter(m => m.achieved).length, 0),
      characterAffections: state.characters.reduce((acc, char) => ({ ...acc, [char.id]: char.affection }), {} as Record<string, number>)
    };

    const updatedAchievements = checkAchievements(state.achievements, stats);

    return { achievements: updatedAchievements };
  }),

  toggleActivity: (activityId) => set((state) => {
    const isSelected = state.selectedActivities.includes(activityId);
    const newSelected = isSelected
      ? state.selectedActivities.filter(id => id !== activityId)
      : state.selectedActivities.length < 2
        ? [...state.selectedActivities, activityId]
        : state.selectedActivities;
    
    return { selectedActivities: newSelected };
  }),

  confirmActivities: () => set((state) => {
    // Refresh moods for the new week
    const updatedCharacters = state.characters.map(char => ({
      ...char,
      mood: getRandomMood()
    }));

    // Update achievements after week progression
    setTimeout(() => get().updateAchievements(), 0);

    return {
      selectedActivities: [],
      currentWeek: state.currentWeek + 1,
      currentScreen: 'main-hub',
      characters: updatedCharacters,
      selectedCharacter: state.selectedCharacter
        ? { ...state.selectedCharacter, mood: getRandomMood() }
        : state.selectedCharacter
    };
  }),

  nextWeek: () => set((state) => ({
    currentWeek: state.currentWeek + 1
  }))
}));
