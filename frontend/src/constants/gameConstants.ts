// Game Constants - Centralized configuration values
export const affectionThresholds = {
  VERY_HIGH: 80,
  HIGH: 60,
  MEDIUM: 40,
  LOW: 20,
  NONE: 0,
} as const;

export const interactionLimits = {
  VERY_HIGH_AFFECTION: 8,
  HIGH_AFFECTION: 6,
  MEDIUM_AFFECTION: 5,
  LOW_MEDIUM_AFFECTION: 4,
  DEFAULT: 3,
} as const;

export const compatibilityScores = {
  EXCELLENT: 90,
  VERY_GOOD: 80,
  GOOD: 70,
  AVERAGE: 60,
  POOR: 50,
} as const;

export const statThresholds = {
  VERY_HIGH: 80,
  HIGH: 70,
  MEDIUM: 60,
  LOW: 50,
} as const;

export const milestoneThresholds = {
  FIRST_MEETING: 1,
  GETTING_CLOSER: 15,
  MUTUAL_INTEREST: 30,
  ROMANTIC_TENSION: 50,
  DEEP_CONNECTION: 65,
  COMMITMENT: 80,
} as const;

export const personalityGrowthLimits = {
  MAX_GROWTH: 10,
  MIN_GROWTH: 0,
  DEFAULT_BASE: 5,
  MAJOR_CHANGE_THRESHOLD: 5,
} as const;

export const performanceThresholds = {
  SLOW_OPERATION: 100, // milliseconds
  VERY_SLOW_OPERATION: 500,
  HIGH_RENDER_COUNT: 50,
} as const;

export const validationLimits = {
  MIN_AFFECTION: 0,
  MAX_AFFECTION: 100,
  MIN_COMPATIBILITY: 0,
  MAX_COMPATIBILITY: 100,
  MIN_STAT_VALUE: 0,
  MAX_STAT_VALUE: 100,
} as const;

export const uiConstants = {
  PROGRESS_BAR_HEIGHT: {
    XS: 'h-1',
    SM: 'h-2',
    MD: 'h-3',
    LG: 'h-4',
  },
  AVATAR_SIZES: {
    XS: 'w-6 h-6',
    SM: 'w-8 h-8',
    MD: 'w-12 h-12',
    LG: 'w-16 h-16',
    XL: 'w-24 h-24',
    '2XL': 'w-32 h-32',
  },
  BORDER_RADIUS: {
    NONE: 'rounded-none',
    SM: 'rounded',
    MD: 'rounded-lg',
    LG: 'rounded-xl',
    FULL: 'rounded-full',
  },
} as const;

export const asyncDelays = {
  IMMEDIATE: 0,
  DEBOUNCE_SHORT: 150,
  DEBOUNCE_MEDIUM: 300,
  DEBOUNCE_LONG: 500,
} as const;

export const asyncOperationKeys = {
  CHARACTER_INFO_UNLOCK: (characterId: string) => `unlock-info-${characterId}`,
  BATCH_UPDATE: (type: string) => `batch-update-${type}`,
  ACHIEVEMENT_UPDATE: 'achievement-update',
  STORYLINE_UPDATE: (characterId: string) => `storyline-update-${characterId}`,
} as const;
