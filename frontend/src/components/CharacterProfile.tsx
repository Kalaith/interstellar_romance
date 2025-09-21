import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { calculateCompatibility, getCompatibilityColor, getCompatibilityLabel, isRomanticallyCompatible, getRomanceCompatibilityLabel, getRomanceCompatibilityColor } from '../utils/compatibility';
import { MoodDisplay } from './ui/MoodDisplay';

type TabType = 'overview' | 'interests' | 'values' | 'background' | 'compatibility';

export const CharacterProfile: React.FC = () => {
  const { selectedCharacter, player, setScreen } = useGameStore();
  const [activeTab, setActiveTab] = useState<TabType>('overview');

  if (!selectedCharacter || !player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-8 text-center">
          <p className="text-xl text-[var(--text-primary)] mb-4">Profile not available!</p>
          <button
            onClick={() => setScreen('main-hub')}
            className="px-6 py-3 text-[var(--bg-space)] bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-teal)] rounded-lg font-semibold"
          >
            Back to Hub
          </button>
        </div>
      </div>
    );
  }

  const compatibility = player ? calculateCompatibility(player, selectedCharacter.profile) : null;
  const knownInfo = selectedCharacter.knownInfo;

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: '👤', available: true },
    { id: 'interests' as TabType, label: 'Interests', icon: '🎯', available: knownInfo.interests },
    { id: 'values' as TabType, label: 'Values', icon: '💎', available: knownInfo.values },
    { id: 'background' as TabType, label: 'Background', icon: '📖', available: knownInfo.background },
    { id: 'compatibility' as TabType, label: 'Analysis', icon: '📊', available: compatibility !== null },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Basic Character Info */}
            <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-[var(--bg-item)] border-2 border-[var(--accent-cyan)]">
                  <img src={selectedCharacter.image} alt={selectedCharacter.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{selectedCharacter.name}</h2>
                  {knownInfo.species ? (
                    <p className="text-[var(--accent-teal)] font-medium mb-2">{selectedCharacter.species}</p>
                  ) : (
                    <p className="text-[var(--text-muted)] font-medium mb-2">Species Unknown</p>
                  )}

                  {/* Gender Information */}
                  <div className="flex items-center gap-4 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--text-muted)]">Gender:</span>
                      <span className="text-sm text-[var(--text-secondary)] capitalize">{selectedCharacter.gender}</span>
                    </div>
                    {player && (
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRomanceCompatibilityColor(player, selectedCharacter)}`}>
                          {isRomanticallyCompatible(player, selectedCharacter) ? '💕' : '🚫'}
                        </span>
                        <span className={`text-xs ${getRomanceCompatibilityColor(player, selectedCharacter)}`}>
                          {getRomanceCompatibilityLabel(player, selectedCharacter)}
                        </span>
                      </div>
                    )}
                  </div>

                  {knownInfo.basicPersonality ? (
                    <p className="text-[var(--text-secondary)] text-sm mb-3">{selectedCharacter.personality}</p>
                  ) : (
                    <p className="text-[var(--text-muted)] text-sm mb-3">Personality Unknown</p>
                  )}

                  {/* Affection Progress */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Affection</span>
                      <span className="text-[var(--text-primary)] text-sm font-bold">{selectedCharacter.affection}/100</span>
                    </div>
                    <div className="w-full bg-[var(--bg-item)] rounded-full h-3 border border-[var(--border-inner)]">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${selectedCharacter.affection}%`,
                          background: `linear-gradient(90deg, var(--resource-minerals), var(--resource-energy))`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mood Display */}
              {knownInfo.mood ? (
                <div className="mb-4">
                  <MoodDisplay mood={selectedCharacter.mood} characterName={selectedCharacter.name} />
                </div>
              ) : (
                <div className="mb-4 p-3 bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg">
                  <div className="text-[var(--text-muted)] text-sm">
                    Current mood is unknown. Spend more time together to learn how they're feeling.
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setScreen('character-interaction')}
                  className="flex items-center gap-3 px-4 py-3 text-[var(--bg-space)] bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-teal)] hover:from-[var(--accent-teal)] hover:to-[var(--accent-cyan)] border border-[var(--border-inner)] rounded-lg font-semibold transition-all duration-300"
                >
                  <span className="text-xl">💬</span>
                  <span>Chat</span>
                </button>
                <button
                  onClick={() => setScreen('date-planning')}
                  className="flex items-center gap-3 px-4 py-3 text-[var(--text-primary)] bg-[var(--bg-section)] hover:bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg font-semibold transition-all duration-300"
                >
                  <span className="text-xl">🌹</span>
                  <span>Plan Date</span>
                </button>
                <button
                  onClick={() => setScreen('photo-gallery')}
                  className="flex items-center gap-3 px-4 py-3 text-[var(--text-primary)] bg-[var(--bg-section)] hover:bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg font-semibold transition-all duration-300"
                >
                  <span className="text-xl">📸</span>
                  <span>Photos</span>
                </button>
                <button
                  onClick={() => setScreen('relationship-timeline')}
                  className="flex items-center gap-3 px-4 py-3 text-[var(--text-primary)] bg-[var(--bg-section)] hover:bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg font-semibold transition-all duration-300"
                >
                  <span className="text-xl">📖</span>
                  <span>Timeline</span>
                </button>
              </div>
            </div>

            {/* Milestones */}
            <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
              <h3 className="text-lg font-bold text-[var(--accent-cyan)] uppercase tracking-wide mb-4">Relationship Progress</h3>
              <div className="space-y-3">
                {selectedCharacter.milestones.map((milestone) => (
                  <div key={milestone.id} className={`flex items-center gap-3 p-3 rounded-lg ${
                    milestone.achieved
                      ? 'bg-[var(--state-available)]/20 border border-[var(--state-available)]/30'
                      : 'bg-[var(--bg-item)] border border-[var(--border-inner)]'
                  }`}>
                    <span className="text-xl">
                      {milestone.achieved ? '✨' : '🔒'}
                    </span>
                    <div className="flex-1">
                      <div className={`font-medium ${milestone.achieved ? 'text-[var(--state-available)]' : 'text-[var(--text-muted)]'}`}>
                        {milestone.name}
                      </div>
                      <div className="text-xs text-[var(--text-secondary)]">{milestone.description}</div>
                      {!milestone.achieved && (
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                          Unlock at {milestone.unlockedAt} affection
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'interests':
        if (!knownInfo.interests) {
          return (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Interests Unknown</h3>
              <p className="text-[var(--text-secondary)]">Reach 10 affection to learn about their interests and hobbies.</p>
            </div>
          );
        }
        return (
          <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
            <h3 className="text-lg font-bold text-[var(--accent-cyan)] uppercase tracking-wide mb-4">Interests & Passions</h3>
            <div className="grid grid-cols-1 gap-4">
              {selectedCharacter.profile.interests.map((interest) => (
                <div key={interest.id} className="bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-[var(--text-primary)]">{interest.name}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-lg ${i < interest.intensity ? 'text-[var(--resource-energy)]' : 'text-[var(--text-muted)]'}`}>⭐</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] capitalize">{interest.category}</div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'values':
        if (!knownInfo.values) {
          return (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Values Unknown</h3>
              <p className="text-[var(--text-secondary)]">Reach 25 affection to learn about their core values and communication style.</p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
              <h4 className="font-bold text-[var(--accent-teal)] mb-4">Core Values</h4>
              <div className="flex flex-wrap gap-2">
                {selectedCharacter.profile.values.map((value) => (
                  <span key={value} className="px-3 py-1 bg-[var(--state-available)]/20 text-[var(--state-available)] rounded-full text-sm capitalize border border-[var(--state-available)]/30">
                    {value}
                  </span>
                ))}
              </div>
            </div>

            {knownInfo.conversationStyle && (
              <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
                <h4 className="font-bold text-[var(--accent-teal)] mb-4">Communication Style</h4>
                <span className="px-4 py-2 bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] rounded-lg text-sm capitalize border border-[var(--accent-cyan)]/30">
                  {selectedCharacter.profile.conversationStyle}
                </span>
              </div>
            )}

            {knownInfo.dealbreakers && (
              <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
                <h4 className="font-bold text-[var(--state-deficit)] mb-4">Deal Breakers</h4>
                <ul className="space-y-2">
                  {selectedCharacter.profile.dealbreakers.map((dealbreaker, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <span className="text-[var(--state-deficit)] mt-1">❌</span>
                      <span className="text-[var(--text-secondary)]">{dealbreaker}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case 'background':
        if (!knownInfo.background) {
          return (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Background Unknown</h3>
              <p className="text-[var(--text-secondary)]">Reach 35 affection to learn about their background and life story.</p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
              <h4 className="font-bold text-[var(--accent-teal)] mb-4">Background</h4>
              <p className="text-[var(--text-secondary)] leading-relaxed">{selectedCharacter.profile.background}</p>
            </div>

            {knownInfo.goals && (
              <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
                <h4 className="font-bold text-[var(--accent-teal)] mb-4">Life Goals</h4>
                <p className="text-[var(--text-secondary)] leading-relaxed">{selectedCharacter.profile.goals}</p>
              </div>
            )}

            {knownInfo.favoriteTopics && (
              <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
                <h4 className="font-bold text-[var(--accent-teal)] mb-4">Favorite Topics</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCharacter.profile.favoriteTopics.map((topic, index) => (
                    <span key={index} className="px-3 py-1 bg-[var(--accent-cyan)]/20 text-[var(--accent-cyan)] rounded-full text-sm border border-[var(--accent-cyan)]/30">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 'compatibility':
        if (!compatibility) {
          return (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Analysis Unavailable</h3>
              <p className="text-[var(--text-secondary)]">Compatibility analysis requires more data.</p>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
              <div className="text-center mb-6">
                <div className={`text-4xl font-bold ${getCompatibilityColor(compatibility.overall)}`}>
                  {compatibility.overall}%
                </div>
                <div className={`text-lg ${getCompatibilityColor(compatibility.overall)}`}>
                  {getCompatibilityLabel(compatibility.overall)}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getCompatibilityColor(compatibility.breakdown.interests)}`}>
                    {compatibility.breakdown.interests}%
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">Interests</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getCompatibilityColor(compatibility.breakdown.values)}`}>
                    {compatibility.breakdown.values}%
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">Values</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getCompatibilityColor(compatibility.breakdown.conversationStyle)}`}>
                    {compatibility.breakdown.conversationStyle}%
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">Communication</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${getCompatibilityColor(compatibility.breakdown.activities)}`}>
                    {compatibility.breakdown.activities}%
                  </div>
                  <div className="text-sm text-[var(--text-muted)]">Activities</div>
                </div>
              </div>

              <div className="bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg p-4">
                <h4 className="font-bold text-[var(--resource-energy)] mb-3">Compatibility Insights</h4>
                <ul className="space-y-2">
                  {compatibility.explanation.map((insight, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-[var(--resource-energy)] mt-1">•</span>
                      <span className="text-[var(--text-secondary)] text-sm">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-cyan)] flex items-center justify-center text-2xl">
                👤
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-wide uppercase">Character Profile</h1>
                <p className="text-[var(--text-secondary)] text-sm">Diplomatic Personnel File</p>
              </div>
            </div>
            <button
              onClick={() => setScreen('main-hub')}
              className="px-6 py-3 text-[var(--text-primary)] bg-[var(--bg-section)] hover:bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg transition-all duration-300"
            >
              Back to Hub
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg mb-6">
          <div className="flex border-b border-[var(--border-inner)]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => tab.available && setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all ${
                  tab.available
                    ? activeTab === tab.id
                      ? 'text-[var(--accent-cyan)] border-b-2 border-[var(--accent-cyan)] bg-[var(--bg-section)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-section)]'
                    : 'text-[var(--text-muted)] cursor-not-allowed opacity-50'
                }`}
                disabled={!tab.available}
              >
                <span className="text-lg">{tab.available ? tab.icon : '🔒'}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="p-6">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};