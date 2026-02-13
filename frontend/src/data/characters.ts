import { Character, CharacterKnownInfo, DailyInteractionData } from '../types/game';
import { getDefaultRelationshipStatus } from '../utils/relationshipUtils';
import { getCharacterImage } from '../utils/assetManager';
import { affectionThresholds, interactionLimits, milestoneThresholds } from '../constants/gameConstants';

// Default knowledge state - everything starts as unknown except name and appearance
const defaultKnownInfo: CharacterKnownInfo = {
  name: true,
  appearance: true,
  species: false,
  basicPersonality: false,
  mood: false,
  interests: false,
  conversationStyle: false,
  values: false,
  background: false,
  goals: false,
  dealbreakers: false,
  favoriteTopics: false,
  deepPersonality: false,
  secretTraits: false
};

// Default milestones for all characters
const defaultMilestones = [
  { id: 'first_meeting', name: 'First Meeting', description: 'Your first encounter', unlockedAt: milestoneThresholds.FIRST_MEETING, achieved: false },
  { id: 'first_conversation', name: 'First Real Conversation', description: 'A meaningful exchange', unlockedAt: milestoneThresholds.GETTING_CLOSER, achieved: false },
  { id: 'personal_sharing', name: 'Personal Sharing', description: 'Opening up about themselves', unlockedAt: milestoneThresholds.MUTUAL_INTEREST, achieved: false },
  { id: 'first_date', name: 'First Date', description: 'Your first romantic encounter', unlockedAt: milestoneThresholds.ROMANTIC_TENSION, achieved: false },
  { id: 'deeper_connection', name: 'Deeper Connection', description: 'Understanding each other better', unlockedAt: milestoneThresholds.DEEP_CONNECTION, achieved: false },
  { id: 'commitment', name: 'Committed Relationship', description: 'Taking things to the next level', unlockedAt: milestoneThresholds.COMMITMENT, achieved: false }
];

// Random mood generator
const getRandomMood = () => {
  const moods = ['cheerful', 'melancholy', 'romantic', 'analytical', 'adventurous', 'neutral'] as const;
  return moods[Math.floor(Math.random() * moods.length)];
};

// Default daily interaction data
const getDefaultDailyInteractions = (affection: number): DailyInteractionData => ({
  lastResetDate: new Date().toISOString().split('T')[0], // Today's date
  interactionsUsed: 0,
  maxInteractions: calculateMaxInteractions(affection)
});

// Calculate max interactions based on affection level
export const calculateMaxInteractions = (affection: number): number => {
  if (affection >= affectionThresholds.VERY_HIGH) return interactionLimits.VERY_HIGH_AFFECTION;
  if (affection >= affectionThresholds.HIGH) return interactionLimits.HIGH_AFFECTION;
  if (affection >= affectionThresholds.MEDIUM) return interactionLimits.MEDIUM_AFFECTION;
  if (affection >= affectionThresholds.LOW) return interactionLimits.LOW_MEDIUM_AFFECTION;
  return interactionLimits.DEFAULT;
};

