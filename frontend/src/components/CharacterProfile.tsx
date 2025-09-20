import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { calculateCompatibility, getCompatibilityColor, getCompatibilityLabel } from '../utils/compatibility';
import { MoodDisplay } from './ui/MoodDisplay';

export const CharacterProfile: React.FC = () => {
  const { selectedCharacter, player, setScreen } = useGameStore();

  if (!selectedCharacter || !player) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Profile not available!</p>
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

  const compatibility = calculateCompatibility(player, selectedCharacter.profile);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Character Profile</h1>
            <button
              onClick={() => setScreen('main-hub')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Back to Hub
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Basic Info & Image */}
            <div className="space-y-6">
              {/* Character Card */}
              <div className="bg-slate-900 rounded-lg p-6 text-white">
                <div className="flex items-center space-x-6 mb-6">
                  <div className="w-32 h-32 rounded-lg overflow-hidden bg-slate-700">
                    <img
                      src={selectedCharacter.image}
                      alt={selectedCharacter.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2">{selectedCharacter.name}</h2>
                    <p className="text-blue-300 mb-2">{selectedCharacter.species}</p>
                    <p className="text-gray-300 text-sm mb-3">{selectedCharacter.personality}</p>

                    {/* Mood */}
                    <MoodDisplay
                      mood={selectedCharacter.mood}
                      characterName={selectedCharacter.name}
                      className="mb-3"
                    />

                    {/* Affection */}
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

                {/* Background */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2 text-purple-300">Background</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedCharacter.profile.background}
                  </p>
                </div>

                {/* Goals */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-purple-300">Life Goals</h3>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {selectedCharacter.profile.goals}
                  </p>
                </div>
              </div>

              {/* Milestones */}
              <div className="bg-slate-900 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4 text-purple-300">Relationship Milestones</h3>
                <div className="space-y-2">
                  {selectedCharacter.milestones.map((milestone) => (
                    <div
                      key={milestone.id}
                      className={`flex items-center space-x-3 p-2 rounded ${
                        milestone.achieved ? 'bg-green-900/30 text-green-300' : 'bg-gray-800/30 text-gray-400'
                      }`}
                    >
                      <span className="text-lg">
                        {milestone.achieved ? '✅' : '⏳'}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium">{milestone.name}</div>
                        <div className="text-xs opacity-75">{milestone.description}</div>
                        {!milestone.achieved && (
                          <div className="text-xs mt-1">
                            Unlock at {milestone.unlockedAt} affection
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Detailed Profile */}
            <div className="space-y-6">
              {/* Compatibility Score */}
              <div className="bg-slate-900 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4 text-purple-300">Compatibility Analysis</h3>

                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold ${getCompatibilityColor(compatibility.overall)}`}>
                    {compatibility.overall}%
                  </div>
                  <div className={`text-lg ${getCompatibilityColor(compatibility.overall)}`}>
                    {getCompatibilityLabel(compatibility.overall)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getCompatibilityColor(compatibility.breakdown.interests)}`}>
                      {compatibility.breakdown.interests}%
                    </div>
                    <div className="text-sm text-gray-400">Interests</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getCompatibilityColor(compatibility.breakdown.values)}`}>
                      {compatibility.breakdown.values}%
                    </div>
                    <div className="text-sm text-gray-400">Values</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getCompatibilityColor(compatibility.breakdown.conversationStyle)}`}>
                      {compatibility.breakdown.conversationStyle}%
                    </div>
                    <div className="text-sm text-gray-400">Communication</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getCompatibilityColor(compatibility.breakdown.activities)}`}>
                      {compatibility.breakdown.activities}%
                    </div>
                    <div className="text-sm text-gray-400">Activities</div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-3">
                  <h4 className="font-semibold mb-2 text-yellow-300">Compatibility Insights:</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    {compatibility.explanation.map((insight, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-yellow-400 mt-1">•</span>
                        <span>{insight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Interests */}
              <div className="bg-slate-900 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4 text-purple-300">Interests & Passions</h3>
                <div className="grid grid-cols-1 gap-3">
                  {selectedCharacter.profile.interests.map((interest) => (
                    <div key={interest.id} className="bg-slate-800 rounded p-3">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">{interest.name}</span>
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-lg ${
                                i < interest.intensity ? 'text-yellow-400' : 'text-gray-600'
                              }`}
                            >
                              ⭐
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 capitalize">{interest.category}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Values & Preferences */}
              <div className="bg-slate-900 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4 text-purple-300">Values & Preferences</h3>

                <div className="mb-4">
                  <h4 className="font-medium mb-2 text-green-300">Core Values:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacter.profile.values.map((value) => (
                      <span
                        key={value}
                        className="px-3 py-1 bg-green-900/30 text-green-300 rounded-full text-sm capitalize"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2 text-blue-300">Preferred Activities:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharacter.profile.preferredActivities.map((activity) => (
                      <span
                        key={activity}
                        className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm capitalize"
                      >
                        {activity}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium mb-2 text-orange-300">Communication Style:</h4>
                  <span className="px-3 py-1 bg-orange-900/30 text-orange-300 rounded-full text-sm capitalize">
                    {selectedCharacter.profile.conversationStyle}
                  </span>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-red-300">Deal Breakers:</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    {selectedCharacter.profile.dealbreakers.map((dealbreaker, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <span className="text-red-400 mt-1">❌</span>
                        <span>{dealbreaker}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Favorite Topics */}
              <div className="bg-slate-900 rounded-lg p-6 text-white">
                <h3 className="text-lg font-semibold mb-4 text-purple-300">Favorite Conversation Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedCharacter.profile.favoriteTopics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-purple-900/30 text-purple-300 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <button
              onClick={() => setScreen('character-interaction')}
              className="px-6 py-3 bg-pink-600 hover:bg-pink-500 text-white font-semibold rounded-lg transition-colors"
            >
              💬 Chat
            </button>
            <button
              onClick={() => setScreen('date-planning')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors"
            >
              🌹 Plan Date
            </button>
            <button
              onClick={() => setScreen('photo-gallery')}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
            >
              📸 Photos
            </button>
            <button
              onClick={() => setScreen('relationship-timeline')}
              className="px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-lg transition-colors"
            >
              📖 Timeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};