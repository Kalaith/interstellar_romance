import React, { useState } from 'react';
import {
  RelationshipConflict,
  ConflictResolutionOption,
  ConflictResolution,
} from '../types/game';

interface ConflictResolutionProps {
  conflict: RelationshipConflict;
  characterName: string;
  characterImage: string;
  playerStats: {
    charisma: number;
    intelligence: number;
    adventure: number;
    empathy: number;
    technology: number;
  };
  onResolve: (resolution: ConflictResolution) => void;
  onClose: () => void;
}

export const ConflictResolutionModal: React.FC<ConflictResolutionProps> = ({
  conflict,
  characterName,
  characterImage,
  playerStats,
  onResolve,
  onClose,
}) => {
  const [selectedOption, setSelectedOption] =
    useState<ConflictResolutionOption | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  const severityColors = {
    minor: 'border-yellow-400 bg-yellow-900/20',
    moderate: 'border-orange-400 bg-orange-900/20',
    major: 'border-red-400 bg-red-900/20',
    critical: 'border-red-600 bg-red-900/40',
  };

  const severityIcons = {
    minor: '⚠️',
    moderate: '🔥',
    major: '💥',
    critical: '⛈️',
  };

  const canUseOption = (option: ConflictResolutionOption): boolean => {
    if (!option.requirements) return true;

    if (option.requirements.playerStat && option.requirements.minValue) {
      const statValue =
        playerStats[option.requirements.playerStat as keyof typeof playerStats];
      return statValue >= option.requirements.minValue;
    }

    return true;
  };

  const calculateActualSuccess = (option: ConflictResolutionOption): number => {
    let successChance = option.preview.successChance;

    // Adjust based on player stats
    if (option.requirements?.playerStat && option.requirements.minValue) {
      const statValue =
        playerStats[option.requirements.playerStat as keyof typeof playerStats];
      const bonus = Math.max(
        0,
        (statValue - option.requirements.minValue) * 0.5
      );
      successChance = Math.min(95, successChance + bonus);
    }

    // Adjust based on conflict severity
    const severityModifier = {
      minor: 1.1,
      moderate: 1.0,
      major: 0.85,
      critical: 0.7,
    };

    return Math.round(successChance * severityModifier[conflict.severity]);
  };

  const handleResolve = () => {
    if (!selectedOption) return;

    setIsResolving(true);

    const actualSuccessChance = calculateActualSuccess(selectedOption);
    const isSuccessful = Math.random() * 100 <= actualSuccessChance;

    const effectivenessMultiplier = isSuccessful ? 1 : 0.3;
    const affectionRecovery = Math.round(
      selectedOption.preview.affectionChange * effectivenessMultiplier -
        conflict.affectionPenalty * (isSuccessful ? 0.8 : 0.3)
    );

    const resolution: ConflictResolution = {
      method: selectedOption.method,
      effectiveness: isSuccessful
        ? actualSuccessChance
        : Math.round(actualSuccessChance * 0.3),
      affectionRecovery: Math.max(
        -conflict.affectionPenalty,
        affectionRecovery
      ),
    };

    setTimeout(() => {
      onResolve(resolution);
    }, 2000);
  };

  if (isResolving) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-slate-900 rounded-lg max-w-md w-full p-6 text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <h3 className="text-xl font-bold text-white mb-2">
            Resolving Conflict...
          </h3>
          <p className="text-gray-300">
            Attempting {selectedOption?.label.toLowerCase()}...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Relationship Conflict
              </h2>
              <div
                className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border-2 ${severityColors[conflict.severity]}`}
              >
                <span>{severityIcons[conflict.severity]}</span>
                <span className="text-white capitalize font-semibold">
                  {conflict.severity} Conflict
                </span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-2xl"
            >
              ×
            </button>
          </div>

          {/* Character & Conflict Description */}
          <div className="bg-slate-800 rounded-lg p-6 mb-6">
            <div className="flex items-start space-x-4 mb-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700">
                <img
                  src={characterImage}
                  alt={characterName}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1">
                  {characterName}
                </h3>
                <p className="text-red-300 text-sm capitalize">
                  {conflict.type.replace('_', ' ')} • {conflict.trigger}
                </p>
              </div>
            </div>

            <div className="bg-slate-700 rounded-lg p-4">
              <p className="text-gray-300 leading-relaxed">
                {conflict.description}
              </p>
            </div>

            <div className="mt-4 p-3 bg-red-900/30 border border-red-400/30 rounded-lg">
              <p className="text-red-300 text-sm">
                <strong>Relationship Impact:</strong> -
                {conflict.affectionPenalty} affection until resolved
              </p>
            </div>
          </div>

          {/* Resolution Options */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-white mb-4">
              How do you want to handle this?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {conflict.resolutionOptions.map((option) => {
                const canUse = canUseOption(option);
                const actualSuccess = calculateActualSuccess(option);

                return (
                  <div
                    key={option.id}
                    onClick={() => canUse && setSelectedOption(option)}
                    className={`rounded-lg p-4 border-2 cursor-pointer transition-all ${
                      selectedOption?.id === option.id
                        ? 'border-purple-400 bg-purple-900/20'
                        : canUse
                          ? 'border-slate-600 bg-slate-800 hover:border-slate-500'
                          : 'border-gray-700 bg-gray-900/50 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="text-white font-semibold">
                        {option.label}
                      </h5>
                      <div
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          actualSuccess >= 70
                            ? 'bg-green-600'
                            : actualSuccess >= 50
                              ? 'bg-yellow-600'
                              : 'bg-red-600'
                        } text-white`}
                      >
                        {actualSuccess}%
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm mb-3">
                      {option.description}
                    </p>

                    {/* Requirements */}
                    {option.requirements && (
                      <div className="mb-3">
                        {option.requirements.playerStat &&
                          option.requirements.minValue && (
                            <div
                              className={`text-xs ${
                                playerStats[
                                  option.requirements
                                    .playerStat as keyof typeof playerStats
                                ] >= option.requirements.minValue
                                  ? 'text-green-400'
                                  : 'text-red-400'
                              }`}
                            >
                              Requires {option.requirements.playerStat}:{' '}
                              {option.requirements.minValue}
                              (You have:{' '}
                              {
                                playerStats[
                                  option.requirements
                                    .playerStat as keyof typeof playerStats
                                ]
                              }
                              )
                            </div>
                          )}
                      </div>
                    )}

                    {/* Preview Effects */}
                    <div className="space-y-1">
                      <div className="text-xs text-gray-400">
                        Expected outcome:
                      </div>
                      <div className="text-xs text-green-300">
                        Affection recovery: +{option.preview.affectionChange}
                      </div>
                      <div className="text-xs text-blue-300">
                        {option.preview.personalityEffects.join(', ')}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Option Details */}
          {selectedOption && (
            <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-4 mb-6">
              <h5 className="text-purple-300 font-semibold mb-2">
                Selected Approach: {selectedOption.label}
              </h5>
              <p className="text-gray-300 text-sm mb-3">
                {selectedOption.description}
              </p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Success Chance:</span>
                  <span className="text-white ml-2">
                    {calculateActualSuccess(selectedOption)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Potential Recovery:</span>
                  <span className="text-green-400 ml-2">
                    +{selectedOption.preview.affectionChange}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Walk Away
            </button>
            <button
              onClick={handleResolve}
              disabled={!selectedOption}
              className={`flex-1 py-3 rounded-lg transition-colors font-semibold ${
                selectedOption
                  ? 'bg-purple-600 hover:bg-purple-500 text-white'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              Resolve Conflict
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
