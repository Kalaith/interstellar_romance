import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { DatePlan, ActivityType } from '../types/game';
import { getDatePlansByActivity } from '../data/date-plans';
import { calculateCompatibility } from '../utils/compatibility';
import { Button } from './ui/Button';
import { StatePanel } from './ui/StatePanel';

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
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md">
          <StatePanel
            variant="unavailable"
            icon="🌹"
            title="Date Planning Unavailable"
            message="Choose a companion and create a player profile before planning a date."
            actionLabel="Back to Hub"
            onAction={() => setScreen('main-hub')}
          />
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

  const filteredPlans = selectedActivity ? getDatePlansByActivity(selectedActivity) : [];

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] uppercase tracking-wide">
                  Plan a Date
                </h1>
                <p className="text-[var(--text-secondary)]">with {selectedCharacter.name}</p>
              </div>
              <Button onClick={() => setScreen('character-profile')} variant="secondary">
                Back to Profile
              </Button>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  planningStep === 'activity'
                    ? 'bg-[var(--accent-cyan)] text-[var(--bg-space)]'
                    : 'bg-[var(--state-available)] text-[var(--bg-space)]'
                }`}
              >
                1
              </div>
              <div className="w-12 h-1 bg-[var(--border-inner)]"></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  planningStep === 'plan'
                    ? 'bg-[var(--accent-cyan)] text-[var(--bg-space)]'
                    : planningStep === 'confirmation'
                      ? 'bg-[var(--state-available)] text-[var(--bg-space)]'
                      : 'bg-[var(--bg-item)] text-[var(--text-muted)]'
                }`}
              >
                2
              </div>
              <div className="w-12 h-1 bg-[var(--border-inner)]"></div>
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  planningStep === 'confirmation' || planningStep === 'outcome'
                    ? 'bg-[var(--accent-cyan)] text-[var(--bg-space)]'
                    : 'bg-[var(--bg-item)] text-[var(--text-muted)]'
                }`}
              >
                3
              </div>
            </div>
          </div>

          {/* Step 1: Activity Type Selection */}
          {planningStep === 'activity' && (
            <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 text-center text-[var(--text-primary)]">
                Choose Activity Type
              </h2>
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
                          ? 'border-[var(--state-available)] bg-[var(--state-available)]/10 hover:bg-[var(--state-available)]/15'
                          : 'border-[var(--border-inner)] bg-[var(--bg-section)] hover:bg-[var(--bg-item)] hover:border-[var(--accent-cyan)]'
                      }`}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <span className="text-3xl">{activity.icon}</span>
                        <h3 className="text-lg font-semibold capitalize">{activity.type}</h3>
                        {isPreferred && (
                          <span className="text-[var(--state-available)] text-sm">
                            ✨ Preferred
                          </span>
                        )}
                      </div>
                      <p className="text-[var(--text-secondary)] text-sm mb-3">
                        {activity.description}
                      </p>
                      <div className="text-xs text-[var(--text-muted)]">
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
            <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                  Choose {selectedActivity} Activity
                </h2>
                <Button onClick={() => setPlanningStep('activity')} variant="secondary" size="sm">
                  Back to Activity Types
                </Button>
              </div>

              {filteredPlans.length === 0 ? (
                <StatePanel
                  variant="empty"
                  icon="📅"
                  title={`No ${selectedActivity} dates found`}
                  message={`Build more affection with ${selectedCharacter.name} to unlock more date options.`}
                />
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredPlans.map(plan => {
                    const isLocked = selectedCharacter.affection < plan.requiredAffection;

                    return (
                      <button
                        key={plan.id}
                        onClick={() => !isLocked && handlePlanSelection(plan)}
                        disabled={isLocked}
                        className={`p-6 rounded-lg border transition-colors text-left focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--bg-space)] ${
                          isLocked
                            ? 'bg-[var(--bg-item)]/60 border-[var(--state-locked)] opacity-70 cursor-not-allowed'
                            : 'bg-[var(--bg-section)] hover:bg-[var(--bg-item)] border-[var(--border-inner)] hover:border-[var(--accent-cyan)]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{plan.name}</h3>
                          {isLocked && (
                            <span className="px-2 py-1 text-xs font-semibold rounded bg-[var(--state-locked)]/30 border border-[var(--state-locked)] text-[var(--text-muted)]">
                              Locked
                            </span>
                          )}
                        </div>
                        <p className="text-[var(--text-secondary)] text-sm mb-4">
                          {plan.description}
                        </p>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-[var(--text-muted)]">Location:</span>
                            <span>{plan.location}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--text-muted)]">Duration:</span>
                            <span>{plan.duration} minutes</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--text-muted)]">Required Affection:</span>
                            <span
                              className={isLocked ? 'text-yellow-300' : 'text-[var(--accent-teal)]'}
                            >
                              {plan.requiredAffection}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[var(--text-muted)]">Compatibility Bonus:</span>
                            <span
                              className={
                                isLocked
                                  ? 'text-[var(--text-muted)]'
                                  : 'text-[var(--state-available)]'
                              }
                            >
                              +{plan.compatibilityBonus} affection
                            </span>
                          </div>
                        </div>

                        {isLocked && (
                          <div className="mt-4 p-3 rounded border border-[var(--resource-influence)]/40 bg-[var(--resource-influence)]/10 text-sm text-[var(--resource-energy)]">
                            Build {plan.requiredAffection - selectedCharacter.affection} more
                            affection to unlock this date.
                          </div>
                        )}

                        {plan.preferredTopics.length > 0 && (
                          <div className="mt-4">
                            <div className="text-xs text-[var(--text-muted)] mb-2">
                              Great conversation topics:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {plan.preferredTopics.slice(0, 3).map((topic, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-[var(--resource-alloys)]/20 text-[var(--text-secondary)] rounded text-xs border border-[var(--resource-alloys)]/30"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 3: Date Confirmation */}
          {planningStep === 'confirmation' && selectedDatePlan && (
            <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-[var(--text-primary)]">
                  Confirm Your Date
                </h2>
                <Button onClick={() => setPlanningStep('plan')} variant="secondary" size="sm">
                  Back to Plans
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Date Details */}
                <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                    {selectedDatePlan.name}
                  </h3>
                  <p className="text-[var(--text-secondary)] mb-6">
                    {selectedDatePlan.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Activity Type:</span>
                      <span className="capitalize">{selectedDatePlan.activityType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Location:</span>
                      <span>{selectedDatePlan.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[var(--text-muted)]">Duration:</span>
                      <span>{selectedDatePlan.duration} minutes</span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="font-semibold mb-2 text-[var(--accent-cyan)]">
                      Conversation Topics:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDatePlan.preferredTopics.map((topic, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-[var(--resource-alloys)]/20 text-[var(--text-secondary)] rounded-full text-sm border border-[var(--resource-alloys)]/30"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Expected Outcome */}
                <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-4">
                    Expected Outcome
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-[var(--text-muted)]">Base Affection Gain:</span>
                        <span className="text-[var(--state-available)]">
                          +{selectedDatePlan.compatibilityBonus}
                        </span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-[var(--text-muted)]">Compatibility Multiplier:</span>
                        <span className="text-[var(--resource-research)]">
                          {compatibility.overall}%
                        </span>
                      </div>
                      {selectedCharacter.profile.preferredActivities.includes(
                        selectedDatePlan.activityType
                      ) && (
                        <div className="flex justify-between mb-2">
                          <span className="text-[var(--text-muted)]">Preference Bonus:</span>
                          <span className="text-[var(--resource-alloys)]">+5</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[var(--border-inner)] pt-4">
                      <div className="flex justify-between text-lg font-semibold">
                        <span>Estimated Total:</span>
                        <span className="text-[var(--state-available)]">
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

                    <div className="bg-[var(--bg-item)] border border-[var(--border-inner)] rounded p-4 mt-4">
                      <h4 className="font-semibold mb-2 text-[var(--accent-cyan)]">
                        Date Success Factors:
                      </h4>
                      <ul className="space-y-1 text-sm text-[var(--text-secondary)]">
                        <li className="flex items-center space-x-2">
                          <span
                            className={
                              selectedCharacter.profile.preferredActivities.includes(
                                selectedDatePlan.activityType
                              )
                                ? 'text-[var(--state-available)]'
                                : 'text-[var(--resource-energy)]'
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
                                ? 'text-[var(--state-available)]'
                                : compatibility.overall >= 50
                                  ? 'text-[var(--resource-energy)]'
                                  : 'text-[var(--state-deficit)]'
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
                <Button onClick={handleDateConfirmation} variant="primary" size="lg">
                  Confirm Date Plan
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Date Outcome */}
          {planningStep === 'outcome' && dateOutcome && (
            <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6">
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
                      <p className="text-[var(--text-secondary)] mb-4">{dateOutcome.description}</p>
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

                <div className="bg-[var(--bg-section)] rounded-lg border border-[var(--border-inner)] p-5 mb-8">
                  <div className="text-sm uppercase tracking-wide text-[var(--accent-cyan)] mb-2">
                    Relationship Memory Recorded
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                    {dateOutcome.memoryTitle}
                  </h3>
                  <p className="text-[var(--text-secondary)] text-sm">
                    This memory now appears in {selectedCharacter.name}'s profile and relationship
                    timeline.
                  </p>
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <Button onClick={() => setScreen('character-profile')} variant="primary">
                    View Profile
                  </Button>
                  <Button onClick={() => setScreen('relationship-timeline')} variant="outline">
                    View Timeline
                  </Button>
                  <Button onClick={() => setScreen('character-interaction')} variant="secondary">
                    Continue Chat
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
