import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { MemoryType, TimelineEvent } from '../types/game';
import { Button } from './ui/Button';
import { StatePanel } from './ui/StatePanel';

export const RelationshipTimeline: React.FC = () => {
  const { selectedCharacter, setScreen } = useGameStore();

  if (!selectedCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md">
          <StatePanel
            variant="unavailable"
            icon="📖"
            title="No Character Selected"
            message="Choose a companion before opening the relationship timeline."
            actionLabel="Back to Hub"
            onAction={() => setScreen('main-hub')}
          />
        </div>
      </div>
    );
  }

  const getEventDate = (date: Date | string): Date => new Date(date);

  const getMemoryIcon = (type: MemoryType): string => {
    const icons: Record<MemoryType, string> = {
      first_meeting: '✨',
      meaningful_conversation: '💬',
      romantic_moment: '💕',
      conflict_resolution: '🕊️',
      shared_activity: '🤝',
      milestone_achievement: '🏆',
      gift_exchange: '🎁',
      date_experience: '🌹',
      personal_revelation: '📖',
      crisis_support: '🛡️',
    };

    return icons[type];
  };

  const getMemoryTimelineType = (type: MemoryType): TimelineEvent['type'] => {
    if (type === 'date_experience') return 'date';
    if (type === 'milestone_achievement') return 'milestone';
    if (type === 'first_meeting') return 'first_meeting';
    return 'conversation';
  };

  // Generate timeline events from character data
  const generateTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = [];

    // Add milestone events
    selectedCharacter.milestones.forEach((milestone, index) => {
      if (milestone.achieved && milestone.achievedDate) {
        events.push({
          id: `milestone_${milestone.id}`,
          type: 'milestone',
          date: getEventDate(milestone.achievedDate),
          title: milestone.name,
          description: milestone.description,
          affectionLevel: milestone.unlockedAt,
          icon: '🏆',
          significance: index < 2 ? 'minor' : index < 4 ? 'major' : 'epic',
        });
      }
    });

    const dateMemoryTimes = selectedCharacter.relationshipMemories
      .filter(memory => memory.type === 'date_experience')
      .map(memory => getEventDate(memory.date).getTime());

    // Add date events
    selectedCharacter.dateHistory.forEach((dateEntry, index) => {
      const date = getEventDate(dateEntry.date);
      const alreadyRepresentedByMemory = dateMemoryTimes.some(
        memoryTime => Math.abs(memoryTime - date.getTime()) < 2000
      );

      if (alreadyRepresentedByMemory) return;

      events.push({
        id: `date_${dateEntry.id}`,
        type: 'date',
        date,
        title: dateEntry.notes || `${dateEntry.success ? 'Successful' : 'Challenging'} Date`,
        description: `Date ${dateEntry.success ? 'went well' : 'was challenging'}; affection ${dateEntry.affectionGained > 0 ? '+' : ''}${dateEntry.affectionGained}`,
        affectionLevel: Math.max(
          0,
          selectedCharacter.affection - (selectedCharacter.dateHistory.length - index - 1) * 5
        ), // Estimate
        icon: dateEntry.success ? '💕' : '💔',
        significance: dateEntry.affectionGained >= 10 ? 'major' : 'minor',
      });
    });

    // Add relationship memories as first-class timeline events
    selectedCharacter.relationshipMemories.forEach(memory => {
      events.push({
        id: `memory_${memory.id}`,
        type: getMemoryTimelineType(memory.type),
        date: getEventDate(memory.date),
        title: memory.title,
        description: memory.consequence
          ? `${memory.description} ${memory.consequence}`
          : memory.description,
        affectionLevel: memory.affectionAtTime,
        icon: getMemoryIcon(memory.type),
        significance:
          Math.abs(memory.emotionalImpact) >= 10
            ? 'epic'
            : Math.abs(memory.emotionalImpact) >= 5
              ? 'major'
              : 'minor',
      });
    });

    // Add photo unlock events
    selectedCharacter.photoGallery.forEach(photo => {
      if (photo.unlocked && photo.unlockedDate) {
        events.push({
          id: `photo_${photo.id}`,
          type: 'photo_unlock',
          date: getEventDate(photo.unlockedDate),
          title: `New Photo: ${photo.title}`,
          description: `Unlocked ${photo.rarity} rarity photo`,
          affectionLevel: photo.unlockedAt,
          icon: '📸',
          significance:
            photo.rarity === 'legendary' ? 'epic' : photo.rarity === 'epic' ? 'major' : 'minor',
        });
      }
    });

    // Add first meeting event (always present)
    if (selectedCharacter.affection > 0) {
      const firstMeetingDate = new Date();
      firstMeetingDate.setDate(
        firstMeetingDate.getDate() - Math.floor(selectedCharacter.affection / 2)
      ); // Estimate
      events.push({
        id: 'first_meeting',
        type: 'first_meeting',
        date: firstMeetingDate,
        title: 'First Meeting',
        description: `Met ${selectedCharacter.name} for the first time`,
        affectionLevel: 0,
        icon: '✨',
        significance: 'major',
      });
    }

    // Sort by date (newest first)
    return events.sort((a, b) => getEventDate(b.date).getTime() - getEventDate(a.date).getTime());
  };

  const timelineEvents = generateTimelineEvents();

  const significanceColors = {
    minor: 'border-[var(--border-inner)] bg-[var(--bg-section)]',
    major: 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/10',
    epic: 'border-[var(--resource-alloys)] bg-[var(--resource-alloys)]/10',
  };

  const typeColors = {
    first_meeting: 'bg-[var(--state-available)] text-[var(--bg-space)]',
    milestone: 'bg-[var(--resource-alloys)] text-[var(--text-primary)]',
    date: 'bg-pink-600 text-[var(--text-primary)]',
    conversation: 'bg-[var(--resource-research)] text-[var(--text-primary)]',
    photo_unlock: 'bg-[var(--resource-energy)] text-[var(--bg-space)]',
    achievement: 'bg-[var(--resource-influence)] text-[var(--bg-space)]',
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] uppercase tracking-wide">
                  Relationship Timeline
                </h1>
                <p className="text-[var(--text-secondary)]">
                  Your journey with {selectedCharacter.name}
                </p>
              </div>
              <Button onClick={() => setScreen('character-profile')} variant="secondary">
                Back to Profile
              </Button>
            </div>
          </div>

          {/* Character Summary */}
          <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-8">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-[var(--bg-item)] border border-[var(--border-inner)]">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">
                  {selectedCharacter.name}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-pink-400">
                      {selectedCharacter.affection}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">Current Affection</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--resource-alloys)]">
                      {selectedCharacter.milestones.filter(m => m.achieved).length}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">Milestones</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--resource-research)]">
                      {timelineEvents.length}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">Total Events</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[var(--accent-cyan)]">
                      {selectedCharacter.relationshipMemories.length}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">Memories</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {timelineEvents.length > 0 ? (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--accent-cyan)] to-pink-500"></div>

              {/* Timeline Events */}
              <div className="space-y-6">
                {timelineEvents.map((event, _index) => (
                  <div key={event.id} className="relative flex items-start space-x-4">
                    {/* Timeline Dot */}
                    <div
                      className={`relative z-10 w-16 h-16 rounded-full ${typeColors[event.type]} flex items-center justify-center text-2xl shadow-lg`}
                    >
                      {event.icon}
                    </div>

                    {/* Event Content */}
                    <div
                      className={`flex-1 rounded-lg border-2 p-6 ${significanceColors[event.significance]}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                            {event.title}
                          </h3>
                          <p className="text-[var(--text-secondary)] text-sm">
                            {event.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-[var(--text-muted)]">
                            {getEventDate(event.date).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-[var(--accent-cyan)]">
                            Affection: {event.affectionLevel}
                          </div>
                        </div>
                      </div>

                      {/* Event Type Badge */}
                      <div className="flex items-center space-x-2 mt-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${typeColors[event.type]}`}
                        >
                          {event.type.replace('_', ' ')}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs capitalize ${
                            event.significance === 'epic'
                              ? 'bg-[var(--resource-alloys)] text-[var(--text-primary)]'
                              : event.significance === 'major'
                                ? 'bg-[var(--resource-research)] text-[var(--text-primary)]'
                                : 'bg-[var(--bg-item)] text-[var(--text-secondary)] border border-[var(--border-inner)]'
                          }`}
                        >
                          {event.significance}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Empty State */
            <StatePanel
              variant="empty"
              icon="📖"
              title="Your Story Begins Here"
              message={`Start interacting with ${selectedCharacter.name} to create your relationship timeline.`}
              actionLabel="Start Your Story"
              onAction={() => setScreen('character-interaction')}
            />
          )}

          {/* Timeline Stats */}
          {timelineEvents.length > 0 && (
            <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold mb-4 text-[var(--accent-cyan)] uppercase tracking-wide">
                Timeline Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {timelineEvents.filter(e => e.type === 'first_meeting').length}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">First Meetings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--resource-alloys)]">
                    {timelineEvents.filter(e => e.type === 'milestone').length}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">Milestones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">
                    {timelineEvents.filter(e => e.type === 'date').length}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">Dates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {timelineEvents.filter(e => e.type === 'photo_unlock').length}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">Photos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--accent-cyan)]">
                    {selectedCharacter.relationshipMemories.length}
                  </div>
                  <div className="text-xs text-[var(--text-muted)]">Memories</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
