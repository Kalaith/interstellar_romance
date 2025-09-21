import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { SELF_IMPROVEMENT_ACTIVITIES } from '../data/self-improvement';

export const SelfImprovementScreen: React.FC = () => {
  const {
    player,
    setScreen
  } = useGameStore();

  if (!player) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-8 text-center">
          <p className="text-xl text-[var(--text-primary)] mb-4">No player found!</p>
          <button
            onClick={() => setScreen('main-hub')}
            className="px-6 py-3 text-[var(--bg-space)] bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-teal)] rounded-lg font-semibold"
          >
            Back to Hub
          </button>
        </div>
      </div>
    );
  }

  const handleActivityClick = (activityId: string) => {
    const activity = SELF_IMPROVEMENT_ACTIVITIES.find(a => a.id === activityId);
    if (activity?.statBonus) {
      // Apply stat bonuses (this would be handled by game store in real implementation)
      console.log(`Applied bonuses from ${activity.name}:`, activity.statBonus);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Panel */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-8 backdrop-blur-sm">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[var(--text-primary)] tracking-wide uppercase mb-2">
              Self-Improvement Center
            </h2>
            <p className="text-[var(--text-secondary)] mt-2">
              Spend your free time developing skills and improving yourself
            </p>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="text-center">
                <div className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Energy</div>
                <div className="text-[var(--resource-energy)] font-semibold">100/100</div>
              </div>
              <div className="text-center">
                <div className="text-[var(--text-muted)] text-xs uppercase tracking-wide">Free Time Slots</div>
                <div className="text-[var(--accent-cyan)] font-semibold">5</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Stats Panel */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-[var(--accent-cyan)] uppercase tracking-wide mb-4">Current Stats</h3>
          <div className="grid grid-cols-5 gap-4">
            {[
              { label: 'Charisma', value: player.stats.charisma, color: 'var(--resource-energy)', icon: '💬' },
              { label: 'Intelligence', value: player.stats.intelligence, color: 'var(--resource-research)', icon: '🧠' },
              { label: 'Adventure', value: player.stats.adventure, color: 'var(--resource-minerals)', icon: '🚀' },
              { label: 'Empathy', value: player.stats.empathy, color: 'var(--resource-food)', icon: '💖' },
              { label: 'Technology', value: player.stats.technology, color: 'var(--resource-alloys)', icon: '🔧' }
            ].map((stat) => (
              <div key={stat.label} className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-4 text-center">
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-[var(--text-muted)] text-xs uppercase tracking-wide">{stat.label}</div>
                <div className="text-xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activities Grid */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold text-[var(--accent-cyan)] uppercase tracking-wide mb-6">Available Activities</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SELF_IMPROVEMENT_ACTIVITIES.map((activity) => (
              <div
                key={activity.id}
                onClick={() => handleActivityClick(activity.id)}
                className="bg-[var(--bg-section)] border-2 border-[var(--border-inner)] rounded-lg p-4 transition-all duration-300 cursor-pointer hover:border-[var(--accent-cyan)] hover:bg-[var(--bg-item)] hover:shadow-[0_0_15px_rgba(0,212,255,0.2)] transform hover:scale-105"
              >
                {/* Activity Icon */}
                <div className="w-full h-20 bg-[var(--bg-item)] rounded-lg mb-3 flex items-center justify-center text-3xl">
                  {activity.category === 'fitness' ? '💪' :
                   activity.category === 'study' ? '📚' :
                   activity.category === 'social' ? '👥' :
                   activity.category === 'personal' ? '🧘' :
                   activity.category === 'leisure' ? '🎮' : '⭐'}
                </div>

                <div className="text-center">
                  <h4 className="text-lg font-bold text-[var(--text-primary)] mb-2">{activity.name}</h4>
                  <p className="text-[var(--text-muted)] text-sm mb-3 line-clamp-2">{activity.description}</p>

                  {/* Resource Requirements */}
                  <div className="flex justify-center gap-2 mb-3">
                    <div className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--bg-item)] border border-[var(--border-inner)] text-[var(--resource-energy)]">
                      ⚡ {activity.energyCost}
                    </div>
                    <div className="text-xs font-semibold px-2 py-1 rounded-full bg-[var(--bg-item)] border border-[var(--border-inner)] text-[var(--accent-cyan)]">
                      ⏱️ {activity.timeSlots}
                    </div>
                  </div>

                  {/* Rewards */}
                  <div className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--state-available)] text-[var(--bg-space)]">
                    {activity.reward}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6">
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setScreen('main-hub')}
              className="flex items-center gap-3 px-8 py-4 text-lg font-semibold text-[var(--text-primary)] bg-[var(--bg-section)] hover:bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg transition-all duration-300"
            >
              <span className="text-2xl">🏠</span>
              <span>Return to Hub</span>
            </button>

            <button
              onClick={() => setScreen('activities')}
              className="flex items-center gap-3 px-8 py-4 text-lg font-semibold text-[var(--bg-space)] bg-gradient-to-r from-[var(--accent-cyan)] to-[var(--accent-teal)] hover:from-[var(--accent-teal)] hover:to-[var(--accent-cyan)] rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
            >
              <span className="text-2xl">📅</span>
              <span>Weekly Planning</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};