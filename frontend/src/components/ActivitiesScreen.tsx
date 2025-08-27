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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 text-white">
            <h2 className="text-3xl font-bold mb-2">Weekly Activities</h2>
            <p className="text-lg">Choose 2 activities for this week (Week {currentWeek})</p>
          </div>

          {/* Activities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {ACTIVITIES.map((activity) => {
              const isSelected = selectedActivities.includes(activity.id);
              const canSelect = selectedActivities.length < 2 || isSelected;
              
              return (
                <div
                  key={activity.id}
                  onClick={() => canSelect && toggleActivity(activity.id)}
                  className={`
                    bg-slate-900 rounded-lg p-6 cursor-pointer transition-all duration-200
                    ${isSelected 
                      ? 'ring-2 ring-blue-500 bg-blue-900' 
                      : canSelect 
                        ? 'hover:bg-slate-800' 
                        : 'opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="text-white">
                    <h4 className="text-xl font-bold mb-2">{activity.name}</h4>
                    <p className="text-gray-300 mb-3">{activity.description}</p>
                    <p className="text-sm text-blue-300 font-medium">{activity.reward}</p>
                  </div>
                  
                  {isSelected && (
                    <div className="mt-3 flex justify-center">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Selection Status and Actions */}
          <div className="bg-slate-900 rounded-lg p-6 text-white text-center">
            <p className="text-lg mb-4">
              Selected Activities: <span className="font-bold text-blue-300">{selectedActivities.length}/2</span>
            </p>
            
            {selectedActivities.length > 0 && (
              <div className="mb-4">
                <p className="text-sm text-gray-300 mb-2">Selected:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {selectedActivities.map((activityId) => {
                    const activity = ACTIVITIES.find(a => a.id === activityId);
                    return (
                      <span 
                        key={activityId}
                        className="px-3 py-1 bg-blue-600 rounded-full text-sm"
                      >
                        {activity?.name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleConfirm}
                disabled={selectedActivities.length !== 2}
                className={`
                  px-8 py-3 font-semibold rounded-lg transition-colors
                  ${selectedActivities.length === 2
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                Confirm Activities
              </button>
              
              <button
                onClick={() => setScreen('main-hub')}
                className="px-8 py-3 bg-gray-600 hover:bg-gray-500 text-white font-semibold rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
