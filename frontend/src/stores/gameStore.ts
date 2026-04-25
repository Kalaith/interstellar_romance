import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { gameApi } from '../api/gameApi';
import {
  Achievement,
  Activity,
  Character,
  CharacterKnownInfo,
  CharacterMood,
  DateHistoryEntry,
  DatePlan,
  DialogueOption,
  GameScreen,
  PlayerAdvancedState,
  PlayerCharacter,
  PlayerCreationInput,
  RelationshipConflict,
  RelationshipMemory,
  SelfImprovementActivity,
  StorylineEvent,
  SuperLikeResult,
} from '../types/game';

interface MoodContent {
  mood: CharacterMood;
  description: string;
  bonus: number;
  penalty: number;
  preferredTopics: string[];
}

interface GameContent {
  datePlans: DatePlan[];
  weeklyActivities: Activity[];
  selfImprovementActivities: SelfImprovementActivity[];
  moods: MoodContent[];
}

interface DialogueResult {
  option: DialogueOption;
  response: {
    text: string;
    emotion: string;
    affectionChange: number;
    consequence?: string;
  };
  affectionChange: number;
  affection: number;
}

interface DateResult {
  plan: DatePlan;
  outcome: {
    success: boolean;
    affectionGained: number;
    compatibility: {
      overall: number;
      breakdown?: Record<string, number>;
      explanation?: string[];
    };
    preferredActivity: boolean;
    memory?: {
      title?: string;
      description?: string;
    };
  };
  affection: number;
}

interface GameState {
  currentScreen: GameScreen;
  isInitialized: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  currentWeek: number;
  player: PlayerCharacter | null;
  characters: Character[];
  selectedCharacter: Character | null;
  selectedActivities: string[];
  achievements: Achievement[];
  totalConversations: number;
  totalDates: number;
  availableStorylines: Record<string, StorylineEvent[]>;
  advancedState: PlayerAdvancedState;
  content: GameContent;

  setScreen: (screen: GameScreen) => void;
  initializeGame: () => Promise<void>;
  loadGame: () => Promise<void>;
  createPlayer: (player: PlayerCreationInput) => Promise<void>;
  selectCharacter: (characterId: string) => Promise<void>;
  chooseDialogue: (characterId: string, optionId: string) => Promise<DialogueResult | null>;
  completeDate: (datePlanId: string) => Promise<DateResult | null>;
  completeSelfImprovement: (activityId: string) => Promise<void>;
  completeStorylineChoice: (storylineId: string, choiceId: string) => Promise<void>;
  useSuperLike: (characterId: string) => Promise<SuperLikeResult | null>;
  createConflict: (characterId: string, force?: boolean) => Promise<RelationshipConflict | null>;
  resolveConflict: (conflictId: string, optionId: string) => Promise<void>;
  refreshDailyMoods: () => Promise<void>;
  confirmActivities: () => Promise<void>;
  toggleActivity: (activityId: string) => void;
  resetGame: () => void;
  clearError: () => void;

  canTalkToCharacterToday: (characterId: string) => boolean;
  getRemainingInteractions: (characterId: string) => number;
  getMoodDescription: (mood: CharacterMood) => string;

  // Legacy compatibility shims. Gameplay mutations are now backend actions.
  updateAffection: (characterId: string, amount: number) => void;
  updateMood: (characterId: string, mood: CharacterMood) => void;
  updateLastInteractionDate: (characterId: string) => void;
  addDateToHistory: (
    characterId: string,
    datePlanId: string,
    affectionGained: number,
    success: boolean
  ) => void;
  addRelationshipMemory: (characterId: string, memory: RelationshipMemory) => void;
  incrementConversations: () => void;
  updateAchievements: () => void;
  useDailyInteraction: (characterId: string) => boolean;
  updateCharacter: (characterId: string, updates: Partial<Character>) => void;
  nextWeek: () => void;
  unlockCharacterInfo: (characterId: string, infoType: keyof CharacterKnownInfo) => void;
  updateCharacterKnowledge: (characterId: string) => void;
  updateStorylines: (characterId: string) => void;
  batchUpdate: (
    characterId: string,
    updates: {
      achievements?: boolean;
      knowledge?: boolean;
      storylines?: boolean;
    }
  ) => void;
}

