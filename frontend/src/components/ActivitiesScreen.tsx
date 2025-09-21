import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { ACTIVITIES } from '../data/activities';

export const ActivitiesScreen: React.FC = () => {
  const { 
    currentWeek, 
    selectedActivities, 
    setScreen, 
    toggleActivity, 
    confirmActivities 
  } = useGameStore();

  const handleConfirm = () => {
    if (selectedActivities.length === 2) {
      confirmActivities();
    }
  };

  // Categorize activities
  const socialActivities = ACTIVITIES.filter(a => a.id === 'social' || a.id === 'work');
  const explorationActivities = ACTIVITIES.filter(a => a.id === 'exploration' || a.id === 'research');
  const personalActivities = ACTIVITIES.filter(a => a.id === 'meditation' || a.id === 'training');

  const renderActivityGrid = (activities: typeof ACTIVITIES, title: string, icon: string) => (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{icon}</span>
        <h3 className="text-xl font-bold text-[var(--accent-cyan)] uppercase tracking-wide">{title}</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activities.map((activity) => {
          const isSelected = selectedActivities.includes(activity.id);
          const canSelect = selectedActivities.length < 2 || isSelected;
          
          return (
            <div
              key={activity.id}
              onClick={() => canSelect && toggleActivity(activity.id)}
              className={`bg-[var(--bg-section)] border-2 rounded-lg p-4 transition-all duration-300 ${
                isSelected 
                  ? 'border-[var(--state-available)] bg-[var(--bg-item)] shadow-[0_0_20px_rgba(46,213,115,0.3)] transform scale-105' 
                  : canSelect 
                    ? 'border-[var(--border-inner)] hover:border-[var(--accent-cyan)] hover:bg-[var(--bg-item)] cursor-pointer hover:shadow-[0_0_15px_rgba(0,212,255,0.2)]' 
                    : 'border-[var(--state-locked)] opacity-50 cursor-not-allowed'
              }`}
            >
              {/* Activity Icon/Image */}
              <div className="w-full h-24 bg-[var(--bg-item)] rounded-lg mb-3 flex items-center justify-center text-4xl">
                {activity.id.includes('social') ? '👥' :
                 activity.id.includes('explore') ? '🌌' :
                 activity.id.includes('study') ? '📚' :
                 activity.id.includes('meditate') ? '🧘' :
                 activity.id.includes('gym') ? '💪' :
                 activity.id.includes('party') ? '🎉' :
                 activity.id.includes('artifact') ? '🏺' :
                 activity.id.includes('alien') ? '👽' :
                 activity.id.includes('hobby') ? '🎨' : '⭐'}
              </div>
              
              <div className="text-center">
                <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">{activity.name}</h4>
                <p className="text-[var(--text-muted)] text-sm mb-3 line-clamp-2">{activity.description}</p>
                <div className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--bg-item)] border border-[var(--border-inner)] text-[var(--resource-energy)]">
                  {activity.reward}
                </div>
              </div>
              
              {/* Selection Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-[var(--state-available)] rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Panel */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-8 backdrop-blur-sm">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-wide uppercase mb-2">
              Weekly Activity Planning
            </h2>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)] text-sm uppercase tracking-wide">Cycle</span>
                <span className="text-[var(--resource-energy)] text-lg font-bold">{currentWeek}</span>
              </div>
              <div className="w-px h-4 bg-[var(--border-inner)]"></div>
              <div className="flex items-center gap-2">
                <span className="text-[var(--text-muted)] text-sm uppercase tracking-wide">Selection</span>
                <span className="text-[var(--accent-cyan)] text-lg font-bold">{selectedActivities.length}/2</span>
              </div>
            </div>
            <p className="text-[var(--text-secondary)] mt-2">Choose 2 activities to advance your relationships and personal growth</p>
          </div>
        </div>

        {/* Activities Grid Panel */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-8">
          {renderActivityGrid(socialActivities, 'Social Activities', '👥')}
          {renderActivityGrid(explorationActivities, 'Exploration & Discovery', '🌌')}
          {renderActivityGrid(personalActivities, 'Personal Development', '📚')}
        </div>

        {/* Selection Status Panel */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6">
          <div className="text-center">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-[var(--accent-cyan)] uppercase tracking-wide mb-4">Activity Scheduler</h3>
              
              {selectedActivities.length > 0 ? (
                <div className="mb-4">
                  <p className="text-[var(--text-muted)] text-sm mb-3 uppercase tracking-wide">Scheduled Activities</p>
                  <div className="flex flex-wrap justify-center gap-3">
                    {selectedActivities.map((activityId) => {
                      const activity = ACTIVITIES.find(a => a.id === activityId);
                      return (
                        <div 
                          key={activityId}
                          className="px-4 py-2 bg-[var(--state-available)] text-[var(--bg-space)] rounded-full text-sm font-semibold flex items-center gap-2"
                        >
                          <span>✓</span>
                          <span>{activity?.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="mb-4">
                  <p className="text-[var(--text-muted)] text-sm uppercase tracking-wide">No activities scheduled</p>
                </div>
              )}
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                disabled={selectedActivities.length !== 2}
                className={`flex items-center gap-3 px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 ${
                  selectedActivities.length === 2
                    ? 'text-[var(--bg-space)] bg-gradient-to-r from-[var(--state-available)] to-[var(--accent-teal)] hover:from-[var(--accent-teal)] hover:to-[var(--state-available)] transform hover:scale-105 shadow-lg hover:shadow-[0_0_20px_rgba(46,213,115,0.3)]'
                    : 'text-[var(--text-muted)] bg-[var(--state-locked)] cursor-not-allowed opacity-50'
                }`}
              >
                <span className="text-2xl">✅</span>
                <span>Confirm Schedule</span>
              </button>
              
              <button
                onClick={() => setScreen('main-hub')}
                className="flex items-center gap-3 px-8 py-4 text-lg font-semibold text-[var(--text-primary)] bg-[var(--bg-section)] hover:bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg transition-all duration-300"
              >
                <span className="text-2xl">🏠</span>
                <span>Return to Hub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
