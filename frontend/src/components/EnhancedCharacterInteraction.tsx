import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { DialogueOption, DialogueResponse, EmotionType } from '../types/game';
import { getDialogueTree, getDialogueResponse } from '../data/dialogue-trees';
import { getMoodModifier } from '../data/moods';
import { EmotionalText } from './ui/EmotionalText';
import { MoodDisplay } from './ui/MoodDisplay';

export const EnhancedCharacterInteraction: React.FC = () => {
  const { selectedCharacter, setScreen, updateAffection, updateLastInteraction, incrementConversations } = useGameStore();
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
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">No character selected!</p>
          <button
            onClick={() => setScreen('main-hub')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            Back to Hub
          </button>
        </div>
      </div>
    );
  }

  const handleDialogueChoice = (option: DialogueOption) => {
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
        updateLastInteraction(selectedCharacter.id);
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
      updateLastInteraction(selectedCharacter.id);
      incrementConversations();
    }
  };

  const filteredOptions = availableOptions.filter(option => {
    if (option.requiresAffection && selectedCharacter.affection < option.requiresAffection) {
      return false;
    }
    return true;
  });

  const unlockedMilestones = selectedCharacter.milestones.filter(m => m.achieved);
  const nextMilestone = selectedCharacter.milestones.find(m => !m.achieved);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Character Display */}
          <div className="bg-slate-900 rounded-lg p-6 mb-6 text-white">
            <div className="flex items-center space-x-6 mb-6">
              <div className="w-32 h-32 rounded-lg overflow-hidden bg-slate-700">
                <img
                  src={selectedCharacter.image}
                  alt={selectedCharacter.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-2">{selectedCharacter.name}</h3>
                <p className="text-blue-300 mb-2">{selectedCharacter.species}</p>

                {/* Mood Display */}
                <div className="mb-3">
                  <MoodDisplay
                    mood={selectedCharacter.mood}
                    characterName={selectedCharacter.name}
                  />
                </div>

                {/* Affection Bar */}
                <div className="mb-2">
                  <div className="w-full bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-pink-500 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${selectedCharacter.affection}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-gray-400 mt-1">
                    Affection: {selectedCharacter.affection}/100
                  </div>
                </div>

                {/* Milestones */}
                {unlockedMilestones.length > 0 && (
                  <div className="mb-2">
                    <p className="text-xs text-purple-300">
                      Milestones: {unlockedMilestones.map(m => m.name).join(', ')}
                    </p>
                  </div>
                )}

                {nextMilestone && (
                  <div className="text-xs text-yellow-300">
                    Next: {nextMilestone.name} (at {nextMilestone.unlockedAt} affection)
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dialogue Area */}
          <div className="bg-slate-900 rounded-lg p-6 mb-6 text-white">
            <div className="bg-slate-800 rounded-lg p-4 mb-4 min-h-[120px] flex items-start">
              <EmotionalText
                text={currentDialogue}
                emotion={currentEmotion}
                className="w-full"
              />
            </div>

            {/* Dialogue Options */}
            <div className="grid grid-cols-1 gap-3">
              {filteredOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleDialogueChoice(option)}
                  className={`px-4 py-3 rounded-lg transition-colors text-left
                    ${option.requiresAffection && selectedCharacter.affection < option.requiresAffection
                      ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  disabled={option.requiresAffection ? selectedCharacter.affection < option.requiresAffection : false}
                >
                  <div className="flex justify-between items-center">
                    <span>{option.text}</span>
                    {option.requiresAffection && (
                      <span className="text-xs text-gray-400">
                        (Requires {option.requiresAffection} affection)
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Dialogue History */}
          {dialogueHistory.length > 0 && (
            <div className="bg-slate-900 rounded-lg p-6 mb-6 text-white">
              <h4 className="text-lg font-semibold mb-4">Recent Conversation</h4>
              <div className="space-y-3 max-h-40 overflow-y-auto">
                {dialogueHistory.slice(-3).map((exchange, index) => (
                  <div key={index} className="space-y-2">
                    <div className="text-blue-300 text-sm">You: {exchange.player}</div>
                    <div className="text-gray-300 text-sm pl-4">{selectedCharacter.name}: {exchange.character}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => setScreen('main-hub')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors"
            >
              Back to Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};