const emptyAdvancedState: PlayerAdvancedState = {
  superLikesAvailable: 0,
  superLikesUsed: [],
  lastSuperLikeReset: new Date(0),
  conflictResolutionSkill: 0,
  icebreakerUnlocks: [],
};

const emptyContent: GameContent = {
  datePlans: [],
  weeklyActivities: [],
  selfImprovementActivities: [],
  moods: [],
};

const initialState = {
  currentScreen: 'main-menu' as GameScreen,
  isInitialized: false,
  isLoading: false,
  isSaving: false,
  error: null,
  currentWeek: 1,
  player: null,
  characters: [],
  selectedCharacter: null,
  selectedActivities: [],
  achievements: [],
  totalConversations: 0,
  totalDates: 0,
  availableStorylines: {},
  advancedState: emptyAdvancedState,
  content: emptyContent,
};

const gameScreens: GameScreen[] = [
  'main-menu',
  'character-creation',
  'main-hub',
  'character-interaction',
  'activities',
  'self-improvement',
  'character-profile',
  'date-planning',
  'photo-gallery',
  'achievements',
  'relationship-timeline',
];

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setScreen: screen => set({ currentScreen: screen }),

      initializeGame: async () => {
        if (get().isInitialized || get().isLoading) {
          return;
        }

        await get().loadGame();
      },

      loadGame: async () => {
        set({ isLoading: true, error: null });
        try {
          const payload = await gameApi.loadGame();
          set(state => ({
            ...normalizeGameState(payload, state.currentScreen),
            isInitialized: true,
            isLoading: false,
            error: null,
          }));
        } catch (error) {
          set({
            isInitialized: true,
            isLoading: false,
            error: errorMessage(error),
          });
        }
      },

      createPlayer: async player => {
        set({ isSaving: true, error: null });
        try {
          const payload = await gameApi.startGame(player);
          set({
            ...normalizeGameState(payload, 'main-hub'),
            isInitialized: true,
            isSaving: false,
            error: null,
          });
        } catch (error) {
          set({ isSaving: false, error: errorMessage(error) });
          throw error;
        }
      },

      selectCharacter: async characterId => {
        set({ isSaving: true, error: null });
        try {
          const payload = await gameApi.selectCharacter(characterId);
          set({
            ...normalizeGameState(payload, 'character-profile'),
            isSaving: false,
            error: null,
          });
        } catch (error) {
          set({ isSaving: false, error: errorMessage(error) });
          throw error;
        }
      },

      chooseDialogue: async (characterId, optionId) => {
        set({ isSaving: true, error: null });
        try {
          const payload = await gameApi.chooseDialogue(
            characterId,
            optionId,
            Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
          );
          const record = asRecord(payload);
          set({
            ...normalizeGameState(record.game_state ?? payload, get().currentScreen),
            isSaving: false,
            error: null,
          });
          return normalizeDialogueResult(record.dialogue);
        } catch (error) {
          set({ isSaving: false, error: errorMessage(error) });
          return null;
        }
      },

      completeDate: async datePlanId => {
        const selectedCharacter = get().selectedCharacter;
        if (!selectedCharacter) {
          return null;
        }

        set({ isSaving: true, error: null });
        try {
          const payload = await gameApi.completeDate(selectedCharacter.id, datePlanId);
          const record = asRecord(payload);
          set({
            ...normalizeGameState(record.game_state ?? payload, get().currentScreen),
            isSaving: false,
            error: null,
          });
          return normalizeDateResult(record.date);
        } catch (error) {
          set({ isSaving: false, error: errorMessage(error) });
          return null;
        }
      },

      completeSelfImprovement: async activityId => {
        set({ isSaving: true, error: null });
        try {
          const payload = await gameApi.completeSelfImprovement(activityId);
          set({
            ...normalizeGameState(payload, get().currentScreen),
            isSaving: false,
            error: null,
          });
        } catch (error) {
          set({ isSaving: false, error: errorMessage(error) });
        }
      },

      completeStorylineChoice: async (storylineId, choiceId) => {
        set({ isSaving: true, error: null });
        try {
          const payload = await gameApi.completeStorylineChoice(storylineId, choiceId);
          const record = asRecord(payload);
          set({
            ...normalizeGameState(record.game_state ?? payload, get().currentScreen),
            isSaving: false,
            error: null,
          });
        } catch (error) {
          set({ isSaving: false, error: errorMessage(error) });
        }
      },

      useSuperLike: async characterId => {
        set({ isSaving: true, error: null });
        try {
          const payload = await gameApi.useSuperLike(characterId);
          const record = asRecord(payload);
          set({
            ...normalizeGameState(record.game_state ?? payload, get().currentScreen),
            isSaving: false,
            error: null,
          });
          return normalizeSuperLikeResult(asRecord(record.super_like).result);
        } catch (error) {
          set({ isSaving: false, error: errorMessage(error) });
          return null;
        }
      },

      createConflict: async (characterId, force = false) => {
        set({ isSaving: true, error: null });
        try {
          const payload = await gameApi.createConflict(characterId, force);
          const record = asRecord(payload);
          set({
            ...normalizeGameState(record.game_state ?? payload, get().currentScreen),
            isSaving: false,
            error: null,
          });
          return record.conflict ? normalizeConflict(record.conflict) : null;
        } catch (error) {
          set({ isSaving: false, error: errorMessage(error) });
          return null;
        }
      },

      resolveConflict: async (conflictId, optionId) => {
        set({ isSaving: true, error: null });
        try {
          const payload = await gameApi.resolveConflict(conflictId, optionId);
          const record = asRecord(payload);
          set({
            ...normalizeGameState(record.game_state ?? payload, get().currentScreen),
            isSaving: false,
            error: null,
          });
        } catch (error) {
          set({ isSaving: false, error: errorMessage(error) });
        }
      },

      refreshDailyMoods: async () => {
        set({ isSaving: true, error: null });
        try {
          const payload = await gameApi.refreshMoods();
          set({
            ...normalizeGameState(payload, get().currentScreen),
            isSaving: false,
            error: null,
          });
        } catch (error) {
          set({ isSaving: false, error: errorMessage(error) });
        }
      },

      confirmActivities: async () => {
        const activityIds = get().selectedActivities;
        if (activityIds.length !== 2) {
          return;
        }

        set({ isSaving: true, error: null });
        try {
          const payload = await gameApi.completeActivities(activityIds);
          set({
            ...normalizeGameState(payload, 'main-hub'),
            selectedActivities: [],
            isSaving: false,
            error: null,
          });
        } catch (error) {
          set({ isSaving: false, error: errorMessage(error) });
        }
      },

      toggleActivity: activityId =>
        set(state => {
          const isSelected = state.selectedActivities.includes(activityId);
          const selectedActivities = isSelected
            ? state.selectedActivities.filter(id => id !== activityId)
            : state.selectedActivities.length < 2
              ? [...state.selectedActivities, activityId]
              : state.selectedActivities;

          return { selectedActivities };
        }),

      resetGame: () => {
        localStorage.removeItem('interstellar-romance-game');
        set({
          ...initialState,
          isInitialized: true,
          currentScreen: 'character-creation',
        });
      },

      clearError: () => set({ error: null }),

      canTalkToCharacterToday: characterId => get().getRemainingInteractions(characterId) > 0,

      getRemainingInteractions: characterId => {
        const character = get().characters.find(candidate => candidate.id === characterId);
        if (!character) {
          return 0;
        }

        return Math.max(
          0,
          character.dailyInteractions.maxInteractions -
            character.dailyInteractions.interactionsUsed
        );
      },

      getMoodDescription: mood =>
        get().content.moods.find(candidate => candidate.mood === mood)?.description ||
        `is feeling ${mood}.`,

      updateAffection: () => undefined,
      updateMood: () => undefined,
      updateLastInteractionDate: () => undefined,
      addDateToHistory: () => undefined,
      addRelationshipMemory: () => undefined,
      incrementConversations: () => undefined,
      updateAchievements: () => undefined,
      useDailyInteraction: characterId => get().canTalkToCharacterToday(characterId),
      updateCharacter: () => undefined,
      nextWeek: () => undefined,
      unlockCharacterInfo: () => undefined,
      updateCharacterKnowledge: () => undefined,
      updateStorylines: () => undefined,
      batchUpdate: () => undefined,
    }),
    {
      name: 'interstellar-romance-game',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      partialize: state => ({ currentScreen: state.currentScreen }),
      merge: (persisted, current) => {
        const persistedScreen = asRecord(persisted).currentScreen;
        return {
          ...current,
          currentScreen: isGameScreen(persistedScreen)
            ? persistedScreen
            : current.currentScreen,
        };
      },
    }
  )
);

