import { DatePlan, ActivityType } from '../types/game';

export const datePlans: DatePlan[] = [
  // Intellectual Activities
  {
    id: 'observatory_visit',
    name: 'Stellar Observatory Date',
    description:
      'Explore the cosmos together at the galactic observatory, discussing star formations and cosmic phenomena.',
    activityType: 'intellectual',
    location: 'Cosmic Observatory Deck',
    duration: 120,
    preferredTopics: ['science', 'exploration', 'philosophy', 'future dreams'],
    requiredAffection: 10,
    compatibilityBonus: 15,
  },
  {
    id: 'science_museum',
    name: 'Xenobiology Museum Tour',
    description:
      'Walk through exhibits of alien life forms while discussing the wonders of biological diversity.',
    activityType: 'intellectual',
    location: 'Interstellar Life Sciences Museum',
    duration: 90,
    preferredTopics: ['science', 'nature', 'evolution', 'discovery'],
    requiredAffection: 5,
    compatibilityBonus: 10,
  },
  {
    id: 'philosophy_cafe',
    name: 'Philosophy Café Discussion',
    description: 'Share deep thoughts over exotic beverages in a quiet, contemplative setting.',
    activityType: 'intellectual',
    location: "The Thinking Being's Café",
    duration: 60,
    preferredTopics: ['philosophy', 'meaning of life', 'consciousness', 'ethics'],
    requiredAffection: 15,
    compatibilityBonus: 20,
  },

  // Adventurous Activities
  {
    id: 'nebula_flight',
    name: 'Nebula Gliding Adventure',
    description:
      'Pilot through colorful nebulae in a small craft, experiencing the thrill of space flight together.',
    activityType: 'adventurous',
    location: 'Chromatic Nebula Field',
    duration: 150,
    preferredTopics: ['adventure', 'courage', 'excitement', 'freedom'],
    requiredAffection: 20,
    compatibilityBonus: 25,
  },
  {
    id: 'asteroid_mining',
    name: 'Asteroid Mining Experience',
    description:
      'Try your hand at asteroid mining together, learning teamwork while seeking rare crystals.',
    activityType: 'adventurous',
    location: 'Mineral-Rich Asteroid Belt',
    duration: 180,
    preferredTopics: ['teamwork', 'challenge', 'discovery', 'achievement'],
    requiredAffection: 25,
    compatibilityBonus: 20,
  },
  {
    id: 'zero_g_sports',
    name: 'Zero-G Sports Arena',
    description:
      'Play anti-gravity sports in a fun, competitive environment that tests coordination and trust.',
    activityType: 'adventurous',
    location: 'Zero Gravity Sports Complex',
    duration: 90,
    preferredTopics: ['competition', 'fun', 'physical prowess', 'teamwork'],
    requiredAffection: 10,
    compatibilityBonus: 15,
  },

  // Romantic Activities
  {
    id: 'sunset_viewing',
    name: 'Binary Sunset Viewing',
    description:
      'Watch the breathtaking binary sunset from the observation deck while sharing intimate conversation.',
    activityType: 'romantic',
    location: 'Sunset Observation Deck',
    duration: 45,
    preferredTopics: ['beauty', 'feelings', 'dreams', 'connection'],
    requiredAffection: 30,
    compatibilityBonus: 30,
  },
  {
    id: 'starlight_dinner',
    name: 'Starlight Dinner',
    description: 'Enjoy a private dinner under the stars with cuisine from across the galaxy.',
    activityType: 'romantic',
    location: 'Starlight Dining Pavilion',
    duration: 120,
    preferredTopics: ['personal stories', 'culture', 'taste preferences', 'intimacy'],
    requiredAffection: 40,
    compatibilityBonus: 35,
  },
  {
    id: 'garden_walk',
    name: 'Botanical Garden Stroll',
    description: 'Walk through exotic alien gardens, enjoying the beauty and serenity together.',
    activityType: 'romantic',
    location: 'Xeno-Botanical Gardens',
    duration: 75,
    preferredTopics: ['nature', 'beauty', 'growth', 'peace'],
    requiredAffection: 15,
    compatibilityBonus: 20,
  },

  // Cultural Activities
  {
    id: 'art_gallery',
    name: 'Interspecies Art Gallery',
    description:
      'Explore artistic expressions from different alien cultures, discussing creativity and meaning.',
    activityType: 'cultural',
    location: 'Galactic Arts Collective',
    duration: 90,
    preferredTopics: ['art', 'culture', 'expression', 'meaning'],
    requiredAffection: 10,
    compatibilityBonus: 15,
  },
  {
    id: 'cultural_festival',
    name: 'Cultural Exchange Festival',
    description:
      'Experience food, music, and traditions from various alien civilizations together.',
    activityType: 'cultural',
    location: 'Cultural Festival Grounds',
    duration: 180,
    preferredTopics: ['culture', 'tradition', 'celebration', 'diversity'],
    requiredAffection: 5,
    compatibilityBonus: 10,
  },
  {
    id: 'music_concert',
    name: 'Harmonic Resonance Concert',
    description:
      'Listen to music created by alien instruments and voices in perfect harmonic resonance.',
    activityType: 'cultural',
    location: 'Resonance Concert Hall',
    duration: 105,
    preferredTopics: ['music', 'harmony', 'emotion', 'art'],
    requiredAffection: 20,
    compatibilityBonus: 25,
  },

  // Relaxing Activities
  {
    id: 'meditation_center',
    name: 'Meditation Sanctuary',
    description:
      'Find inner peace together in a tranquil meditation space designed for mental harmony.',
    activityType: 'relaxing',
    location: 'Universal Meditation Sanctuary',
    duration: 60,
    preferredTopics: ['peace', 'mindfulness', 'spirituality', 'connection'],
    requiredAffection: 20,
    compatibilityBonus: 20,
  },
  {
    id: 'thermal_springs',
    name: 'Thermal Spring Retreat',
    description: 'Relax in natural thermal springs while enjoying peaceful conversation.',
    activityType: 'relaxing',
    location: 'Crystalline Thermal Springs',
    duration: 90,
    preferredTopics: ['relaxation', 'nature', 'wellness', 'comfort'],
    requiredAffection: 25,
    compatibilityBonus: 25,
  },

  // Social Activities
  {
    id: 'game_arcade',
    name: 'Galactic Game Arcade',
    description: 'Play interactive games from different alien cultures, competing and cooperating.',
    activityType: 'social',
    location: 'Multi-Species Game Arcade',
    duration: 120,
    preferredTopics: ['fun', 'competition', 'games', 'strategy'],
    requiredAffection: 5,
    compatibilityBonus: 10,
  },
  {
    id: 'social_mixer',
    name: 'Interspecies Social Mixer',
    description: 'Meet other beings at a casual social gathering with your date by your side.',
    activityType: 'social',
    location: 'Social Hub Commons',
    duration: 150,
    preferredTopics: ['socializing', 'community', 'networking', 'friendship'],
    requiredAffection: 15,
    compatibilityBonus: 15,
  },

  // Creative Activities
  {
    id: 'art_creation',
    name: 'Collaborative Art Creation',
    description:
      'Create a piece of art together using materials and techniques from both your cultures.',
    activityType: 'creative',
    location: 'Creative Arts Workshop',
    duration: 135,
    preferredTopics: ['creativity', 'collaboration', 'expression', 'imagination'],
    requiredAffection: 25,
    compatibilityBonus: 30,
  },
  {
    id: 'cooking_class',
    name: 'Interspecies Cooking Class',
    description:
      "Learn to prepare dishes from each other's cultures in a fun, hands-on cooking experience.",
    activityType: 'creative',
    location: 'Culinary Fusion Kitchen',
    duration: 120,
    preferredTopics: ['culture', 'taste', 'tradition', 'sharing'],
    requiredAffection: 15,
    compatibilityBonus: 20,
  },
  {
    id: 'music_creation',
    name: 'Musical Collaboration',
    description: 'Create music together using instruments from both your species, finding harmony.',
    activityType: 'creative',
    location: 'Harmonic Music Studio',
    duration: 90,
    preferredTopics: ['music', 'harmony', 'creativity', 'emotion'],
    requiredAffection: 30,
    compatibilityBonus: 35,
  },
];

export function getDatePlansByActivity(activityType: ActivityType): DatePlan[] {
  return datePlans.filter(plan => plan.activityType === activityType);
}

export function getAvailableDatePlans(affection: number): DatePlan[] {
  return datePlans.filter(plan => affection >= plan.requiredAffection);
}

export function getDatePlanById(id: string): DatePlan | undefined {
  return datePlans.find(plan => plan.id === id);
}
