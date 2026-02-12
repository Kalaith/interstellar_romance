import { Character, PlayerCharacter, SexualPreference, CompatibilityScore } from '../types/game';
import { CharacterId } from '../types/brandedTypes';
import { calculateCompatibility, getCompatibilityLabel } from '../utils/compatibility';
import { filterCharactersByPreference, getPreferenceDescription } from '../utils/character-filtering';
import { Validators } from '../utils/validators';
import { Logger } from '../services/Logger';

export interface CompatibilityDisplay extends CompatibilityScore {
  colorClass: string;
  label: string;
}

export class CharacterService {
  static filterByPreference(characters: Character[], preference: SexualPreference): Character[] {
    try {
      Validators.validateArrayNotEmpty(characters, 'characters');
      return filterCharactersByPreference(characters, preference);
    } catch (error) {
      Logger.error('Failed to filter characters by preference', error);
      return [];
    }
  }
  
  static calculateDisplayCompatibility(
    player: PlayerCharacter, 
    character: Character
  ): CompatibilityDisplay | null {
    try {
      Validators.validatePlayerExists(player);
      Validators.validateCharacterExists(character);
      
      const compatibility = calculateCompatibility(player, character.profile);
      
      return {
        ...compatibility,
        colorClass: this.getCompatibilityColorClass(compatibility.overall),
        label: getCompatibilityLabel(compatibility.overall)
      };
    } catch (error) {
      Logger.error(`Failed to calculate compatibility for character ${character?.id}`, error);
      return null;
    }
  }
  
  static findCharacterById(characters: Character[], id: CharacterId): Character | null {
    try {
      const validId = Validators.validateCharacterId(id);
      const character = characters.find(c => c.id === validId);
      return character || null;
    } catch (error) {
      Logger.error(`Failed to find character by ID: ${id}`, error);
      return null;
    }
  }
  
  static getAvailableInteractions(character: Character): number {
    try {
      Validators.validateCharacterExists(character);
      return Math.max(0, character.dailyInteractions.maxInteractions - character.dailyInteractions.interactionsUsed);
    } catch (error) {
      Logger.error(`Failed to get available interactions for character ${character?.id}`, error);
      return 0;
    }
  }
  
  static canInteractToday(character: Character): boolean {
    return this.getAvailableInteractions(character) > 0;
  }
  
  static getCharactersByAffectionRange(
    characters: Character[], 
    minAffection: number, 
    maxAffection: number = 100
  ): Character[] {
    try {
      Validators.validateArrayNotEmpty(characters, 'characters');
      const validMin = Validators.validateAffectionLevel(minAffection);
      const validMax = Validators.validateAffectionLevel(maxAffection);
      
      return characters.filter(character => 
        character.affection >= validMin && character.affection <= validMax
      );
    } catch (error) {
      Logger.error('Failed to filter characters by affection range', error);
      return [];
    }
  }
  
  static getHighestAffectionCharacter(characters: Character[]): Character | null {
    try {
      Validators.validateArrayNotEmpty(characters, 'characters');
      return characters.reduce((highest, current) => 
        current.affection > highest.affection ? current : highest
      );
    } catch (error) {
      Logger.error('Failed to find highest affection character', error);
      return null;
    }
  }
  
  static getPreferenceDescription(preference: SexualPreference): string {
    try {
      return getPreferenceDescription(preference);
    } catch (error) {
      Logger.error(`Failed to get preference description for: ${preference}`, error);
      return 'Unknown preference';
    }
  }
  
  static getCharacterDisplayName(character: Character): string {
    try {
      Validators.validateCharacterExists(character);
      return character.name || 'Unknown Character';
    } catch (error) {
      Logger.error('Failed to get character display name', error);
      return 'Unknown Character';
    }
  }
  
  static getCharacterMoodDescription(character: Character): string {
    try {
      Validators.validateCharacterExists(character);
      
      if (!character.knownInfo.mood) {
        return 'Mood unknown';
      }
      
      const moodDescriptions = {
        cheerful: 'is in a bright and optimistic mood',
        melancholy: 'seems contemplative and a bit wistful',
        romantic: 'has a dreamy, romantic air about them',
        analytical: 'appears focused and intellectually engaged',
        adventurous: 'seems restless and eager for excitement',
        tired: 'looks a bit weary but still attentive',
        excited: 'is buzzing with energy and enthusiasm',
        neutral: 'appears calm and balanced'
      };
      
      return moodDescriptions[character.mood] || 'has an unreadable mood';
    } catch (error) {
      Logger.error(`Failed to get mood description for character ${character?.id}`, error);
      return 'Mood unknown';
    }
  }
  
  private static getCompatibilityColorClass(score: number): string {
    try {
      const validScore = Validators.validateCompatibilityScore(score);
      
      if (validScore >= 90) return 'text-green-400';
      if (validScore >= 70) return 'text-blue-400';
      if (validScore >= 50) return 'text-yellow-400';
      if (validScore >= 30) return 'text-orange-400';
      return 'text-red-400';
    } catch (error) {
      Logger.error(`Failed to get compatibility color class for score: ${score}`, error);
      return 'text-gray-400';
    }
  }
}
