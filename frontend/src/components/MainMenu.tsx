import React from 'react';
import { useGameStore } from '../stores/gameStore';

export const MainMenu: React.FC = () => {
  const setScreen = useGameStore(state => state.setScreen);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="card mb-8">
          <div className="text-center">
            <h1 className="brand text-4xl md:text-6xl mb-4">
              Interstellar Romance<span className="cursor"></span>
            </h1>
            <p className="subtitle text-xl md:text-2xl mb-2">
              A Stellaris Inspired Dating Simulator
            </p>
            <p className="text-lg">
              Find love among the stars
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setScreen('main-hub')}
            className="btn primary neon-outline block w-64 mx-auto text-xl"
          >
            🚀 Start Game
          </button>

          <button
            onClick={() => setScreen('character-creation')}
            className="btn warn neon-outline block w-64 mx-auto text-xl"
          >
            👤 Character Creation
          </button>

          <button
            className="btn ghost block w-64 mx-auto text-xl opacity-50"
            disabled
          >
            ⚙️ Settings
          </button>
        </div>
      </div>
    </div>
  );
};
