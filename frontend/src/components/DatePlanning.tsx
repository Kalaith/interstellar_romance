import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { DatePlan, ActivityType } from '../types/game';
import { getDatePlansByActivity } from '../data/date-plans';
import { calculateCompatibility } from '../utils/compatibility';

export const DatePlanning: React.FC = () => {
  const { selectedCharacter, player, setScreen, updateAffection, addDateToHistory } =
    useGameStore();
  const [selectedActivity, setSelectedActivity] = useState<ActivityType | null>(null);
  const [selectedDatePlan, setSelectedDatePlan] = useState<DatePlan | null>(null);
  const [planningStep, setPlanningStep] = useState<
    'activity' | 'plan' | 'confirmation' | 'outcome'
  >('activity');
  const [dateOutcome, setDateOutcome] = useState<{
    title: string;
    description: string;
    affectionGained: number;
    success: boolean;
    memoryTitle: string;
  } | null>(null);

  if (!selectedCharacter || !player) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Date planning not available!</p>
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

  // const availablePlans = getAvailableDatePlans(selectedCharacter.affection);
  const compatibility = calculateCompatibility(player, selectedCharacter.profile);

  const activityTypes: {
    type: ActivityType;
    icon: string;
    description: string;
  }[] = [
    {
      type: 'intellectual',
      icon: '🧠',
      description: 'Stimulate your minds together',
    },
    {
      type: 'adventurous',
      icon: '🚀',
      description: 'Exciting experiences and thrills',
    },
    {
      type: 'romantic',
      icon: '💕',
      description: 'Intimate and romantic moments',
    },
    {
      type: 'cultural',
      icon: '🎭',
      description: 'Explore art, music, and traditions',
    },
    {
      type: 'relaxing',
      icon: '🧘',
      description: 'Peaceful and calming activities',
    },
    { type: 'social', icon: '👥', description: 'Meet others and socialize' },
    {
      type: 'creative',
      icon: '🎨',
      description: 'Express yourselves through creation',
    },
  ];

  const handleActivitySelection = (activityType: ActivityType) => {
    setSelectedActivity(activityType);
    setPlanningStep('plan');
  };

  const handlePlanSelection = (plan: DatePlan) => {
    setSelectedDatePlan(plan);
    setPlanningStep('confirmation');
  };

  const handleDateConfirmation = () => {
    if (!selectedDatePlan) return;

    // Calculate date success based on compatibility and character preferences
    const isPreferredActivity = selectedCharacter.profile.preferredActivities.includes(
      selectedDatePlan.activityType
    );
    const baseAffectionGain = selectedDatePlan.compatibilityBonus;
    const compatibilityMultiplier = compatibility.overall / 100;
    const preferenceBonus = isPreferredActivity ? 5 : 0;

    const totalAffectionGain = Math.round(
      baseAffectionGain * compatibilityMultiplier + preferenceBonus
    );
    const dateSuccess = totalAffectionGain > 0 && compatibility.overall >= 40;

    // Record the date before applying affection so the memory captures the full date result.
    addDateToHistory(selectedCharacter.id, selectedDatePlan.id, totalAffectionGain, dateSuccess);
    updateAffection(selectedCharacter.id, totalAffectionGain);

    setDateOutcome({
      title: dateSuccess ? 'Date Completed Successfully' : 'Date Was Challenging',
      description: dateSuccess
        ? `${selectedCharacter.name} will remember the ${selectedDatePlan.name.toLowerCase()} as a meaningful shared experience.`
        : `${selectedCharacter.name} may need time to process the ${selectedDatePlan.name.toLowerCase()}, but the moment is now part of your shared history.`,
      affectionGained: totalAffectionGain,
      success: dateSuccess,
      memoryTitle: `${dateSuccess ? 'Memorable' : 'Complicated'} Date: ${selectedDatePlan.name}`,
    });

    // Reset planning state
    setSelectedActivity(null);
    setSelectedDatePlan(null);
    setPlanningStep('outcome');
  };

  const filteredPlans = selectedActivity
    ? getDatePlansByActivity(selectedActivity).filter(
        plan => selectedCharacter.affection >= plan.requiredAffection
      )
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">Plan a Date</h1>
              <p className="text-gray-300">with {selectedCharacter.name}</p>
            </div>
            <button
              onClick={() => setScreen('character-profile')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Back to Profile
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  planningStep === 'activity'
                    ? 'bg-purple-600 text-white'
                    : 'bg-green-600 text-white'
                }`}
              >
                1
              </div>
              <div className="w-12 h-1 bg-gray-600"></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  planningStep === 'plan'
                    ? 'bg-purple-600 text-white'
                    : planningStep === 'confirmation'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-600 text-gray-300'
                }`}
              >
                2
              </div>
              <div className="w-12 h-1 bg-gray-600"></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  planningStep === 'confirmation' || planningStep === 'outcome'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                3
              </div>
            </div>
          </div>

          {/* Step 1: Activity Type Selection */}
          {planningStep === 'activity' && (
            <div className="bg-slate-900 rounded-lg p-6 text-white">
              <h2 className="text-2xl font-semibold mb-6 text-center">Choose Activity Type</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {activityTypes.map(activity => {
                  const isPreferred = selectedCharacter.profile.preferredActivities.includes(
                    activity.type
                  );
                  const compatibilityScore = compatibility.breakdown.activities;

                  return (
                    <button
                      key={activity.type}
                      onClick={() => handleActivitySelection(activity.type)}
                      className={`p-6 rounded-lg border-2 transition-all duration-200 text-left ${
                        isPreferred
                          ? 'border-green-500 bg-green-900/20 hover:bg-green-800/30'
                          : 'border-slate-600 bg-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-3xl">{activity.icon}</span>
                        <h3 className="text-lg font-semibold capitalize">{activity.type}</h3>
                        {isPreferred && (
                          <span className="text-green-400 text-sm">✨ Preferred</span>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm mb-3">{activity.description}</p>
                      <div className="text-xs text-gray-400">
                        Compatibility: {compatibilityScore}%
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Specific Date Plan Selection */}
          {planningStep === 'plan' && selectedActivity && (
            <div className="bg-slate-900 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Choose {selectedActivity} Activity</h2>
                <button
                  onClick={() => setPlanningStep('activity')}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm"
                >
                  Back to Activity Types
                </button>
              </div>

              {filteredPlans.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-lg mb-4">
                    No {selectedActivity} activities available at your current affection level.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Build more affection with {selectedCharacter.name} to unlock more date options.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredPlans.map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => handlePlanSelection(plan)}
                      className="p-6 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-600 transition-colors text-left"
                    >
                      <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                      <p className="text-gray-300 text-sm mb-4">{plan.description}</p>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Location:</span>
                          <span>{plan.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Duration:</span>
                          <span>{plan.duration} minutes</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Compatibility Bonus:</span>
                          <span className="text-green-400">
                            +{plan.compatibilityBonus} affection
                          </span>
                        </div>
                      </div>

                      {plan.preferredTopics.length > 0 && (
                        <div className="mt-4">
                          <div className="text-xs text-gray-400 mb-2">
                            Great conversation topics:
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {plan.preferredTopics.slice(0, 3).map((topic, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-purple-900/30 text-purple-300 rounded text-xs"
                              >
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Date Confirmation */}
          {planningStep === 'confirmation' && selectedDatePlan && (
            <div className="bg-slate-900 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Confirm Your Date</h2>
                <button
                  onClick={() => setPlanningStep('plan')}
                  className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-sm"
                >
                  Back to Plans
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Date Details */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">{selectedDatePlan.name}</h3>
                  <p className="text-gray-300 mb-6">{selectedDatePlan.description}</p>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Activity Type:</span>
                      <span className="capitalize">{selectedDatePlan.activityType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location:</span>
                      <span>{selectedDatePlan.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Duration:</span>
                      <span>{selectedDatePlan.duration} minutes</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2 text-purple-300">Conversation Topics:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDatePlan.preferredTopics.map((topic, index) => (
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

                {/* Expected Outcome */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4">Expected Outcome</h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Base Affection Gain:</span>
                        <span className="text-green-400">
                          +{selectedDatePlan.compatibilityBonus}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-400">Compatibility Multiplier:</span>
                        <span className="text-blue-400">{compatibility.overall}%</span>
                      </div>
                      {selectedCharacter.profile.preferredActivities.includes(
                        selectedDatePlan.activityType
                      ) && (
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Preference Bonus:</span>
                          <span className="text-purple-400">+5</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-slate-600 pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Estimated Total:</span>
                        <span className="text-green-400">
                          +
                          {Math.round(
                            (selectedDatePlan.compatibilityBonus * compatibility.overall) / 100 +
                              (selectedCharacter.profile.preferredActivities.includes(
                                selectedDatePlan.activityType
                              )
                                ? 5
                                : 0)
                          )}{' '}
                          affection
                        </span>
                      </div>
                    </div>

                    <div className="bg-blue-900/20 rounded p-4 mt-4">
                      <h4 className="font-semibold mb-2 text-blue-300">Date Success Factors:</h4>
                      <ul className="space-y-1 text-sm text-gray-300">
                        <li className="flex items-center space-x-2">
                          <span
                            className={
                              selectedCharacter.profile.preferredActivities.includes(
                                selectedDatePlan.activityType
                              )
                                ? 'text-green-400'
                                : 'text-yellow-400'
                            }
                          >
                            {selectedCharacter.profile.preferredActivities.includes(
                              selectedDatePlan.activityType
                            )
                              ? '✅'
                              : '⚠️'}
                          </span>
                          <span>
                            {selectedCharacter.profile.preferredActivities.includes(
                              selectedDatePlan.activityType
                            )
                              ? 'This is one of their preferred activities!'
                              : 'Not their preferred activity, but still enjoyable'}
                          </span>
                        </li>
                        <li className="flex items-center space-x-2">
                          <span
                            className={
                              compatibility.overall >= 70
                                ? 'text-green-400'
                                : compatibility.overall >= 50
                                  ? 'text-yellow-400'
                                  : 'text-red-400'
                            }
                          >
                            {compatibility.overall >= 70
                              ? '✅'
                              : compatibility.overall >= 50
                                ? '⚠️'
                                : '❌'}
                          </span>
                          <span>
                            {compatibility.overall >= 70
                              ? 'High compatibility'
                              : compatibility.overall >= 50
                                ? 'Moderate compatibility'
                                : 'Low compatibility - be careful!'}
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmation Button */}
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleDateConfirmation}
                  className="px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white font-semibold rounded-lg transition-colors text-lg"
                >
                  Confirm Date Plan
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Date Outcome */}
          {planningStep === 'outcome' && dateOutcome && (
            <div className="bg-slate-900 rounded-lg p-6 text-white">
              <div className="max-w-3xl mx-auto">
                <div
                  className={`rounded-lg border-2 p-6 mb-6 ${
                    dateOutcome.success
                      ? 'border-pink-400 bg-pink-900/20'
                      : 'border-yellow-400 bg-yellow-900/20'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{dateOutcome.success ? '💕' : '🌙'}</div>
                    <div className="flex-1">
                      <h2 className="text-2xl font-semibold mb-2">{dateOutcome.title}</h2>
                      <p className="text-gray-300 mb-4">{dateOutcome.description}</p>
                      <div className="text-lg font-semibold">
                        Affection:{' '}
                        <span
                          className={
                            dateOutcome.affectionGained >= 0 ? 'text-green-400' : 'text-red-400'
                          }
                        >
                          {dateOutcome.affectionGained > 0 ? '+' : ''}
                          {dateOutcome.affectionGained}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg border border-purple-400/40 p-5 mb-8">
                  <div className="text-sm uppercase tracking-wide text-purple-300 mb-2">
                    Relationship Memory Recorded
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {dateOutcome.memoryTitle}
                  </h3>
                  <p className="text-gray-300 text-sm">
                    This memory now appears in {selectedCharacter.name}'s profile and relationship
                    timeline.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setScreen('character-profile')}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => setScreen('relationship-timeline')}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
                  >
                    View Timeline
                  </button>
                  <button
                    onClick={() => setScreen('character-interaction')}
                    className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors"
                  >
                    Continue Chat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
