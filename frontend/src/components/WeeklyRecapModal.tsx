import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { Button } from './ui/Button';

export const WeeklyRecapModal: React.FC = () => {
  const weeklySummary = useGameStore(state => state.weeklySummary);
  const currentWeek = useGameStore(state => state.currentWeek);
  const [dismissedKey, setDismissedKey] = React.useState<string | null>(null);
  const summaryKey = weeklySummary
    ? `${weeklySummary.week}:${weeklySummary.energy_used}:${weeklySummary.time_slots_used}`
    : null;

  React.useEffect(() => {
    setDismissedKey(null);
  }, [summaryKey]);

  if (!weeklySummary || dismissedKey === summaryKey) {
    return null;
  }

  const statChanges = Object.entries(weeklySummary.stats)
    .map(([stat, value]) => ({
      stat,
      change: value - (weeklySummary.previous_stats[stat] ?? value),
    }))
    .filter(item => item.change !== 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6">
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg shadow-2xl">
        <div className="p-6 border-b border-[var(--border-inner)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                Cycle {weeklySummary.week} Complete
              </p>
              <h2 className="text-2xl font-bold text-[var(--accent-cyan)]">Weekly Recap</h2>
              <p className="text-sm text-[var(--text-secondary)]">
                Now entering cycle {currentWeek}
              </p>
            </div>
            <Button size="sm" variant="ghost" onClick={() => setDismissedKey(summaryKey)}>
              Close
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <RecapMetric label="Energy" value={weeklySummary.energy_used} />
            <RecapMetric label="Time" value={weeklySummary.time_slots_used} />
            <RecapMetric label="Focus" value={weeklySummary.social_cost} />
          </div>

          {statChanges.length > 0 && (
            <section>
              <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wide mb-3">
                Captain Growth
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {statChanges.map(item => (
                  <div
                    key={item.stat}
                    className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded px-3 py-2"
                  >
                    <span className="text-sm text-[var(--text-secondary)] capitalize">
                      {item.stat}
                    </span>
                    <span className="float-right text-sm font-semibold text-[var(--state-available)]">
                      +{item.change}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section>
            <h3 className="text-sm font-semibold text-[var(--text-primary)] uppercase tracking-wide mb-3">
              Relationship Changes
            </h3>
            <div className="space-y-2">
              {weeklySummary.relationship_effects.map(effect => (
                <div
                  key={effect.character_id}
                  className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                    <div className="font-semibold text-[var(--text-primary)]">
                      {effect.character_name}
                    </div>
                    <div className="flex gap-2 text-xs">
                      <ChangeBadge label="Affection" value={effect.affection_change} />
                      <ChangeBadge label="Trust" value={effect.trust_change} />
                    </div>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{effect.reason}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-2">Mood: {effect.mood}</p>
                </div>
              ))}
            </div>
          </section>

          {weeklySummary.random_event && (
            <section className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-4">
              <h3 className="text-sm font-semibold text-[var(--resource-energy)] uppercase tracking-wide mb-1">
                {weeklySummary.random_event.title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {weeklySummary.random_event.description}
              </p>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

function RecapMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg px-4 py-3">
      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide">{label}</div>
      <div className="text-xl font-bold text-[var(--text-primary)]">{value}</div>
    </div>
  );
}

function ChangeBadge({ label, value }: { label: string; value: number }) {
  const textColor =
    value > 0
      ? 'text-[var(--state-available)]'
      : value < 0
        ? 'text-[var(--state-deficit)]'
        : 'text-[var(--text-muted)]';
  const signedValue = value > 0 ? `+${value}` : String(value);

  return (
    <span
      className={`bg-[var(--bg-item)] border border-[var(--border-inner)] rounded px-2 py-1 ${textColor}`}
    >
      {label} {signedValue}
    </span>
  );
}
