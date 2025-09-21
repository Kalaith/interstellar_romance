import { Activity } from '../types/game';

export const ACTIVITIES: Activity[] = [
  {
    id: 'work',
    name: 'Work Assignment',
    description: 'Complete your duties aboard the station',
    reward: '+1 Random Stat, +50 Credits',
    type: 'weekly',
    category: 'social',
    statBonus: { charisma: 1 }
  },
  {
    id: 'social',
    name: 'Social Event',
    description: 'Attend a diplomatic gathering',
    reward: '+1 Charisma, Meet characters',
    type: 'weekly',
    category: 'social',
    statBonus: { charisma: 1 }
  },
  {
    id: 'research',
    name: 'Research Project',
    description: 'Assist with scientific studies',
    reward: '+2 Intelligence, +1 Technology',
    type: 'weekly',
    category: 'exploration',
    statBonus: { intelligence: 2, technology: 1 }
  },
  {
    id: 'exploration',
    name: 'Exploration Mission',
    description: 'Survey nearby star systems',
    reward: '+2 Adventure, Rare items',
    type: 'weekly',
    category: 'exploration',
    statBonus: { adventure: 2 }
  },
  {
    id: 'meditation',
    name: 'Meditation Retreat',
    description: 'Focus on inner balance and understanding',
    reward: '+2 Empathy, +1 Charisma',
    type: 'weekly',
    category: 'personal',
    statBonus: { empathy: 2, charisma: 1 }
  },
  {
    id: 'training',
    name: 'Skills Training',
    description: 'Improve your abilities',
    reward: '+1 to chosen stat',
    type: 'weekly',
    category: 'personal',
    statBonus: { charisma: 1 }
  }
];
