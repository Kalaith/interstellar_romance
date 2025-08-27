import React from 'react';
import { useGameStore } from '../stores/gameStore';

export const MainHub: React.FC = () => {
  const { 
    player, 
    characters, 
    currentWeek, 
    setScreen, 
    selectCharacter 
  } = useGameStore();

  if (!player) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">No character found!</p>
          <button 
            onClick={() => setScreen('character-creation')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            Create Character
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-slate-900 rounded-lg p-6 mb-8 text-white">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-3xl font-bold">Galactic Dating Hub</h2>
            <div className="text-right">
              <div className="text-lg">
                <span className="font-semibold">{player.name}</span> | Week {currentWeek}
              </div>
            </div>
          </div>
          
          {/* Player Stats */}
          <div className="grid grid-cols-5 gap-4 text-center">
            <div className="bg-slate-700 rounded p-3">
              <div className="text-sm text-gray-300">Charisma</div>
              <div className="text-xl font-bold">{player.stats.charisma}</div>
            </div>
            <div className="bg-slate-700 rounded p-3">
              <div className="text-sm text-gray-300">Intelligence</div>
              <div className="text-xl font-bold">{player.stats.intelligence}</div>
            </div>
            <div className="bg-slate-700 rounded p-3">
              <div className="text-sm text-gray-300">Adventure</div>
              <div className="text-xl font-bold">{player.stats.adventure}</div>
            </div>
            <div className="bg-slate-700 rounded p-3">
              <div className="text-sm text-gray-300">Empathy</div>
              <div className="text-xl font-bold">{player.stats.empathy}</div>
            </div>
            <div className="bg-slate-700 rounded p-3">
              <div className="text-sm text-gray-300">Technology</div>
              <div className="text-xl font-bold">{player.stats.technology}</div>
            </div>
          </div>
        </div>

        {/* Characters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {characters.map((character) => (
            <div 
              key={character.id}
              onClick={() => selectCharacter(character.id)}
              className="bg-slate-900 rounded-lg overflow-hidden cursor-pointer hover:bg-slate-800 transition-colors"
            >
              <div className="aspect-video bg-slate-700 relative">
                <img 
                  src={character.image} 
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 text-white">
                <h3 className="text-xl font-bold mb-1">{character.name}</h3>
                <p className="text-sm text-blue-300 mb-1">{character.species}</p>
                <p className="text-sm text-gray-300 mb-3">{character.personality}</p>
                
                {/* Affection Bar */}
                <div className="mb-2">
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${character.affection}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Affection: {character.affection}/100
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <button 
            onClick={() => setScreen('activities')}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
          >
            Weekly Activities
          </button>
          <button 
            className="px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors"
            disabled
          >
            Inventory
          </button>
          <button 
            onClick={() => setScreen('main-menu')}
            className="px-8 py-4 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors"
          >
            Menu
          </button>
        </div>
      </div>
    </div>
  );
};
