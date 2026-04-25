import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { DialogueOption, EmotionType } from '../types/game';
import { EmotionalText } from './ui/EmotionalText';
import { MoodDisplay } from './ui/MoodDisplay';
import { Button } from './ui/Button';
import { StatePanel } from './ui/StatePanel';

export const EnhancedCharacterInteraction: React.FC = () => {
  const {
    selectedCharacter,
    setScreen,
    canTalkToCharacterToday,
    chooseDialogue,
    isSaving,
  } = useGameStore();
  const [currentDialogue, setCurrentDialogue] = useState<string>(
    'Choose how to start your conversation...'
  );
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('neutral');
  const [availableOptions, setAvailableOptions] = useState<DialogueOption[]>([]);
  const [dialogueHistory, setDialogueHistory] = useState<
    { player: string; character: string; emotion: string }[]
  >([]);
  // const [currentBranch, setCurrentBranch] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCharacter) {
      setAvailableOptions(selectedCharacter.availableDialogueOptions || []);
    }
  }, [selectedCharacter]);

  if (!selectedCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md">
          <StatePanel
            variant="unavailable"
            icon="💬"
            title="No Character Selected"
            message="Choose a companion before opening the communication interface."
            actionLabel="Back to Hub"
            onAction={() => setScreen('main-hub')}
          />
        </div>
      </div>
    );
  }

  const handleDialogueChoice = async (option: DialogueOption) => {
    if (!canTalkToCharacterToday(selectedCharacter.id)) {
      setCurrentDialogue(
        `You've already had your daily conversation with ${selectedCharacter.name}. Come back tomorrow for another chat!`
      );
      setCurrentEmotion('neutral');
      return;
    }

    const result = await chooseDialogue(selectedCharacter.id, option.id);
    if (result) {
      setCurrentDialogue(result.response.text);
      setCurrentEmotion(result.response.emotion as EmotionType);
      setDialogueHistory(prev => [
        ...prev,
        {
          player: option.text,
          character: result.response.text,
          emotion: result.response.emotion,
        },
      ]);
    } else {
      setCurrentDialogue('The channel flickers. Try again once the backend confirms the exchange.');
      setCurrentEmotion('neutral');
    }
  };

  const filteredOptions = availableOptions.filter(option => {
    if (option.requiresAffection && selectedCharacter.affection < option.requiresAffection) {
      return false;
    }
    return true;
  });

  const canTalkToday = canTalkToCharacterToday(selectedCharacter.id);

  const unlockedMilestones = selectedCharacter.milestones.filter(m => m.achieved);
  const nextMilestone = selectedCharacter.milestones.find(m => !m.achieved);

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Stellaris-Style Character Console */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-6 backdrop-blur-sm">
          {/* Character Header Panel */}
          <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6 mb-6">
            <div className="flex items-start gap-6">
              {/* Character Portrait */}
              <div className="relative">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-[var(--bg-item)] border-2 border-[var(--accent-cyan)]">
                  <img
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-[var(--state-available)] rounded-full border-2 border-[var(--bg-section)] animate-pulse"></div>
              </div>

              {/* Character Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1">
                      {selectedCharacter.name}
                    </h3>
                    {selectedCharacter.knownInfo.species ? (
                      <p className="text-[var(--accent-teal)] font-medium mb-1">
                        {selectedCharacter.species}
                      </p>
                    ) : (
                      <p className="text-[var(--text-muted)] font-medium mb-1">Unknown Species</p>
                    )}
                    {selectedCharacter.knownInfo.basicPersonality ? (
                      <p className="text-[var(--text-muted)] text-sm">
                        {selectedCharacter.personality}
                      </p>
                    ) : (
                      <p className="text-[var(--text-muted)] text-sm">Personality Unknown</p>
                    )}
                  </div>

                  {/* Communication Status */}
                  <div className="text-right space-y-2">
                    <div>
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                        Comm Status
                      </div>
                      <div className="text-[var(--state-available)] font-semibold">ONLINE</div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                        Daily Chat
                      </div>
                      <div
                        className={`font-semibold ${canTalkToday ? 'text-[var(--state-available)]' : 'text-[var(--state-deficit)]'}`}
                      >
                        {canTalkToday ? 'AVAILABLE' : 'USED'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mood Display */}
                {selectedCharacter.knownInfo.mood ? (
                  <div className="mb-4">
                    <MoodDisplay
                      mood={selectedCharacter.mood}
                      characterName={selectedCharacter.name}
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="text-[var(--text-muted)] text-sm">
                      Current mood is unknown - spend more time with them to learn their emotional
                      state.
                    </div>
                  </div>
                )}

                {/* Relationship Resources */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[var(--text-muted)] text-xs uppercase tracking-wide">
                        Affection
                      </span>
                      <span className="text-[var(--text-primary)] text-sm font-bold">
                        {selectedCharacter.affection}/100
                      </span>
                    </div>
                    <div className="w-full bg-[var(--bg-section)] rounded-full h-2">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${selectedCharacter.affection}%`,
                          background: `linear-gradient(90deg, var(--resource-minerals), var(--resource-energy))`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[var(--text-muted)] text-xs uppercase tracking-wide">
                        Trust
                      </span>
                      <span className="text-[var(--text-primary)] text-sm font-bold">
                        {selectedCharacter.relationshipStatus.trust}/100
                      </span>
                    </div>
                    <div className="w-full bg-[var(--bg-section)] rounded-full h-2">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${selectedCharacter.relationshipStatus.trust}%`,
                          background: `linear-gradient(90deg, var(--accent-teal), var(--accent-cyan))`,
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[var(--text-muted)] text-xs uppercase tracking-wide">
                        Compatibility
                      </span>
                      <span className="text-[var(--text-primary)] text-sm font-bold">
                        {selectedCharacter.relationshipStatus.compatibility}%
                      </span>
                    </div>
                    <div className="w-full bg-[var(--bg-section)] rounded-full h-2">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${selectedCharacter.relationshipStatus.compatibility}%`,
                          background: `linear-gradient(90deg, var(--state-available), var(--resource-food))`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="flex flex-wrap gap-2">
                  {unlockedMilestones.map((milestone, index) => (
                    <div
                      key={index}
                      className="px-3 py-1 bg-[var(--state-available)] text-[var(--bg-space)] rounded-full text-xs font-semibold"
                    >
                      ✨ {milestone.name}
                    </div>
                  ))}
                  {nextMilestone && (
                    <div className="px-3 py-1 bg-[var(--state-locked)] text-[var(--text-muted)] rounded-full text-xs">
                      🔒 {nextMilestone.name} ({nextMilestone.unlockedAt} affection)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Communication Console */}
          <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[var(--accent-cyan)] font-bold uppercase tracking-wide">
                Communication Interface
              </h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[var(--state-available)] rounded-full animate-pulse"></div>
                <span className="text-[var(--text-muted)] text-xs">ACTIVE CHANNEL</span>
              </div>
            </div>

            {/* Dialogue Display */}
            <div className="bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg p-4 mb-6 min-h-[120px]">
              <div className="text-[var(--text-primary)] leading-relaxed">
                <EmotionalText text={currentDialogue} emotion={currentEmotion} className="w-full" />
              </div>
            </div>

            {/* Daily Chat Warning */}
            {!canTalkToday && (
              <div className="bg-[var(--state-deficit)]/20 border border-[var(--state-deficit)]/30 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <div className="text-[var(--state-deficit)] font-semibold">
                      Daily conversation completed
                    </div>
                    <div className="text-[var(--text-muted)] text-sm">
                      You've already had your daily chat with {selectedCharacter.name}. Come back
                      tomorrow for another conversation!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Response Options Grid */}
            <div className="grid grid-cols-1 gap-3">
              {filteredOptions.map(option => {
                const isLocked =
                  option.requiresAffection &&
                  selectedCharacter.affection < option.requiresAffection;
                const isDisabled = isLocked || !canTalkToday || isSaving;

                return (
                  <button
                    key={option.id}
                    onClick={() => !isDisabled && void handleDialogueChoice(option)}
                    className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                      isDisabled
                        ? 'border-[var(--state-locked)] bg-[var(--bg-item)] text-[var(--text-muted)] cursor-not-allowed opacity-50'
                        : 'border-[var(--border-inner)] bg-[var(--bg-item)] text-[var(--text-primary)] hover:border-[var(--accent-cyan)] hover:bg-[var(--bg-section)] hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]'
                    }`}
                    disabled={isDisabled}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{option.text}</span>
                      {option.requiresAffection && (
                        <span className="text-xs px-2 py-1 rounded-full bg-[var(--bg-section)] border border-[var(--border-inner)]">
                          {isLocked ? '🔒' : '💖'} {option.requiresAffection}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conversation Log */}
          {dialogueHistory.length > 0 && (
            <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
              <h4 className="text-[var(--accent-teal)] font-bold uppercase tracking-wide mb-4">
                Recent Exchange Log
              </h4>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {dialogueHistory.slice(-3).map((exchange, index) => (
                  <div
                    key={index}
                    className="space-y-2 border-b border-[var(--border-inner)] pb-3 last:border-b-0"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-[var(--accent-cyan)] text-xs font-semibold uppercase">
                        You:
                      </span>
                      <span className="text-[var(--text-secondary)] text-sm">
                        {exchange.player}
                      </span>
                    </div>
                    <div className="flex items-start gap-3 pl-4">
                      <span className="text-[var(--accent-teal)] text-xs font-semibold uppercase">
                        {selectedCharacter.name}:
                      </span>
                      <span className="text-[var(--text-primary)] text-sm">
                        {exchange.character}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Panel */}
        <div className="flex justify-center">
          <Button onClick={() => setScreen('main-hub')} variant="secondary" size="lg">
            <span className="text-2xl">🏠</span>
            <span>Return to Hub</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
