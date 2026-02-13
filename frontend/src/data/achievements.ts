import { Achievement, AchievementCategory } from '../types/game';

export const ACHIEVEMENTS: Achievement[] = [
  // Relationship Achievements
  {
    id: 'first_meeting',
    name: 'First Contact',
    description: 'Have your first conversation with any character',
    icon: '👋',
    category: 'relationship',
    condition: { type: 'conversation_count', target: 1 },
    achieved: false,
    progress: 0,
  },
  {
    id: 'friend_zone',
    name: 'Making Friends',
    description: 'Reach 25 affection with any character',
    icon: '🤝',
    category: 'relationship',
    condition: { type: 'affection', target: 25 },
    achieved: false,
    progress: 0,
  },
  {
    id: 'romantic_interest',
    name: 'Romantic Interest',
    description: 'Reach 50 affection with any character',
    icon: '💕',
    category: 'relationship',
    condition: { type: 'affection', target: 50 },
    achieved: false,
    progress: 0,
  },
  {
    id: 'deep_connection',
    name: 'Deep Connection',
    description: 'Reach 75 affection with any character',
    icon: '💖',
    category: 'relationship',
    condition: { type: 'affection', target: 75 },
    achieved: false,
    progress: 0,
  },
  {
    id: 'true_love',
    name: 'True Love',
    description: 'Reach 100 affection with any character',
    icon: '💗',
    category: 'relationship',
    condition: { type: 'affection', target: 100 },
    reward: {
      type: 'photo',
      id: 'legendary_photo',
      description: 'Unlock a special legendary photo',
    },
    achieved: false,
    progress: 0,
  },

  // Character-Specific Achievements
  {
    id: 'nature_lover',
    name: 'Nature Lover',
    description: "Reach 50 affection with Zara'thul",
    icon: '🌿',
    category: 'relationship',
    condition: { type: 'affection', target: 50, characterId: 'zarath' },
    reward: {
      type: 'dialogue_option',
      id: 'nature_wisdom',
      description: 'Unlock special nature-themed conversations',
    },
    achieved: false,
    progress: 0,
  },
  {
    id: 'space_explorer',
    name: 'Space Explorer',
    description: "Reach 50 affection with Captain Vel'nari",
    icon: '🚀',
    category: 'relationship',
    condition: { type: 'affection', target: 50, characterId: 'velnari' },
    reward: {
      type: 'date_plan',
      id: 'exclusive_nebula_tour',
      description: 'Unlock exclusive space exploration dates',
    },
    achieved: false,
    progress: 0,
  },
  {
    id: 'ocean_depths',
    name: 'Ocean Depths',
    description: "Reach 50 affection with Dr. Keth'ra",
    icon: '🌊',
    category: 'relationship',
    condition: { type: 'affection', target: 50, characterId: 'kethra' },
    reward: {
      type: 'photo',
      id: 'underwater_paradise',
      description: 'Unlock exclusive underwater photos',
    },
    achieved: false,
    progress: 0,
  },
  {
    id: 'warrior_bond',
    name: "Warrior's Bond",
    description: "Reach 50 affection with Commander Ryx'tal",
    icon: '⚔️',
    category: 'relationship',
    condition: { type: 'affection', target: 50, characterId: 'ryxtal' },
    reward: {
      type: 'dialogue_option',
      id: 'honor_code',
      description: 'Learn about ancient warrior traditions',
    },
    achieved: false,
    progress: 0,
  },
  {
    id: 'empathic_connection',
    name: 'Empathic Connection',
    description: "Reach 50 affection with Sage Mor'geth",
    icon: '🧠',
    category: 'relationship',
    condition: { type: 'affection', target: 50, characterId: 'morgeth' },
    reward: {
      type: 'photo',
      id: 'collective_consciousness',
      description: 'Unlock empathic art photos',
    },
    achieved: false,
    progress: 0,
  },
  {
    id: 'tech_harmony',
    name: 'Technological Harmony',
    description: "Reach 50 affection with Engineer Thex'ik",
    icon: '⚙️',
    category: 'relationship',
    condition: { type: 'affection', target: 50, characterId: 'thexik' },
    reward: {
      type: 'date_plan',
      id: 'quantum_workshop',
      description: 'Unlock advanced technology dates',
    },
    achieved: false,
    progress: 0,
  },

  // Dating Achievements
  {
    id: 'first_date',
    name: 'First Date',
    description: 'Successfully complete your first planned date',
    icon: '🌹',
    category: 'dating',
    condition: { type: 'date_count', target: 1 },
    achieved: false,
    progress: 0,
  },
  {
    id: 'serial_dater',
    name: 'Serial Dater',
    description: 'Complete 10 successful dates',
    icon: '💐',
    category: 'dating',
    condition: { type: 'date_count', target: 10 },
    achieved: false,
    progress: 0,
  },
  {
    id: 'romantic_master',
    name: 'Romantic Master',
    description: 'Complete 25 successful dates',
    icon: '👑',
    category: 'dating',
    condition: { type: 'date_count', target: 25 },
    reward: {
      type: 'cosmetic',
      id: 'romantic_title',
      description: 'Earn the "Galactic Romantic" title',
    },
    achieved: false,
    progress: 0,
  },

  // Conversation Achievements
  {
    id: 'social_butterfly',
    name: 'Social Butterfly',
    description: 'Have 50 conversations across all characters',
    icon: '🦋',
    category: 'conversation',
    condition: { type: 'conversation_count', target: 50 },
    achieved: false,
    progress: 0,
  },
  {
    id: 'master_conversationalist',
    name: 'Master Conversationalist',
    description: 'Have 100 conversations across all characters',
    icon: '🎭',
    category: 'conversation',
    condition: { type: 'conversation_count', target: 100 },
    reward: {
      type: 'dialogue_option',
      id: 'master_charm',
      description: 'Unlock special charm dialogue options',
    },
    achieved: false,
    progress: 0,
  },

  // Collection Achievements
  {
    id: 'photo_collector',
    name: 'Photo Collector',
    description: 'Unlock 10 character photos',
    icon: '📸',
    category: 'collection',
    condition: { type: 'photo_unlock', target: 10 },
    achieved: false,
    progress: 0,
  },
  {
    id: 'memory_keeper',
    name: 'Memory Keeper',
    description: 'Unlock 25 character photos',
    icon: '📚',
    category: 'collection',
    condition: { type: 'photo_unlock', target: 25 },
    achieved: false,
    progress: 0,
  },
  {
    id: 'legendary_collector',
    name: 'Legendary Collector',
    description: 'Unlock all legendary photos',
    icon: '🏆',
    category: 'collection',
    condition: { type: 'photo_unlock', target: 6 }, // 6 legendary photos (1 per character)
    reward: {
      type: 'cosmetic',
      id: 'collector_badge',
      description: 'Exclusive collector badge',
    },
    achieved: false,
    progress: 0,
  },

  // Compatibility Achievements
  {
    id: 'perfect_match',
    name: 'Perfect Match',
    description: 'Achieve 90%+ compatibility with any character',
    icon: '✨',
    category: 'mastery',
    condition: { type: 'compatibility', target: 90 },
    achieved: false,
    progress: 0,
  },
  {
    id: 'universal_charm',
    name: 'Universal Charm',
    description: 'Achieve 70%+ compatibility with all characters',
    icon: '🌟',
    category: 'mastery',
    condition: { type: 'compatibility', target: 70 },
    reward: {
      type: 'cosmetic',
      id: 'universal_charm_title',
      description: 'Earn the "Universal Charmer" title',
    },
    achieved: false,
    progress: 0,
  },

  // Milestone Achievements
  {
    id: 'milestone_hunter',
    name: 'Milestone Hunter',
    description: 'Unlock 10 relationship milestones',
    icon: '🎯',
    category: 'relationship',
    condition: { type: 'milestone', target: 10 },
    achieved: false,
    progress: 0,
  },
  {
    id: 'relationship_expert',
    name: 'Relationship Expert',
    description: 'Unlock all milestones with any character',
    icon: '💎',
    category: 'relationship',
    condition: { type: 'milestone', target: 6 }, // 6 milestones per character
    reward: {
      type: 'photo',
      id: 'relationship_master',
      description: 'Unlock exclusive relationship expert photo',
    },
    achieved: false,
    progress: 0,
  },

  // Exploration Achievements
  {
    id: 'galactic_explorer',
    name: 'Galactic Explorer',
    description: 'Visit all available date locations',
    icon: '🗺️',
    category: 'exploration',
    condition: { type: 'date_count', target: 15 }, // Approximate number of unique locations
    achieved: false,
    progress: 0,
  },
];

