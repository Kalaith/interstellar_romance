import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { useCharacterStore } from '../stores/characterStore';
import { MoodDisplay } from './ui/MoodDisplay';
import { ProgressBar } from './ui/ProgressBar';
import { Button, PrimaryButton, SecondaryButton } from './ui/Button';
import { CharacterImage } from './AssetLoader';
import { calculateCompatibility } from '../utils/compatibility';
import { filterCharactersByPreference, getPreferenceDescription } from '../utils/character-filtering';
import { AFFECTION_THRESHOLDS } from '../constants/gameConstants';
import { Logger } from '../services/Logger';
import { createCharacterId } from '../types/brandedTypes';

export const MainHub: React.FC = () => {
  const {
    player,
    currentWeek,
    setScreen
  } = useGameStore();

  const {
    characters,
    selectCharacter,
    canTalkToCharacterToday
  } = useCharacterStore();

  React.useEffect(() => {
    Logger.info('MainHub component mounted', {
      playerName: player?.name,
      characterCount: characters.length,
      currentWeek
    });
  }, [player?.name, characters.length, currentWeek]);

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-8 text-center">
          <p className="text-xl text-[var(--text-primary)] mb-4">No character found!</p>
          <PrimaryButton
            onClick={() => setScreen('character-creation')}
            size="lg"
          >
            Create Character
          </PrimaryButton>
        </div>
      </div>
    );
  }

  // Filter characters based on player's sexual preference
  const filteredCharacters = filterCharactersByPreference(characters, player.sexualPreference);
  const preferenceDescription = getPreferenceDescription(player.sexualPreference);

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8 max-w-7xl">
        {/* Stellaris-Style Top Bar */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-[var(--accent-cyan)] flex items-center justify-center text-2xl">
                🌌
              </div>
              <div>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-wide uppercase">
                  Galactic Dating Hub
                </h2>
                <p className="text-[var(--text-secondary)] text-sm">Interstellar Romance Command</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Captain</div>
                <div className="text-[var(--text-primary)] font-semibold">{player.name}</div>
              </div>
              <div className="text-center">
                <div className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Cycle</div>
                <div className="text-[var(--resource-energy)] font-semibold">{currentWeek}</div>
              </div>
              <Button
                variant="ghost"
                onClick={() => setScreen('main-menu')}
                iconLeft="🏠"
              >
                Main Menu
              </Button>
            </div>
          </div>
          
          {/* Player Stats Grid - Stellaris Resource Style */}
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: 'Charisma', value: player.stats.charisma, color: 'var(--resource-energy)', icon: '💬' },
              { label: 'Intelligence', value: player.stats.intelligence, color: 'var(--resource-research)', icon: '🧠' },
              { label: 'Adventure', value: player.stats.adventure, color: 'var(--resource-minerals)', icon: '🚀' },
              { label: 'Empathy', value: player.stats.empathy, color: 'var(--resource-food)', icon: '💖' },
              { label: 'Technology', value: player.stats.technology, color: 'var(--resource-alloys)', icon: '🔧' }
            ].map((stat) => (
              <div key={stat.label} className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-[var(--text-muted)] text-xs uppercase tracking-wide">{stat.label}</div>
                <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Panel - Characters Grid */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-[var(--accent-cyan)] uppercase tracking-wide">Available Companions</h3>
            <div className="flex items-center gap-4">
              <span className="text-[var(--text-muted)] text-sm">{filteredCharacters.length} of {characters.length} shown</span>
              <span className="text-[var(--text-secondary)] text-xs bg-[var(--bg-section)] px-3 py-1 rounded-full border border-[var(--border-inner)]">
                {preferenceDescription}
              </span>
              <button className="px-4 py-2 bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg text-[var(--text-secondary)] text-sm hover:bg-[var(--bg-item)] transition-colors">
                🔄 Auto Manage
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharacters.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <div className="text-6xl mb-4">💔</div>
                <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">No Compatible Characters</h3>
                <p className="text-[var(--text-secondary)] mb-4">
                  No characters match your current preference: {preferenceDescription.toLowerCase()}
                </p>
                <button
                  onClick={() => setScreen('character-creation')}
                  className="px-6 py-3 text-[var(--bg-space)] bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-teal)] rounded-lg font-semibold"
                >
                  Update Preferences
                </button>
              </div>
            ) : (
              filteredCharacters.map((character) => {
              const canTalkToday = canTalkToCharacterToday(createCharacterId(character.id));
              const compatibility = player ? calculateCompatibility(player, character.profile) : null;

              return (
                <div
                  key={character.id}
                  onClick={() => selectCharacter(createCharacterId(character.id))}
                  className="bg-[var(--bg-section)] border-2 border-[var(--border-inner)] hover:border-[var(--accent-cyan)] cursor-pointer hover:shadow-[0_0_20px_rgba(0,212,255,0.2)] transform hover:scale-105 rounded-lg overflow-hidden transition-all duration-300"
                >
                  {/* Character Portrait */}
                  <div className="aspect-video relative bg-[var(--bg-item)]">
                    <CharacterImage
                      characterId={character.id}
                      alt={character.name}
                      className="w-full h-full object-cover"
                      fallbackClassName="bg-[var(--bg-item)]"
                    />
                    
                    {/* Compatibility Badge */}
                    {compatibility && (
                      <div className="absolute top-3 right-3">
                        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--bg-item)] border border-[var(--border-inner)]">
                          <span style={{ color: compatibility.overall >= 70 ? 'var(--state-available)' : compatibility.overall >= 40 ? 'var(--resource-energy)' : 'var(--state-deficit)' }}>
                            {compatibility.overall}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Daily Chat Status */}
                    {!canTalkToday && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-[var(--resource-energy)] text-2xl mb-2">💬</div>
                          <div className="text-[var(--text-secondary)] text-sm">Chat Used</div>
                          <div className="text-[var(--text-muted)] text-xs">Available tomorrow</div>
                        </div>
                      </div>
                    )}

                    {/* Available Status */}
                    {canTalkToday && (
                      <div className="absolute top-3 left-3">
                        <div className="w-3 h-3 bg-[var(--state-available)] rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>

                  {/* Character Info Panel */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-[var(--text-primary)]">{character.name}</h3>
                        {character.knownInfo.species ? (
                          <p className="text-[var(--accent-teal)] text-sm font-medium">{character.species}</p>
                        ) : (
                          <p className="text-[var(--text-muted)] text-sm font-medium">Unknown Species</p>
                        )}
                        {character.knownInfo.basicPersonality ? (
                          <p className="text-[var(--text-muted)] text-xs">{character.personality}</p>
                        ) : (
                          <p className="text-[var(--text-muted)] text-xs">Personality Unknown</p>
                        )}
                      </div>
                    </div>

                    {/* Mood Display */}
                    {character.knownInfo.mood ? (
                      <div className="mb-3">
                        <MoodDisplay
                          mood={character.mood}
                          characterName={character.name}
                          className="text-xs"
                        />
                      </div>
                    ) : (
                      <div className="mb-3">
                        <div className="text-xs text-[var(--text-muted)]">Mood: Unknown</div>
                      </div>
                    )}

                    {/* Affection Progress */}
                    <div className="mb-4">
                      <ProgressBar
                        variant="affection"
                        value={character.affection}
                        showValue={true}
                        animated={true}
                        size="sm"
                        label="Affection"
                      />
                    </div>

                    {/* Action Buttons Grid */}
                    <div className="grid grid-cols-2 gap-2">
                      <PrimaryButton
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          selectCharacter(createCharacterId(character.id));
                          setScreen('character-profile');
                        }}
                        iconLeft="📋"
                      >
                        Profile
                      </PrimaryButton>

                      {character.affection >= AFFECTION_THRESHOLDS.HIGH ? (
                        <SecondaryButton
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectCharacter(createCharacterId(character.id));
                            setScreen('character-interaction');
                          }}
                          iconLeft="📅"
                        >
                          Date
                        </SecondaryButton>
                      ) : (
                        <Button
                          size="xs"
                          disabled
                          variant="ghost"
                          iconLeft="🔒"
                        >
                          Locked
                        </Button>
                      )}
                    </div>

                    {/* Milestones */}
                    {character.milestones.filter(m => m.achieved).length > 0 && (
                      <div className="mt-3 pt-3 border-t border-[var(--border-inner)]">
                        <div className="flex items-center gap-2">
                          <span className="text-[var(--state-available)] text-xs">✨</span>
                          <span className="text-[var(--text-muted)] text-xs">
                            {character.milestones.filter(m => m.achieved).length} milestones achieved
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>

        {/* Bottom Action Panel */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6">
          <div className="flex justify-center gap-4 flex-wrap">
            <button
              onClick={() => setScreen('activities')}
              className="flex items-center gap-3 px-6 py-4 text-lg font-semibold text-[var(--bg-space)] bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-teal)] hover:from-[var(--accent-teal)] hover:to-[var(--accent-cyan)] rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
            >
              <span className="text-2xl">📅</span>
              <span>Weekly Planning</span>
            </button>

            <button
              onClick={() => setScreen('self-improvement')}
              className="flex items-center gap-3 px-6 py-4 text-lg font-semibold text-[var(--bg-space)] bg-gradient-to-r from-[var(--resource-energy)] to-[var(--resource-alloys)] hover:from-[var(--resource-alloys)] hover:to-[var(--resource-energy)] rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[0_0_20px_rgba(46,213,115,0.3)]"
            >
              <span className="text-2xl">💪</span>
              <span>Self-Improvement</span>
            </button>

            <button
              onClick={() => setScreen('achievements')}
              className="flex items-center gap-3 px-6 py-4 text-lg font-semibold text-[var(--text-primary)] bg-[var(--bg-section)] hover:bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg transition-all duration-300"
            >
              <span className="text-2xl">🏆</span>
              <span>Achievements</span>
            </button>

            <button
              onClick={() => setScreen('main-menu')}
              className="flex items-center gap-3 px-6 py-4 text-lg font-semibold text-[var(--text-muted)] bg-[var(--bg-section)] hover:bg-[var(--bg-item)] border border-[var(--state-locked)] rounded-lg transition-all duration-300"
            >
              <span className="text-2xl">🏠</span>
              <span>Menu</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
