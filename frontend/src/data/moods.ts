import { CharacterMood } from '../types/game';

export const moodDescriptions: Record<CharacterMood, string> = {
  cheerful: 'is in a bright and optimistic mood',
  melancholy: 'seems contemplative and a bit wistful',
  romantic: 'has a dreamy, romantic air about them',
  analytical: 'appears focused and intellectually engaged',
  adventurous: 'seems restless and eager for excitement',
  tired: 'looks a bit weary but still attentive',
  excited: 'is buzzing with energy and enthusiasm',
  neutral: 'appears calm and balanced',
};

export const moodEffects: Record<
  CharacterMood,
  { bonus: number; penalty: number; preferredTopics: string[] }
> = {
  cheerful: {
    bonus: 2,
    penalty: 0,
    preferredTopics: ['greeting', 'interests', 'compliment'],
  },
  melancholy: {
    bonus: 3,
    penalty: -1,
    preferredTopics: ['backstory', 'comfort', 'deep_talk'],
  },
  romantic: {
    bonus: 4,
    penalty: -2,
    preferredTopics: ['flirt', 'compliment', 'romantic'],
  },
  analytical: {
    bonus: 2,
    penalty: -1,
    preferredTopics: ['interests', 'philosophy', 'science'],
  },
  adventurous: {
    bonus: 3,
    penalty: -1,
    preferredTopics: ['adventure', 'travel', 'excitement'],
  },
  tired: {
    bonus: 1,
    penalty: -2,
    preferredTopics: ['comfort', 'gentle_talk'],
  },
  excited: {
    bonus: 3,
    penalty: 0,
    preferredTopics: ['excitement', 'plans', 'adventure'],
  },
  neutral: {
    bonus: 1,
    penalty: 0,
    preferredTopics: ['greeting', 'interests', 'general'],
  },
};

export function getRandomMood(): CharacterMood {
  const moods: CharacterMood[] = [
    'cheerful',
    'melancholy',
    'romantic',
    'analytical',
    'adventurous',
    'tired',
    'excited',
    'neutral',
  ];
  return moods[Math.floor(Math.random() * moods.length)];
}

export function getMoodModifier(mood: CharacterMood, topic: string): number {
  const effects = moodEffects[mood];
  if (effects.preferredTopics.includes(topic)) {
    return effects.bonus;
  }
  return effects.penalty;
}