function normalizeGameState(payload: unknown, requestedScreen?: GameScreen): Partial<GameState> {
  const state = asRecord(payload);
  const content = normalizeContent(state.content);
  const selectedCharacterId = asString(state.selectedCharacterId ?? state.selected_character_id);
  const characters = asArray(state.characters).map(character => normalizeCharacter(character));
  const selectedCharacter =
    characters.find(character => character.id === selectedCharacterId) || null;
  const player = normalizePlayer(state.player);
  const currentScreen = player
    ? requestedScreen || 'main-hub'
    : requestedScreen === 'character-creation'
      ? 'character-creation'
      : 'main-menu';

  return {
    currentScreen,
    player,
    characters,
    selectedCharacter,
    currentWeek: toNumber(state.currentWeek ?? state.current_week, 1),
    totalConversations: toNumber(state.totalConversations ?? state.total_conversations, 0),
    totalDates: toNumber(state.totalDates ?? state.total_dates, 0),
    selectedActivities: asArray<string>(state.selectedActivities ?? state.selected_activities),
    achievements: asArray(state.achievements).map(normalizeAchievement),
    availableStorylines: normalizeStorylines(state.availableStorylines),
    advancedState: normalizeAdvancedState(state.advancedState),
    content,
  };
}

function normalizeContent(raw: unknown): GameContent {
  const content = asRecord(raw);
  return {
    datePlans: asArray(content.datePlans).map(normalizeDatePlan),
    weeklyActivities: asArray(content.weeklyActivities).map(activity =>
      normalizeActivity(activity)
    ),
    selfImprovementActivities: asArray(content.selfImprovementActivities).map(activity =>
      normalizeActivity(activity, 'daily')
    ) as SelfImprovementActivity[],
    moods: asArray(content.moods).map(normalizeMood),
  };
}

