// Timezone handling utilities for daily interactions

export interface TimeZoneInfo {
  timezone: string;
  offset: number; // in minutes
  abbreviation: string;
  isDST: boolean;
}

export interface DailyResetInfo {
  lastResetDate: string; // ISO date string (YYYY-MM-DD)
  nextResetTime: Date;
  timeUntilReset: number; // milliseconds
  hasReset: boolean;
}

// Get user's current timezone information
export const getUserTimezone = (): TimeZoneInfo => {
  const now = new Date();
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const offset = now.getTimezoneOffset(); // in minutes

  // Get timezone abbreviation
  const formatter = new Intl.DateTimeFormat('en', {
    timeZoneName: 'short',
    timeZone: timezone
  });
  const parts = formatter.formatToParts(now);
  const abbreviation = parts.find(part => part.type === 'timeZoneName')?.value || 'UTC';

  // Check if currently in DST
  const january = new Date(now.getFullYear(), 0, 1);
  const july = new Date(now.getFullYear(), 6, 1);
  const isDST = Math.max(january.getTimezoneOffset(), july.getTimezoneOffset()) !== now.getTimezoneOffset();

  return {
    timezone,
    offset: -offset, // Convert to positive for east of UTC
    abbreviation,
    isDST
  };
};

// Get the current date in user's timezone as ISO string (YYYY-MM-DD)
export const getCurrentDateInTimezone = (timezone?: string): string => {
  const userTimezone = timezone || getUserTimezone().timezone;
  const now = new Date();

  // Format date in user's timezone
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: userTimezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  return formatter.format(now); // Returns YYYY-MM-DD format
};

// Calculate when the next daily reset should occur
export const getNextResetTime = (timezone?: string): Date => {
  const userTimezone = timezone || getUserTimezone().timezone;
  const now = new Date();

  // Create tomorrow at midnight in user's timezone
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);

  // Format as ISO string and parse to get midnight in user's timezone
  const tomorrowMidnight = new Date(tomorrow.toLocaleDateString('en-CA') + 'T00:00:00');

  // Adjust for timezone offset
  const timezoneOffset = new Date().getTimezoneOffset() * 60000; // Convert to milliseconds
  const userOffset = getUserTimezoneOffset(userTimezone) * 60000;

  return new Date(tomorrowMidnight.getTime() - timezoneOffset + userOffset);
};

// Get timezone offset in minutes for a specific timezone
const getUserTimezoneOffset = (timezone: string): number => {
  const now = new Date();
  const utc = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
  const targetTime = new Date(utc.toLocaleString("en-US", {timeZone: timezone}));
  return (utc.getTime() - targetTime.getTime()) / 60000;
};

// Check if daily interactions should be reset
export const shouldResetDailyInteractions = (lastResetDate: string, timezone?: string): boolean => {
  const currentDate = getCurrentDateInTimezone(timezone);
  return lastResetDate !== currentDate;
};

// Get comprehensive daily reset information
export const getDailyResetInfo = (lastResetDate: string, timezone?: string): DailyResetInfo => {
  const currentDate = getCurrentDateInTimezone(timezone);
  const hasReset = shouldResetDailyInteractions(lastResetDate, timezone);
  const nextResetTime = getNextResetTime(timezone);
  const timeUntilReset = nextResetTime.getTime() - Date.now();

  return {
    lastResetDate: hasReset ? currentDate : lastResetDate,
    nextResetTime,
    timeUntilReset: Math.max(0, timeUntilReset),
    hasReset
  };
};

// Format time until reset for display
export const formatTimeUntilReset = (timeUntilReset: number): string => {
  if (timeUntilReset <= 0) return 'Now';

  const hours = Math.floor(timeUntilReset / (1000 * 60 * 60));
  const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeUntilReset % (1000 * 60)) / 1000);

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
};

// Enhanced daily interaction data with timezone support
export interface EnhancedDailyInteractionData {
  lastResetDate: string;
  interactionsUsed: number;
  maxInteractions: number;
  timezone: string;
  resetInfo: DailyResetInfo;
}

// Create enhanced daily interaction data with timezone support
export const createEnhancedDailyInteractions = (
  affection: number,
  calculateMaxInteractions: (affection: number) => number,
  existingData?: { lastResetDate?: string; interactionsUsed?: number; timezone?: string }
): EnhancedDailyInteractionData => {
  const userTimezone = getUserTimezone();
  const timezone = existingData?.timezone || userTimezone.timezone;
  const currentDate = getCurrentDateInTimezone(timezone);

  // Check if we should reset based on the last reset date
  const lastResetDate = existingData?.lastResetDate || currentDate;
  const resetInfo = getDailyResetInfo(lastResetDate, timezone);

  return {
    lastResetDate: resetInfo.hasReset ? currentDate : lastResetDate,
    interactionsUsed: resetInfo.hasReset ? 0 : (existingData?.interactionsUsed || 0),
    maxInteractions: calculateMaxInteractions(affection),
    timezone,
    resetInfo
  };
};

// Validate and migrate old daily interaction data
export const migrateDailyInteractionData = (
  oldData: { lastResetDate: string; interactionsUsed: number; maxInteractions: number },
  affection: number,
  calculateMaxInteractions: (affection: number) => number
): EnhancedDailyInteractionData => {
  // If old data doesn't have timezone, assume user's current timezone
  const userTimezone = getUserTimezone();
  const timezone = userTimezone.timezone;

  // Check if the old data needs to be reset
  const resetInfo = getDailyResetInfo(oldData.lastResetDate, timezone);

  return {
    lastResetDate: resetInfo.hasReset ? getCurrentDateInTimezone(timezone) : oldData.lastResetDate,
    interactionsUsed: resetInfo.hasReset ? 0 : oldData.interactionsUsed,
    maxInteractions: calculateMaxInteractions(affection),
    timezone,
    resetInfo
  };
};

// Hook-like function to get real-time reset information
export const useResetTimer = (lastResetDate: string, timezone?: string) => {
  const getResetInfo = () => getDailyResetInfo(lastResetDate, timezone);

  return {
    getResetInfo,
    formatTimeUntilReset: (timeUntilReset: number) => formatTimeUntilReset(timeUntilReset),
    getCurrentDate: () => getCurrentDateInTimezone(timezone)
  };
};