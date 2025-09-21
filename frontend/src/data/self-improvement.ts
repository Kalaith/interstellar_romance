import { SelfImprovementActivity } from '../types/game';

export const SELF_IMPROVEMENT_ACTIVITIES: SelfImprovementActivity[] = [
  {
    id: 'gym',
    name: 'Physical Training',
    description: 'Build strength and improve your physical condition',
    reward: '+1 Charisma, +1 Adventure',
    type: 'daily',
    category: 'fitness',
    energyCost: 2,
    timeSlots: 1,
    statBonus: { charisma: 1, adventure: 1 }
  },
  {
    id: 'study',
    name: 'Technical Studies',
    description: 'Learn about alien technology and scientific principles',
    reward: '+2 Intelligence, +1 Technology',
    type: 'daily',
    category: 'study',
    energyCost: 2,
    timeSlots: 1,
    statBonus: { intelligence: 2, technology: 1 }
  },
  {
    id: 'diplomacy',
    name: 'Diplomatic Practice',
    description: 'Practice negotiation and social skills',
    reward: '+2 Charisma, +1 Empathy',
    type: 'daily',
    category: 'social',
    energyCost: 1,
    timeSlots: 1,
    statBonus: { charisma: 2, empathy: 1 }
  },
  {
    id: 'meditation',
    name: 'Mindfulness Training',
    description: 'Center yourself and improve emotional intelligence',
    reward: '+2 Empathy, +1 Charisma',
    type: 'daily',
    category: 'personal',
    energyCost: 1,
    timeSlots: 1,
    statBonus: { empathy: 2, charisma: 1 }
  },
  {
    id: 'workshop',
    name: 'Engineering Workshop',
    description: 'Tinker with technology and improve your technical skills',
    reward: '+2 Technology, +1 Intelligence',
    type: 'daily',
    category: 'study',
    energyCost: 2,
    timeSlots: 1,
    statBonus: { technology: 2, intelligence: 1 }
  },
  {
    id: 'simulator',
    name: 'Adventure Simulation',
    description: 'Practice dangerous scenarios in a safe environment',
    reward: '+2 Adventure, +1 Technology',
    type: 'daily',
    category: 'leisure',
    energyCost: 2,
    timeSlots: 1,
    statBonus: { adventure: 2, technology: 1 }
  },
  {
    id: 'social_hour',
    name: 'Casual Socializing',
    description: 'Spend time in common areas meeting people',
    reward: '+1 Charisma, Chance to discover events',
    type: 'daily',
    category: 'social',
    energyCost: 1,
    timeSlots: 1,
    statBonus: { charisma: 1 }
  },
  {
    id: 'research',
    name: 'Personal Research',
    description: 'Study alien cultures and improve your understanding',
    reward: '+1 Intelligence, +1 Empathy',
    type: 'daily',
    category: 'study',
    energyCost: 1,
    timeSlots: 1,
    statBonus: { intelligence: 1, empathy: 1 }
  }
];