function normalizePlayer(raw: unknown): PlayerCharacter | null {
  if (!raw) {
    return null;
  }

  const player = asRecord(raw);
  return {
    name: asString(player.name),
    species: asString(player.species, 'human') as PlayerCharacter['species'],
    gender: asString(player.gender, 'other') as PlayerCharacter['gender'],
    sexualPreference: asString(
      player.sexualPreference,
      'all'
    ) as PlayerCharacter['sexualPreference'],
    traits: asArray<string>(player.traits),
    backstory: asString(player.backstory),
    stats: {
      charisma: toNumber(asRecord(player.stats).charisma, 5),
      intelligence: toNumber(asRecord(player.stats).intelligence, 5),
      adventure: toNumber(asRecord(player.stats).adventure, 5),
      empathy: toNumber(asRecord(player.stats).empathy, 5),
      technology: toNumber(asRecord(player.stats).technology, 5),
    },
  };
}

function normalizeCharacter(raw: unknown): Character {
  const character = asRecord(raw);
  const relationshipStatus = asRecord(character.relationshipStatus);

  return {
    id: asString(character.id),
    name: asString(character.name),
    species: asString(character.species),
    gender: asString(character.gender, 'other') as Character['gender'],
    personality: asString(character.personality),
    image: asString(character.image),
    affection: toNumber(character.affection),
    mood: asString(character.mood, 'neutral') as CharacterMood,
    milestones: asArray(character.milestones).map(milestone => {
      const item = asRecord(milestone);
      return {
        id: asString(item.id),
        name: asString(item.name),
        description: asString(item.description),
        unlockedAt: toNumber(item.unlockedAt ?? item.unlocked_at),
        achieved: toBoolean(item.achieved),
        achievedDate: toOptionalDate(item.achievedDate ?? item.achieved_at),
      };
    }),
    profile: asRecord(character.profile) as unknown as Character['profile'],
    lastInteractionDate: asOptionalString(
      character.lastInteractionDate ?? character.last_interaction_date
    ),
    photoGallery: asArray(character.photoGallery).map(photo => {
      const item = asRecord(photo);
      return {
        id: asString(item.id),
        url: asString(item.url),
        title: asString(item.title),
        description: asString(item.description),
        unlockedAt: toNumber(item.unlockedAt ?? item.unlocked_at_affection),
        unlocked: toBoolean(item.unlocked),
        unlockedDate: toOptionalDate(item.unlockedDate ?? item.unlocked_at),
        rarity: asString(item.rarity, 'common') as Character['photoGallery'][number]['rarity'],
      };
    }),
    dateHistory: asArray(character.dateHistory).map(normalizeDateHistory),
    knownInfo: normalizeKnownInfo(character.knownInfo),
    dailyInteractions: {
      lastResetDate: asString(
        asRecord(character.dailyInteractions).lastResetDate ??
          asRecord(character.dailyInteractions).daily_reset_date
      ),
      interactionsUsed: toNumber(
        asRecord(character.dailyInteractions).interactionsUsed ??
          asRecord(character.dailyInteractions).interactions_used
      ),
      maxInteractions: toNumber(
        asRecord(character.dailyInteractions).maxInteractions ??
          asRecord(character.dailyInteractions).max_interactions,
        1
      ),
      timezone: asOptionalString(asRecord(character.dailyInteractions).timezone),
    },
    relationshipStatus: {
      level: asString(relationshipStatus.level, 'stranger') as Character['relationshipStatus']['level'],
      title: asString(relationshipStatus.title),
      description: asString(relationshipStatus.description),
      compatibility: toNumber(relationshipStatus.compatibility),
      trust: toNumber(relationshipStatus.trust),
      intimacy: toNumber(relationshipStatus.intimacy),
      commitment: toNumber(relationshipStatus.commitment),
      communicationStyle: (relationshipStatus.communicationStyle ||
        relationshipStatus.communication_style ||
        {}) as Character['relationshipStatus']['communicationStyle'],
      sharedExperiences: toNumber(
        relationshipStatus.sharedExperiences ?? relationshipStatus.shared_experiences
      ),
      conflicts: toNumber(relationshipStatus.conflicts ?? relationshipStatus.conflicts_count),
      lastStatusChange: toDate(
        relationshipStatus.lastStatusChange ?? relationshipStatus.last_status_change
      ),
    },
    relationshipMemories: asArray(character.relationshipMemories).map(normalizeMemory),
    personalityGrowth: asArray(character.personalityGrowth),
    superLikesReceived: asArray(character.superLikesReceived),
    activeConflicts: asArray(character.activeConflicts).map(normalizeConflict),
    conflictHistory: asArray(character.conflictHistory).map(normalizeConflict),
    icebreakerMessages: asArray(character.availableIcebreakers).map(icebreaker => {
      const item = asRecord(icebreaker);
      return {
        id: asString(item.id),
        characterId: asString(item.characterId ?? item.character_id),
        category: asString(item.category) as Character['icebreakerMessages'][number]['category'],
        message: asString(item.message),
        context: asRecord(item.context) as unknown as Character['icebreakerMessages'][number]['context'],
        effectiveness: toNumber(item.effectiveness),
        used: toBoolean(item.used),
        usedDate: toOptionalDate(item.usedDate ?? item.used_at),
        response: asOptionalString(item.response),
      };
    }),
    temporaryBoosts: asArray(character.temporaryBoosts),
    availableDialogueOptions: asArray(character.availableDialogueOptions).map(normalizeDialogueOption),
    availableIcebreakers: asArray(character.availableIcebreakers).map(icebreaker => {
      const item = asRecord(icebreaker);
      return {
        id: asString(item.id),
        characterId: asString(item.characterId ?? item.character_id),
        category: asString(item.category) as Character['icebreakerMessages'][number]['category'],
        message: asString(item.message),
        context: asRecord(item.context) as unknown as Character['icebreakerMessages'][number]['context'],
        effectiveness: toNumber(item.effectiveness),
        used: toBoolean(item.used),
      };
    }),
    romanticallyCompatible: toBoolean(character.romanticallyCompatible, true),
  };
}

