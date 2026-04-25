import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameStore } from '../stores/gameStore';
import {
  getAvailableDialogueOptions,
  getContextualDialogue,
  processDialogueConsequence,
} from '../data/dialogue-trees';
import { DialogueOption } from '../types/game';
import { StorylinePanel } from './StorylinePanel';
import { CharacterImage } from './AssetLoader';
import {
  usePerformanceMonitor,
  useDebouncedAffectionUpdate,
  useOptimizedNavigation,
} from '../hooks/useOptimizedGame';
import { Button } from './ui/Button';
import { ProgressBar } from './ui/ProgressBar';
import { StatePanel } from './ui/StatePanel';

export const CharacterInteraction: React.FC = () => {
  const { selectedCharacter } = useGameStore();
  const { logSlowOperation } = usePerformanceMonitor('CharacterInteraction');
  const debouncedUpdateAffection = useDebouncedAffectionUpdate(150);
  const { navigateToScreen } = useOptimizedNavigation();

  const [currentDialogue, setCurrentDialogue] = useState<string>(
    'Select a conversation topic to begin...'
  );
  const [availableOptions, setAvailableOptions] = useState<DialogueOption[]>([]);
  const [consequences, setConsequences] = useState<string[]>([]);

  // Memoize dialogue options calculation for performance
  const dialogueOptions = useMemo(() => {
    if (!selectedCharacter) return [];

    const startTime = Date.now();
    const options = getAvailableDialogueOptions(
      selectedCharacter.id,
      selectedCharacter.affection,
      selectedCharacter.mood
    );
    logSlowOperation('getAvailableDialogueOptions', startTime);

    return options;
  }, [selectedCharacter, logSlowOperation]);

  // Update available options when memoized calculation changes
  useEffect(() => {
    setAvailableOptions(dialogueOptions);
  }, [dialogueOptions]);

  const handleDialogue = useCallback(
    (option: DialogueOption) => {
      if (!selectedCharacter) return;

      const startTime = Date.now();
      const response = getContextualDialogue(
        selectedCharacter.id,
        option.topic,
        selectedCharacter.mood,
        selectedCharacter.affection
      );
      logSlowOperation('getContextualDialogue', startTime);

      setCurrentDialogue(response.text);

      if (response.affectionChange > 0) {
        // Use debounced update for better performance
        debouncedUpdateAffection(selectedCharacter.id, response.affectionChange);
      }

      // Handle consequences
      if (response.consequence) {
        const processedConsequence = processDialogueConsequence(
          response.consequence,
          selectedCharacter.id
        );
        setConsequences(prev => [...prev.slice(-2), processedConsequence]); // Keep last 3 consequences
      }

      // Options will be automatically updated via the memoized calculation
      // when affection changes through the debounced update
    },
    [selectedCharacter, logSlowOperation, debouncedUpdateAffection]
  );

  const handleGift = useCallback(() => {
    if (!selectedCharacter) return;
    setCurrentDialogue(`${selectedCharacter.name} appreciates your thoughtful gift!`);
    debouncedUpdateAffection(selectedCharacter.id, 5);
  }, [selectedCharacter, debouncedUpdateAffection]);

  const handleDate = useCallback(() => {
    if (!selectedCharacter) return;

    if (selectedCharacter.affection >= 50) {
      setCurrentDialogue(`${selectedCharacter.name} happily agrees to go on a date with you!`);
      debouncedUpdateAffection(selectedCharacter.id, 10);
    } else {
      setCurrentDialogue(
        `${selectedCharacter.name} politely declines. They seem to want to know you better first.`
      );
    }
  }, [selectedCharacter, debouncedUpdateAffection]);

  if (!selectedCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md">
          <StatePanel
            variant="unavailable"
            icon="💬"
            title="No Character Selected"
            message="Choose a companion before opening the conversation console."
            actionLabel="Back to Hub"
            onAction={() => navigateToScreen('main-hub')}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Character Display */}
          <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-6">
            <div className="flex items-center space-x-6 mb-6">
              <CharacterImage
                characterId={selectedCharacter.id}
                alt={selectedCharacter.name}
                className="w-32 h-32 rounded-lg object-cover"
                fallbackClassName="bg-[var(--bg-item)]"
              />
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
                  {selectedCharacter.name}
                </h3>
                <p className="text-[var(--accent-teal)] mb-2">{selectedCharacter.species}</p>
                <p className="text-[var(--accent-cyan)] mb-2">Mood: {selectedCharacter.mood}</p>

                {/* Relationship Status */}
                <div className="mb-3">
                  <p className="text-[var(--resource-energy)] font-semibold text-sm">
                    {selectedCharacter.relationshipStatus.title}
                  </p>
                  <p className="text-[var(--text-secondary)] text-xs mt-1">
                    {selectedCharacter.relationshipStatus.description}
                  </p>
                </div>

                <div className="mb-2">
                  <ProgressBar
                    value={selectedCharacter.affection}
                    variant="affection"
                    size="md"
                    showValue
                    label="Affection"
                  />
                </div>

                {/* Advanced Relationship Metrics */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-[var(--resource-research)]">Trust</div>
                    <div className="text-[var(--text-primary)]">
                      {selectedCharacter.relationshipStatus.trust}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[var(--state-available)]">Intimacy</div>
                    <div className="text-[var(--text-primary)]">
                      {selectedCharacter.relationshipStatus.intimacy}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-[var(--resource-alloys)]">Compatibility</div>
                    <div className="text-[var(--text-primary)]">
                      {selectedCharacter.relationshipStatus.compatibility}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dialogue Area */}
          <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-6">
            <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-4 mb-4 min-h-[120px] flex items-center">
              <p className="text-lg leading-relaxed text-[var(--text-primary)]">
                {currentDialogue}
              </p>
            </div>

            {/* Consequences Display */}
            {consequences.length > 0 && (
              <div className="mb-4 space-y-2">
                {consequences.map((consequence, index) => (
                  <div
                    key={index}
                    className="bg-[var(--resource-alloys)]/15 border border-[var(--resource-alloys)]/30 rounded p-3"
                  >
                    <p className="text-[var(--text-secondary)] text-sm italic">{consequence}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Dialogue Options */}
            <div className="grid grid-cols-1 gap-3">
              {availableOptions.length > 0 ? (
                availableOptions.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleDialogue(option)}
                    className={`px-4 py-3 rounded-lg transition-colors text-left relative border focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--bg-space)] ${
                      option.requiresAffection &&
                      selectedCharacter.affection < option.requiresAffection
                        ? 'bg-[var(--bg-item)] border-[var(--state-locked)] text-[var(--text-muted)] opacity-60 cursor-not-allowed'
                        : 'bg-[var(--bg-section)] border-[var(--border-inner)] text-[var(--text-primary)] hover:bg-[var(--bg-item)] hover:border-[var(--accent-cyan)]'
                    }`}
                    disabled={
                      !!(
                        option.requiresAffection &&
                        selectedCharacter.affection < option.requiresAffection
                      )
                    }
                  >
                    <div className="flex justify-between items-center">
                      <span>{option.text}</span>
                      {option.requiresAffection && (
                        <span className="text-xs text-pink-400 ml-2">
                          (Affection {option.requiresAffection}+)
                        </span>
                      )}
                    </div>
                    {option.emotion && (
                      <div className="text-xs text-[var(--accent-cyan)] mt-1 capitalize">
                        {option.emotion} • {option.topic}
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <StatePanel
                  variant="empty"
                  icon="💬"
                  title="No Dialogue Available"
                  message="Try building more affection or check back later."
                  className="p-4"
                />
              )}
            </div>
          </div>

          {/* Storyline Panel */}
          <StorylinePanel characterId={selectedCharacter.id} />

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button onClick={handleGift} variant="outline">
              Give Gift
            </Button>
            <Button onClick={handleDate} variant="primary">
              Ask on Date
            </Button>
            <Button onClick={() => navigateToScreen('main-hub')} variant="secondary">
              Back to Hub
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
