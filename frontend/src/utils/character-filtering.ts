import { Character, SexualPreference } from '../types/game';

/**
 * Filters characters based on the player's sexual preference
 */
export const filterCharactersByPreference = (
  characters: Character[], 
  playerPreference: SexualPreference
): Character[] => {
  if (playerPreference === 'all' || playerPreference === 'alien-species') {
    return characters; // Show all characters
  }

  return characters.filter(character => {
    switch (playerPreference) {
      case 'men':
        return character.gender === 'male';
      case 'women':
        return character.gender === 'female';
      case 'non-binary':
        return character.gender === 'non-binary' || character.gender === 'other';
      default:
        return true; // Fallback to show all
    }
  });
};

/**
 * Gets a description of what characters will be shown based on preference
 */
export const getPreferenceDescription = (preference: SexualPreference): string => {
  switch (preference) {
    case 'men':
      return 'Showing male characters';
    case 'women':
      return 'Showing female characters';
    case 'non-binary':
      return 'Showing non-binary characters';
    case 'all':
      return 'Showing all gender identities';
    case 'alien-species':
      return 'Showing all alien species';
    default:
      return 'Showing all characters';
  }
};

/**
 * Checks if a character matches the player's preference
 */
export const isCharacterCompatibleWithPreference = (
  character: Character,
  playerPreference: SexualPreference
): boolean => {
  if (playerPreference === 'all' || playerPreference === 'alien-species') {
    return true;
  }

  switch (playerPreference) {
    case 'men':
      return character.gender === 'male';
    case 'women':
      return character.gender === 'female';
    case 'non-binary':
      return character.gender === 'non-binary' || character.gender === 'other';
    default:
      return true;
  }
};