function normalizeDialogueOption(raw: unknown): DialogueOption {
  const option = asRecord(raw);
  return {
    id: asString(option.id),
    text: asString(option.text),
    topic: asString(option.topic),
    emotion: asOptionalString(option.emotion) as DialogueOption['emotion'],
    consequence: asOptionalString(option.consequence),
    requiresAffection: toOptionalNumber(option.requiresAffection ?? option.requires_affection),
    requiresMood: asOptionalString(option.requiresMood ?? option.requires_mood) as
      | CharacterMood
      | undefined,
    nextOptions: asArray<string>(option.nextOptions ?? option.next_option_ids),
  };
}

function normalizeDatePlan(raw: unknown): DatePlan {
  const plan = asRecord(raw);
  return {
    id: asString(plan.id),
    name: asString(plan.name),
    description: asString(plan.description),
    activityType: asString(plan.activityType ?? plan.activity_type) as DatePlan['activityType'],
    location: asString(plan.location),
    duration: toNumber(plan.duration ?? plan.duration_minutes),
    preferredTopics: asArray<string>(plan.preferredTopics ?? plan.preferred_topics),
    requiredAffection: toNumber(plan.requiredAffection ?? plan.required_affection),
    compatibilityBonus: toNumber(plan.compatibilityBonus ?? plan.compatibility_bonus),
  };
}

