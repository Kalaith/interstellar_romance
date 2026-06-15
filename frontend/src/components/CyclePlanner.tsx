import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { Character, ResourceBudget } from '../types/game';
import { Button } from './ui/Button';
import { ProgressBar } from './ui/ProgressBar';

export const CyclePlanner: React.FC = () => {
  const { actionEconomy, characters, selectCharacter, setScreen } = useGameStore();
  const pendingFollowUps = characters.filter(character => character.cooldowns?.dateFollowUpPending);
  const conflictItems = characters.flatMap(character =>
    character.activeConflicts
      .filter(conflict => !conflict.resolved)
      .map(conflict => ({ character, conflict }))
  );
  const remainingChats = characters.reduce((total, character) => {
    const cooldowns = character.cooldowns;
    if (!cooldowns) {
      return total;
    }

    return (
      total + Math.max(0, cooldowns.dialoguesAllowedThisWeek - cooldowns.dialoguesUsedThisWeek)
    );
  }, 0);

  return (
    <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-5 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-5">
        <div>
          <h3 className="text-lg font-bold text-[var(--accent-cyan)] uppercase tracking-wide">
            Cycle Planner
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Cycle {actionEconomy.week} resources and relationship obligations
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            iconLeft="📅"
            onClick={() => setScreen('activities')}
          >
            Weekly Plan
          </Button>
          <Button
            size="sm"
            variant="secondary"
            iconLeft="💪"
            onClick={() => setScreen('self-improvement')}
          >
            Improve
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <ResourceTile label="Energy" budget={actionEconomy.energy} tone="health" />
        <ResourceTile label="Time" budget={actionEconomy.timeSlots} tone="progress" />
        <ResourceTile label="Focus" budget={actionEconomy.socialFocus} tone="compatibility" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <PlannerQueue
          title="Follow-ups"
          emptyText="No dates need a follow-up."
          count={pendingFollowUps.length}
        >
          {pendingFollowUps.slice(0, 3).map(character => (
            <CharacterQueueItem
              key={character.id}
              character={character}
              detail="Date follow-up pending"
              actionLabel="Reply"
              onAction={() => {
                void selectCharacter(character.id).then(() => setScreen('date-planning'));
              }}
            />
          ))}
        </PlannerQueue>

        <PlannerQueue
          title="Conflicts"
          emptyText="No active conflicts."
          count={conflictItems.length}
        >
          {conflictItems.slice(0, 3).map(({ character, conflict }) => (
            <CharacterQueueItem
              key={conflict.id}
              character={character}
              detail={`${conflict.severity} ${conflict.type.replaceAll('_', ' ')}`}
              actionLabel="Resolve"
              isUrgent={conflict.severity === 'major' || conflict.severity === 'critical'}
              onAction={() => {
                void selectCharacter(character.id).then(() => setScreen('character-journal'));
              }}
            />
          ))}
        </PlannerQueue>

        <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-4 min-h-[140px]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wide">
              Open Chats
            </h4>
            <span className="text-xs text-[var(--text-muted)]">{remainingChats} left</span>
          </div>

          {actionEconomy.warnings.length > 0 ? (
            <div className="space-y-2">
              {actionEconomy.warnings.map(warning => (
                <div
                  key={warning}
                  className="text-xs text-[var(--resource-energy)] bg-[var(--bg-item)] border border-[var(--border-inner)] rounded px-3 py-2"
                >
                  {warning}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-secondary)]">
              Enough budget remains for conversations, dates, or recovery work.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

function ResourceTile({
  label,
  budget,
  tone,
}: {
  label: string;
  budget: ResourceBudget;
  tone: 'health' | 'progress' | 'compatibility';
}) {
  const usedPercent = budget.available > 0 ? Math.round((budget.used / budget.available) * 100) : 0;

  return (
    <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[var(--text-secondary)] uppercase tracking-wide">
          {label}
        </span>
        <span className="text-sm font-semibold text-[var(--text-primary)]">
          {budget.remaining}/{budget.available}
        </span>
      </div>
      <ProgressBar value={usedPercent} variant={tone} size="sm" animated={true} />
      <div className="text-xs text-[var(--text-muted)] mt-2">{budget.used} committed</div>
    </div>
  );
}

function PlannerQueue({
  title,
  emptyText,
  count,
  children,
}: {
  title: string;
  emptyText: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-4 min-h-[140px]">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wide">
          {title}
        </h4>
        <span className="text-xs text-[var(--text-muted)]">{count}</span>
      </div>

      {count > 0 ? (
        <div className="space-y-2">{children}</div>
      ) : (
        <p className="text-sm text-[var(--text-secondary)]">{emptyText}</p>
      )}
    </div>
  );
}

function CharacterQueueItem({
  character,
  detail,
  actionLabel,
  isUrgent = false,
  onAction,
}: {
  character: Character;
  detail: string;
  actionLabel: string;
  isUrgent?: boolean;
  onAction: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 bg-[var(--bg-item)] border border-[var(--border-inner)] rounded px-3 py-2">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-[var(--text-primary)]">
          {character.name}
        </div>
        <div
          className={
            isUrgent ? 'text-xs text-[var(--state-deficit)]' : 'text-xs text-[var(--text-muted)]'
          }
        >
          {detail}
        </div>
      </div>
      <Button size="xs" variant={isUrgent ? 'danger' : 'outline'} onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
