import {
  RelationshipStatus,
  RelationshipLevel,
  Character,
  PlayerCharacter,
  RelationshipMemory,
  MemoryType,
} from '../types/game';

// Calculate relationship level based on affection
export function getRelationshipLevel(affection: number): RelationshipLevel {
  if (affection <= 10) return 'stranger';
  if (affection <= 20) return 'acquaintance';
  if (affection <= 35) return 'friend';
  if (affection <= 50) return 'close_friend';
  if (affection <= 65) return 'romantic_interest';
  if (affection <= 80) return 'dating';
  if (affection <= 95) return 'committed_partner';
  return 'soulmate';
}

// Get relationship title and description
export function getRelationshipStatusInfo(
  level: RelationshipLevel,
  characterName: string
): { title: string; description: string } {
  const statusMap: Record<RelationshipLevel, { title: string; description: string }> = {
    stranger: {
      title: 'Unknown',
      description: `You've just met ${characterName}. There's much to discover about this intriguing individual.`,
    },
    acquaintance: {
      title: 'New Acquaintance',
      description: `You and ${characterName} are getting to know each other. First impressions are forming.`,
    },
    friend: {
      title: 'Friend',
      description: `${characterName} has become a valued friend. You enjoy each other's company and conversation.`,
    },
    close_friend: {
      title: 'Close Friend',
      description: `You and ${characterName} share a deep friendship built on trust and mutual understanding.`,
    },
    romantic_interest: {
      title: 'Romantic Interest',
      description: `There's a spark between you and ${characterName}. Romance is blossoming in your relationship.`,
    },
    dating: {
      title: 'Dating',
      description: `You and ${characterName} are officially dating. Your romantic connection continues to deepen.`,
    },
    committed_partner: {
      title: 'Committed Partner',
      description: `${characterName} is your committed romantic partner. Your bond is strong and meaningful.`,
    },
    soulmate: {
      title: 'Soulmate',
      description: `${characterName} is your soulmate. Your connection transcends the ordinary - a perfect union of hearts and minds.`,
    },
  };

  return statusMap[level];
}

// Calculate compatibility score based on character profiles
export function calculateCompatibility(player: PlayerCharacter, character: Character): number {
  let compatibilityScore = 0;

  // Base compatibility from species (some species naturally get along better)
  const speciesBonus = getSpeciesCompatibility(player.species, character.species);
  compatibilityScore += speciesBonus;

  // Values alignment
  const sharedValues = character.profile.values.filter(
    value =>
      (player.stats.empathy >= 7 && value === 'empathy') ||
      (player.stats.adventure >= 7 && value === 'adventure') ||
      (player.stats.intelligence >= 7 && value === 'innovation')
  ).length;
  compatibilityScore += sharedValues * 10;

  // Conversation style compatibility
  const styleCompatibility = getConversationStyleCompatibility(
    player.species, // Approximate player's style from species
    character.profile.conversationStyle
  );
  compatibilityScore += styleCompatibility;

  // Clamp to 0-100 range
  return Math.max(0, Math.min(100, compatibilityScore));
}

// Helper function for species compatibility
function getSpeciesCompatibility(playerSpecies: string, characterSpecies: string): number {
  // Base compatibility matrix (simplified)
  const compatibilityMatrix: Record<string, Record<string, number>> = {
    human: {
      'Aviari - Sky Warrior': 15,
      'Mystari - Dimensional Sage': 20,
      'Sylvani - Biotechnician': 25,
      'Florani - Garden Keeper': 20,
      'Draconi - Elite Guard': 10,
      'Aquari - Deep Sage': 15,
      'Umbra - Shadow Operative': 8,
      'Cephalopi - Neural Engineer': 22,
    },
    plantoid: {
      'Florani - Garden Keeper': 30,
      'Sylvani - Biotechnician': 25,
      'Mystari - Dimensional Sage': 15,
    },
    aquatic: {
      'Aquari - Deep Sage': 30,
      'Mystari - Dimensional Sage': 20,
      'Florani - Garden Keeper': 15,
    },
    reptilian: {
      'Draconi - Elite Guard': 25,
      'Aviari - Sky Warrior': 20,
      'Umbra - Shadow Operative': 15,
    },
  };

  return compatibilityMatrix[playerSpecies]?.[characterSpecies] || 10;
}

// Helper function for conversation style compatibility
function getConversationStyleCompatibility(playerSpecies: string, characterStyle: string): number {
  // Simplified style matching based on player species tendencies
  const stylePreferences: Record<string, Record<string, number>> = {
    human: {
      direct: 15,
      emotional: 20,
      playful: 18,
      serious: 12,
      philosophical: 10,
      analytical: 15,
    },
    plantoid: {
      philosophical: 25,
      emotional: 20,
      analytical: 15,
      serious: 12,
      direct: 8,
      playful: 10,
    },
    aquatic: {
      philosophical: 30,
      serious: 20,
      emotional: 15,
      analytical: 10,
      direct: 5,
      playful: 5,
    },
    reptilian: {
      direct: 25,
      serious: 20,
      analytical: 15,
      philosophical: 10,
      emotional: 8,
      playful: 12,
    },
  };

  return stylePreferences[playerSpecies]?.[characterStyle] || 10;
}

// Create a new relationship memory
export function createRelationshipMemory(
  type: MemoryType,
  title: string,
  description: string,
  emotionalImpact: number,
  affectionAtTime: number,
  consequence?: string
): RelationshipMemory {
  return {
    id: `memory_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    date: new Date(),
    type,
    title,
    description,
    emotionalImpact,
    participantEmotions: emotionalImpact > 0 ? ['happy'] : ['neutral'],
    affectionAtTime,
    consequence,
    tags: [type, emotionalImpact > 5 ? 'significant' : 'minor'],
  };
}

// Update relationship status based on current affection and interactions
export function updateRelationshipStatus(
  currentStatus: RelationshipStatus,
  affection: number,
  characterName: string,
  player: PlayerCharacter,
  character: Character
): RelationshipStatus {
  const newLevel = getRelationshipLevel(affection);
  const { title, description } = getRelationshipStatusInfo(newLevel, characterName);
  const compatibility = calculateCompatibility(player, character);

  // Update trust, intimacy, and commitment based on affection and interactions
  const trust = Math.min(100, currentStatus.trust + (affection > currentStatus.intimacy ? 1 : 0));
  const intimacy = Math.min(100, Math.floor(affection * 0.8) + currentStatus.sharedExperiences);
  const commitment = Math.min(100, Math.floor(affection * 0.6) + currentStatus.conflicts * 2);

  return {
    ...currentStatus,
    level: newLevel,
    title,
    description,
    compatibility,
    trust,
    intimacy,
    commitment,
    lastStatusChange:
      newLevel !== currentStatus.level ? new Date() : currentStatus.lastStatusChange,
  };
}

// Get default relationship status for new character
export function getDefaultRelationshipStatus(characterName: string): RelationshipStatus {
  const level = getRelationshipLevel(0);
  const { title, description } = getRelationshipStatusInfo(level, characterName);

  return {
    level,
    title,
    description,
    compatibility: 0,
    trust: 0,
    intimacy: 0,
    commitment: 0,
    communicationStyle: {
      compatibility: 50,
      playerPreference: 'emotional',
      characterStyle: 'direct',
      adaptationLevel: 0,
    },
    sharedExperiences: 0,
    conflicts: 0,
    lastStatusChange: new Date(),
  };
}
