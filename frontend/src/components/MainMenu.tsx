import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';

export const MainMenu: React.FC = () => {
  const { setScreen, resetGame, player } = useGameStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSettings = () => {
    setShowSettings(!showSettings);
  };

  const handleResetGame = () => {
    resetGame();
    setShowResetConfirm(false);
    setShowSettings(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto">
        {/* Main Title Panel */}
        <div className="bg-slate-800/90 border border-cyan-300/20 rounded-lg p-8 mb-8 backdrop-blur-sm">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-cyan-50 mb-4 tracking-wide uppercase">
              Interstellar Romance<span className="cursor"></span>
            </h1>
            <p className="text-xl md:text-2xl text-cyan-300 mb-2 font-semibold">
              A Stellaris Inspired Dating Simulator
            </p>
            <p className="text-lg text-cyan-100">
              Find love among the stars
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          {player ? (
            <>
              <button
                onClick={() => setScreen('main-hub')}
                className="block w-64 mx-auto px-6 py-4 text-xl font-semibold text-slate-900 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-teal-400 hover:to-cyan-400 border border-cyan-400 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-400/30"
              >
                🚀 Continue Game
              </button>

              <button
                onClick={() => setScreen('character-creation')}
                className="block w-64 mx-auto px-6 py-4 text-xl font-semibold text-cyan-50 bg-slate-700/80 hover:bg-slate-600/80 border border-teal-400/30 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                👤 New Character
              </button>
            </>
          ) : (
            <button
              onClick={() => setScreen('character-creation')}
              className="block w-64 mx-auto px-6 py-4 text-xl font-semibold text-slate-900 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-teal-400 hover:to-cyan-400 border border-cyan-400 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-400/30"
            >
              🚀 Start New Game
            </button>
          )}

          <button
            onClick={handleSettings}
            className="block w-64 mx-auto px-6 py-4 text-xl font-semibold text-cyan-100 bg-slate-600/60 hover:bg-slate-500/60 border border-slate-500 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ⚙️ Settings
          </button>

          {/* Development Reset Button - More prominent for testing */}
          {player && (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="block w-64 mx-auto px-6 py-4 text-lg font-semibold text-red-200 bg-red-900/30 hover:bg-red-900/50 border border-red-500/50 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🗑️ Clear All Data
            </button>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-8 bg-slate-800/90 border border-cyan-300/20 rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-cyan-50 mb-4">Settings</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between">
                <span className="text-cyan-100">Sound Effects</span>
                <button className="w-12 h-6 bg-slate-600 rounded-full relative">
                  <div className="w-5 h-5 bg-cyan-400 rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cyan-100">Background Music</span>
                <button className="w-12 h-6 bg-slate-600 rounded-full relative">
                  <div className="w-5 h-5 bg-cyan-400 rounded-full absolute top-0.5 left-0.5 transition-transform"></div>
                </button>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-cyan-100">Animations</span>
                <button className="w-12 h-6 bg-cyan-400 rounded-full relative">
                  <div className="w-5 h-5 bg-slate-900 rounded-full absolute top-0.5 right-0.5 transition-transform"></div>
                </button>
              </div>

              {player && (
                <div className="border-t border-slate-600 pt-3 mt-3">
                  <button
                    onClick={() => setShowResetConfirm(true)}
                    className="w-full px-4 py-2 text-red-300 bg-red-900/30 hover:bg-red-900/50 border border-red-500/50 rounded transition-colors"
                  >
                    🗑️ Reset Game Data
                  </button>
                </div>
              )}
            </div>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 px-4 py-2 text-cyan-100 bg-slate-600/60 hover:bg-slate-500/60 border border-slate-500 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* Reset Confirmation Modal */}
        {showResetConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 border border-red-500/50 rounded-lg p-6 max-w-md mx-4">
              <h3 className="text-xl font-bold text-red-300 mb-4">⚠️ Confirm Reset</h3>
              <p className="text-cyan-100 mb-6">
                Are you sure you want to reset all game data? This will permanently delete all stored data including:
              </p>
              <ul className="text-cyan-200 text-sm mb-6 list-disc list-inside space-y-1">
                <li>Your character ({player?.name})</li>
                <li>All relationship progress</li>
                <li>Unlocked photos and achievements</li>
                <li>Conversation history</li>
                <li>All locally saved game data</li>
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 px-4 py-2 text-cyan-100 bg-slate-600/60 hover:bg-slate-500/60 border border-slate-500 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetGame}
                  className="flex-1 px-4 py-2 text-white bg-red-600 hover:bg-red-700 border border-red-500 rounded transition-colors"
                >
                  Reset Everything
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
