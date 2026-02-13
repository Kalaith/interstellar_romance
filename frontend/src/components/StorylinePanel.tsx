import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { StorylineEvent } from '../data/character-storylines';

interface StorylinePanelProps {
  characterId: string;
}

export const StorylinePanel: React.FC<StorylinePanelProps> = ({
  characterId,
}) => {
  const { availableStorylines, completeStorylineChoice } = useGameStore();
  const [selectedStoryline, setSelectedStoryline] =
    useState<StorylineEvent | null>(null);

  const characterStorylines = availableStorylines[characterId] || [];
  const unlockedStorylines = characterStorylines.filter(
    (s) => s.unlocked && !s.completed
  );

  const handleStorylineClick = (storyline: StorylineEvent) => {
    setSelectedStoryline(storyline);
  };

  const handleChoiceSelect = (storylineId: string, choiceId: string) => {
    completeStorylineChoice(storylineId, choiceId);
    setSelectedStoryline(null);
  };

  if (characterStorylines.length === 0) {
    return null;
  }

  return (
    <div className="mt-6">
      <h4 className="text-lg font-semibold text-white mb-3">
        Character Storylines
      </h4>

      {unlockedStorylines.length === 0 ? (
        <div className="bg-slate-800 rounded-lg p-4 text-center">
          <p className="text-gray-400">No new storylines available yet.</p>
          <p className="text-gray-500 text-sm mt-1">
            Continue building your relationship to unlock more!
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {unlockedStorylines.map((storyline) => (
            <div
              key={storyline.id}
              className="bg-slate-800 rounded-lg p-4 cursor-pointer hover:bg-slate-700 transition-colors border-l-4 border-yellow-500"
              onClick={() => handleStorylineClick(storyline)}
            >
              <div className="flex justify-between items-start mb-2">
                <h5 className="text-yellow-400 font-semibold">
                  {storyline.title}
                </h5>
                <span className="text-xs bg-yellow-900 text-yellow-200 px-2 py-1 rounded">
                  New Story
                </span>
              </div>
              <p className="text-gray-300 text-sm">{storyline.description}</p>
              <div className="mt-2 text-xs text-gray-400">
                Required Affection: {storyline.requiredAffection}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Storyline Modal */}
      {selectedStoryline && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-yellow-400">
                  {selectedStoryline.title}
                </h3>
                <button
                  onClick={() => setSelectedStoryline(null)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
              </div>

              <div className="bg-slate-800 rounded-lg p-4 mb-6">
                <p className="text-gray-300 leading-relaxed">
                  {selectedStoryline.dialogue}
                </p>
              </div>

              {selectedStoryline.choices && (
                <div className="space-y-3">
                  <h4 className="text-white font-semibold mb-3">
                    How do you respond?
                  </h4>
                  {selectedStoryline.choices.map((choice) => (
                    <button
                      key={choice.id}
                      onClick={() =>
                        handleChoiceSelect(selectedStoryline.id, choice.id)
                      }
                      className="w-full text-left p-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                    >
                      <div className="text-white mb-1">{choice.text}</div>
                      <div className="text-xs text-green-400">
                        +{choice.affectionChange} affection
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {selectedStoryline.rewards &&
                selectedStoryline.rewards.length > 0 && (
                  <div className="mt-6 p-3 bg-purple-900/40 rounded-lg border border-purple-500/30">
                    <h5 className="text-purple-300 font-semibold mb-2">
                      Potential Rewards:
                    </h5>
                    <ul className="text-purple-200 text-sm space-y-1">
                      {selectedStoryline.rewards.map((reward, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-purple-400 rounded-full mr-2"></span>
                          {reward.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
