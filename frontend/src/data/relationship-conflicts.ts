import {
  RelationshipConflict,
  ConflictResolutionOption,
  ConflictType,
} from '../types/game';

export const conflictTemplates: Record<
  ConflictType,
  {
    triggers: string[];
    descriptions: Record<string, string>;
    baseAffectionPenalty: number;
  }
> = {
  values_clash: {
    triggers: [
      'disagreement on core beliefs',
      'moral differences',
      'lifestyle priorities',
    ],
    descriptions: {
      zara: 'You and Zara have a fundamental disagreement about the role of military action in peacekeeping.',
      kai: 'Kai questions your approach to problem-solving, finding it too emotional rather than logical.',
      nova: "Nova feels hurt that you don't share her appreciation for artistic expression.",
      astra:
        'Astra is frustrated by your cautious approach to taking risks and trying new things.',
      orion:
        'Orion finds your fast-paced lifestyle incompatible with his need for contemplation.',
      luna: 'Luna is concerned about your competitive nature conflicting with her cooperative values.',
    },
    baseAffectionPenalty: 8,
  },
  miscommunication: {
    triggers: [
      'misunderstood intentions',
      'poor timing',
      'cultural differences',
    ],
    descriptions: {
      zara: "A tactical comment you made was misinterpreted as criticism of Zara's combat skills.",
      kai: 'Your emotional expression confused Kai, who interpreted it as illogical behavior.',
      nova: 'Nova misunderstood your directness as insensitivity to her feelings.',
      astra:
        "Your attempt at being responsible came across as trying to control Astra's freedom.",
      orion:
        'Orion interpreted your enthusiasm as disrespect for his measured approach.',
      luna: "Luna felt your independence suggested you don't value her supportive nature.",
    },
    baseAffectionPenalty: 5,
  },
  jealousy: {
    triggers: ['attention to others', 'past relationships', 'time allocation'],
    descriptions: {
      zara: 'Zara noticed you spending time training with other warriors and felt territorial.',
      kai: 'Kai calculated that you spend more processing time thinking about others.',
      nova: "Nova saw you complimenting someone else's artistic work and felt overlooked.",
      astra:
        'Astra is jealous of your adventures with other people while she was busy.',
      orion:
        'Orion observed your social interactions and questioned his special status.',
      luna: "Luna feels you're not prioritizing your relationship as much as she hoped.",
    },
    baseAffectionPenalty: 6,
  },
  expectation_mismatch: {
    triggers: ['relationship pace', 'commitment levels', 'future planning'],
    descriptions: {
      zara: 'Zara expected more decisive action in your relationship progression.',
      kai: "Kai's calculated relationship timeline doesn't match your organic approach.",
      nova: 'Nova hoped for more romantic gestures and feels the relationship lacks poetry.',
      astra:
        "Astra expected more spontaneous adventures together than you've been having.",
      orion:
        'Orion feels the relationship is moving too quickly for proper contemplation.',
      luna: "Luna expected more emotional intimacy and feels you're keeping distance.",
    },
    baseAffectionPenalty: 7,
  },
  lifestyle_difference: {
    triggers: ['daily routines', 'social preferences', 'activity choices'],
    descriptions: {
      zara: "Your civilian schedule conflicts with Zara's military training regimen.",
      kai: "Kai's structured approach to life clashes with your more flexible style.",
      nova: "Nova's need for creative time doesn't align with your practical schedules.",
      astra:
        "Astra's high-energy lifestyle is exhausting for your more moderate pace.",
      orion:
        "Orion's contemplative lifestyle feels too slow for your active nature.",
      luna: "Luna's community-focused life doesn't match your independent preferences.",
    },
    baseAffectionPenalty: 6,
  },
  trust_issue: {
    triggers: ['broken promises', 'secrets revealed', 'reliability concerns'],
    descriptions: {
      zara: "Zara discovered you weren't entirely honest about your past experiences.",
      kai: 'Kai found inconsistencies in your previous statements and questions your reliability.',
      nova: "Nova feels you haven't been emotionally honest about your feelings.",
      astra:
        "Astra is hurt that you didn't trust her enough to include her in important decisions.",
      orion:
        'Orion senses hidden aspects of your personality and feels deceived.',
      luna: "Luna is concerned that you haven't been fully open about your emotional needs.",
    },
    baseAffectionPenalty: 10,
  },
};

