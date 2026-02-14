export interface Character {
  id: string;
  name: string;
  species: string;
  gender: Gender;
  personality: string;
  image: string;
  affection: number;
  mood: CharacterMood;
  milestones: RelationshipMilestone[];
  profile: CharacterProfile;
  lastInteractionDate?: string; // YYYY-MM-DD format for daily tracking
  photoGallery: CharacterPhoto[];
  dateHistory: DateHistoryEntry[];
  knownInfo: CharacterKnownInfo; // Progressive disclosure tracking
  // Daily interaction tracking
  dailyInteractions: DailyInteractionData;
  // Relationship status tracking
  relationshipStatus: RelationshipStatus;
  relationshipMemories: RelationshipMemory[];
  // Phase 4: Advanced Features
  personalityGrowth: PersonalityGrowth[];
  superLikesReceived: SuperLike[];
  activeConflicts: RelationshipConflict[];
  conflictHistory: RelationshipConflict[];
  icebreakerMessages: IcebreakerMessage[];
  temporaryBoosts: TemporaryBoost[];
}

export interface PlayerCharacter {
  name: string;
  species: 'human' | 'plantoid' | 'aquatic' | 'reptilian';
  gender: Gender;
  sexualPreference: SexualPreference;
  traits: string[];
  backstory: string;
  stats: PlayerStats;
}

export interface PlayerStats {
  charisma: number;
  intelligence: number;
  adventure: number;
  empathy: number;
  technology: number;
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  reward: string;
  type: 'weekly' | 'daily';
  category?: 'social' | 'exploration' | 'personal' | 'fitness' | 'study' | 'leisure';
  statBonus?: Partial<PlayerStats>;
}

export interface SelfImprovementActivity extends Activity {
  type: 'daily';
  energyCost: number;
  timeSlots: number; // How many time slots this takes
}

export type GameScreen =
  | 'main-menu'
  | 'character-creation'
  | 'main-hub'
  | 'character-interaction'
  | 'activities'
  | 'self-improvement'
  | 'character-profile'
  | 'date-planning'
  | 'photo-gallery'
  | 'achievements'
  | 'relationship-timeline';

export interface DialogueOption {
  id: string;
  text: string;
  topic: string;
  emotion?: EmotionType;
  consequence?: string;
  requiresAffection?: number;
  requiresMood?: CharacterMood;
  nextOptions?: string[];
}

export interface DialogueTree {
  id: string;
  characterId: string;
  rootOptions: DialogueOption[];
  branches: { [key: string]: DialogueOption[] };
}

export interface DialogueResponse {
  text: string;
  emotion: EmotionType;
  affectionChange: number;
  consequence?: string;
}

export type EmotionType =
  | 'happy'
  | 'sad'
  | 'excited'
  | 'nervous'
  | 'flirty'
  | 'thoughtful'
  | 'surprised'
  | 'hopeful'
  | 'neutral';

export type CharacterMood =
  | 'cheerful'
  | 'melancholy'
  | 'romantic'
  | 'analytical'
  | 'adventurous'
  | 'tired'
  | 'excited'
  | 'neutral';

export interface RelationshipMilestone {
  id: string;
  name: string;
  description: string;
  unlockedAt: number; // affection level
  achieved: boolean;
  achievedDate?: Date;
}

export interface CharacterProfile {
  interests: Interest[];
  dealbreakers: string[];
  preferredActivities: ActivityType[];
  conversationStyle: ConversationStyle;
  values: PersonalValue[];
  background: string;
  goals: string;
  favoriteTopics: string[];
}

export interface Interest {
  id: string;
  name: string;
  category: InterestCategory;
  intensity: 1 | 2 | 3 | 4 | 5; // 1 = mild interest, 5 = passionate
}

export type InterestCategory =
  | 'science'
  | 'arts'
  | 'adventure'
  | 'nature'
  | 'technology'
  | 'philosophy'
  | 'culture'
  | 'exploration';

export type ActivityType =
  | 'intellectual'
  | 'adventurous'
  | 'romantic'
  | 'cultural'
  | 'relaxing'
  | 'social'
  | 'creative';

export type ConversationStyle =
  | 'direct'
  | 'philosophical'
  | 'playful'
  | 'serious'
  | 'emotional'
  | 'analytical';

export type PersonalValue =
  | 'honesty'
  | 'adventure'
  | 'harmony'
  | 'growth'
  | 'tradition'
  | 'innovation'
  | 'loyalty'
  | 'freedom'
  | 'honor'
  | 'empathy'
  | 'efficiency';