function normalizeActivity(raw: unknown, fallbackType?: Activity['type']): Activity {
  const activity = asRecord(raw);
  return {
    id: asString(activity.id),
    name: asString(activity.name),
    description: asString(activity.description),
    reward: asString(activity.reward),
    type: asString(activity.type, fallbackType || 'weekly') as Activity['type'],
    category: asOptionalString(activity.category) as Activity['category'],
    statBonus: asRecord(activity.statBonus ?? activity.stat_bonus),
    energyCost: toOptionalNumber(activity.energyCost ?? activity.energy_cost),
    timeSlots: toOptionalNumber(activity.timeSlots ?? activity.time_slots),
  };
}

function normalizeMood(raw: unknown): MoodContent {
  const mood = asRecord(raw);
  return {
    mood: asString(mood.mood, 'neutral') as CharacterMood,
    description: asString(mood.description),
    bonus: toNumber(mood.bonus),
    penalty: toNumber(mood.penalty),
    preferredTopics: asArray<string>(mood.preferredTopics ?? mood.preferred_topics),
  };
}

function normalizeAchievement(raw: unknown): Achievement {
  const achievement = asRecord(raw);
  return {
    id: asString(achievement.id),
    name: asString(achievement.name),
    description: asString(achievement.description),
    icon: asString(achievement.icon),
    category: asString(achievement.category) as Achievement['category'],
    condition: asRecord(achievement.condition) as unknown as Achievement['condition'],
    reward: achievement.reward
      ? (asRecord(achievement.reward) as unknown as Achievement['reward'])
      : undefined,
    achieved: toBoolean(achievement.achieved),
    achievedDate: toOptionalDate(achievement.achievedDate ?? achievement.achieved_at),
    progress: toNumber(achievement.progress),
  };
}

