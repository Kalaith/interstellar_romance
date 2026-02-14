import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { GameScreen, PlayerCharacter } from '../types/game';
import { Week, createWeek } from '../types/brandedTypes';
import { Validators } from '../utils/validators';
import { Logger } from '../services/Logger';

interface GameStateStore {
  currentScreen: GameScreen;
  currentWeek: Week;
  player: PlayerCharacter | null;
  totalConversations: number;
  totalDates: number;

  // Actions
  setScreen: (screen: GameScreen) => void;
  createPlayer: (player: PlayerCharacter) => void;
  nextWeek: () => void;
  incrementConversations: () => void;
  incrementDates: () => void;
  resetGame: () => void;

  // Queries
  isPlayerCreated: () => boolean;
  getGameStats: () => {
    totalConversations: number;
    totalDates: number;
    currentWeek: Week;
  };
}

const initialState = {
  currentScreen: 'main-menu' as GameScreen,
  currentWeek: createWeek(1),
  player: null,
  totalConversations: 0,
  totalDates: 0,
};

export const useGameStateStore = create<GameStateStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      setScreen: screen => {
        try {
          Logger.debug(`Navigating to screen: ${screen}`);
          set({ currentScreen: screen });
        } catch (error) {
          Logger.error(`Failed to set screen: ${screen}`, error);
        }
      },

      createPlayer: player => {
        try {
          Validators.validatePlayerExists(player);
          Validators.validateStringNotEmpty(player.name, 'player.name');

          Logger.info(`Player created: ${player.name} (${player.species})`);
          set({
            player,
            currentScreen: 'main-hub',
          });
        } catch (error) {
          Logger.error('Failed to create player', error);
        }
      },

      nextWeek: () => {
        try {
          const newWeek = createWeek(get().currentWeek + 1);
          Logger.info(`Advanced to week ${newWeek}`);
          set({ currentWeek: newWeek });
        } catch (error) {
          Logger.error('Failed to advance to next week', error);
        }
      },

      incrementConversations: () => {
        try {
          const newTotal = get().totalConversations + 1;
          Logger.debug(`Incremented conversations to ${newTotal}`);
          set({ totalConversations: newTotal });
        } catch (error) {
          Logger.error('Failed to increment conversations', error);
        }
      },

      incrementDates: () => {
        try {
          const newTotal = get().totalDates + 1;
          Logger.debug(`Incremented dates to ${newTotal}`);
          set({ totalDates: newTotal });
        } catch (error) {
          Logger.error('Failed to increment dates', error);
        }
      },

      resetGame: () => {
        try {
          Logger.info('Resetting game state');

          // Clear localStorage completely
          localStorage.removeItem('character-store');
          localStorage.removeItem('game-state-store');
          localStorage.removeItem('achievement-store');
          localStorage.removeItem('interstellar-romance-game');

          set(initialState);
        } catch (error) {
          Logger.error('Failed to reset game', error);
        }
      },

      // Query methods
      isPlayerCreated: () => {
        return get().player !== null;
      },

      getGameStats: () => {
        const state = get();
        return {
          totalConversations: state.totalConversations,
          totalDates: state.totalDates,
          currentWeek: state.currentWeek,
        };
      },
    }),
    {
      name: 'game-state-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
