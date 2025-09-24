import React from 'react';
import { useDailyInteractions } from '../../hooks/useDailyInteractions';
import { getUserTimezone } from '../../utils/timezoneUtils';

interface DailyInteractionStatusProps {
  characterId: string;
  showDetails?: boolean;
  compact?: boolean;
  className?: string;
}

export const DailyInteractionStatus: React.FC<DailyInteractionStatusProps> = ({
  characterId,
  showDetails = false,
  compact = false,
  className = ''
}) => {
  const {
    interactionsUsed,
    maxInteractions,
    canInteract,
    remainingInteractions,
    timeUntilResetFormatted,
    interactionProgress,
    debugInfo
  } = useDailyInteractions(characterId);

  const userTimezone = getUserTimezone();

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          <span className="text-xs text-gray-300">
            {remainingInteractions}/{maxInteractions}
          </span>
        </div>
        {!canInteract && (
          <span className="text-xs text-yellow-400">
            Resets: {timeUntilResetFormatted}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-slate-800 rounded-lg p-4 border border-slate-600 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-white">Daily Interactions</h3>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${canInteract ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <span className={`text-sm font-medium ${canInteract ? 'text-green-400' : 'text-red-400'}`}>
            {canInteract ? 'Available' : 'Exhausted'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-400 mb-1">
          <span>Used: {interactionsUsed}</span>
          <span>Max: {maxInteractions}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              interactionProgress < 100
                ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                : 'bg-gradient-to-r from-red-500 to-orange-500'
            }`}
            style={{ width: `${interactionProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Status Information */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400">Remaining:</span>
          <span className={`text-sm font-medium ${canInteract ? 'text-blue-400' : 'text-gray-500'}`}>
            {remainingInteractions} interactions
          </span>
        </div>

        {!canInteract && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-400">Resets in:</span>
            <span className="text-sm font-medium text-yellow-400">
              {timeUntilResetFormatted}
            </span>
          </div>
        )}

        {showDetails && (
          <>
            <div className="border-t border-slate-600 pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Timezone:</span>
                <span className="text-xs text-gray-400">{userTimezone.abbreviation}</span>
              </div>
              {debugInfo && process.env.NODE_ENV === 'development' && (
                <details className="mt-2">
                  <summary className="text-xs text-gray-500 cursor-pointer">Debug Info</summary>
                  <div className="text-xs text-gray-400 mt-1 space-y-1">
                    <div>Last Reset: {debugInfo.lastResetDate}</div>
                    <div>Current Date: {debugInfo.currentDate}</div>
                    <div>Timezone: {debugInfo.timezone}</div>
                    <div>Has Reset: {debugInfo.hasReset ? 'Yes' : 'No'}</div>
                  </div>
                </details>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// Simple interaction counter component
interface InteractionCounterProps {
  characterId: string;
  className?: string;
}

export const InteractionCounter: React.FC<InteractionCounterProps> = ({
  characterId,
  className = ''
}) => {
  const { remainingInteractions, maxInteractions, canInteract } = useDailyInteractions(characterId);

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${canInteract ? 'bg-green-400' : 'bg-red-400'}`}></div>
      <span className={`text-xs ${canInteract ? 'text-green-400' : 'text-red-400'}`}>
        {remainingInteractions}/{maxInteractions}
      </span>
    </div>
  );
};

// Reset countdown component
interface ResetCountdownProps {
  characterId: string;
  className?: string;
}

export const ResetCountdown: React.FC<ResetCountdownProps> = ({
  characterId,
  className = ''
}) => {
  const { timeUntilResetFormatted, canInteract } = useDailyInteractions(characterId);

  if (canInteract) return null;

  return (
    <div className={`text-xs text-yellow-400 ${className}`}>
      Resets in {timeUntilResetFormatted}
    </div>
  );
};