export function checkAchievements(
  achievements: Achievement[],
  stats: {
    totalAffection: number;
    maxAffection: number;
    totalDates: number;
    totalConversations: number;
    unlockedPhotos: number;
    maxCompatibility: number;
    unlockedMilestones: number;
    characterAffections: Record<string, number>;
  }
): Achievement[] {
  return achievements.map((achievement) => {
    if (achievement.achieved) return achievement;

    let progress = 0;
    let isAchieved = false;

    switch (achievement.condition.type) {
      case 'affection':
        if (achievement.condition.characterId) {
          const characterAffection =
            stats.characterAffections[achievement.condition.characterId] || 0;
          progress = Math.min(
            100,
            (characterAffection / achievement.condition.target) * 100
          );
          isAchieved = characterAffection >= achievement.condition.target;
        } else {
          progress = Math.min(
            100,
            (stats.maxAffection / achievement.condition.target) * 100
          );
          isAchieved = stats.maxAffection >= achievement.condition.target;
        }
        break;

      case 'date_count':
        progress = Math.min(
          100,
          (stats.totalDates / achievement.condition.target) * 100
        );
        isAchieved = stats.totalDates >= achievement.condition.target;
        break;

      case 'conversation_count':
        progress = Math.min(
          100,
          (stats.totalConversations / achievement.condition.target) * 100
        );
        isAchieved = stats.totalConversations >= achievement.condition.target;
        break;

      case 'photo_unlock':
        progress = Math.min(
          100,
          (stats.unlockedPhotos / achievement.condition.target) * 100
        );
        isAchieved = stats.unlockedPhotos >= achievement.condition.target;
        break;

      case 'compatibility':
        progress = Math.min(
          100,
          (stats.maxCompatibility / achievement.condition.target) * 100
        );
        isAchieved = stats.maxCompatibility >= achievement.condition.target;
        break;

      case 'milestone':
        progress = Math.min(
          100,
          (stats.unlockedMilestones / achievement.condition.target) * 100
        );
        isAchieved = stats.unlockedMilestones >= achievement.condition.target;
        break;
    }

    return {
      ...achievement,
      progress: Math.round(progress),
      achieved: isAchieved,
      achievedDate:
        isAchieved && !achievement.achieved
          ? new Date()
          : achievement.achievedDate,
    };
  });
}

export function getAchievementsByCategory(
  achievements: Achievement[],
  category: AchievementCategory
): Achievement[] {
  return achievements.filter(
    (achievement) => achievement.category === category
  );
}

export function getRecentAchievements(
  achievements: Achievement[],
  days: number = 7
): Achievement[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return achievements.filter(
    (achievement) =>
      achievement.achieved &&
      achievement.achievedDate &&
      achievement.achievedDate >= cutoffDate
  );
}
