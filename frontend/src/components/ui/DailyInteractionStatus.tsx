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
  className = '',
}) => {
  const {
    interactionsUsed,
    maxInteractions,
    canInteract,
    remainingInteractions,
    timeUntilResetFormatted,
    interactionProgress,
    debugInfo,
  } = useDailyInteractions(characterId);

  const userTimezone = getUserTimezone();

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[var(--accent-cyan)]"></div>
          <span className="text-xs text-[var(--text-secondary)]">
            {remainingInteractions}/{maxInteractions}
          </span>
        </div>
        {!canInteract && (
          <span className="text-xs text-[var(--resource-energy)]">
            Resets: {timeUntilResetFormatted}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      className={`bg-[var(--bg-section)] rounded-lg p-4 border border-[var(--border-inner)] ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">Daily Interactions</h3>
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${canInteract ? 'bg-[var(--state-available)]' : 'bg-[var(--state-deficit)]'}`}
          ></div>
          <span
            className={`text-sm font-medium ${canInteract ? 'text-[var(--state-available)]' : 'text-[var(--state-deficit)]'}`}
          >
            {canInteract ? 'Available' : 'Exhausted'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-[var(--text-muted)] mb-1">
          <span>Used: {interactionsUsed}</span>
          <span>Max: {maxInteractions}</span>
        </div>
        <div className="w-full bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-full h-2 overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              interactionProgress < 100
                ? 'bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-teal)]'
                : 'bg-gradient-to-r from-[var(--state-deficit)] to-[var(--resource-influence)]'
            }`}
            style={{ width: `${interactionProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Status Information */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[var(--text-muted)]">Remaining:</span>
          <span
            className={`text-sm font-medium ${canInteract ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-muted)]'}`}
          >
            {remainingInteractions} interactions
          </span>
        </div>

        {!canInteract && (
          <div className="flex justify-between items-center">
            <span className="text-sm text-[var(--text-muted)]">Resets in:</span>
            <span className="text-sm font-medium text-[var(--resource-energy)]">
              {timeUntilResetFormatted}
            </span>
          </div>
        )}

        {showDetails && (
          <>
            <div className="border-t border-[var(--border-inner)] pt-2 mt-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-muted)]">Timezone:</span>
                <span className="text-xs text-[var(--text-secondary)]">
                  {userTimezone.abbreviation}
                </span>
              </div>
              {debugInfo && import.meta.env.DEV && (
                <details className="mt-2">
                  <summary className="text-xs text-[var(--text-muted)] cursor-pointer">
                    Debug Info
                  </summary>
                  <div className="text-xs text-[var(--text-secondary)] mt-1 space-y-1">
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
  className = '',
}) => {
  const { remainingInteractions, maxInteractions, canInteract } = useDailyInteractions(characterId);

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <div
        className={`w-1.5 h-1.5 rounded-full ${canInteract ? 'bg-[var(--state-available)]' : 'bg-[var(--state-deficit)]'}`}
      ></div>
      <span
        className={`text-xs ${canInteract ? 'text-[var(--state-available)]' : 'text-[var(--state-deficit)]'}`}
      >
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

export const ResetCountdown: React.FC<ResetCountdownProps> = ({ characterId, className = '' }) => {
  const { timeUntilResetFormatted, canInteract } = useDailyInteractions(characterId);

  if (canInteract) return null;

  return (
    <div className={`text-xs text-[var(--resource-energy)] ${className}`}>
      Resets in {timeUntilResetFormatted}
    </div>
  );
};
