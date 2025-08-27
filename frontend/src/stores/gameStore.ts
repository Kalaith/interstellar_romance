import { create } from 'zustand';
import { GameScreen, PlayerCharacter, Character } from '../types/game';
import { CHARACTERS } from '../data/characters';

interface GameState {
  currentScreen: GameScreen;
  currentWeek: number;
  player: PlayerCharacter | null;
  characters: Character[];
  selectedCharacter: Character | null;
  selectedActivities: string[];
  
  // Actions
  setScreen: (screen: GameScreen) => void;
  createPlayer: (player: PlayerCharacter) => void;
  selectCharacter: (characterId: string) => void;
  updateAffection: (characterId: string, amount: number) => void;
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

  setScreen: (screen) => set({ currentScreen: screen }),

  createPlayer: (player) => set({ 
    player,
    currentScreen: 'main-hub'
  }),

  selectCharacter: (characterId) => {
    const character = get().characters.find(c => c.id === characterId);
    set({ 
      selectedCharacter: character || null,
      currentScreen: 'character-interaction'
    });
  },

  updateAffection: (characterId, amount) => set((state) => ({
    characters: state.characters.map(char =>
      char.id === characterId
        ? { ...char, affection: Math.max(0, Math.min(100, char.affection + amount)) }
        : char
    ),
    selectedCharacter: state.selectedCharacter?.id === characterId
      ? { ...state.selectedCharacter, affection: Math.max(0, Math.min(100, state.selectedCharacter.affection + amount)) }
      : state.selectedCharacter
  })),

  toggleActivity: (activityId) => set((state) => {
    const isSelected = state.selectedActivities.includes(activityId);
    const newSelected = isSelected
      ? state.selectedActivities.filter(id => id !== activityId)
      : state.selectedActivities.length < 2
        ? [...state.selectedActivities, activityId]
        : state.selectedActivities;
    
    return { selectedActivities: newSelected };
  }),

  confirmActivities: () => set((state) => ({
    selectedActivities: [],
    currentWeek: state.currentWeek + 1,
    currentScreen: 'main-hub'
  })),

  nextWeek: () => set((state) => ({
    currentWeek: state.currentWeek + 1
  }))
}));
