import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';

export const CharacterInteraction: React.FC = () => {
  const { selectedCharacter, setScreen, updateAffection } = useGameStore();
  const [currentDialogue, setCurrentDialogue] = useState<string>('Select a conversation topic to begin...');

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

  const dialogueOptions = [
    { id: 'greeting', text: 'General Chat', topic: 'greeting' },
    { id: 'interests', text: 'Ask About Interests', topic: 'interests' },
    { id: 'backstory', text: 'Learn About Past', topic: 'backstory' },
    { id: 'flirt', text: 'Flirt', topic: 'flirt' }
  ];

  const handleDialogue = (topic: string) => {
    let dialogue = '';
    let affectionGain = 0;

    switch (topic) {
      case 'greeting':
        dialogue = `${selectedCharacter.name} greets you warmly and seems pleased to see you.`;
        affectionGain = 1;
        break;
      case 'interests':
        dialogue = `${selectedCharacter.name} shares some of their hobbies and interests with you. You learn more about their personality.`;
        affectionGain = 2;
        break;
      case 'backstory':
        dialogue = `${selectedCharacter.name} opens up about their past experiences. You feel a deeper connection forming.`;
        affectionGain = 3;
        break;
      case 'flirt':
        if (selectedCharacter.affection >= 20) {
          dialogue = `${selectedCharacter.name} blushes at your compliment and seems charmed by your words.`;
          affectionGain = 5;
        } else {
          dialogue = `${selectedCharacter.name} seems a bit uncomfortable with your advance. Maybe you should get to know them better first.`;
          affectionGain = 0;
        }
        break;
    }

    setCurrentDialogue(dialogue);
    if (affectionGain > 0) {
      updateAffection(selectedCharacter.id, affectionGain);
    }
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
              </div>
            </div>
          </div>

          {/* Dialogue Area */}
          <div className="bg-slate-900 rounded-lg p-6 mb-6 text-white">
            <div className="bg-slate-800 rounded-lg p-4 mb-4 min-h-[100px] flex items-center">
              <p className="text-lg">{currentDialogue}</p>
            </div>

            {/* Dialogue Options */}
            <div className="grid grid-cols-2 gap-3">
              {dialogueOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleDialogue(option.topic)}
                  className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-left"
                >
                  {option.text}
                </button>
              ))}
            </div>
          </div>

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
