import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { MoodDisplay } from './ui/MoodDisplay';
import { calculateCompatibility, getCompatibilityColor } from '../utils/compatibility';

export const MainHub: React.FC = () => {
  const {
    player,
    characters,
    currentWeek,
    setScreen,
    selectCharacter,
    isCharacterAvailable,
    getTimeUntilAvailable
  } = useGameStore();

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card text-center">
          <p className="text-xl mb-4">No character found!</p>
          <button
            onClick={() => setScreen('character-creation')}
            className="btn primary"
          >
            Create Character
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8">
        {/* Header */}
        <div className="card mb-8">
          <div className="header mb-4">
            <h2 className="brand text-2xl md:text-3xl">Galactic Dating Hub</h2>
            <div className="flex-1"></div>
            <div className="kv">
              <span className="key">Captain:</span>
              <span className="value">{player.name}</span>
            </div>
            <div className="kv">
              <span className="key">Week:</span>
              <span className="value">{currentWeek}</span>
            </div>
          </div>
          
          {/* Player Stats */}
          <div className="grid grid-cols-5 gap-4 text-center">
            <div className="card">
              <div className="subtitle text-sm">Charisma</div>
              <div className="value text-xl">{player.stats.charisma}</div>
            </div>
            <div className="card">
              <div className="subtitle text-sm">Intelligence</div>
              <div className="value text-xl">{player.stats.intelligence}</div>
            </div>
            <div className="card">
              <div className="subtitle text-sm">Adventure</div>
              <div className="value text-xl">{player.stats.adventure}</div>
            </div>
            <div className="card">
              <div className="subtitle text-sm">Empathy</div>
              <div className="value text-xl">{player.stats.empathy}</div>
            </div>
            <div className="card">
              <div className="subtitle text-sm">Technology</div>
              <div className="value text-xl">{player.stats.technology}</div>
            </div>
          </div>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {characters.map((character) => {
            const isAvailable = isCharacterAvailable(character.id);
            const timeUntilAvailable = getTimeUntilAvailable(character.id);
            const compatibility = player ? calculateCompatibility(player, character.profile) : null;

            return (
              <div
                key={character.id}
                onClick={() => selectCharacter(character.id)}
                className={`card neon-outline overflow-hidden cursor-pointer transition-all duration-300 ${
                  isAvailable
                    ? 'hover:scale-105'
                    : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <div className="aspect-video relative bg-slate-800">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                  {!isAvailable && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="subtitle text-sm">⏰ Busy</div>
                        <div className="subtitle text-xs">{timeUntilAvailable}m left</div>
                      </div>
                    </div>
                  )}
                  {compatibility && (
                    <div className="absolute top-2 right-2">
                      <div
                        className={`chip text-xs ${
                          getCompatibilityColor(compatibility.overall)
                        }`}
                      >
                        {compatibility.overall}%
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="brand text-xl mb-1">{character.name}</h3>
                  <p className="subtitle text-sm mb-1">{character.species}</p>
                  <p className="subtitle text-sm mb-3">{character.personality}</p>

                  {/* Mood Display */}
                  <div className="mb-3">
                    <MoodDisplay
                      mood={character.mood}
                      characterName={character.name}
                      className="text-xs scale-75 origin-left"
                    />
                  </div>

                  {/* Affection Bar */}
                  <div className="mb-3">
                    <div className="progress">
                      <i style={{ width: `${character.affection}%` }}></i>
                    </div>
                    <div className="kv mt-1">
                      <span className="key text-xs">Affection:</span>
                      <span className="value text-xs">{character.affection}/100</span>
                    </div>
                  </div>

                  {/* Quick Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        selectCharacter(character.id);
                      }}
                      className={`btn ${
                        isAvailable ? 'primary' : 'ghost'
                      } flex-1 text-xs`}
                      disabled={!isAvailable}
                    >
                      View Profile
                    </button>
                    {character.affection >= 10 && isAvailable && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          selectCharacter(character.id);
                          // Will navigate to profile, then user can plan date
                        }}
                        className="btn warn flex-1 text-xs"
                      >
                        Plan Date
                      </button>
                    )}
                  </div>

                  {/* Milestones indicator */}
                  {character.milestones.filter(m => m.achieved).length > 0 && (
                    <div className="mt-2">
                      <span className="chip text-xs text-green-400">
                        ✨ {character.milestones.filter(m => m.achieved).length} milestones
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 flex-wrap gap-4">
          <button
            onClick={() => setScreen('activities')}
            className="btn primary neon-outline px-8 py-4 text-lg"
          >
            📅 Weekly Activities
          </button>
          <button
            onClick={() => setScreen('achievements')}
            className="btn warn neon-outline px-8 py-4 text-lg"
          >
            🏆 Achievements
          </button>
          <button
            onClick={() => setScreen('main-menu')}
            className="btn ghost px-8 py-4 text-lg"
          >
            🏠 Menu
          </button>
        </div>
      </div>
    </div>
  );
};
