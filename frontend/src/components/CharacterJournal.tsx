import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { CharacterKnownInfo, RelationshipConflict, RelationshipMemory } from '../types/game';
import { Button } from './ui/Button';
import { StatePanel } from './ui/StatePanel';

const knowledgeLabels: Record<keyof CharacterKnownInfo, string> = {
  name: 'Name',
  appearance: 'Appearance',
  species: 'Species',
  basicPersonality: 'Personality',
  mood: 'Mood',
  interests: 'Interests',
  conversationStyle: 'Conversation Style',
  values: 'Values',
  background: 'Background',
  goals: 'Goals',
  dealbreakers: 'Deal Breakers',
  favoriteTopics: 'Favorite Topics',
  deepPersonality: 'Deep Personality',
  secretTraits: 'Secret Traits',
};

export const CharacterJournal: React.FC = () => {
  const { selectedCharacter, setScreen } = useGameStore();

  if (!selectedCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md">
          <StatePanel
            variant="unavailable"
            icon="📓"
            title="No Journal Selected"
            message="Choose a companion before opening their relationship journal."
            actionLabel="Back to Hub"
            onAction={() => setScreen('main-hub')}
          />
        </div>
      </div>
    );
  }

  const journal = selectedCharacter.journal;
  const knownInfo = journal?.knownInfo ?? selectedCharacter.knownInfo;
  const recentMemories = journal?.recentMemories?.length
    ? journal.recentMemories
    : [...selectedCharacter.relationshipMemories]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
  const activeConflicts = journal?.activeConflicts ?? selectedCharacter.activeConflicts;
  const milestones = journal?.milestones ?? selectedCharacter.milestones;
  const knownEntries = Object.entries(knownInfo) as [keyof CharacterKnownInfo, boolean][];
  const knownCount = knownEntries.filter(([, unlocked]) => unlocked).length;
  const achievedMilestones = milestones.filter(milestone => milestone.achieved);
  const nextMilestone = milestones.find(milestone => !milestone.achieved);

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg bg-[var(--accent-cyan)] flex items-center justify-center text-2xl">
                📓
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] uppercase tracking-wide">
                  Relationship Journal
                </h1>
                <p className="text-sm text-[var(--text-secondary)]">
                  Field notes for {selectedCharacter.name}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setScreen('relationship-timeline')} variant="secondary">
                Timeline
              </Button>
              <Button onClick={() => setScreen('character-profile')} variant="secondary">
                Back to Profile
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <section className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                <div className="h-28 w-28 overflow-hidden rounded-lg border-2 border-[var(--accent-cyan)] bg-[var(--bg-item)]">
                  <img
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h2 className="mb-2 text-2xl font-bold text-[var(--text-primary)]">
                    {selectedCharacter.name}
                  </h2>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <Metric label="Affection" value={`${selectedCharacter.affection}/100`} />
                    <Metric label="Known Data" value={`${knownCount}/${knownEntries.length}`} />
                    <Metric
                      label="Memories"
                      value={String(selectedCharacter.relationshipMemories.length)}
                    />
                    <Metric label="Conflicts" value={String(activeConflicts.length)} />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h3 className="text-lg font-bold uppercase tracking-wide text-[var(--accent-cyan)]">
                  Recent Notes
                </h3>
                <Button
                  onClick={() => setScreen('character-interaction')}
                  variant="outline"
                  size="sm"
                >
                  Open Comms
                </Button>
              </div>
              {recentMemories.length > 0 ? (
                <div className="space-y-3">
                  {recentMemories.map(memory => (
                    <MemoryEntry key={memory.id} memory={memory} />
                  ))}
                </div>
              ) : (
                <EmptyJournalLine text="No relationship memories have been recorded yet." />
              )}
            </section>

            <section className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
              <h3 className="mb-4 text-lg font-bold uppercase tracking-wide text-[var(--accent-cyan)]">
                Active Conflicts
              </h3>
              {activeConflicts.length > 0 ? (
                <div className="space-y-3">
                  {activeConflicts.map(conflict => (
                    <ConflictEntry key={conflict.id} conflict={conflict} />
                  ))}
                </div>
              ) : (
                <EmptyJournalLine text="No unresolved conflicts are currently logged." />
              )}
            </section>
          </div>

          <div className="space-y-6">
            <section className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
              <h3 className="mb-4 text-lg font-bold uppercase tracking-wide text-[var(--accent-cyan)]">
                Known Information
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {knownEntries.map(([key, unlocked]) => (
                  <div
                    key={key}
                    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-sm ${
                      unlocked
                        ? 'border-[var(--state-available)]/30 bg-[var(--state-available)]/10 text-[var(--text-primary)]'
                        : 'border-[var(--border-inner)] bg-[var(--bg-item)] text-[var(--text-muted)]'
                    }`}
                  >
                    <span>{knowledgeLabels[key]}</span>
                    <span className={unlocked ? 'text-[var(--state-available)]' : ''}>
                      {unlocked ? 'Known' : 'Locked'}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
              <h3 className="mb-4 text-lg font-bold uppercase tracking-wide text-[var(--accent-cyan)]">
                Milestone Log
              </h3>
              <div className="mb-4 grid grid-cols-2 gap-3">
                <Metric
                  label="Achieved"
                  value={`${achievedMilestones.length}/${milestones.length}`}
                />
                <Metric
                  label="Next"
                  value={nextMilestone ? `${nextMilestone.unlockedAt}` : 'Clear'}
                />
              </div>
              <div className="space-y-3">
                {milestones.map(milestone => (
                  <div
                    key={milestone.id}
                    className={`rounded-lg border p-3 ${
                      milestone.achieved
                        ? 'border-[var(--resource-alloys)]/40 bg-[var(--resource-alloys)]/10'
                        : 'border-[var(--border-inner)] bg-[var(--bg-item)]'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-semibold text-[var(--text-primary)]">
                          {milestone.name}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {milestone.description}
                        </p>
                      </div>
                      <span className="text-xs text-[var(--text-muted)]">
                        {milestone.achieved ? 'Done' : `${milestone.unlockedAt}`}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

const Metric: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-lg border border-[var(--border-inner)] bg-[var(--bg-item)] p-3 text-center">
    <div className="text-lg font-bold text-[var(--accent-cyan)]">{value}</div>
    <div className="text-xs uppercase tracking-wide text-[var(--text-muted)]">{label}</div>
  </div>
);

const MemoryEntry: React.FC<{ memory: RelationshipMemory }> = ({ memory }) => (
  <article className="rounded-lg border border-[var(--border-inner)] bg-[var(--bg-item)] p-4">
    <div className="mb-2 flex items-start justify-between gap-4">
      <div>
        <h4 className="font-semibold text-[var(--text-primary)]">{memory.title}</h4>
        <div className="text-xs capitalize text-[var(--text-muted)]">
          {memory.type.replaceAll('_', ' ')} • {new Date(memory.date).toLocaleDateString()}
        </div>
      </div>
      <span
        className={`text-sm font-bold ${
          memory.emotionalImpact >= 0
            ? 'text-[var(--state-available)]'
            : 'text-[var(--state-deficit)]'
        }`}
      >
        {memory.emotionalImpact > 0 ? '+' : ''}
        {memory.emotionalImpact}
      </span>
    </div>
    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{memory.description}</p>
    {memory.tags.length > 0 && (
      <div className="mt-3 flex flex-wrap gap-2">
        {memory.tags.map(tag => (
          <span
            key={tag}
            className="rounded-full border border-[var(--border-inner)] bg-[var(--bg-section)] px-2 py-1 text-xs text-[var(--text-muted)]"
          >
            {tag}
          </span>
        ))}
      </div>
    )}
  </article>
);

const ConflictEntry: React.FC<{ conflict: RelationshipConflict }> = ({ conflict }) => (
  <article className="rounded-lg border border-[var(--state-deficit)]/30 bg-[var(--state-deficit)]/10 p-4">
    <div className="mb-2 flex items-start justify-between gap-4">
      <div>
        <h4 className="font-semibold capitalize text-[var(--text-primary)]">
          {conflict.type.replaceAll('_', ' ')}
        </h4>
        <div className="text-xs capitalize text-[var(--text-muted)]">
          {conflict.severity} • {new Date(conflict.startDate).toLocaleDateString()}
        </div>
      </div>
      <span className="text-sm font-bold text-[var(--state-deficit)]">
        -{conflict.affectionPenalty}
      </span>
    </div>
    <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{conflict.description}</p>
    <div className="mt-2 text-xs text-[var(--resource-energy)]">{conflict.trigger}</div>
  </article>
);

const EmptyJournalLine: React.FC<{ text: string }> = ({ text }) => (
  <div className="rounded-lg border border-[var(--border-inner)] bg-[var(--bg-item)] p-4 text-sm text-[var(--text-muted)]">
    {text}
  </div>
);
