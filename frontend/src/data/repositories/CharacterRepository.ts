import { Character, RelationshipMilestone, CharacterPhoto } from '../../types/game';
import { CharacterId, AffectionLevel, createAffectionLevel } from '../../types/brandedTypes';
import { Validators } from '../../utils/validators';
import { Logger } from '../../services/Logger';
import { calculateMaxInteractions } from '../characters';
import { checkMilestones } from '../milestones';
import { checkPhotoUnlocks } from '../photo-galleries';

export class CharacterRepository {
  private static instance: CharacterRepository;
  
  static getInstance(): CharacterRepository {
    if (!this.instance) {
      this.instance = new CharacterRepository();
    }
    return this.instance;
  }
  
  findById(characters: Character[], id: CharacterId): Character | null {
    try {
      const validId = Validators.validateCharacterId(id);
      const character = characters.find(c => c.id === validId);
      
      if (!character) {
        Logger.warn(`Character not found: ${id}`);
        return null;
      }
      
      return character;
    } catch (error) {
      Logger.error(`Failed to find character by ID: ${id}`, error);
      return null;
    }
  }
  
  updateAffection(characters: Character[], id: CharacterId, amount: number): Character[] {
    try {
      const validId = Validators.validateCharacterId(id);
      const validAmount = Validators.validateAffectionAmount(amount);
      
      return characters.map(character => {
        if (character.id === validId) {
          const newAffectionValue = Math.max(0, Math.min(100, character.affection + validAmount));
          const newAffection = createAffectionLevel(newAffectionValue);
          
          const updatedCharacter = {
            ...character,
            affection: newAffection,
            // Update related properties
            dailyInteractions: {
              ...character.dailyInteractions,
              maxInteractions: calculateMaxInteractions(newAffection)
            },
            // Check for milestone achievements
            milestones: this.checkMilestones(character.milestones, newAffection),
            // Update photo unlocks
            photoGallery: this.checkPhotoUnlocks(character.photoGallery, newAffection)
          };
          
          Logger.debug(`Updated affection for ${character.name}: ${character.affection} -> ${newAffection}`);
          return updatedCharacter;
        }
        return character;
      });
    } catch (error) {
      Logger.error(`Failed to update affection for character ${id}`, error);
      return characters; // Return unchanged on error
    }
  }
  
  updateMood(characters: Character[], id: CharacterId, mood: string): Character[] {
    try {
      const validId = Validators.validateCharacterId(id);
      
      return characters.map(character => {
        if (character.id === validId) {
          Logger.debug(`Updated mood for ${character.name}: ${character.mood} -> ${mood}`);
          return { ...character, mood: mood as any };
        }
        return character;
      });
    } catch (error) {
      Logger.error(`Failed to update mood for character ${id}`, error);
      return characters;
    }
  }
  
  useDailyInteraction(characters: Character[], id: CharacterId): Character[] {
    try {
      const validId = Validators.validateCharacterId(id);
      
      return characters.map(character => {
        if (character.id === validId) {
          if (character.dailyInteractions.interactionsUsed >= character.dailyInteractions.maxInteractions) {
            Logger.warn(`No daily interactions remaining for character ${character.name}`);
            return character;
          }
          
          const updatedInteractions = {
            ...character.dailyInteractions,
            interactionsUsed: character.dailyInteractions.interactionsUsed + 1
          };
          
          Logger.debug(`Used daily interaction for ${character.name}: ${updatedInteractions.interactionsUsed}/${updatedInteractions.maxInteractions}`);
          
          return {
            ...character,
            dailyInteractions: updatedInteractions
          };
        }
        return character;
      });
    } catch (error) {
      Logger.error(`Failed to use daily interaction for character ${id}`, error);
      return characters;
    }
  }
  
  resetDailyInteractions(characters: Character[], timezone: string): Character[] {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      
      return characters.map(character => {
        const updatedInteractions = {
          ...character.dailyInteractions,
          lastResetDate: currentDate,
          interactionsUsed: 0,
          timezone
        };
        
        return {
          ...character,
          dailyInteractions: updatedInteractions
        };
      });
    } catch (error) {
      Logger.error('Failed to reset daily interactions', error);
      return characters;
    }
  }
  
  updateLastInteractionDate(characters: Character[], id: CharacterId): Character[] {
    try {
      const validId = Validators.validateCharacterId(id);
      const today = new Date().toISOString().split('T')[0];
      
      return characters.map(character => {
        if (character.id === validId) {
          return { ...character, lastInteractionDate: today };
        }
        return character;
      });
    } catch (error) {
      Logger.error(`Failed to update last interaction date for character ${id}`, error);
      return characters;
    }
  }
  
  private checkMilestones(
    milestones: RelationshipMilestone[], 
    affection: AffectionLevel
  ): RelationshipMilestone[] {
    try {
      return milestones.map(milestone => {
        const shouldAchieve = affection >= milestone.unlockedAt && !milestone.achieved;
        
        if (shouldAchieve) {
          Logger.info(`Milestone achieved: ${milestone.name}`);
          return {
            ...milestone,
            achieved: true,
            achievedDate: new Date()
          };
        }
        
        return milestone;
      });
    } catch (error) {
      Logger.error('Failed to check milestones', error);
      return milestones;
    }
  }
  
  private checkPhotoUnlocks(
    photoGallery: CharacterPhoto[], 
    affection: AffectionLevel
  ): CharacterPhoto[] {
    try {
      return photoGallery.map(photo => {
        const shouldUnlock = affection >= photo.unlockedAt && !photo.unlocked;
        
        if (shouldUnlock) {
          Logger.info(`Photo unlocked: ${photo.title}`);
          return {
            ...photo,
            unlocked: true,
            unlockedDate: new Date()
          };
        }
        
        return photo;
      });
    } catch (error) {
      Logger.error('Failed to check photo unlocks', error);
      return photoGallery;
    }
  }
  
  canInteractToday(character: Character): boolean {
    try {
      Validators.validateCharacterExists(character);
      return character.dailyInteractions.interactionsUsed < character.dailyInteractions.maxInteractions;
    } catch (error) {
      Logger.error(`Failed to check if can interact today for character ${character?.id}`, error);
      return false;
    }
  }
  
  getRemainingInteractions(character: Character): number {
    try {
      Validators.validateCharacterExists(character);
      return Math.max(0, character.dailyInteractions.maxInteractions - character.dailyInteractions.interactionsUsed);
    } catch (error) {
      Logger.error(`Failed to get remaining interactions for character ${character?.id}`, error);
      return 0;
    }
  }
}