export type Gender = 'male' | 'female' | 'non-binary' | 'other';

export type SexualPreference = 'men' | 'women' | 'all' | 'non-binary' | 'alien-species';

export interface DatePlan {
  id: string;
  name: string;
  description: string;
  activityType: ActivityType;
  location: string;
  duration: number; // minutes
  preferredTopics: string[];
  requiredAffection: number;
  compatibilityBonus: number;
}

export interface CompatibilityScore {
  overall: number; // 0-100
  breakdown: {
    interests: number;
    values: number;
    conversationStyle: number;
    activities: number;
  };
  explanation: string[];
}

export interface CharacterPhoto {
  id: string;
  url: string;
  title: string;
  description: string;
  unlockedAt: number; // affection level
  unlocked: boolean;
  unlockedDate?: Date;
  rarity: PhotoRarity;
}

export type PhotoRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: AchievementCategory;
  condition: AchievementCondition;
  reward?: AchievementReward;
  achieved: boolean;
  achievedDate?: Date;
  progress: number; // 0-100
}

export type AchievementCategory =
  | 'relationship'
  | 'exploration'
  | 'conversation'
  | 'dating'
  | 'collection'
  | 'mastery';

export interface AchievementCondition {
  type:
    | 'affection'
    | 'milestone'
    | 'date_count'
    | 'conversation_count'
    | 'photo_unlock'
    | 'compatibility';
  target: number;
  characterId?: string;
  specificMilestone?: string;
}

export interface AchievementReward {
  type: 'photo' | 'dialogue_option' | 'date_plan' | 'cosmetic';
  id: string;
  description: string;
}

// Phase 4: Advanced Features Types

export interface PersonalityGrowth {
  trait: string;
  baseValue: number;
  currentValue: number;
  growthHistory: GrowthEvent[];
  maxGrowth: number;
  minGrowth: number;
}

export interface GrowthEvent {
  id: string;
  date: Date;
  trigger: GrowthTrigger;
  change: number;
  reason: string;
}

export type GrowthTrigger =
  | 'positive_interaction'
  | 'negative_interaction'
  | 'milestone_achievement'
  | 'date_success'
  | 'date_failure'
  | 'conversation_choice'
  | 'conflict_resolution';

export interface SuperLike {
  id: string;
  characterId: string;
  usedDate: Date;
  effect: SuperLikeEffect;
  result: SuperLikeResult;
}

export interface SuperLikeEffect {
  affectionBonus: number;
  specialDialogue: boolean;
  moodBoost: boolean;
  temporaryCompatibilityBonus: number;
  duration: number; // hours
}

export interface SuperLikeResult {
  affectionGained: number;
  specialResponse: string;
  unlockedContent?: string[];
}

export interface RelationshipConflict {
  id: string;
  characterId: string;
  type: ConflictType;
  severity: ConflictSeverity;
  trigger: string;
  description: string;
  startDate: Date;
  resolved: boolean;
  resolutionDate?: Date;
  resolutionMethod?: ConflictResolution;
  affectionPenalty: number;
  resolutionOptions: ConflictResolutionOption[];
}

export type ConflictType =
  | 'values_clash'
  | 'miscommunication'
  | 'jealousy'
  | 'expectation_mismatch'
  | 'lifestyle_difference'
  | 'trust_issue';

export type ConflictSeverity = 'minor' | 'moderate' | 'major' | 'critical';

export interface ConflictResolution {
  method: 'apologize' | 'discuss' | 'compromise' | 'gift' | 'time_apart' | 'ignore';
  effectiveness: number; // 0-100
  affectionRecovery: number;
  personalityGrowth?: PersonalityGrowth[];
}

export interface ConflictResolutionOption {
  id: string;
  method: ConflictResolution['method'];
  label: string;
  description: string;
  requirements?: {
    playerStat?: keyof PlayerStats;
    minValue?: number;
    characterAffection?: number;
  };
  preview: {
    successChance: number;
    affectionChange: number;
    personalityEffects: string[];
  };
}

export interface IcebreakerMessage {
  id: string;
  characterId: string;
  category: IcebreakerCategory;
  message: string;
  context: IcebreakerContext;
  effectiveness: number; // 0-100 based on compatibility
  used: boolean;
  usedDate?: Date;
  response?: string;
}

export type IcebreakerCategory =
  | 'compliment'
  | 'question'
  | 'shared_interest'
  | 'humor'
  | 'observation'
  | 'cultural_exchange';

