import React, { useState } from 'react';
import { PersonalityGrowth } from '../types/game';
import { getPersonalityChangeIndicator, getPersonalityDescription } from '../utils/personality-growth';

interface PersonalityGrowthTrackerProps {
  characterName: string;
  personalityGrowth: PersonalityGrowth[];
  onClose: () => void;
}

export const PersonalityGrowthTracker: React.FC<PersonalityGrowthTrackerProps> = ({
  characterName,
  personalityGrowth,
  onClose
}) => {
  const [selectedTrait, setSelectedTrait] = useState<PersonalityGrowth | null>(null);

  const overallDescription = getPersonalityDescription(personalityGrowth);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Personality Growth Tracker</h2>
              <p className="text-gray-300">{characterName}'s evolving personality</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Overall Description */}
          <div className="bg-slate-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-purple-300 mb-2">Personality Evolution</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{overallDescription}</p>
          </div>

          {/* Personality Traits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {personalityGrowth.map((trait) => {
              const indicator = getPersonalityChangeIndicator(trait);
              const progressPercent = (trait.currentValue / trait.maxGrowth) * 100;
              const changePercent = ((trait.currentValue - trait.baseValue) / trait.baseValue) * 100;

              return (
                <div
                  key={trait.trait}
                  onClick={() => setSelectedTrait(trait)}
                  className={`bg-slate-800 rounded-lg p-4 cursor-pointer transition-all hover:bg-slate-700 border-2 ${
                    indicator.status === 'improved' ? 'border-green-400/20' :
                    indicator.status === 'declined' ? 'border-red-400/20' :
                    'border-gray-600/20'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-white font-semibold capitalize">
                      {trait.trait.replace('_', ' ')}
                    </h4>
                    <div className={`px-2 py-1 rounded text-xs font-semibold ${
                      indicator.status === 'improved' ? 'bg-green-600 text-white' :
                      indicator.status === 'declined' ? 'bg-red-600 text-white' :
                      'bg-gray-600 text-white'
                    }`}>
                      {indicator.description}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="w-full bg-gray-700 rounded-full h-2 mb-1">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          indicator.status === 'improved' ? 'bg-green-500' :
                          indicator.status === 'declined' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`}
                        style={{ width: `${progressPercent}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>{trait.currentValue}/{trait.maxGrowth}</span>
                      <span>Base: {trait.baseValue}</span>
                    </div>
                  </div>

                  {/* Change Indicator */}
                  {Math.abs(changePercent) > 5 && (
                    <div className="text-xs text-gray-300">
                      {changePercent > 0 ? '+' : ''}{Math.round(changePercent)}% from initial
                    </div>
                  )}

                  {/* Recent Events Count */}
                  {trait.growthHistory.length > 0 && (
                    <div className="text-xs text-purple-300 mt-1">
                      {trait.growthHistory.length} growth events
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selected Trait Detail */}
          {selectedTrait && (
            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4 capitalize">
                {selectedTrait.trait.replace('_', ' ')} Growth History
              </h3>

              {selectedTrait.growthHistory.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {selectedTrait.growthHistory
                    .slice()
                    .reverse()
                    .map((event, index) => (
                      <div key={event.id} className="flex items-start space-x-3 p-3 bg-slate-700 rounded">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          event.change > 0 ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <p className="text-gray-300 text-sm">{event.reason}</p>
                            <div className="text-right">
                              <div className={`text-sm font-semibold ${
                                event.change > 0 ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {event.change > 0 ? '+' : ''}{event.change}
                              </div>
                              <div className="text-xs text-gray-400">
                                {event.date.toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-xs text-purple-300 capitalize mt-1">
                            Trigger: {event.trigger.replace('_', ' ')}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-8">
                  No growth events recorded yet for this trait.
                </p>
              )}

              <button
                onClick={() => setSelectedTrait(null)}
                className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg transition-colors"
              >
                Close Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};