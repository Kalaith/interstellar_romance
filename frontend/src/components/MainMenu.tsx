import React from 'react';
import { useGameStore } from '../stores/gameStore';

export const MainMenu: React.FC = () => {
  const setScreen = useGameStore(state => state.setScreen);

  return (
    <div className="min-h-screen relative bg-gradient-to-b from-slate-900 to-blue-900 flex items-center justify-center">
      {/* Stars background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="w-full h-full opacity-30 animate-pulse"
          style={{
            backgroundImage: `
              radial-gradient(2px 2px at 20% 30%, white, transparent),
              radial-gradient(2px 2px at 40% 70%, white, transparent),
              radial-gradient(1px 1px at 90% 40%, white, transparent),
              radial-gradient(1px 1px at 50% 80%, white, transparent),
              radial-gradient(2px 2px at 70% 10%, white, transparent)
            `,
            backgroundSize: '200px 100px'
          }}
        ></div>
      </div>
      
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-white mb-4 tracking-wide">
            Interstellar Romance
          </h1>
          <p className="text-2xl text-blue-200 mb-2">
            A Stellaris Inspired Dating Simulator
          </p>
          <p className="text-lg text-blue-300">
            Find love among the stars
          </p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => setScreen('main-hub')}
            className="block w-64 mx-auto px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white text-xl font-semibold rounded-lg transition-colors duration-200"
          >
            Start Game
          </button>
          
          <button 
            onClick={() => setScreen('character-creation')}
            className="block w-64 mx-auto px-8 py-4 bg-purple-600 hover:bg-purple-500 text-white text-xl font-semibold rounded-lg transition-colors duration-200"
          >
            Character Creation
          </button>
          
          <button 
            className="block w-64 mx-auto px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white text-xl font-semibold rounded-lg transition-colors duration-200"
            disabled
          >
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};
