import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Character, CharacterMood } from '../types/game';
import { CharacterId } from '../types/brandedTypes';
import { CHARACTERS } from '../data/characters';
import { CharacterRepository } from '../data/repositories/CharacterRepository';
import { Validators } from '../utils/validators';
import { Logger } from '../services/Logger';
import { AsyncOperationManager } from '../utils/AsyncOperationManager';
import { asyncOperationKeys, asyncDelays } from '../constants/gameConstants';

interface CharacterStore {
  characters: Character[];
  selectedCharacter: Character | null;
  
  // Actions
  selectCharacter: (id: CharacterId) => void;
  updateAffection: (id: CharacterId, amount: number) => void;
  updateMood: (id: CharacterId, mood: CharacterMood) => void;
  updateCharacter: (id: CharacterId, updates: Partial<Character>) => void;
  updateLastInteractionDate: (id: CharacterId) => void;
  canTalkToCharacterToday: (id: CharacterId) => boolean;
  useDailyInteraction: (id: CharacterId) => boolean;
  refreshDailyMoods: () => void;
  resetCharacters: () => void;
  
  // Queries
  findCharacterById: (id: CharacterId) => Character | null;
  getRemainingInteractions: (id: CharacterId) => number;
}

export const useCharacterStore = create<CharacterStore>()(
  persist(
    (set, get) => ({
      characters: [...CHARACTERS],
      selectedCharacter: null,

      selectCharacter: (id) => {
        try {
          const validId = Validators.validateCharacterId(id);
          const characterRepo = CharacterRepository.getInstance();
          const character = characterRepo.findById(get().characters, validId);
          
          set({ selectedCharacter: character });
          
          // Schedule async info unlock
          if (character) {
            AsyncOperationManager.scheduleOperation(
              asyncOperationKeys.CHARACTER_INFO_UNLOCK(validId),
              () => {
                // Unlock basic info on first interaction
                const updatedCharacters = get().characters.map(c => 
                  c.id === validId 
                    ? { 
                        ...c, 
                        knownInfo: { 
                          ...c.knownInfo, 
                          species: true, 
                          basicPersonality: true 
                        } 
                      }
                    : c
                );
                set({ 
                  characters: updatedCharacters,
                  selectedCharacter: updatedCharacters.find(c => c.id === validId) || null
                });
              },
              asyncDelays.IMMEDIATE
            );
          }
        } catch (error) {
          Logger.error(`Failed to select character: ${id}`, error);
        }
      },

      updateAffection: (id, amount) => {
        try {
          const validId = Validators.validateCharacterId(id);
          const validAmount = Validators.validateAffectionAmount(amount);
          const characterRepo = CharacterRepository.getInstance();
          
          const updatedCharacters = characterRepo.updateAffection(get().characters, validId, validAmount);
          const updatedSelectedCharacter = get().selectedCharacter?.id === validId
            ? updatedCharacters.find(c => c.id === validId) || get().selectedCharacter
            : get().selectedCharacter;
          
          set({
            characters: updatedCharacters,
            selectedCharacter: updatedSelectedCharacter
          });
          
          // Schedule related updates
          AsyncOperationManager.scheduleOperation(
            asyncOperationKeys.BATCH_UPDATE(`affection-${validId}`),
            () => {
              // Trigger knowledge and storyline updates
              Logger.debug(`Batch updating after affection change for character ${validId}`);
            },
            asyncDelays.DEBOUNCE_SHORT
          );
          
        } catch (error) {
          Logger.error(`Failed to update affection for character ${id}`, error);
        }
      },

      updateMood: (id, mood) => {
        try {
          const validId = Validators.validateCharacterId(id);
          const characterRepo = CharacterRepository.getInstance();
          
          const updatedCharacters = characterRepo.updateMood(get().characters, validId, mood);
          const updatedSelectedCharacter = get().selectedCharacter?.id === validId
            ? updatedCharacters.find(c => c.id === validId) || get().selectedCharacter
            : get().selectedCharacter;
          
          set({
            characters: updatedCharacters,
            selectedCharacter: updatedSelectedCharacter
          });
        } catch (error) {
          Logger.error(`Failed to update mood for character ${id}`, error);
        }
      },

      updateCharacter: (id, updates) => {
        try {
          const validId = Validators.validateCharacterId(id);
          
          const updatedCharacters = get().characters.map(character =>
            character.id === validId
              ? { ...character, ...updates }
              : character
          );
          
          const updatedSelectedCharacter = get().selectedCharacter?.id === validId
            ? updatedCharacters.find(c => c.id === validId) || get().selectedCharacter
            : get().selectedCharacter;
          
          set({
            characters: updatedCharacters,
            selectedCharacter: updatedSelectedCharacter
          });
        } catch (error) {
          Logger.error(`Failed to update character ${id}`, error);
        }
      },

      updateLastInteractionDate: (id) => {
        try {
          const validId = Validators.validateCharacterId(id);
          const characterRepo = CharacterRepository.getInstance();
          
          const updatedCharacters = characterRepo.updateLastInteractionDate(get().characters, validId);
          
          set({ characters: updatedCharacters });
        } catch (error) {
          Logger.error(`Failed to update last interaction date for character ${id}`, error);
        }
      },

      canTalkToCharacterToday: (id) => {
        try {
          const validId = Validators.validateCharacterId(id);
          const character = get().findCharacterById(validId);
          
          if (!character) return false;
          
          const characterRepo = CharacterRepository.getInstance();
          return characterRepo.canInteractToday(character);
        } catch (error) {
          Logger.error(`Failed to check if can talk to character ${id}`, error);
          return false;
        }
      },

      useDailyInteraction: (id) => {
        try {
          const validId = Validators.validateCharacterId(id);
          
          if (!get().canTalkToCharacterToday(validId)) {
            return false;
          }
          
          const characterRepo = CharacterRepository.getInstance();
          const updatedCharacters = characterRepo.useDailyInteraction(get().characters, validId);
          
          set({ characters: updatedCharacters });
          return true;
        } catch (error) {
          Logger.error(`Failed to use daily interaction for character ${id}`, error);
          return false;
        }
      },

      refreshDailyMoods: () => {
        try {
          const moods = ['cheerful', 'melancholy', 'romantic', 'analytical', 'adventurous', 'neutral'] as const;
          const getRandomMood = () => moods[Math.floor(Math.random() * moods.length)];
          
          const updatedCharacters = get().characters.map(char => ({
            ...char,
            mood: getRandomMood()
          }));
          
          const updatedSelectedCharacter = get().selectedCharacter
            ? { ...get().selectedCharacter!, mood: getRandomMood() }
            : get().selectedCharacter;
          
          set({
            characters: updatedCharacters,
            selectedCharacter: updatedSelectedCharacter
          });
        } catch (error) {
          Logger.error('Failed to refresh daily moods', error);
        }
      },

      resetCharacters: () => {
        set({
          characters: [...CHARACTERS],
          selectedCharacter: null
        });
      },

      // Query methods
      findCharacterById: (id) => {
        try {
          const validId = Validators.validateCharacterId(id);
          const characterRepo = CharacterRepository.getInstance();
          return characterRepo.findById(get().characters, validId);
        } catch (error) {
          Logger.error(`Failed to find character by ID: ${id}`, error);
          return null;
        }
      },

      getRemainingInteractions: (id) => {
        try {
          const character = get().findCharacterById(id);
          if (!character) return 0;
          
          const characterRepo = CharacterRepository.getInstance();
          return characterRepo.getRemainingInteractions(character);
        } catch (error) {
          Logger.error(`Failed to get remaining interactions for character ${id}`, error);
          return 0;
        }
      }
    }),
    {
      name: 'character-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