export const CHARACTERS: Character[] = [
  {
    id: 'kyrathen',
    name: "Kyra'then",
    species: 'Aviari - Sky Warrior',
    gender: 'male',
    personality: 'Noble • Protective • Wise',
    image: getCharacterImage('kyrathen'),
    affection: 0,
    mood: getRandomMood(),
    milestones: [...defaultMilestones],
    profile: {
      interests: [
        { id: 'flight', name: 'Aerial Navigation', category: 'adventure', intensity: 5 },
        { id: 'honor', name: 'Warrior Code', category: 'philosophy', intensity: 4 },
        { id: 'history', name: 'Ancient Traditions', category: 'culture', intensity: 4 },
        { id: 'leadership', name: 'Strategic Command', category: 'technology', intensity: 3 }
      ],
      dealbreakers: ['Dishonesty', 'Cowardice', 'Disrespect for nature'],
      preferredActivities: ['adventurous', 'cultural', 'intellectual'],
      conversationStyle: 'serious',
      values: ['honor', 'loyalty', 'tradition', 'freedom'],
      background: 'Desert clan chieftain who united the scattered sky tribes through diplomacy and strength',
      goals: 'To bridge the gap between ancient traditions and modern galactic society',
      favoriteTopics: ['Flight techniques', 'Tribal history', 'Honor duels', 'Desert survival']
    },
    lastInteractionDate: undefined,
    photoGallery: [
      { id: 'portrait', url: getCharacterImage('kyrathen'), title: 'Tribal Portrait', description: 'In ceremonial feathered headdress', unlockedAt: 0, unlocked: true, rarity: 'common' }
    ],
    dateHistory: [],
    knownInfo: { ...defaultKnownInfo },
    dailyInteractions: getDefaultDailyInteractions(0),
    relationshipStatus: getDefaultRelationshipStatus("Kyra'then"),
    relationshipMemories: [],
    personalityGrowth: [
      { trait: 'protective', baseValue: 8, currentValue: 8, growthHistory: [], maxGrowth: 10, minGrowth: 5 },
      { trait: 'traditional', baseValue: 9, currentValue: 9, growthHistory: [], maxGrowth: 10, minGrowth: 7 },
      { trait: 'noble', baseValue: 7, currentValue: 7, growthHistory: [], maxGrowth: 10, minGrowth: 4 }
    ],
    superLikesReceived: [],
    activeConflicts: [],
    conflictHistory: [],
    icebreakerMessages: [],
    temporaryBoosts: []
  },
  {
    id: 'seraphina',
    name: "Seraphina Voidwhisper",
    species: 'Mystari - Dimensional Sage',
    gender: 'female',
    personality: 'Mystical • Intuitive • Enigmatic',
    image: getCharacterImage('seraphina'),
    affection: 0,
    mood: getRandomMood(),
    milestones: [...defaultMilestones],
    profile: {
      interests: [
        { id: 'meditation', name: 'Dimensional Meditation', category: 'philosophy', intensity: 5 },
        { id: 'prophecy', name: 'Future Sight', category: 'science', intensity: 4 },
        { id: 'crystals', name: 'Crystal Resonance', category: 'technology', intensity: 4 },
        { id: 'dreams', name: 'Dream Walking', category: 'arts', intensity: 3 }
      ],
      dealbreakers: ['Materialistic focus', 'Closed-mindedness', 'Aggressive behavior'],
      preferredActivities: ['intellectual', 'romantic', 'cultural'],
      conversationStyle: 'philosophical',
      values: ['empathy', 'harmony', 'growth', 'tradition'],
      background: 'Oracle of the Blue Temples who can peer across dimensional barriers',
      goals: 'To guide others toward enlightenment and cosmic understanding',
      favoriteTopics: ['Dimensional theory', 'Spiritual growth', 'Ancient prophecies', 'Energy manipulation']
    },
    lastInteractionDate: undefined,
    photoGallery: [
      { id: 'portrait', url: getCharacterImage('seraphina'), title: 'Hooded Oracle', description: 'In traditional temple robes', unlockedAt: 0, unlocked: true, rarity: 'common' }
    ],
    dateHistory: [],
    knownInfo: { ...defaultKnownInfo },
    dailyInteractions: getDefaultDailyInteractions(0),
    relationshipStatus: getDefaultRelationshipStatus("Seraphina Voidwhisper"),
    relationshipMemories: [],
    personalityGrowth: [
      { trait: 'intuitive', baseValue: 9, currentValue: 9, growthHistory: [], maxGrowth: 10, minGrowth: 7 },
      { trait: 'mystical', baseValue: 10, currentValue: 10, growthHistory: [], maxGrowth: 10, minGrowth: 8 },
      { trait: 'compassionate', baseValue: 8, currentValue: 8, growthHistory: [], maxGrowth: 10, minGrowth: 5 }
    ],
    superLikesReceived: [],
    activeConflicts: [],
    conflictHistory: [],
    icebreakerMessages: [],
    temporaryBoosts: []
  },
  {
    id: 'thessarian',
    name: "Dr. Thessarian Brightleaf",
    species: 'Sylvani - Biotechnician',
    gender: 'non-binary',
    personality: 'Analytical • Innovative • Precise',
    image: getCharacterImage('thessarian'),
    affection: 0,
    mood: getRandomMood(),
    milestones: [...defaultMilestones],
    profile: {
      interests: [
        { id: 'biotech', name: 'Biotechnology', category: 'technology', intensity: 5 },
        { id: 'genetics', name: 'Genetic Engineering', category: 'science', intensity: 5 },
        { id: 'research', name: 'Scientific Method', category: 'science', intensity: 4 },
        { id: 'innovation', name: 'Technological Innovation', category: 'technology', intensity: 4 }
      ],
      dealbreakers: ['Anti-science views', 'Deliberate ignorance', 'Destruction of knowledge'],
      preferredActivities: ['intellectual', 'creative', 'adventurous'],
      conversationStyle: 'analytical',
      values: ['innovation', 'efficiency', 'growth', 'loyalty'],
      background: 'Lead researcher at the Galactic Biotechnology Institute, specializing in cross-species compatibility',
      goals: 'To advance understanding of biological diversity and create beneficial symbioses',
      favoriteTopics: ['Genetic sequences', 'Bioengineering', 'Research methodology', 'Scientific ethics']
    },
    lastInteractionDate: undefined,
    photoGallery: [
      { id: 'portrait', url: getCharacterImage('thessarian'), title: 'Laboratory Portrait', description: 'In formal research attire', unlockedAt: 0, unlocked: true, rarity: 'common' }
    ],
    dateHistory: [],
    knownInfo: { ...defaultKnownInfo },
    dailyInteractions: getDefaultDailyInteractions(0),
    relationshipStatus: getDefaultRelationshipStatus("Dr. Thessarian Brightleaf"),
    relationshipMemories: [],
    personalityGrowth: [
      { trait: 'analytical', baseValue: 10, currentValue: 10, growthHistory: [], maxGrowth: 10, minGrowth: 8 },
      { trait: 'innovative', baseValue: 9, currentValue: 9, growthHistory: [], maxGrowth: 10, minGrowth: 6 },
      { trait: 'precise', baseValue: 8, currentValue: 8, growthHistory: [], maxGrowth: 10, minGrowth: 5 }
    ],
    superLikesReceived: [],
    activeConflicts: [],
    conflictHistory: [],
    icebreakerMessages: [],
    temporaryBoosts: []
  },
  {
    id: 'lyralynn',
    name: "Lyralynn Bloomheart",
    species: 'Florani - Garden Keeper',
    gender: 'female',
    personality: 'Nurturing • Peaceful • Connected',
    image: getCharacterImage('lyralynn'),
    affection: 0,
    mood: getRandomMood(),
    milestones: [...defaultMilestones],
    profile: {
      interests: [
        { id: 'botany', name: 'Plant Biology', category: 'nature', intensity: 5 },
        { id: 'ecology', name: 'Ecosystem Balance', category: 'nature', intensity: 5 },
        { id: 'growth', name: 'Organic Growth', category: 'science', intensity: 4 },
        { id: 'harmony', name: 'Natural Harmony', category: 'philosophy', intensity: 4 }
      ],
      dealbreakers: ['Environmental destruction', 'Artificial enhancement addiction', 'Disconnection from nature'],
      preferredActivities: ['relaxing', 'cultural', 'romantic'],
      conversationStyle: 'emotional',
      values: ['harmony', 'growth', 'empathy', 'tradition'],
      background: 'Guardian of the Great Forest, responsible for maintaining the balance between civilization and nature',
      goals: 'To help others find their connection to the natural world and inner growth',
      favoriteTopics: ['Plant cultivation', 'Natural cycles', 'Emotional healing', 'Sustainable living']
    },
    lastInteractionDate: undefined,
    photoGallery: [
      { id: 'portrait', url: getCharacterImage('lyralynn'), title: 'Forest Guardian', description: 'Among her beloved plants', unlockedAt: 0, unlocked: true, rarity: 'common' }
    ],
    dateHistory: [],
    knownInfo: { ...defaultKnownInfo },
    dailyInteractions: getDefaultDailyInteractions(0),
    relationshipStatus: getDefaultRelationshipStatus("Lyralynn Bloomheart"),
    relationshipMemories: [],
    personalityGrowth: [
      { trait: 'nurturing', baseValue: 10, currentValue: 10, growthHistory: [], maxGrowth: 10, minGrowth: 8 },
      { trait: 'peaceful', baseValue: 9, currentValue: 9, growthHistory: [], maxGrowth: 10, minGrowth: 6 },
      { trait: 'connected', baseValue: 8, currentValue: 8, growthHistory: [], maxGrowth: 10, minGrowth: 5 }
    ],
    superLikesReceived: [],
    activeConflicts: [],
    conflictHistory: [],
    icebreakerMessages: [],
    temporaryBoosts: []
  },
  {
    id: 'zarantha',
    name: "Commander Zarantha Scales",
    species: 'Draconi - Elite Guard',
    gender: 'female',
    personality: 'Confident • Ambitious • Tactical',
    image: getCharacterImage('zarantha'),
    affection: 0,
    mood: getRandomMood(),
    milestones: [...defaultMilestones],
    profile: {
      interests: [
        { id: 'strategy', name: 'Military Strategy', category: 'technology', intensity: 5 },
        { id: 'combat', name: 'Combat Training', category: 'adventure', intensity: 4 },
        { id: 'leadership', name: 'Command Structure', category: 'culture', intensity: 4 },
        { id: 'technology', name: 'Advanced Weaponry', category: 'technology', intensity: 3 }
      ],
      dealbreakers: ['Weakness', 'Betrayal', 'Incompetence in critical situations'],
      preferredActivities: ['adventurous', 'intellectual', 'social'],
      conversationStyle: 'direct',
      values: ['honor', 'efficiency', 'loyalty', 'freedom'],
      background: 'Elite military commander who rose through the ranks to become the youngest general in Draconi history',
      goals: 'To prove that strength and intelligence combined can overcome any obstacle',
      favoriteTopics: ['Battle tactics', 'Leadership philosophy', 'Technological advancement', 'Personal achievement']
    },
    lastInteractionDate: undefined,
    photoGallery: [
      { id: 'portrait', url: getCharacterImage('zarantha'), title: 'Command Portrait', description: 'In military dress uniform', unlockedAt: 0, unlocked: true, rarity: 'common' }
    ],
    dateHistory: [],
    knownInfo: { ...defaultKnownInfo },
    dailyInteractions: getDefaultDailyInteractions(0),
    relationshipStatus: getDefaultRelationshipStatus("Commander Zarantha Scales"),
    relationshipMemories: [],
    personalityGrowth: [
      { trait: 'confident', baseValue: 9, currentValue: 9, growthHistory: [], maxGrowth: 10, minGrowth: 6 },
      { trait: 'ambitious', baseValue: 8, currentValue: 8, growthHistory: [], maxGrowth: 10, minGrowth: 5 },
      { trait: 'tactical', baseValue: 10, currentValue: 10, growthHistory: [], maxGrowth: 10, minGrowth: 7 }
    ],
    superLikesReceived: [],
    activeConflicts: [],
    conflictHistory: [],
    icebreakerMessages: [],
    temporaryBoosts: []
  },
  {
    id: 'thalassos',
    name: "High Priest Thalassos",
    species: 'Aquari - Deep Sage',
    gender: 'male',
    personality: 'Wise • Contemplative • Spiritual',
    image: getCharacterImage('thalassos'),
    affection: 0,
    mood: getRandomMood(),
    milestones: [...defaultMilestones],
    profile: {
      interests: [
        { id: 'spirituality', name: 'Ancient Rituals', category: 'philosophy', intensity: 5 },
        { id: 'ocean', name: 'Ocean Mysteries', category: 'nature', intensity: 5 },
        { id: 'meditation', name: 'Deep Meditation', category: 'philosophy', intensity: 4 },
        { id: 'history', name: 'Aquatic Civilizations', category: 'culture', intensity: 4 }
      ],
      dealbreakers: ['Disrespect for sacred traditions', 'Pollution of water sources', 'Shallow thinking'],
      preferredActivities: ['intellectual', 'cultural', 'romantic'],
      conversationStyle: 'philosophical',
      values: ['tradition', 'harmony', 'empathy', 'honor'],
      background: 'High Priest of the Deep Temples, keeper of ancient aquatic knowledge and rituals',
      goals: 'To preserve ancient wisdom while guiding others through spiritual transformation',
      favoriteTopics: ['Ocean lore', 'Spiritual practices', 'Ancient ceremonies', 'Water meditation']
    },
    lastInteractionDate: undefined,
    photoGallery: [
      { id: 'portrait', url: getCharacterImage('thalassos'), title: 'Ceremonial Robes', description: 'In traditional temple attire', unlockedAt: 0, unlocked: true, rarity: 'common' }
    ],
    dateHistory: [],
    knownInfo: { ...defaultKnownInfo },
    dailyInteractions: getDefaultDailyInteractions(0),
    relationshipStatus: getDefaultRelationshipStatus("High Priest Thalassos"),
    relationshipMemories: [],
    personalityGrowth: [
      { trait: 'wise', baseValue: 10, currentValue: 10, growthHistory: [], maxGrowth: 10, minGrowth: 8 },
      { trait: 'contemplative', baseValue: 9, currentValue: 9, growthHistory: [], maxGrowth: 10, minGrowth: 6 },
      { trait: 'spiritual', baseValue: 8, currentValue: 8, growthHistory: [], maxGrowth: 10, minGrowth: 5 }
    ],
    superLikesReceived: [],
    activeConflicts: [],
    conflictHistory: [],
    icebreakerMessages: [],
    temporaryBoosts: []
  },
  {
    id: 'nightshade',
    name: "Nightshade Voidwalker",
    species: 'Umbra - Shadow Operative',
    gender: 'other',
    personality: 'Mysterious • Intense • Protective',
    image: getCharacterImage('nightshade'),
    affection: 0,
    mood: getRandomMood(),
    milestones: [...defaultMilestones],
    profile: {
      interests: [
        { id: 'stealth', name: 'Shadow Arts', category: 'adventure', intensity: 5 },
        { id: 'technology', name: 'Advanced Tech', category: 'technology', intensity: 4 },
        { id: 'mystery', name: 'Unsolved Mysteries', category: 'science', intensity: 4 },
        { id: 'protection', name: 'Guardian Protocols', category: 'philosophy', intensity: 3 }
      ],
      dealbreakers: ['Betrayal of trust', 'Unnecessary cruelty', 'Exposure of secrets'],
      preferredActivities: ['adventurous', 'intellectual', 'romantic'],
      conversationStyle: 'direct',
      values: ['loyalty', 'freedom', 'honor', 'efficiency'],
      background: 'Elite operative from the Shadow Realm, sworn to protect interdimensional stability',
      goals: 'To maintain balance between light and shadow while finding personal connection',
      favoriteTopics: ['Dimensional physics', 'Stealth techniques', 'Protection strategies', 'Energy manipulation']
    },
    lastInteractionDate: undefined,
    photoGallery: [
      { id: 'portrait', url: getCharacterImage('nightshade'), title: 'Shadow Form', description: 'In operational attire', unlockedAt: 0, unlocked: true, rarity: 'common' }
    ],
    dateHistory: [],
    knownInfo: { ...defaultKnownInfo },
    dailyInteractions: getDefaultDailyInteractions(0),
    relationshipStatus: getDefaultRelationshipStatus("Nightshade Voidwalker"),
    relationshipMemories: [],
    personalityGrowth: [
      { trait: 'mysterious', baseValue: 10, currentValue: 10, growthHistory: [], maxGrowth: 10, minGrowth: 8 },
      { trait: 'intense', baseValue: 8, currentValue: 8, growthHistory: [], maxGrowth: 10, minGrowth: 5 },
      { trait: 'protective', baseValue: 9, currentValue: 9, growthHistory: [], maxGrowth: 10, minGrowth: 6 }
    ],
    superLikesReceived: [],
    activeConflicts: [],
    conflictHistory: [],
    icebreakerMessages: [],
    temporaryBoosts: []
  },
  {
    id: 'kronos',
    name: "Dr. Kronos Mindweave",
    species: 'Cephalopi - Neural Engineer',
    gender: 'male',
    personality: 'Brilliant • Curious • Complex',
    image: getCharacterImage('kronos'),
    affection: 0,
    mood: getRandomMood(),
    milestones: [...defaultMilestones],
    profile: {
      interests: [
        { id: 'neuroscience', name: 'Neural Networks', category: 'science', intensity: 5 },
        { id: 'cybernetics', name: 'Bio-Cybernetics', category: 'technology', intensity: 5 },
        { id: 'consciousness', name: 'Consciousness Studies', category: 'philosophy', intensity: 4 },
        { id: 'innovation', name: 'Mental Enhancement', category: 'technology', intensity: 4 }
      ],
      dealbreakers: ['Mental stagnation', 'Fear of progress', 'Rejection of enhancement'],
      preferredActivities: ['intellectual', 'creative', 'social'],
      conversationStyle: 'analytical',
      values: ['innovation', 'growth', 'efficiency', 'freedom'],
      background: 'Pioneering researcher in neural-cybernetic interfaces, pushing the boundaries of consciousness',
      goals: 'To unlock the full potential of biological and artificial intelligence integration',
      favoriteTopics: ['Neural pathways', 'Cybernetic enhancement', 'Consciousness theory', 'Mental evolution']
    },
    lastInteractionDate: undefined,
    photoGallery: [
      { id: 'portrait', url: getCharacterImage('kronos'), title: 'Research Station', description: 'In his laboratory', unlockedAt: 0, unlocked: true, rarity: 'common' }
    ],
    dateHistory: [],
    knownInfo: { ...defaultKnownInfo },
    dailyInteractions: getDefaultDailyInteractions(0),
    relationshipStatus: getDefaultRelationshipStatus("Dr. Kronos Mindweave"),
    relationshipMemories: [],
    personalityGrowth: [
      { trait: 'brilliant', baseValue: 10, currentValue: 10, growthHistory: [], maxGrowth: 10, minGrowth: 8 },
      { trait: 'curious', baseValue: 9, currentValue: 9, growthHistory: [], maxGrowth: 10, minGrowth: 7 },
      { trait: 'complex', baseValue: 8, currentValue: 8, growthHistory: [], maxGrowth: 10, minGrowth: 5 }
    ],
    superLikesReceived: [],
    activeConflicts: [],
    conflictHistory: [],
    icebreakerMessages: [],
    temporaryBoosts: []
  }
];
