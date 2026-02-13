import {
  CompatibilityScore,
  CharacterProfile,
  PlayerCharacter,
  Character,
} from '../types/game';

export function calculateCompatibility(
  playerCharacter: PlayerCharacter,
  characterProfile: CharacterProfile
): CompatibilityScore {
  const interestScore = calculateInterestCompatibility(
    playerCharacter,
    characterProfile
  );
  const valueScore = calculateValueCompatibility(
    playerCharacter,
    characterProfile
  );
  const conversationScore = calculateConversationCompatibility(
    playerCharacter,
    characterProfile
  );
  const activityScore = calculateActivityCompatibility(
    playerCharacter,
    characterProfile
  );

  const overall = Math.round(
    (interestScore + valueScore + conversationScore + activityScore) / 4
  );

  const explanation = generateCompatibilityExplanation(
    overall,
    {
      interests: interestScore,
      values: valueScore,
      conversationStyle: conversationScore,
      activities: activityScore,
    },
    characterProfile
  );

  return {
    overall,
    breakdown: {
      interests: interestScore,
      values: valueScore,
      conversationStyle: conversationScore,
      activities: activityScore,
    },
    explanation,
  };
}

function calculateInterestCompatibility(
  player: PlayerCharacter,
  character: CharacterProfile
): number {
  // Map player stats to interests
  const playerInterestScores = {
    science: player.stats.intelligence,
    technology: player.stats.technology,
    adventure: player.stats.adventure,
    nature: player.stats.empathy,
    philosophy: player.stats.intelligence,
    culture: player.stats.charisma,
    arts: player.stats.empathy,
    exploration: player.stats.adventure,
  };

  let totalScore = 0;
  let maxPossibleScore = 0;

  character.interests.forEach((interest) => {
    const playerScore = playerInterestScores[interest.category] || 0;
    const characterIntensity = interest.intensity;

    // Score is higher when player stat matches character interest intensity
    const matchScore = Math.min(playerScore, characterIntensity * 20); // Convert 1-5 to 20-100 scale
    totalScore += matchScore * characterIntensity; // Weight by character's passion level
    maxPossibleScore += 100 * characterIntensity;
  });

  return maxPossibleScore > 0
    ? Math.round((totalScore / maxPossibleScore) * 100)
    : 50;
}

function calculateValueCompatibility(
  player: PlayerCharacter,
  character: CharacterProfile
): number {
  // Map player traits to values
  const playerValues = new Set(
    player.traits.map((trait) => trait.toLowerCase())
  );

  let matches = 0;
  character.values.forEach((value) => {
    // Check if player traits align with character values
    switch (value) {
      case 'adventure':
        if (
          player.stats.adventure >= 70 ||
          playerValues.has('adventurous') ||
          playerValues.has('bold')
        )
          matches++;
        break;
      case 'honesty':
        if (
          playerValues.has('honest') ||
          playerValues.has('truthful') ||
          playerValues.has('direct')
        )
          matches++;
        break;
      case 'harmony':
        if (
          player.stats.empathy >= 70 ||
          playerValues.has('peaceful') ||
          playerValues.has('diplomatic')
        )
          matches++;
        break;
      case 'growth':
        if (
          player.stats.intelligence >= 70 ||
          playerValues.has('curious') ||
          playerValues.has('learning')
        )
          matches++;
        break;
      case 'innovation':
        if (
          player.stats.technology >= 70 ||
          playerValues.has('innovative') ||
          playerValues.has('creative')
        )
          matches++;
        break;
      case 'loyalty':
        if (
          playerValues.has('loyal') ||
          playerValues.has('faithful') ||
          playerValues.has('dedicated')
        )
          matches++;
        break;
      case 'freedom':
        if (
          playerValues.has('independent') ||
          playerValues.has('free-spirited') ||
          player.stats.adventure >= 60
        )
          matches++;
        break;
      case 'tradition':
        if (
          playerValues.has('traditional') ||
          playerValues.has('respectful') ||
          playerValues.has('honorable')
        )
          matches++;
        break;
    }
  });

  return Math.round((matches / character.values.length) * 100);
}

function calculateConversationCompatibility(
  player: PlayerCharacter,
  character: CharacterProfile
): number {
  // Map player stats to conversation style compatibility
  let score = 50; // Base compatibility

  switch (character.conversationStyle) {
    case 'direct':
      score = player.stats.charisma >= 60 ? 80 : 60;
      break;
    case 'philosophical':
      score =
        player.stats.intelligence >= 70
          ? 90
          : player.stats.intelligence >= 50
            ? 70
            : 50;
      break;
    case 'playful':
      score =
        player.stats.charisma >= 70
          ? 85
          : player.stats.adventure >= 60
            ? 75
            : 55;
      break;
    case 'serious':
      score = player.stats.intelligence >= 60 ? 80 : 60;
      break;
    case 'emotional':
      score =
        player.stats.empathy >= 70 ? 90 : player.stats.empathy >= 50 ? 75 : 55;
      break;
    case 'analytical':
      score =
        player.stats.intelligence >= 80 || player.stats.technology >= 70
          ? 85
          : player.stats.intelligence >= 60
            ? 70
            : 50;
      break;
  }

  return Math.round(score);
}

