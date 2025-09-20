import { PersonalityGrowth } from '../types/game';

export const initialPersonalityTraits: Record<string, PersonalityGrowth[]> = {
  'zara': [
    {
      trait: 'confidence',
      baseValue: 75,
      currentValue: 75,
      growthHistory: [],
      maxGrowth: 95,
      minGrowth: 40
    },
    {
      trait: 'openness',
      baseValue: 60,
      currentValue: 60,
      growthHistory: [],
      maxGrowth: 90,
      minGrowth: 30
    },
    {
      trait: 'trust',
      baseValue: 45,
      currentValue: 45,
      growthHistory: [],
      maxGrowth: 85,
      minGrowth: 20
    },
    {
      trait: 'empathy',
      baseValue: 80,
      currentValue: 80,
      growthHistory: [],
      maxGrowth: 100,
      minGrowth: 50
    }
  ],
  'kai': [
    {
      trait: 'confidence',
      baseValue: 85,
      currentValue: 85,
      growthHistory: [],
      maxGrowth: 100,
      minGrowth: 60
    },
    {
      trait: 'patience',
      baseValue: 40,
      currentValue: 40,
      growthHistory: [],
      maxGrowth: 80,
      minGrowth: 20
    },
    {
      trait: 'vulnerability',
      baseValue: 30,
      currentValue: 30,
      growthHistory: [],
      maxGrowth: 70,
      minGrowth: 15
    },
    {
      trait: 'curiosity',
      baseValue: 90,
      currentValue: 90,
      growthHistory: [],
      maxGrowth: 100,
      minGrowth: 70
    }
  ],
  'nova': [
    {
      trait: 'confidence',
      baseValue: 40,
      currentValue: 40,
      growthHistory: [],
      maxGrowth: 80,
      minGrowth: 20
    },
    {
      trait: 'social_comfort',
      baseValue: 25,
      currentValue: 25,
      growthHistory: [],
      maxGrowth: 75,
      minGrowth: 10
    },
    {
      trait: 'expressiveness',
      baseValue: 35,
      currentValue: 35,
      growthHistory: [],
      maxGrowth: 85,
      minGrowth: 15
    },
    {
      trait: 'trust',
      baseValue: 70,
      currentValue: 70,
      growthHistory: [],
      maxGrowth: 95,
      minGrowth: 40
    }
  ],
  'astra': [
    {
      trait: 'spontaneity',
      baseValue: 95,
      currentValue: 95,
      growthHistory: [],
      maxGrowth: 100,
      minGrowth: 80
    },
    {
      trait: 'focus',
      baseValue: 30,
      currentValue: 30,
      growthHistory: [],
      maxGrowth: 70,
      minGrowth: 15
    },
    {
      trait: 'responsibility',
      baseValue: 40,
      currentValue: 40,
      growthHistory: [],
      maxGrowth: 80,
      minGrowth: 20
    },
    {
      trait: 'emotional_stability',
      baseValue: 60,
      currentValue: 60,
      growthHistory: [],
      maxGrowth: 90,
      minGrowth: 30
    }
  ],
  'orion': [
    {
      trait: 'emotional_openness',
      baseValue: 20,
      currentValue: 20,
      growthHistory: [],
      maxGrowth: 70,
      minGrowth: 10
    },
    {
      trait: 'flexibility',
      baseValue: 35,
      currentValue: 35,
      growthHistory: [],
      maxGrowth: 80,
      minGrowth: 15
    },
    {
      trait: 'patience',
      baseValue: 85,
      currentValue: 85,
      growthHistory: [],
      maxGrowth: 100,
      minGrowth: 60
    },
    {
      trait: 'curiosity',
      baseValue: 75,
      currentValue: 75,
      growthHistory: [],
      maxGrowth: 95,
      minGrowth: 50
    }
  ],
  'luna': [
    {
      trait: 'confidence',
      baseValue: 70,
      currentValue: 70,
      growthHistory: [],
      maxGrowth: 95,
      minGrowth: 45
    },
    {
      trait: 'warmth',
      baseValue: 85,
      currentValue: 85,
      growthHistory: [],
      maxGrowth: 100,
      minGrowth: 60
    },
    {
      trait: 'assertiveness',
      baseValue: 50,
      currentValue: 50,
      growthHistory: [],
      maxGrowth: 85,
      minGrowth: 25
    },
    {
      trait: 'adventure_seeking',
      baseValue: 60,
      currentValue: 60,
      growthHistory: [],
      maxGrowth: 90,
      minGrowth: 35
    }
  ]
};

export interface PersonalityGrowthTriggers {
  positive_interaction: {
    confidence: 2;
    trust: 3;
    openness: 2;
    social_comfort: 4;
    expressiveness: 3;
    emotional_openness: 4;
    warmth: 2;
  };
  negative_interaction: {
    confidence: -3;
    trust: -4;
    openness: -2;
    social_comfort: -5;
    expressiveness: -3;
    emotional_openness: -5;
    warmth: -2;
  };
  milestone_achievement: {
    confidence: 5;
    trust: 4;
    emotional_openness: 3;
    assertiveness: 3;
  };
  date_success: {
    confidence: 3;
    social_comfort: 4;
    adventure_seeking: 2;
    spontaneity: 2;
  };
  date_failure: {
    confidence: -2;
    social_comfort: -3;
    trust: -2;
  };
  conversation_choice: {
    openness: 1;
    expressiveness: 2;
    emotional_openness: 2;
    curiosity: 1;
  };
  conflict_resolution: {
    patience: 4;
    emotional_stability: 3;
    flexibility: 4;
    empathy: 3;
    responsibility: 3;
  };
}

export const personalityGrowthTriggers: PersonalityGrowthTriggers = {
  positive_interaction: {
    confidence: 2,
    trust: 3,
    openness: 2,
    social_comfort: 4,
    expressiveness: 3,
    emotional_openness: 4,
    warmth: 2
  },
  negative_interaction: {
    confidence: -3,
    trust: -4,
    openness: -2,
    social_comfort: -5,
    expressiveness: -3,
    emotional_openness: -5,
    warmth: -2
  },
  milestone_achievement: {
    confidence: 5,
    trust: 4,
    emotional_openness: 3,
    assertiveness: 3
  },
  date_success: {
    confidence: 3,
    social_comfort: 4,
    adventure_seeking: 2,
    spontaneity: 2
  },
  date_failure: {
    confidence: -2,
    social_comfort: -3,
    trust: -2
  },
  conversation_choice: {
    openness: 1,
    expressiveness: 2,
    emotional_openness: 2,
    curiosity: 1
  },
  conflict_resolution: {
    patience: 4,
    emotional_stability: 3,
    flexibility: 4,
    empathy: 3,
    responsibility: 3
  }
};