export const baseResolutionOptions: ConflictResolutionOption[] = [
  {
    id: 'apologize',
    method: 'apologize',
    label: 'Sincere Apology',
    description:
      'Take full responsibility and apologize genuinely for your part in the conflict.',
    requirements: {
      playerStat: 'empathy',
      minValue: 60,
    },
    preview: {
      successChance: 75,
      affectionChange: 4,
      personalityEffects: ['Increases trust', 'May boost emotional openness'],
    },
  },
  {
    id: 'discuss',
    method: 'discuss',
    label: 'Open Discussion',
    description:
      'Have an honest conversation about the issue and try to understand each other.',
    requirements: {
      playerStat: 'charisma',
      minValue: 50,
    },
    preview: {
      successChance: 65,
      affectionChange: 6,
      personalityEffects: ['Improves communication', 'Builds understanding'],
    },
  },
  {
    id: 'compromise',
    method: 'compromise',
    label: 'Find Middle Ground',
    description:
      'Work together to find a solution that addresses both of your concerns.',
    requirements: {
      playerStat: 'intelligence',
      minValue: 65,
    },
    preview: {
      successChance: 80,
      affectionChange: 8,
      personalityEffects: [
        'Increases flexibility',
        'Builds cooperation skills',
      ],
    },
  },
  {
    id: 'gift',
    method: 'gift',
    label: 'Thoughtful Gesture',
    description: 'Show your care through a meaningful gift or special action.',
    preview: {
      successChance: 60,
      affectionChange: 3,
      personalityEffects: ['May improve mood temporarily', 'Shows care'],
    },
  },
  {
    id: 'time_apart',
    method: 'time_apart',
    label: 'Give Space',
    description:
      'Allow some time and distance for emotions to settle before reconnecting.',
    preview: {
      successChance: 55,
      affectionChange: 2,
      personalityEffects: ['Allows reflection', 'May increase independence'],
    },
  },
  {
    id: 'ignore',
    method: 'ignore',
    label: 'Ignore the Issue',
    description:
      'Act like nothing happened and hope the problem resolves itself.',
    preview: {
      successChance: 25,
      affectionChange: -2,
      personalityEffects: ['May decrease trust', 'Could create resentment'],
    },
  },
];

export const characterSpecificResolutions: Record<
  string,
  Partial<ConflictResolutionOption>[]
> = {
  zara: [
    {
      id: 'warrior_respect',
      method: 'discuss',
      label: "Warrior's Honor",
      description: 'Appeal to her sense of honor and acknowledge her strength.',
      requirements: { characterAffection: 40 },
      preview: {
        successChance: 85,
        affectionChange: 10,
        personalityEffects: ['Greatly increases respect', 'Boosts confidence'],
      },
    },
  ],
  kai: [
    {
      id: 'logical_analysis',
      method: 'discuss',
      label: 'Logical Analysis',
      description:
        'Present a systematic analysis of the conflict and proposed solutions.',
      requirements: { playerStat: 'intelligence', minValue: 75 },
      preview: {
        successChance: 90,
        affectionChange: 12,
        personalityEffects: ['Appreciates logic', 'Increases analytical trust'],
      },
    },
  ],
  nova: [
    {
      id: 'artistic_expression',
      method: 'gift',
      label: 'Creative Apology',
      description:
        'Express your feelings through art, poetry, or another creative medium.',
      preview: {
        successChance: 80,
        affectionChange: 9,
        personalityEffects: [
          'Deeply touches emotions',
          'Increases expressiveness',
        ],
      },
    },
  ],
  astra: [
    {
      id: 'adventure_solution',
      method: 'compromise',
      label: 'Adventure Together',
      description:
        'Suggest an exciting shared activity to work through the conflict.',
      requirements: { playerStat: 'adventure', minValue: 60 },
      preview: {
        successChance: 85,
        affectionChange: 11,
        personalityEffects: ['Boosts excitement', 'Increases spontaneity'],
      },
    },
  ],
  orion: [
    {
      id: 'meditative_discussion',
      method: 'time_apart',
      label: 'Contemplative Approach',
      description:
        'Suggest a period of reflection followed by a thoughtful discussion.',
      preview: {
        successChance: 75,
        affectionChange: 7,
        personalityEffects: ['Appreciates patience', 'Deepens thoughtfulness'],
      },
    },
  ],
  luna: [
    {
      id: 'healing_focus',
      method: 'apologize',
      label: 'Healing Together',
      description: 'Focus on emotional healing and mutual care for each other.',
      requirements: { playerStat: 'empathy', minValue: 70 },
      preview: {
        successChance: 88,
        affectionChange: 10,
        personalityEffects: ['Increases warmth', 'Builds emotional connection'],
      },
    },
  ],
};

export function generateConflict(
  characterId: string,
  affectionLevel: number
): RelationshipConflict | null {
  // Higher affection = lower conflict chance
  const conflictChance = Math.max(5, 30 - affectionLevel * 0.2);

  if (Math.random() * 100 > conflictChance) {
    return null;
  }

  const conflictTypes: ConflictType[] = [
    'values_clash',
    'miscommunication',
    'jealousy',
    'expectation_mismatch',
    'lifestyle_difference',
    'trust_issue',
  ];
  const conflictType =
    conflictTypes[Math.floor(Math.random() * conflictTypes.length)];
  const template = conflictTemplates[conflictType];

  const trigger =
    template.triggers[Math.floor(Math.random() * template.triggers.length)];
  const description = template.descriptions[characterId];

  const severity =
    affectionLevel > 60 ? 'minor' : affectionLevel > 30 ? 'moderate' : 'major';
  const affectionPenalty =
    template.baseAffectionPenalty *
    (severity === 'minor' ? 0.5 : severity === 'moderate' ? 1 : 1.5);

  const resolutionOptions = [...baseResolutionOptions];
  const characterSpecific = characterSpecificResolutions[characterId];
  if (characterSpecific) {
    characterSpecific.forEach((option) => {
      resolutionOptions.push({
        ...baseResolutionOptions[0],
        ...option,
      } as ConflictResolutionOption);
    });
  }

  return {
    id: `conflict_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    characterId,
    type: conflictType,
    severity,
    trigger,
    description,
    startDate: new Date(),
    resolved: false,
    affectionPenalty: Math.round(affectionPenalty),
    resolutionOptions,
  };
}
