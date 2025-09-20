import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { TimelineEvent } from '../types/game';

export const RelationshipTimeline: React.FC = () => {
  const { selectedCharacter, setScreen } = useGameStore();

  if (!selectedCharacter) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">No character selected!</p>
          <button
            onClick={() => setScreen('main-hub')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            Back to Hub
          </button>
        </div>
      </div>
    );
  }

  // Generate timeline events from character data
  const generateTimelineEvents = (): TimelineEvent[] => {
    const events: TimelineEvent[] = [];

    // Add milestone events
    selectedCharacter.milestones.forEach((milestone, index) => {
      if (milestone.achieved && milestone.achievedDate) {
        events.push({
          id: `milestone_${milestone.id}`,
          type: 'milestone',
          date: milestone.achievedDate,
          title: milestone.name,
          description: milestone.description,
          affectionLevel: milestone.unlockedAt,
          icon: '🏆',
          significance: index < 2 ? 'minor' : index < 4 ? 'major' : 'epic'
        });
      }
    });

    // Add date events
    selectedCharacter.dateHistory.forEach((dateEntry, index) => {
      events.push({
        id: `date_${dateEntry.id}`,
        type: 'date',
        date: dateEntry.date,
        title: `${dateEntry.success ? 'Successful' : 'Challenging'} Date`,
        description: `Affection ${dateEntry.success ? 'gained' : 'adjusted'}: ${dateEntry.affectionGained > 0 ? '+' : ''}${dateEntry.affectionGained}`,
        affectionLevel: Math.max(0, selectedCharacter.affection - (selectedCharacter.dateHistory.length - index - 1) * 5), // Estimate
        icon: dateEntry.success ? '💕' : '💔',
        significance: dateEntry.affectionGained >= 10 ? 'major' : 'minor'
      });
    });

    // Add photo unlock events
    selectedCharacter.photoGallery.forEach(photo => {
      if (photo.unlocked && photo.unlockedDate) {
        events.push({
          id: `photo_${photo.id}`,
          type: 'photo_unlock',
          date: photo.unlockedDate,
          title: `New Photo: ${photo.title}`,
          description: `Unlocked ${photo.rarity} rarity photo`,
          affectionLevel: photo.unlockedAt,
          icon: '📸',
          significance: photo.rarity === 'legendary' ? 'epic' : photo.rarity === 'epic' ? 'major' : 'minor'
        });
      }
    });

    // Add first meeting event (always present)
    if (selectedCharacter.affection > 0) {
      const firstMeetingDate = new Date();
      firstMeetingDate.setDate(firstMeetingDate.getDate() - Math.floor(selectedCharacter.affection / 2)); // Estimate
      events.push({
        id: 'first_meeting',
        type: 'first_meeting',
        date: firstMeetingDate,
        title: 'First Meeting',
        description: `Met ${selectedCharacter.name} for the first time`,
        affectionLevel: 0,
        icon: '✨',
        significance: 'major'
      });
    }

    // Sort by date (newest first)
    return events.sort((a, b) => b.date.getTime() - a.date.getTime());
  };

  const timelineEvents = generateTimelineEvents();

  const significanceColors = {
    minor: 'border-gray-400 bg-gray-900/20',
    major: 'border-blue-400 bg-blue-900/20',
    epic: 'border-purple-400 bg-purple-900/20'
  };

  const typeColors = {
    first_meeting: 'bg-green-600',
    milestone: 'bg-purple-600',
    date: 'bg-pink-600',
    conversation: 'bg-blue-600',
    photo_unlock: 'bg-yellow-600',
    achievement: 'bg-orange-600'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Relationship Timeline</h1>
              <p className="text-gray-300">Your journey with {selectedCharacter.name}</p>
            </div>
            <button
              onClick={() => setScreen('character-profile')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Back to Profile
            </button>
          </div>

          {/* Character Summary */}
          <div className="bg-slate-900 rounded-lg p-6 mb-8 text-white">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-700">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-2">{selectedCharacter.name}</h2>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-pink-400">{selectedCharacter.affection}</div>
                    <div className="text-xs text-gray-400">Current Affection</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-400">
                      {selectedCharacter.milestones.filter(m => m.achieved).length}
                    </div>
                    <div className="text-xs text-gray-400">Milestones</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-400">{timelineEvents.length}</div>
                    <div className="text-xs text-gray-400">Total Events</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {timelineEvents.length > 0 ? (
            <div className="relative">
              {/* Timeline Line */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 to-pink-500"></div>

              {/* Timeline Events */}
              <div className="space-y-6">
                {timelineEvents.map((event, index) => (
                  <div key={event.id} className="relative flex items-start space-x-4">
                    {/* Timeline Dot */}
                    <div className={`relative z-10 w-16 h-16 rounded-full ${typeColors[event.type]} flex items-center justify-center text-white text-2xl shadow-lg`}>
                      {event.icon}
                    </div>

                    {/* Event Content */}
                    <div className={`flex-1 rounded-lg border-2 p-6 ${significanceColors[event.significance]}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{event.title}</h3>
                          <p className="text-gray-300 text-sm">{event.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-400">
                            {event.date.toLocaleDateString()}
                          </div>
                          <div className="text-xs text-purple-300">
                            Affection: {event.affectionLevel}
                          </div>
                        </div>
                      </div>

                      {/* Event Type Badge */}
                      <div className="flex items-center space-x-2 mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white capitalize ${typeColors[event.type]}`}>
                          {event.type.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs capitalize ${
                          event.significance === 'epic' ? 'bg-purple-600 text-white' :
                          event.significance === 'major' ? 'bg-blue-600 text-white' : 'bg-gray-600 text-white'
                        }`}>
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
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-xl font-semibold text-white mb-2">Your Story Begins Here</h3>
              <p className="text-gray-400 mb-6">
                Start interacting with {selectedCharacter.name} to create your relationship timeline.
              </p>
              <button
                onClick={() => setScreen('character-interaction')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors"
              >
                Start Your Story
              </button>
            </div>
          )}

          {/* Timeline Stats */}
          {timelineEvents.length > 0 && (
            <div className="bg-slate-900 rounded-lg p-6 mt-8 text-white">
              <h3 className="text-lg font-semibold mb-4 text-purple-300">Timeline Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {timelineEvents.filter(e => e.type === 'first_meeting').length}
                  </div>
                  <div className="text-xs text-gray-400">First Meetings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">
                    {timelineEvents.filter(e => e.type === 'milestone').length}
                  </div>
                  <div className="text-xs text-gray-400">Milestones</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-400">
                    {timelineEvents.filter(e => e.type === 'date').length}
                  </div>
                  <div className="text-xs text-gray-400">Dates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {timelineEvents.filter(e => e.type === 'photo_unlock').length}
                  </div>
                  <div className="text-xs text-gray-400">Photos</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};