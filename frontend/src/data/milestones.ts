import { RelationshipMilestone } from '../types/game';

export const defaultMilestones: RelationshipMilestone[] = [
  {
    id: 'first_meeting',
    name: 'First Meeting',
    description: 'Your first conversation together',
    unlockedAt: 1,
    achieved: false,
  },
  {
    id: 'getting_closer',
    name: 'Getting Closer',
    description: "You're starting to understand each other",
    unlockedAt: 15,
    achieved: false,
  },
  {
    id: 'mutual_interest',
    name: 'Mutual Interest',
    description: "There's definitely something between you two",
    unlockedAt: 30,
    achieved: false,
  },
  {
    id: 'romantic_tension',
    name: 'Romantic Tension',
    description: 'The air crackles with romantic possibility',
    unlockedAt: 50,
    achieved: false,
  },
  {
    id: 'deep_connection',
    name: 'Deep Connection',
    description: 'You share a profound emotional bond',
    unlockedAt: 70,
    achieved: false,
  },
  {
    id: 'true_love',
    name: 'True Love',
    description: 'Your hearts beat as one across the stars',
    unlockedAt: 90,
    achieved: false,
  },
];

export function checkMilestones(
  currentAffection: number,
  milestones: RelationshipMilestone[]
): RelationshipMilestone[] {
  return milestones.map((milestone) => {
    if (!milestone.achieved && currentAffection >= milestone.unlockedAt) {
      return {
        ...milestone,
        achieved: true,
        achievedDate: new Date(),
      };
    }
    return milestone;
  });
}