function normalizeDateHistory(raw: unknown): DateHistoryEntry {
  const entry = asRecord(raw);
  return {
    id: asString(entry.id),
    datePlanId: asString(entry.datePlanId ?? entry.date_plan_id),
    date: toDate(entry.date ?? entry.occurred_at),
    success: toBoolean(entry.success),
    affectionGained: toNumber(entry.affectionGained ?? entry.affection_gained),
    compatibilityAtTime: toNumber(
      entry.compatibilityAtTime ?? entry.compatibility_at_time
    ),
    playerLevel: toNumber(entry.playerLevel ?? entry.player_level),
    notes: asOptionalString(entry.notes),
  };
}

function normalizeMemory(raw: unknown): RelationshipMemory {
  const memory = asRecord(raw);
  return {
    id: asString(memory.id),
    date: toDate(memory.date ?? memory.occurred_at),
    type: asString(memory.type) as RelationshipMemory['type'],
    title: asString(memory.title),
    description: asString(memory.description),
    emotionalImpact: toNumber(memory.emotionalImpact ?? memory.emotional_impact),
    participantEmotions: asArray(memory.participantEmotions ?? memory.participant_emotions),
    affectionAtTime: toNumber(memory.affectionAtTime ?? memory.affection_at_time),
    consequence: asOptionalString(memory.consequence),
    tags: asArray<string>(memory.tags),
  };
}

function normalizeConflict(raw: unknown): RelationshipConflict {
  const conflict = asRecord(raw);
  return {
    id: asString(conflict.id),
    characterId: asString(conflict.characterId ?? conflict.character_id),
    type: asString(conflict.type) as RelationshipConflict['type'],
    severity: asString(conflict.severity, 'minor') as RelationshipConflict['severity'],
    trigger: asString(conflict.trigger),
    description: asString(conflict.description),
    startDate: toDate(conflict.startDate ?? conflict.start_at),
    resolved: toBoolean(conflict.resolved),
    resolutionDate: toOptionalDate(conflict.resolutionDate ?? conflict.resolved_at),
    resolutionMethod: conflict.resolutionMethod as RelationshipConflict['resolutionMethod'],
    affectionPenalty: toNumber(conflict.affectionPenalty ?? conflict.affection_penalty),
    resolutionOptions: asArray(conflict.resolutionOptions ?? conflict.resolution_options),
  };
}

function normalizeStorylines(raw: unknown): Record<string, StorylineEvent[]> {
  const storylines = asRecord(raw);
  return Object.fromEntries(
    Object.entries(storylines).map(([characterId, values]) => [
      characterId,
      asArray(values).map(storyline => {
        const item = asRecord(storyline);
        return {
          id: asString(item.id),
          characterId: asString(item.characterId ?? item.character_id),
          requiredAffection: toNumber(item.requiredAffection ?? item.required_affection),
          title: asString(item.title),
          description: asString(item.description),
          dialogue: asString(item.dialogue),
          unlocked: toBoolean(item.unlocked),
          completed: toBoolean(item.completed),
          choices: asArray(item.choices).map(choice => {
            const option = asRecord(choice);
            return {
              id: asString(option.id),
              text: asString(option.text),
              consequence: asString(option.consequence),
              affectionChange: toNumber(option.affectionChange ?? option.affection_change),
              unlockNext: asOptionalString(option.unlockNext ?? option.unlock_next),
            };
          }),
          rewards: asArray(item.rewards),
        };
      }),
    ])
  );
}

function normalizeAdvancedState(raw: unknown): PlayerAdvancedState {
  const advancedState = asRecord(raw);
  return {
    superLikesAvailable: toNumber(advancedState.superLikesAvailable),
    superLikesUsed: asArray(advancedState.superLikesUsed),
    lastSuperLikeReset: toDate(advancedState.lastSuperLikeReset),
    conflictResolutionSkill: toNumber(advancedState.conflictResolutionSkill),
    icebreakerUnlocks: asArray<string>(advancedState.icebreakerUnlocks),
  };
}

