import React, { useState, useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { getAvailableDialogueOptions, getContextualDialogue, processDialogueConsequence } from '../data/dialogue-trees';
import { DialogueOption } from '../types/game';
import { StorylinePanel } from './StorylinePanel';

export const CharacterInteraction: React.FC = () => {
  const { selectedCharacter, setScreen, updateAffection } = useGameStore();
  const [currentDialogue, setCurrentDialogue] = useState<string>('Select a conversation topic to begin...');
  const [availableOptions, setAvailableOptions] = useState<DialogueOption[]>([]);
  const [consequences, setConsequences] = useState<string[]>([]);

  // Update available dialogue options when character or affection changes
  useEffect(() => {
    if (selectedCharacter) {
      const options = getAvailableDialogueOptions(
        selectedCharacter.id,
        selectedCharacter.affection,
        selectedCharacter.mood
      );
      setAvailableOptions(options);
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

  const handleDialogue = (option: DialogueOption) => {
    if (!selectedCharacter) return;

    const response = getContextualDialogue(
      selectedCharacter.id,
      option.topic,
      selectedCharacter.mood,
      selectedCharacter.affection
    );

    setCurrentDialogue(response.text);

    if (response.affectionChange > 0) {
      updateAffection(selectedCharacter.id, response.affectionChange);
    }

    // Handle consequences
    if (response.consequence) {
      const processedConsequence = processDialogueConsequence(response.consequence, selectedCharacter.id);
      setConsequences(prev => [...prev.slice(-2), processedConsequence]); // Keep last 3 consequences
    }

    // Update available options after interaction
    setTimeout(() => {
      const newOptions = getAvailableDialogueOptions(
        selectedCharacter.id,
        selectedCharacter.affection + (response.affectionChange || 0),
        selectedCharacter.mood
      );
      setAvailableOptions(newOptions);
    }, 100);
  };

  const handleGift = () => {
    setCurrentDialogue(`${selectedCharacter.name} appreciates your thoughtful gift!`);
    updateAffection(selectedCharacter.id, 5);
  };

  const handleDate = () => {
    if (selectedCharacter.affection >= 50) {
      setCurrentDialogue(`${selectedCharacter.name} happily agrees to go on a date with you!`);
      updateAffection(selectedCharacter.id, 10);
    } else {
      setCurrentDialogue(`${selectedCharacter.name} politely declines. They seem to want to know you better first.`);
    }
  };

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
                <p className="text-purple-300 mb-2">Mood: {selectedCharacter.mood}</p>

                {/* Relationship Status */}
                <div className="mb-3">
                  <p className="text-yellow-400 font-semibold text-sm">
                    {selectedCharacter.relationshipStatus.title}
                  </p>
                  <p className="text-gray-300 text-xs mt-1">
                    {selectedCharacter.relationshipStatus.description}
                  </p>
                </div>

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

                {/* Advanced Relationship Metrics */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <div className="text-blue-400">Trust</div>
                    <div className="text-white">{selectedCharacter.relationshipStatus.trust}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400">Intimacy</div>
                    <div className="text-white">{selectedCharacter.relationshipStatus.intimacy}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-purple-400">Compatibility</div>
                    <div className="text-white">{selectedCharacter.relationshipStatus.compatibility}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Dialogue Area */}
          <div className="bg-slate-900 rounded-lg p-6 mb-6 text-white">
            <div className="bg-slate-800 rounded-lg p-4 mb-4 min-h-[120px] flex items-center">
              <p className="text-lg leading-relaxed">{currentDialogue}</p>
            </div>

            {/* Consequences Display */}
            {consequences.length > 0 && (
              <div className="mb-4 space-y-2">
                {consequences.map((consequence, index) => (
                  <div key={index} className="bg-purple-900/40 border border-purple-500/30 rounded p-3">
                    <p className="text-purple-200 text-sm italic">{consequence}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Dialogue Options */}
            <div className="grid grid-cols-1 gap-3">
              {availableOptions.length > 0 ? (
                availableOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleDialogue(option)}
                    className={`px-4 py-3 text-white rounded-lg transition-colors text-left relative ${
                      option.requiresAffection && selectedCharacter.affection < option.requiresAffection
                        ? 'bg-slate-600 opacity-60 cursor-not-allowed'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                    disabled={option.requiresAffection && selectedCharacter.affection < option.requiresAffection}
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
                      <div className="text-xs text-blue-300 mt-1 capitalize">
                        {option.emotion} • {option.topic}
                      </div>
                    )}
                  </button>
                ))
              ) : (
                <div className="text-center text-gray-400 py-4">
                  <p>No dialogue options available for this character yet.</p>
                  <p className="text-sm mt-1">Try building more affection or check back later!</p>
                </div>
              )}
            </div>
          </div>

          {/* Storyline Panel */}
          <StorylinePanel characterId={selectedCharacter.id} />

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <button 
              onClick={handleGift}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors"
            >
              Give Gift
            </button>
            <button 
              onClick={handleDate}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-semibold rounded-lg transition-colors"
            >
              Ask on Date
            </button>
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
