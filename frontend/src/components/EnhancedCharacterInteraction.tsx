import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { DialogueOption, DialogueResponse, EmotionType } from '../types/game';
import { getDialogueTree, getDialogueResponse } from '../data/dialogue-trees';
import { getMoodModifier } from '../data/moods';
import { EmotionalText } from './ui/EmotionalText';
import { MoodDisplay } from './ui/MoodDisplay';

export const EnhancedCharacterInteraction: React.FC = () => {
  const { selectedCharacter, setScreen, updateAffection, updateLastInteractionDate, incrementConversations, canTalkToCharacterToday } = useGameStore();
  const [currentDialogue, setCurrentDialogue] = useState<string>('Choose how to start your conversation...');
  const [currentEmotion, setCurrentEmotion] = useState<EmotionType>('neutral');
  const [availableOptions, setAvailableOptions] = useState<DialogueOption[]>([]);
  const [dialogueHistory, setDialogueHistory] = useState<{ player: string; character: string; emotion: string }[]>([]);
  const [currentBranch, setCurrentBranch] = useState<string | null>(null);

  useEffect(() => {
    if (selectedCharacter) {
      const dialogueTree = getDialogueTree(selectedCharacter.id);
      if (dialogueTree) {
        setAvailableOptions(dialogueTree.rootOptions);
      } else {
        // Fallback to basic options for characters without dialogue trees
        setAvailableOptions([
          { id: 'greeting', text: 'General Chat', topic: 'greeting' },
          { id: 'interests', text: 'Ask About Interests', topic: 'interests' },
          { id: 'backstory', text: 'Learn About Past', topic: 'backstory' },
          { id: 'flirt', text: 'Flirt', topic: 'flirt', requiresAffection: 20 }
        ]);
      }
    }
  }, [selectedCharacter]);

  if (!selectedCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-8 text-center">
          <p className="text-xl text-[var(--text-primary)] mb-4">No character selected!</p>
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

  const handleDialogueChoice = (option: DialogueOption) => {
    // Check if we can talk today (once per day limit)
    if (!canTalkToCharacterToday(selectedCharacter.id)) {
      setCurrentDialogue(`You've already had your daily conversation with ${selectedCharacter.name}. Come back tomorrow for another chat!`);
      setCurrentEmotion('neutral');
      return;
    }

    // Check requirements
    if (option.requiresAffection && selectedCharacter.affection < option.requiresAffection) {
      setCurrentDialogue(`${selectedCharacter.name} seems uncomfortable with that approach. Perhaps build more trust first.`);
      setCurrentEmotion('nervous');
      return;
    }

    if (option.requiresMood && selectedCharacter.mood !== option.requiresMood) {
      setCurrentDialogue(`${selectedCharacter.name} doesn't seem to be in the right mood for that conversation.`);
      setCurrentEmotion('neutral');
      return;
    }

    // Mark that we've talked today (no longer using the multi-interaction system)
    updateLastInteractionDate(selectedCharacter.id);

    // Get response
    const response = getDialogueResponse(option.id);
    if (response) {
      setCurrentDialogue(response.text);
      setCurrentEmotion(response.emotion);

      // Calculate affection change with mood modifier
      const moodModifier = getMoodModifier(selectedCharacter.mood, option.topic);
      const totalAffectionChange = response.affectionChange + moodModifier;

      if (totalAffectionChange !== 0) {
        updateAffection(selectedCharacter.id, totalAffectionChange);
        incrementConversations();
      }

      // Add to dialogue history
      setDialogueHistory(prev => [...prev, {
        player: option.text,
        character: response.text,
        emotion: response.emotion
      }]);

      // Update available options based on branches
      if (option.nextOptions) {
        const dialogueTree = getDialogueTree(selectedCharacter.id);
        if (dialogueTree) {
          const nextBranchOptions = option.nextOptions.flatMap(branchId =>
            dialogueTree.branches[branchId] || []
          );
          setAvailableOptions([...dialogueTree.rootOptions, ...nextBranchOptions]);
          setCurrentBranch(option.nextOptions[0] || null);
        }
      }
    } else {
      // Fallback for basic dialogue
      handleBasicDialogue(option);
    }
  };

  const handleBasicDialogue = (option: DialogueOption) => {
    // Note: interaction already used in handleDialogueChoice, don't use again

    let dialogue = '';
    let affectionGain = 0;
    let emotion: EmotionType = 'neutral';

    switch (option.topic) {
      case 'greeting':
        dialogue = `${selectedCharacter.name} greets you warmly and seems pleased to see you.`;
        affectionGain = 1;
        emotion = 'happy';
        break;
      case 'interests':
        dialogue = `${selectedCharacter.name} shares some of their hobbies and interests with you. You learn more about their personality.`;
        affectionGain = 2;
        emotion = 'thoughtful';
        break;
      case 'backstory':
        dialogue = `${selectedCharacter.name} opens up about their past experiences. You feel a deeper connection forming.`;
        affectionGain = 3;
        emotion = 'thoughtful';
        break;
      case 'flirt':
        if (selectedCharacter.affection >= 20) {
          dialogue = `${selectedCharacter.name} blushes at your compliment and seems charmed by your words.`;
          affectionGain = 5;
          emotion = 'flirty';
        } else {
          dialogue = `${selectedCharacter.name} seems a bit uncomfortable with your advance. Maybe you should get to know them better first.`;
          affectionGain = 0;
          emotion = 'nervous';
        }
        break;
    }

    // Apply mood modifier
    const moodModifier = getMoodModifier(selectedCharacter.mood, option.topic);
    const totalAffectionChange = affectionGain + moodModifier;

    setCurrentDialogue(dialogue);
    setCurrentEmotion(emotion);

    if (totalAffectionChange > 0) {
      updateAffection(selectedCharacter.id, totalAffectionChange);
      incrementConversations();
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
                    <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-1">{selectedCharacter.name}</h3>
                    {selectedCharacter.knownInfo.species ? (
                      <p className="text-[var(--accent-teal)] font-medium mb-1">{selectedCharacter.species}</p>
                    ) : (
                      <p className="text-[var(--text-muted)] font-medium mb-1">Unknown Species</p>
                    )}
                    {selectedCharacter.knownInfo.basicPersonality ? (
                      <p className="text-[var(--text-muted)] text-sm">{selectedCharacter.personality}</p>
                    ) : (
                      <p className="text-[var(--text-muted)] text-sm">Personality Unknown</p>
                    )}
                  </div>

                  {/* Communication Status */}
                  <div className="text-right space-y-2">
                    <div>
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Comm Status</div>
                      <div className="text-[var(--state-available)] font-semibold">ONLINE</div>
                    </div>
                    <div>
                      <div className="text-xs text-[var(--text-muted)] uppercase tracking-wide">Daily Chat</div>
                      <div className={`font-semibold ${canTalkToday ? 'text-[var(--state-available)]' : 'text-[var(--state-deficit)]'}`}>
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
                    <div className="text-[var(--text-muted)] text-sm">Current mood is unknown - spend more time with them to learn their emotional state.</div>
                  </div>
                )}

                {/* Relationship Resources */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Affection</span>
                      <span className="text-[var(--text-primary)] text-sm font-bold">{selectedCharacter.affection}/100</span>
                    </div>
                    <div className="w-full bg-[var(--bg-section)] rounded-full h-2">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${selectedCharacter.affection}%`,
                          background: `linear-gradient(90deg, var(--resource-minerals), var(--resource-energy))`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Trust</span>
                      <span className="text-[var(--text-primary)] text-sm font-bold">75/100</span>
                    </div>
                    <div className="w-full bg-[var(--bg-section)] rounded-full h-2">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `75%`,
                          background: `linear-gradient(90deg, var(--accent-teal), var(--accent-cyan))`
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Compatibility</span>
                      <span className="text-[var(--text-primary)] text-sm font-bold">85%</span>
                    </div>
                    <div className="w-full bg-[var(--bg-section)] rounded-full h-2">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `85%`,
                          background: `linear-gradient(90deg, var(--state-available), var(--resource-food))`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="flex flex-wrap gap-2">
                  {unlockedMilestones.map((milestone, index) => (
                    <div key={index} className="px-3 py-1 bg-[var(--state-available)] text-[var(--bg-space)] rounded-full text-xs font-semibold">
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
              <h4 className="text-[var(--accent-cyan)] font-bold uppercase tracking-wide">Communication Interface</h4>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[var(--state-available)] rounded-full animate-pulse"></div>
                <span className="text-[var(--text-muted)] text-xs">ACTIVE CHANNEL</span>
              </div>
            </div>

            {/* Dialogue Display */}
            <div className="bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg p-4 mb-6 min-h-[120px]">
              <div className="text-[var(--text-primary)] leading-relaxed">
                <EmotionalText
                  text={currentDialogue}
                  emotion={currentEmotion}
                  className="w-full"
                />
              </div>
            </div>

            {/* Daily Chat Warning */}
            {!canTalkToday && (
              <div className="bg-[var(--state-deficit)]/20 border border-[var(--state-deficit)]/30 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <div>
                    <div className="text-[var(--state-deficit)] font-semibold">Daily conversation completed</div>
                    <div className="text-[var(--text-muted)] text-sm">
                      You've already had your daily chat with {selectedCharacter.name}. Come back tomorrow for another conversation!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Response Options Grid */}
            <div className="grid grid-cols-1 gap-3">
              {filteredOptions.map((option) => {
                const isLocked = option.requiresAffection && selectedCharacter.affection < option.requiresAffection;
                const isDisabled = isLocked || !canTalkToday;

                return (
                  <button
                    key={option.id}
                    onClick={() => !isDisabled && handleDialogueChoice(option)}
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
              <h4 className="text-[var(--accent-teal)] font-bold uppercase tracking-wide mb-4">Recent Exchange Log</h4>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {dialogueHistory.slice(-3).map((exchange, index) => (
                  <div key={index} className="space-y-2 border-b border-[var(--border-inner)] pb-3 last:border-b-0">
                    <div className="flex items-start gap-3">
                      <span className="text-[var(--accent-cyan)] text-xs font-semibold uppercase">You:</span>
                      <span className="text-[var(--text-secondary)] text-sm">{exchange.player}</span>
                    </div>
                    <div className="flex items-start gap-3 pl-4">
                      <span className="text-[var(--accent-teal)] text-xs font-semibold uppercase">{selectedCharacter.name}:</span>
                      <span className="text-[var(--text-primary)] text-sm">{exchange.character}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Panel */}
        <div className="flex justify-center">
          <button
            onClick={() => setScreen('main-hub')}
            className="flex items-center gap-3 px-8 py-4 text-lg font-semibold text-[var(--text-primary)] bg-[var(--bg-section)] hover:bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg transition-all duration-300"
          >
            <span className="text-2xl">🏠</span>
            <span>Return to Hub</span>
          </button>
        </div>
      </div>
    </div>
  );
};