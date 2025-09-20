import { PersonalityGrowth, GrowthEvent, GrowthTrigger } from '../types/game';
import { personalityGrowthTriggers } from '../data/personality-growth';

export function calculatePersonalityGrowth(
  currentTraits: PersonalityGrowth[],
  trigger: GrowthTrigger,
  reason: string
): PersonalityGrowth[] {
  const triggers = personalityGrowthTriggers[trigger];
  const updatedTraits = [...currentTraits];

  updatedTraits.forEach(trait => {
    const change = triggers[trait.trait as keyof typeof triggers] || 0;

    if (change !== 0) {
      const newValue = Math.max(
        trait.minGrowth,
        Math.min(trait.maxGrowth, trait.currentValue + change)
      );

      if (newValue !== trait.currentValue) {
        const growthEvent: GrowthEvent = {
          id: `growth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          date: new Date(),
          trigger,
          change: newValue - trait.currentValue,
          reason
        };

        trait.currentValue = newValue;
        trait.growthHistory.push(growthEvent);
      }
    }
  });

  return updatedTraits;
}

export function getPersonalityDescription(traits: PersonalityGrowth[]): string {
  const descriptions: string[] = [];

  traits.forEach(trait => {
    const change = trait.currentValue - trait.baseValue;
    const changePercent = Math.abs(change) / trait.baseValue * 100;

    if (changePercent >= 15) { // Significant change
      if (change > 0) {
        descriptions.push(getPositiveTraitDescription(trait.trait, changePercent));
      } else {
        descriptions.push(getNegativeTraitDescription(trait.trait, changePercent));
      }
    }
  });

  return descriptions.length > 0
    ? descriptions.join('; ')
    : 'Personality remains largely unchanged from initial impression.';
}

function getPositiveTraitDescription(trait: string, changePercent: number): string {
  const intensity = changePercent >= 30 ? 'significantly' : 'noticeably';

  const descriptions: Record<string, string> = {
    confidence: `has become ${intensity} more confident`,
    trust: `trusts you ${intensity} more`,
    openness: `is ${intensity} more open about their feelings`,
    social_comfort: `feels ${intensity} more comfortable in social situations`,
    expressiveness: `expresses themselves ${intensity} more freely`,
    emotional_openness: `is ${intensity} more emotionally available`,
    warmth: `shows ${intensity} more warmth in interactions`,
    patience: `has developed ${intensity} more patience`,
    vulnerability: `is ${intensity} more willing to be vulnerable`,
    curiosity: `shows ${intensity} more curiosity about you`,
    spontaneity: `has become ${intensity} more spontaneous`,
    focus: `can focus ${intensity} better during conversations`,
    responsibility: `takes ${intensity} more responsibility for their actions`,
    emotional_stability: `is ${intensity} more emotionally stable`,
    flexibility: `has become ${intensity} more flexible and adaptable`,
    assertiveness: `is ${intensity} more assertive about their needs`,
    adventure_seeking: `seeks ${intensity} more adventurous experiences`
  };

  return descriptions[trait] || `has improved in ${trait}`;
}

function getNegativeTraitDescription(trait: string, changePercent: number): string {
  const intensity = changePercent >= 30 ? 'significantly' : 'noticeably';

  const descriptions: Record<string, string> = {
    confidence: `has become ${intensity} less confident`,
    trust: `trusts you ${intensity} less`,
    openness: `is ${intensity} less open about their feelings`,
    social_comfort: `feels ${intensity} less comfortable in social situations`,
    expressiveness: `expresses themselves ${intensity} less freely`,
    emotional_openness: `is ${intensity} less emotionally available`,
    warmth: `shows ${intensity} less warmth in interactions`,
    patience: `has ${intensity} less patience`,
    vulnerability: `is ${intensity} less willing to be vulnerable`,
    curiosity: `shows ${intensity} less curiosity`,
    spontaneity: `has become ${intensity} less spontaneous`,
    focus: `has ${intensity} more trouble focusing`,
    responsibility: `takes ${intensity} less responsibility`,
    emotional_stability: `is ${intensity} less emotionally stable`,
    flexibility: `has become ${intensity} more rigid`,
    assertiveness: `is ${intensity} less assertive`,
    adventure_seeking: `seeks ${intensity} less adventurous experiences`
  };

  return descriptions[trait] || `has declined in ${trait}`;
}

export function getPersonalityChangeIndicator(trait: PersonalityGrowth): {
  status: 'improved' | 'declined' | 'stable';
  intensity: 'minor' | 'moderate' | 'major';
  description: string;
} {
  const change = trait.currentValue - trait.baseValue;
  const changePercent = Math.abs(change) / trait.baseValue * 100;

  let status: 'improved' | 'declined' | 'stable';
  if (change > 5) status = 'improved';
  else if (change < -5) status = 'declined';
  else status = 'stable';

  let intensity: 'minor' | 'moderate' | 'major';
  if (changePercent < 10) intensity = 'minor';
  else if (changePercent < 25) intensity = 'moderate';
  else intensity = 'major';

  const description = status === 'stable'
    ? 'No significant change'
    : status === 'improved'
    ? `+${change} improvement`
    : `${change} decline`;

  return { status, intensity, description };
}

export function calculatePersonalityCompatibility(
  playerChoices: string[],
  characterTraits: PersonalityGrowth[]
): number {
  // Calculate how well current personality aligns with player's demonstrated preferences
  let compatibility = 70; // base compatibility

  characterTraits.forEach(trait => {
    const growth = trait.currentValue - trait.baseValue;

    // Positive growth generally improves compatibility
    if (growth > 0) {
      compatibility += Math.min(growth * 0.3, 10);
    } else if (growth < -10) {
      // Significant negative growth hurts compatibility
      compatibility += Math.max(growth * 0.2, -15);
    }
  });

  return Math.max(0, Math.min(100, Math.round(compatibility)));
}