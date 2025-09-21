import React, { useState } from 'react';
import { Character, SuperLikeResult } from '../types/game';
import { superLikeEffects, superLikeResponses, superLikeUnlocks } from '../data/super-likes';

interface SuperLikeModalProps {
  character: Character;
  superLikesAvailable: number;
  onUseSuperLike: (result: SuperLikeResult) => void;
  onClose: () => void;
}

export const SuperLikeModal: React.FC<SuperLikeModalProps> = ({
  character,
  superLikesAvailable,
  onUseSuperLike,
  onClose
}) => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [showResult, setShowResult] = useState<SuperLikeResult | null>(null);

  const effect = superLikeEffects[character.id];
  const responses = superLikeResponses[character.id];
  const unlocks = superLikeUnlocks[character.id];

  const handleConfirm = () => {
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    const result: SuperLikeResult = {
      affectionGained: effect.affectionBonus,
      specialResponse: randomResponse,
      unlockedContent: unlocks.content
    };

    setShowResult(result);
    onUseSuperLike(result);
  };

  if (showResult) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 rounded-lg max-w-2xl w-full">
          <div className="p-6">
            {/* Success Header */}
            <div className="text-center mb-6">
              <div className="text-6xl mb-4">💖</div>
              <h2 className="text-2xl font-bold text-white mb-2">Super Like Sent!</h2>
              <p className="text-purple-300">
                {character.name} is absolutely thrilled by your bold gesture!
              </p>
            </div>

            {/* Character Response */}
            <div className="bg-slate-800 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                  <img
                    src={character.image}
                    alt={character.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-2">{character.name}</h3>
                  <p className="text-gray-300 text-sm leading-relaxed italic">
                    "{showResult.specialResponse}"
                  </p>
                </div>
              </div>
            </div>

            {/* Rewards */}
            <div className="space-y-4 mb-6">
              <div className="bg-green-900/30 border border-green-400 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-2">Affection Bonus</h4>
                <p className="text-white text-lg">
                  +{showResult.affectionGained} Affection! 💕
                </p>
              </div>

              {showResult.unlockedContent && showResult.unlockedContent.length > 0 && (
                <div className="bg-purple-900/30 border border-purple-400 rounded-lg p-4">
                  <h4 className="text-purple-300 font-semibold mb-2">New Content Unlocked!</h4>
                  <ul className="space-y-1">
                    {showResult.unlockedContent.map((content, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-center space-x-2">
                        <span className="text-purple-400">✨</span>
                        <span>{content}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="bg-blue-900/30 border border-blue-400 rounded-lg p-4">
                <h4 className="text-blue-300 font-semibold mb-2">Temporary Boost Active</h4>
                <p className="text-gray-300 text-sm">
                  +{effect.temporaryCompatibilityBonus}% compatibility bonus for the next {effect.duration} hours
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors"
            >
              Continue Relationship
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg max-w-2xl w-full">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">💖</div>
            <h2 className="text-2xl font-bold text-white mb-2">Send a Super Like</h2>
            <p className="text-gray-300">
              Show {character.name} just how much you care with a special gesture
            </p>
          </div>

          {/* Character Info */}
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700">
                <img
                  src={character.image}
                  alt={character.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-white font-semibold">{character.name}</h3>
                <p className="text-gray-300 text-sm">{character.species}</p>
                <p className="text-pink-400 text-sm">Current affection: {character.affection}/100</p>
              </div>
            </div>
          </div>

          {/* Super Like Effects Preview */}
          <div className="space-y-3 mb-6">
            <h4 className="text-white font-semibold">What happens when you send a Super Like:</h4>

            <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <span className="text-green-400">💕</span>
                <span className="text-green-300 text-sm">
                  Instant +{effect.affectionBonus} affection bonus
                </span>
              </div>
            </div>

            <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <span className="text-purple-400">✨</span>
                <span className="text-purple-300 text-sm">
                  Unlocks special dialogue and content
                </span>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <span className="text-blue-400">⚡</span>
                <span className="text-blue-300 text-sm">
                  +{effect.temporaryCompatibilityBonus}% compatibility boost for {effect.duration} hours
                </span>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-400/30 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <span className="text-yellow-400">😊</span>
                <span className="text-yellow-300 text-sm">
                  Instantly improves {character.name}'s mood
                </span>
              </div>
            </div>
          </div>

          {/* Super Likes Available */}
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">Super Likes Available:</span>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-purple-400">{superLikesAvailable}</span>
                <span className="text-purple-400">💖</span>
              </div>
            </div>
            {superLikesAvailable === 0 && (
              <p className="text-red-400 text-sm mt-2">
                You'll get 1 new Super Like tomorrow!
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Maybe Later
            </button>

            {superLikesAvailable > 0 ? (
              !isConfirming ? (
                <button
                  onClick={() => setIsConfirming(true)}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors"
                >
                  Send Super Like! 💖
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  className="flex-1 py-3 bg-pink-600 hover:bg-pink-500 text-white font-semibold rounded-lg transition-colors animate-pulse"
                >
                  Confirm - Use Super Like
                </button>
              )
            ) : (
              <button
                disabled
                className="flex-1 py-3 bg-gray-500 text-gray-300 rounded-lg cursor-not-allowed"
              >
                No Super Likes Available
              </button>
            )}
          </div>

          {isConfirming && (
            <p className="text-center text-yellow-300 text-sm mt-3">
              Are you sure? This will use one of your precious Super Likes!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};