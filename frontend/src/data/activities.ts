import { Activity } from '../types/game';

export const ACTIVITIES: Activity[] = [
  {
    id: 'work',
    name: 'Work Assignment',
    description: 'Complete your duties aboard the station',
    reward: '+1 Random Stat, +50 Credits'
  },
  {
    id: 'social',
    name: 'Social Event', 
    description: 'Attend a diplomatic gathering',
    reward: '+1 Charisma, Meet characters'
  },
  {
    id: 'research',
    name: 'Research Project',
    description: 'Assist with scientific studies',
    reward: '+2 Intelligence, +1 Technology'
  },
  {
    id: 'exploration',
    name: 'Exploration Mission',
    description: 'Survey nearby star systems',
    reward: '+2 Adventure, Rare items'
  },
  {
    id: 'meditation',
    name: 'Meditation Retreat',
    description: 'Focus on inner balance and understanding',
    reward: '+2 Empathy, +1 Charisma'
  },
  {
    id: 'training',
    name: 'Skills Training',
    description: 'Improve your abilities',
    reward: '+1 to chosen stat'
  }
];