function normalizeDialogueResult(raw: unknown): DialogueResult | null {
  if (!raw) {
    return null;
  }

  const dialogue = asRecord(raw);
  const response = asRecord(dialogue.response);
  return {
    option: normalizeDialogueOption(dialogue.option),
    response: {
      text: asString(response.text),
      emotion: asString(response.emotion),
      affectionChange: toNumber(response.affectionChange ?? response.affection_change),
      consequence: asOptionalString(response.consequence),
    },
    affectionChange: toNumber(dialogue.affectionChange ?? dialogue.affection_change),
    affection: toNumber(dialogue.affection),
  };
}

function normalizeDateResult(raw: unknown): DateResult | null {
  if (!raw) {
    return null;
  }

  const date = asRecord(raw);
  const outcome = asRecord(date.outcome);
  const compatibility = asRecord(outcome.compatibility);
  return {
    plan: normalizeDatePlan(date.plan),
    outcome: {
      success: toBoolean(outcome.success),
      affectionGained: toNumber(outcome.affectionGained ?? outcome.affection_gained),
      compatibility: {
        overall: toNumber(compatibility.overall),
        breakdown: asRecord(compatibility.breakdown) as Record<string, number>,
        explanation: asArray<string>(compatibility.explanation),
      },
      preferredActivity: toBoolean(outcome.preferredActivity ?? outcome.preferred_activity),
      memory: asRecord(outcome.memory) as DateResult['outcome']['memory'],
    },
    affection: toNumber(date.affection),
  };
}

function normalizeSuperLikeResult(raw: unknown): SuperLikeResult | null {
  if (!raw) {
    return null;
  }

  const result = asRecord(raw);
  return {
    affectionGained: toNumber(result.affectionGained),
    specialResponse: asString(result.specialResponse),
    unlockedContent: asArray<string>(result.unlockedContent),
  };
}

function normalizeKnownInfo(raw: unknown): CharacterKnownInfo {
  const known = asRecord(raw);
  return {
    name: toBoolean(known.name, true),
    appearance: toBoolean(known.appearance, true),
    species: toBoolean(known.species),
    basicPersonality: toBoolean(known.basicPersonality),
    mood: toBoolean(known.mood),
    interests: toBoolean(known.interests),
    conversationStyle: toBoolean(known.conversationStyle),
    values: toBoolean(known.values),
    background: toBoolean(known.background),
    goals: toBoolean(known.goals),
    dealbreakers: toBoolean(known.dealbreakers),
    favoriteTopics: toBoolean(known.favoriteTopics),
    deepPersonality: toBoolean(known.deepPersonality),
    secretTraits: toBoolean(known.secretTraits),
  };
}

function asRecord(value: unknown): Record<string, unknown> {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : {};
}

function asArray<T = unknown>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown, fallback = ''): string {
  return typeof value === 'string' ? value : fallback;
}

function asOptionalString(value: unknown): string | undefined {
  return typeof value === 'string' && value !== '' ? value : undefined;
}

function toNumber(value: unknown, fallback = 0): number {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function toOptionalNumber(value: unknown): number | undefined {
  return value === null || value === undefined ? undefined : toNumber(value);
}

function toBoolean(value: unknown, fallback = false): boolean {
  if (value === undefined || value === null) {
    return fallback;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'number') {
    return value !== 0;
  }
  if (typeof value === 'string') {
    return value === '1' || value.toLowerCase() === 'true';
  }
  return fallback;
}

function toDate(value: unknown): Date {
  const parsed = value ? new Date(String(value)) : new Date();
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}

function toOptionalDate(value: unknown): Date | undefined {
  if (!value) {
    return undefined;
  }
  return toDate(value);
}

function isGameScreen(value: unknown): value is GameScreen {
  return typeof value === 'string' && gameScreens.includes(value as GameScreen);
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Backend request failed.';
}
