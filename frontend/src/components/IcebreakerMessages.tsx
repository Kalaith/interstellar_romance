import React, { useState, useEffect } from 'react';
import { IcebreakerMessage, IcebreakerCategory } from '../types/game';
import {
  getAvailableIcebreakers,
  generateContextualSuggestion,
} from '../data/icebreaker-messages';

interface IcebreakerMessagesProps {
  characterId: string;
  characterName: string;
  characterImage: string;
  currentAffection: number;
  characterMood: string;
  recentInteractions: string[];
  onSendMessage: (message: IcebreakerMessage) => void;
  onClose: () => void;
}

export const IcebreakerMessages: React.FC<IcebreakerMessagesProps> = ({
  characterId,
  characterName,
  characterImage,
  currentAffection,
  characterMood,
  recentInteractions,
  onSendMessage,
  onClose,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<
    IcebreakerCategory | 'all'
  >('all');
  const [availableMessages, setAvailableMessages] = useState<
    IcebreakerMessage[]
  >([]);
  const [selectedMessage, setSelectedMessage] =
    useState<IcebreakerMessage | null>(null);
  const [contextualSuggestion, setContextualSuggestion] = useState<string>('');

  const currentTime = new Date().getHours();
  const timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night' =
    currentTime < 6
      ? 'night'
      : currentTime < 12
        ? 'morning'
        : currentTime < 18
          ? 'afternoon'
          : currentTime < 22
            ? 'evening'
            : 'night';

  useEffect(() => {
    const messages = getAvailableIcebreakers(
      characterId,
      currentAffection,
      characterMood,
      timeOfDay
    );
    setAvailableMessages(messages);
    setContextualSuggestion(
      generateContextualSuggestion(
        characterId,
        currentAffection,
        recentInteractions
      )
    );
  }, [
    characterId,
    currentAffection,
    characterMood,
    timeOfDay,
    recentInteractions,
  ]);

  const categories: {
    key: IcebreakerCategory | 'all';
    name: string;
    icon: string;
  }[] = [
    { key: 'all', name: 'All', icon: '💬' },
    { key: 'compliment', name: 'Compliments', icon: '💕' },
    { key: 'question', name: 'Questions', icon: '❓' },
    { key: 'shared_interest', name: 'Shared Interests', icon: '🤝' },
    { key: 'humor', name: 'Humor', icon: '😄' },
    { key: 'observation', name: 'Observations', icon: '👁️' },
    { key: 'cultural_exchange', name: 'Culture', icon: '🌍' },
  ];

  const filteredMessages =
    selectedCategory === 'all'
      ? availableMessages
      : availableMessages.filter((msg) => msg.category === selectedCategory);

  const getEffectivenessColor = (effectiveness: number): string => {
    if (effectiveness >= 85) return 'text-green-400 bg-green-900/30';
    if (effectiveness >= 70) return 'text-yellow-400 bg-yellow-900/30';
    if (effectiveness >= 55) return 'text-orange-400 bg-orange-900/30';
    return 'text-red-400 bg-red-900/30';
  };

  const getEffectivenessLabel = (effectiveness: number): string => {
    if (effectiveness >= 85) return 'Excellent';
    if (effectiveness >= 70) return 'Good';
    if (effectiveness >= 55) return 'Fair';
    return 'Risky';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Conversation Starters
              </h2>
              <p className="text-gray-300">
                Perfect icebreakers for {characterName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Character Info */}
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700">
                <img
                  src={characterImage}
                  alt={characterName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-white font-semibold">{characterName}</h3>
                <div className="text-sm text-gray-300">
                  <span>Affection: {currentAffection}/100</span>
                  <span className="mx-2">•</span>
                  <span>Mood: {characterMood}</span>
                  <span className="mx-2">•</span>
                  <span>Time: {timeOfDay}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contextual Suggestion */}
          <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-4 mb-6">
            <h4 className="text-purple-300 font-semibold mb-2 flex items-center">
              <span className="mr-2">💡</span>
              Smart Suggestion
            </h4>
            <p className="text-gray-300 text-sm">{contextualSuggestion}</p>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => {
              const categoryCount =
                category.key === 'all'
                  ? availableMessages.length
                  : availableMessages.filter(
                      (msg) => msg.category === category.key
                    ).length;

              return (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    selectedCategory === category.key
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                  <span className="text-xs bg-black/20 px-2 py-1 rounded">
                    {categoryCount}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Message Options */}
          <div className="space-y-3 mb-6">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => setSelectedMessage(message)}
                  className={`bg-slate-800 rounded-lg p-4 cursor-pointer transition-all border-2 ${
                    selectedMessage?.id === message.id
                      ? 'border-purple-400 bg-purple-900/20'
                      : 'border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">
                        {
                          categories.find((c) => c.key === message.category)
                            ?.icon
                        }
                      </span>
                      <span className="text-white text-sm font-medium capitalize">
                        {message.category.replace('_', ' ')}
                      </span>
                    </div>
                    <div
                      className={`px-2 py-1 rounded text-xs font-semibold ${getEffectivenessColor(message.effectiveness)}`}
                    >
                      {getEffectivenessLabel(message.effectiveness)} (
                      {message.effectiveness}%)
                    </div>
                  </div>

                  <p className="text-gray-300 mb-2 leading-relaxed">
                    "{message.message}"
                  </p>

                  {/* Context Info */}
                  <div className="flex flex-wrap gap-2 text-xs">
                    {message.context.basedOnInterest && (
                      <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded">
                        Interest: {message.context.basedOnInterest}
                      </span>
                    )}
                    {message.context.basedOnMood && (
                      <span className="px-2 py-1 bg-green-900/30 text-green-300 rounded">
                        Best mood: {message.context.basedOnMood}
                      </span>
                    )}
                    {message.context.timeOfDay && (
                      <span className="px-2 py-1 bg-yellow-900/30 text-yellow-300 rounded">
                        Time: {message.context.timeOfDay}
                      </span>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">😔</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No messages available
                </h3>
                <p className="text-gray-400">
                  {selectedCategory === 'all'
                    ? 'Try building more affection or check back later for new conversation starters.'
                    : 'No messages in this category. Try a different category or build more affection.'}
                </p>
              </div>
            )}
          </div>

          {/* Selected Message Preview */}
          {selectedMessage && (
            <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-4 mb-6">
              <h5 className="text-purple-300 font-semibold mb-2">
                Selected Message:
              </h5>
              <p className="text-white mb-3">"{selectedMessage.message}"</p>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400">
                  Expected effectiveness: {selectedMessage.effectiveness}%
                </span>
                <span
                  className={`font-semibold ${
                    selectedMessage.effectiveness >= 85
                      ? 'text-green-400'
                      : selectedMessage.effectiveness >= 70
                        ? 'text-yellow-400'
                        : 'text-orange-400'
                  }`}
                >
                  {getEffectivenessLabel(selectedMessage.effectiveness)}
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Maybe Later
            </button>
            <button
              onClick={() => selectedMessage && onSendMessage(selectedMessage)}
              disabled={!selectedMessage}
              className={`flex-1 py-3 rounded-lg transition-colors font-semibold ${
                selectedMessage
                  ? 'bg-purple-600 hover:bg-purple-500 text-white'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
