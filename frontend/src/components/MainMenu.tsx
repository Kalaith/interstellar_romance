import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { Button } from './ui/Button';
import { ConfirmModal } from './ui/Modal';

const SETTINGS_KEY = 'interstellar-romance-ui-settings';

export const MainMenu: React.FC = () => {
  const {
    setScreen,
    resetGame,
    player,
    continueAsGuest,
    mergeGuestSession,
    visitWebHatcheryLogin,
    isSaving,
    isGuest,
    isAuthenticated,
    hasMergeableGuestSession,
    authDisplayName,
  } = useGameStore();
  const [showSettings, setShowSettings] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      return stored
        ? JSON.parse(stored)
        : { soundEffects: false, backgroundMusic: false, animations: true };
    } catch {
      return { soundEffects: false, backgroundMusic: false, animations: true };
    }
  });

  const updateSetting = (key: keyof typeof settings) => {
    const nextSettings = { ...settings, [key]: !settings[key] };
    setSettings(nextSettings);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(nextSettings));
  };

  React.useEffect(() => {
    document.documentElement.dataset.animations = settings.animations ? 'on' : 'off';
  }, [settings.animations]);

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
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-8 mb-8 backdrop-blur-sm">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-[var(--text-primary)] mb-4 tracking-wide uppercase">
              Interstellar Romance<span className="cursor"></span>
            </h1>
            <p className="text-xl md:text-2xl text-[var(--accent-cyan)] mb-2 font-semibold">
              A Stellaris Inspired Dating Simulator
            </p>
            <p className="text-lg text-[var(--text-secondary)]">Find love among the stars</p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          {isAuthenticated && (
            <div className="mx-auto w-80 rounded-lg border border-[var(--accent-cyan)]/30 bg-[var(--accent-cyan)]/10 p-3 text-sm text-[var(--text-secondary)] space-y-3">
              Signed in{authDisplayName ? ` as ${authDisplayName}` : ''}.
              {hasMergeableGuestSession && (
                <div className="space-y-2 border-t border-[var(--accent-cyan)]/20 pt-3">
                  <p>Guest progress is available on this browser.</p>
                  <button
                    onClick={() => void mergeGuestSession()}
                    disabled={isSaving}
                    className="w-full px-4 py-2 text-sm font-semibold text-[var(--bg-space)] bg-[var(--accent-cyan)] hover:bg-[var(--accent-teal)] border border-[var(--accent-cyan)] rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] disabled:opacity-60 disabled:cursor-wait"
                  >
                    {isSaving ? 'Merging Guest Progress...' : 'Merge Guest Progress'}
                  </button>
                </div>
              )}
            </div>
          )}

          {player ? (
            <>
              {isGuest && (
                <div className="mx-auto w-80 rounded-lg border border-[var(--resource-energy)]/40 bg-[var(--resource-energy)]/10 p-3 text-sm text-[var(--text-secondary)] space-y-3">
                  <p>
                    Guest progress stays on this browser. Sign in with a full account to keep saves
                    across devices and cache resets.
                  </p>
                  <button
                    onClick={() => void visitWebHatcheryLogin()}
                    disabled={isSaving}
                    className="w-full px-4 py-2 text-sm font-semibold text-[var(--bg-space)] bg-[var(--resource-energy)] hover:bg-[var(--accent-cyan)] border border-[var(--resource-energy)] rounded transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--resource-energy)] disabled:opacity-60 disabled:cursor-wait"
                  >
                    {isSaving ? 'Opening Login...' : 'Sign in with WebHatchery'}
                  </button>
                </div>
              )}
              <button
                onClick={() => setScreen('main-hub')}
                className="block w-64 mx-auto px-6 py-4 text-xl font-semibold text-[var(--bg-space)] bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-teal)] hover:from-[var(--accent-teal)] hover:to-[var(--accent-cyan)] border border-[var(--accent-cyan)] rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--bg-space)]"
              >
                🚀 Continue Game
              </button>

              <button
                onClick={() => setScreen('character-creation')}
                className="block w-64 mx-auto px-6 py-4 text-xl font-semibold text-[var(--text-primary)] bg-[var(--bg-section)] hover:bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--bg-space)]"
              >
                👤 New Character
              </button>
            </>
          ) : isAuthenticated ? (
            <>
              <button
                onClick={() => setScreen('character-creation')}
                className="block w-64 mx-auto px-6 py-4 text-xl font-semibold text-[var(--bg-space)] bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-teal)] hover:from-[var(--accent-teal)] hover:to-[var(--accent-cyan)] border border-[var(--accent-cyan)] rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--bg-space)]"
              >
                👤 Create Character
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => void continueAsGuest()}
                disabled={isSaving}
                className="block w-64 mx-auto px-6 py-4 text-xl font-semibold text-[var(--bg-space)] bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-teal)] hover:from-[var(--accent-teal)] hover:to-[var(--accent-cyan)] border border-[var(--accent-cyan)] rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.3)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--bg-space)] disabled:opacity-60 disabled:cursor-wait"
              >
                {isSaving ? 'Opening Guest Session...' : '🚀 Continue as Guest'}
              </button>
              <button
                onClick={() => void visitWebHatcheryLogin()}
                disabled={isSaving}
                className="block w-64 mx-auto px-6 py-4 text-xl font-semibold text-[var(--text-primary)] bg-[var(--bg-section)] hover:bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--bg-space)] disabled:opacity-60 disabled:cursor-wait"
              >
                {isSaving ? 'Opening Login...' : 'Sign in with WebHatchery'}
              </button>
              <p className="mx-auto max-w-sm text-sm text-[var(--text-muted)]">
                Guest play continues from this browser cache. Use a full account if you want saves
                protected across cache resets or devices.
              </p>
            </>
          )}

          <button
            onClick={handleSettings}
            className="block w-64 mx-auto px-6 py-4 text-xl font-semibold text-[var(--text-primary)] bg-[var(--bg-section)] hover:bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--bg-space)]"
          >
            ⚙️ Settings
          </button>

          {/* Development Reset Button - More prominent for testing */}
          {player && (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="block w-64 mx-auto px-6 py-4 text-lg font-semibold text-red-200 bg-red-900/30 hover:bg-red-900/50 border border-red-500/50 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-[var(--bg-space)]"
            >
              🗑️ Clear All Data
            </button>
          )}
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <div className="mt-8 bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 backdrop-blur-sm">
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Settings</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center justify-between gap-4">
                <span className="text-[var(--text-secondary)]">Sound Effects</span>
                <button
                  type="button"
                  aria-pressed={settings.soundEffects}
                  onClick={() => updateSetting('soundEffects')}
                  className={`w-12 h-6 rounded-full relative border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] ${
                    settings.soundEffects
                      ? 'bg-[var(--accent-cyan)] border-[var(--accent-cyan)]'
                      : 'bg-[var(--bg-item)] border-[var(--border-inner)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full absolute top-0.5 transition-transform ${
                      settings.soundEffects
                        ? 'translate-x-6 bg-[var(--bg-space)]'
                        : 'translate-x-0.5 bg-[var(--text-muted)]'
                    }`}
                  ></div>
                </button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[var(--text-secondary)]">Background Music</span>
                <button
                  type="button"
                  aria-pressed={settings.backgroundMusic}
                  onClick={() => updateSetting('backgroundMusic')}
                  className={`w-12 h-6 rounded-full relative border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] ${
                    settings.backgroundMusic
                      ? 'bg-[var(--accent-cyan)] border-[var(--accent-cyan)]'
                      : 'bg-[var(--bg-item)] border-[var(--border-inner)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full absolute top-0.5 transition-transform ${
                      settings.backgroundMusic
                        ? 'translate-x-6 bg-[var(--bg-space)]'
                        : 'translate-x-0.5 bg-[var(--text-muted)]'
                    }`}
                  ></div>
                </button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-[var(--text-secondary)]">Animations</span>
                <button
                  type="button"
                  aria-pressed={settings.animations}
                  onClick={() => updateSetting('animations')}
                  className={`w-12 h-6 rounded-full relative border transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] ${
                    settings.animations
                      ? 'bg-[var(--accent-cyan)] border-[var(--accent-cyan)]'
                      : 'bg-[var(--bg-item)] border-[var(--border-inner)]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full absolute top-0.5 transition-transform ${
                      settings.animations
                        ? 'translate-x-6 bg-[var(--bg-space)]'
                        : 'translate-x-0.5 bg-[var(--text-muted)]'
                    }`}
                  ></div>
                </button>
              </div>

              {player && (
                <div className="border-t border-[var(--border-inner)] pt-3 mt-3">
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
              <Button onClick={() => setShowSettings(false)} variant="secondary" fullWidth>
                Close
              </Button>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={showResetConfirm}
          onClose={() => setShowResetConfirm(false)}
          onConfirm={handleResetGame}
          title="Confirm Reset"
          message={`Reset all saved game data${player ? ` for ${player.name}` : ''}? This removes relationship progress, unlocked photos, achievements, conversation history, and local saves.`}
          confirmText="Reset Everything"
          cancelText="Cancel"
          variant="danger"
        />
      </div>
    </div>
  );
};
