import { ValidationError, CharacterId, AffectionLevel, PercentageScore, createCharacterId, createAffectionLevel } from '../types/brandedTypes';
import { Character, PlayerCharacter } from '../types/game';
import { VALIDATION_LIMITS } from '../constants/gameConstants';

export class Validators {
  static validateCharacterId(id: unknown): CharacterId {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Character ID must be a non-empty string', 'characterId');
    }
    return createCharacterId(id);
  }
  
  static validateAffectionAmount(amount: unknown): number {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new ValidationError('Affection amount must be a number', 'amount');
    }
    if (amount < -VALIDATION_LIMITS.MAX_AFFECTION || amount > VALIDATION_LIMITS.MAX_AFFECTION) {
      throw new ValidationError(
        `Affection amount must be between -${VALIDATION_LIMITS.MAX_AFFECTION} and ${VALIDATION_LIMITS.MAX_AFFECTION}`, 
        'amount'
      );
    }
    return amount;
  }
  
  static validateAffectionLevel(level: unknown): AffectionLevel {
    if (typeof level !== 'number' || isNaN(level)) {
      throw new ValidationError('Affection level must be a number', 'affection');
    }
    if (level < VALIDATION_LIMITS.MIN_AFFECTION || level > VALIDATION_LIMITS.MAX_AFFECTION) {
      throw new ValidationError(
        `Affection level must be between ${VALIDATION_LIMITS.MIN_AFFECTION} and ${VALIDATION_LIMITS.MAX_AFFECTION}`, 
        'affection'
      );
    }
    return createAffectionLevel(level);
  }
  
  static validateCharacterExists(character: Character | undefined | null): Character {
    if (!character) {
      throw new ValidationError('Character not found');
    }
    return character;
  }
  
  static validatePlayerExists(player: PlayerCharacter | null | undefined): PlayerCharacter {
    if (!player) {
      throw new ValidationError('Player character not found');
    }
    return player;
  }
  
  static validateCompatibilityScore(score: unknown): PercentageScore {
    if (typeof score !== 'number' || isNaN(score)) {
      throw new ValidationError('Compatibility score must be a number', 'compatibility');
    }
    if (score < VALIDATION_LIMITS.MIN_COMPATIBILITY || score > VALIDATION_LIMITS.MAX_COMPATIBILITY) {
      throw new ValidationError(
        `Compatibility score must be between ${VALIDATION_LIMITS.MIN_COMPATIBILITY} and ${VALIDATION_LIMITS.MAX_COMPATIBILITY}`,
        'compatibility'
      );
    }
    return score as PercentageScore;
  }
  
  static validateStatValue(value: unknown, statName: string): number {
    if (typeof value !== 'number' || isNaN(value)) {
      throw new ValidationError(`${statName} must be a number`, statName);
    }
    if (value < VALIDATION_LIMITS.MIN_STAT_VALUE || value > VALIDATION_LIMITS.MAX_STAT_VALUE) {
      throw new ValidationError(
        `${statName} must be between ${VALIDATION_LIMITS.MIN_STAT_VALUE} and ${VALIDATION_LIMITS.MAX_STAT_VALUE}`,
        statName
      );
    }
    return value;
  }
  
  static validateArrayNotEmpty<T>(array: T[] | undefined | null, fieldName: string): T[] {
    if (!Array.isArray(array) || array.length === 0) {
      throw new ValidationError(`${fieldName} must be a non-empty array`, fieldName);
    }
    return array;
  }
  
  static validateStringNotEmpty(value: unknown, fieldName: string): string {
    if (!value || typeof value !== 'string' || value.trim().length === 0) {
      throw new ValidationError(`${fieldName} must be a non-empty string`, fieldName);
    }
    return value.trim();
  }
}