export interface IcebreakerContext {
  requiredAffection: number;
  basedOnInterest?: string;
  basedOnMood?: CharacterMood;
  timeOfDay?: 'morning' | 'afternoon' | 'evening' | 'night';
  characterPersonality?: string[];
}

export type MoodState = CharacterMood;

export interface TemporaryBoost {
  id: string;
  type: 'super_like' | 'successful_resolution' | 'perfect_date' | 'milestone_bonus';
  effect: 'compatibility_bonus' | 'affection_multiplier' | 'mood_boost' | 'interaction_bonus';
  value: number;
  startDate: Date;
  duration: number; // hours
  expiresAt: Date;
  description: string;
}

export interface DateHistoryEntry {
  id: string;
  datePlanId: string;
  date: Date;
  success: boolean;
  affectionGained: number;
  compatibilityAtTime: number;
  playerLevel: number;
  notes?: string;
}

export interface DailyInteractionData {
  lastResetDate: string; // YYYY-MM-DD format
  interactionsUsed: number;
  maxInteractions: number;
  timezone?: string; // User's timezone (e.g., 'America/New_York')
}

export interface RelationshipTimeline {
  characterId: string;
  events: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  type: 'first_meeting' | 'milestone' | 'date' | 'conversation' | 'photo_unlock' | 'achievement';
  date: Date;
  title: string;
  description: string;
  affectionLevel: number;
  icon: string;
  significance: 'minor' | 'major' | 'epic';
}

export interface PlayerAdvancedState {
  superLikesAvailable: number;
  superLikesUsed: SuperLike[];
  lastSuperLikeReset: Date;
  conflictResolutionSkill: number; // 0-100, improves with successful resolutions
  icebreakerUnlocks: string[]; // unlocked icebreaker categories
}

// Progressive Information Disclosure System
export interface CharacterKnownInfo {
  // Basic info (always known after first encounter)
  name: boolean;
  appearance: boolean;

  // Basic details (unlocked after first conversation)
  species: boolean;
  basicPersonality: boolean;

  // Intermediate info (unlocked at various affection levels)
  mood: boolean; // Unlocked at 5 affection
  interests: boolean; // Unlocked at 10 affection
  conversationStyle: boolean; // Unlocked at 15 affection
  values: boolean; // Unlocked at 25 affection

  // Deep info (unlocked at higher affection levels)
  background: boolean; // Unlocked at 35 affection
  goals: boolean; // Unlocked at 50 affection
  dealbreakers: boolean; // Unlocked at 60 affection
  favoriteTopics: boolean; // Unlocked at 70 affection

  // Secret info (unlocked through milestones or special events)
  deepPersonality: boolean; // Unlocked through milestones
  secretTraits: boolean; // Unlocked through specific interactions
}

// Relationship Status System
export interface RelationshipStatus {
  level: RelationshipLevel;
  title: string;
  description: string;
  compatibility: number; // 0-100 based on personalities, values, interests
  trust: number; // 0-100 separate from affection
  intimacy: number; // 0-100 emotional closeness
  commitment: number; // 0-100 dedication to the relationship
  communicationStyle: CommunicationStyleMatch;
  sharedExperiences: number; // Count of significant moments together
  conflicts: number; // Total number of conflicts resolved
  lastStatusChange: Date;
}

export type RelationshipLevel =
  | 'stranger' // 0-10 affection
  | 'acquaintance' // 11-20 affection
  | 'friend' // 21-35 affection
  | 'close_friend' // 36-50 affection
  | 'romantic_interest' // 51-65 affection
  | 'dating' // 66-80 affection
  | 'committed_partner' // 81-95 affection
  | 'soulmate'; // 96-100 affection

export interface CommunicationStyleMatch {
  compatibility: number; // How well your styles mesh
  playerPreference: ConversationStyle;
  characterStyle: ConversationStyle;
  adaptationLevel: number; // How much each has adapted to the other
}

export interface RelationshipMemory {
  id: string;
  date: Date;
  type: MemoryType;
  title: string;
  description: string;
  emotionalImpact: number; // -10 to +10
  participantEmotions: EmotionType[];
  affectionAtTime: number;
  consequence?: string;
  tags: string[];
}

export type MemoryType =
  | 'first_meeting'
  | 'meaningful_conversation'
  | 'romantic_moment'
  | 'conflict_resolution'
  | 'shared_activity'
  | 'milestone_achievement'
  | 'gift_exchange'
  | 'date_experience'
  | 'personal_revelation'
  | 'crisis_support';