function calculateActivityCompatibility(
  player: PlayerCharacter,
  character: CharacterProfile
): number {
  // Map player stats to activity preferences
  const playerActivityScores = {
    intellectual: player.stats.intelligence,
    adventurous: player.stats.adventure,
    romantic: player.stats.charisma + player.stats.empathy,
    cultural: player.stats.charisma,
    relaxing: player.stats.empathy,
    social: player.stats.charisma,
    creative: player.stats.empathy + player.stats.intelligence,
  };

  let totalScore = 0;
  character.preferredActivities.forEach((activity) => {
    totalScore += playerActivityScores[activity] || 0;
  });

  const averageScore = totalScore / character.preferredActivities.length;
  return Math.round(Math.min(averageScore, 100));
}

function generateCompatibilityExplanation(
  overall: number,
  breakdown: {
    interests: number;
    values: number;
    conversationStyle: number;
    activities: number;
  },
  character: CharacterProfile
): string[] {
  const explanations: string[] = [];

  if (overall >= 80) {
    explanations.push('You two have incredible chemistry together!');
  } else if (overall >= 60) {
    explanations.push("There's definitely potential for a strong connection.");
  } else if (overall >= 40) {
    explanations.push(
      'You have some things in common, but may need to work on compatibility.'
    );
  } else {
    explanations.push(
      'You might have different approaches to life, but opposites can attract!'
    );
  }

  // Interest compatibility
  if (breakdown.interests >= 80) {
    explanations.push('Your interests align wonderfully with theirs.');
  } else if (breakdown.interests <= 40) {
    explanations.push(
      'Your interests are quite different, which could lead to interesting discoveries.'
    );
  }

  // Value compatibility
  if (breakdown.values >= 80) {
    explanations.push('You share many of the same core values.');
  } else if (breakdown.values <= 40) {
    explanations.push(
      'Your values differ, which might require understanding and compromise.'
    );
  }

  // Conversation compatibility
  if (breakdown.conversationStyle >= 80) {
    explanations.push(
      `Your communication styles complement each other well for ${character.conversationStyle} conversations.`
    );
  } else if (breakdown.conversationStyle <= 40) {
    explanations.push(
      `Their ${character.conversationStyle} conversation style might be challenging for you at first.`
    );
  }

  // Activity compatibility
  if (breakdown.activities >= 80) {
    explanations.push("You'd enjoy many of the same activities together.");
  } else if (breakdown.activities <= 40) {
    explanations.push('You might need to explore new activities to connect.');
  }

  return explanations;
}

export function getCompatibilityColor(score: number): string {
  if (score >= 80) return 'text-green-400';
  if (score >= 60) return 'text-yellow-400';
  if (score >= 40) return 'text-orange-400';
  return 'text-red-400';
}

export function getCompatibilityLabel(score: number): string {
  if (score >= 90) return 'Soulmate';
  if (score >= 80) return 'Excellent';
  if (score >= 70) return 'Very Good';
  if (score >= 60) return 'Good';
  if (score >= 50) return 'Moderate';
  if (score >= 40) return 'Fair';
  if (score >= 30) return 'Challenging';
  return 'Difficult';
}

// Romance compatibility functions
export function isRomanticallyCompatible(
  player: PlayerCharacter,
  character: Character
): boolean {
  const playerPreference = player.sexualPreference;
  const characterGender = character.gender;

  switch (playerPreference) {
    case 'men':
      return characterGender === 'male';
    case 'women':
      return characterGender === 'female';
    case 'non-binary':
      return characterGender === 'non-binary';
    case 'all':
      return true; // Compatible with all genders
    case 'alien-species':
      return true; // Compatible with all alien species regardless of gender
    default:
      return false;
  }
}

export function getFilteredCharactersByPreference(
  player: PlayerCharacter,
  characters: Character[]
): Character[] {
  return characters.filter((character) =>
    isRomanticallyCompatible(player, character)
  );
}

export function getRomanceCompatibilityLabel(
  player: PlayerCharacter,
  character: Character
): string {
  if (!isRomanticallyCompatible(player, character)) {
    return 'Not Romantically Interested';
  }

  const playerPreference = player.sexualPreference;
  const characterGender = character.gender;

  if (playerPreference === 'all' || playerPreference === 'alien-species') {
    return 'Open to Romance';
  }

  // For specific preferences, give more enthusiastic labels
  const genderLabels = {
    male: 'Attracted to Men',
    female: 'Attracted to Women',
    'non-binary': 'Attracted to Non-Binary Individuals',
    other: 'Attracted to Unique Beings',
  };

  return genderLabels[characterGender] || 'Open to Romance';
}

export function getRomanceCompatibilityColor(
  player: PlayerCharacter,
  character: Character
): string {
  if (!isRomanticallyCompatible(player, character)) {
    return 'text-gray-400';
  }

  const playerPreference = player.sexualPreference;

  if (playerPreference === 'all' || playerPreference === 'alien-species') {
    return 'text-pink-400';
  }

  // Perfect match for specific preference
  return 'text-green-400';
}
