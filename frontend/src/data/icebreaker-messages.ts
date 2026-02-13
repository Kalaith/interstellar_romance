import { IcebreakerMessage, IcebreakerCategory } from '../types/game';

export const icebreakerTemplates: Record<
  string,
  Record<IcebreakerCategory, IcebreakerMessage[]>
> = {
  zara: {
    compliment: [
      {
        id: 'zara_compliment_1',
        characterId: 'zara',
        category: 'compliment',
        message:
          "Your combat techniques are absolutely incredible. I've never seen anyone move with such precision and power.",
        context: {
          requiredAffection: 10,
          characterPersonality: ['confident', 'warrior'],
        },
        effectiveness: 85,
        used: false,
      },
      {
        id: 'zara_compliment_2',
        characterId: 'zara',
        category: 'compliment',
        message:
          'The way you carry yourself with such strength and confidence is really attractive.',
        context: {
          requiredAffection: 25,
          characterPersonality: ['confident'],
        },
        effectiveness: 78,
        used: false,
      },
    ],
    question: [
      {
        id: 'zara_question_1',
        characterId: 'zara',
        category: 'question',
        message:
          "What's the most challenging battle you've ever faced, and how did you overcome it?",
        context: {
          requiredAffection: 15,
          basedOnInterest: 'combat training',
        },
        effectiveness: 82,
        used: false,
      },
      {
        id: 'zara_question_2',
        characterId: 'zara',
        category: 'question',
        message:
          'Do you ever find it difficult to balance your warrior life with your personal relationships?',
        context: {
          requiredAffection: 40,
          characterPersonality: ['warrior', 'complex'],
        },
        effectiveness: 88,
        used: false,
      },
    ],
    shared_interest: [
      {
        id: 'zara_interest_1',
        characterId: 'zara',
        category: 'shared_interest',
        message:
          "I've been thinking about taking up combat training myself. Would you be willing to teach me some basics?",
        context: {
          requiredAffection: 20,
          basedOnInterest: 'combat training',
        },
        effectiveness: 90,
        used: false,
      },
    ],
    humor: [
      {
        id: 'zara_humor_1',
        characterId: 'zara',
        category: 'humor',
        message:
          'I bet you could take on a whole army with just a stern look and that impressive stance of yours!',
        context: {
          requiredAffection: 30,
          basedOnMood: 'cheerful',
        },
        effectiveness: 75,
        used: false,
      },
    ],
    observation: [
      {
        id: 'zara_observation_1',
        characterId: 'zara',
        category: 'observation',
        message:
          "I notice you're always so focused during training. Your dedication is really inspiring.",
        context: {
          requiredAffection: 5,
          timeOfDay: 'morning',
        },
        effectiveness: 70,
        used: false,
      },
    ],
    cultural_exchange: [
      {
        id: 'zara_culture_1',
        characterId: 'zara',
        category: 'cultural_exchange',
        message:
          "I'd love to learn more about Zelarian warrior traditions. Are there any customs I should know about?",
        context: {
          requiredAffection: 35,
          characterPersonality: ['traditional'],
        },
        effectiveness: 85,
        used: false,
      },
    ],
  },
  kai: {
    compliment: [
      {
        id: 'kai_compliment_1',
        characterId: 'kai',
        category: 'compliment',
        message:
          'Your analytical mind is fascinating. The way you approach problems with such logical precision is really impressive.',
        context: {
          requiredAffection: 10,
          characterPersonality: ['logical', 'analytical'],
        },
        effectiveness: 88,
        used: false,
      },
      {
        id: 'kai_compliment_2',
        characterId: 'kai',
        category: 'compliment',
        message:
          'I admire how you can find patterns and solutions that others miss. Your intelligence is quite attractive.',
        context: {
          requiredAffection: 25,
          characterPersonality: ['intelligent'],
        },
        effectiveness: 82,
        used: false,
      },
    ],
    question: [
      {
        id: 'kai_question_1',
        characterId: 'kai',
        category: 'question',
        message:
          "What's the most elegant algorithm or solution you've ever developed?",
        context: {
          requiredAffection: 15,
          basedOnInterest: 'technology',
        },
        effectiveness: 85,
        used: false,
      },
      {
        id: 'kai_question_2',
        characterId: 'kai',
        category: 'question',
        message:
          "How do you process emotions alongside your logical thinking? I'm curious about your internal algorithms.",
        context: {
          requiredAffection: 45,
          characterPersonality: ['logical', 'emotional_complexity'],
        },
        effectiveness: 92,
        used: false,
      },
    ],
    shared_interest: [
      {
        id: 'kai_interest_1',
        characterId: 'kai',
        category: 'shared_interest',
        message:
          "I've been working on a complex problem and could use your analytical perspective. Want to collaborate?",
        context: {
          requiredAffection: 20,
          basedOnInterest: 'problem_solving',
        },
        effectiveness: 90,
        used: false,
      },
    ],
    humor: [
      {
        id: 'kai_humor_1',
        characterId: 'kai',
        category: 'humor',
        message:
          'I bet your brain runs on the most efficient emotional processing algorithms in the galaxy!',
        context: {
          requiredAffection: 30,
          basedOnMood: 'analytical',
        },
        effectiveness: 78,
        used: false,
      },
    ],
    observation: [
      {
        id: 'kai_observation_1',
        characterId: 'kai',
        category: 'observation',
        message:
          'I notice how you pause to process information before responding. It shows real thoughtfulness.',
        context: {
          requiredAffection: 5,
          timeOfDay: 'afternoon',
        },
        effectiveness: 72,
        used: false,
      },
    ],
    cultural_exchange: [
      {
        id: 'kai_culture_1',
        characterId: 'kai',
        category: 'cultural_exchange',
        message:
          "How do Andromedans integrate logic and emotion in your society? I'm fascinated by your dual nature.",
        context: {
          requiredAffection: 35,
          characterPersonality: ['cultural'],
        },
        effectiveness: 87,
        used: false,
      },
    ],
  },
  nova: {
    compliment: [
      {
        id: 'nova_compliment_1',
        characterId: 'nova',
        category: 'compliment',
        message:
          'Your artistic vision is absolutely breathtaking. You see beauty in ways that completely enchant me.',
        context: {
          requiredAffection: 10,
          basedOnInterest: 'art',
        },
        effectiveness: 90,
        used: false,
      },
      {
        id: 'nova_compliment_2',
        characterId: 'nova',
        category: 'compliment',
        message:
          'When you light up talking about your passions, you become even more radiant than usual.',
        context: {
          requiredAffection: 25,
          basedOnMood: 'excited',
        },
        effectiveness: 85,
        used: false,
      },
    ],
    question: [
      {
        id: 'nova_question_1',
        characterId: 'nova',
        category: 'question',
        message:
          "What inspires your art the most? I'd love to understand your creative process.",
        context: {
          requiredAffection: 15,
          basedOnInterest: 'creative_expression',
        },
        effectiveness: 88,
        used: false,
      },
      {
        id: 'nova_question_2',
        characterId: 'nova',
        category: 'question',
        message:
          'Do you ever feel like your emotions are too intense for others to understand?',
        context: {
          requiredAffection: 40,
          characterPersonality: ['sensitive', 'emotional'],
        },
        effectiveness: 92,
        used: false,
      },
    ],
    shared_interest: [
      {
        id: 'nova_interest_1',
        characterId: 'nova',
        category: 'shared_interest',
        message:
          "I'd love to create something beautiful together. Maybe you could teach me about your artistic techniques?",
        context: {
          requiredAffection: 20,
          basedOnInterest: 'art',
        },
        effectiveness: 94,
        used: false,
      },
    ],
    humor: [
      {
        id: 'nova_humor_1',
        characterId: 'nova',
        category: 'humor',
        message:
          'I think you could make even a grocery list sound like beautiful poetry!',
        context: {
          requiredAffection: 30,
          basedOnMood: 'cheerful',
        },
        effectiveness: 80,
        used: false,
      },
    ],
    observation: [
      {
        id: 'nova_observation_1',
        characterId: 'nova',
        category: 'observation',
        message:
          'I love watching you work on your art. The concentration and passion in your expression is captivating.',
        context: {
          requiredAffection: 5,
          timeOfDay: 'evening',
        },
        effectiveness: 78,
        used: false,
      },
    ],
    cultural_exchange: [
      {
        id: 'nova_culture_1',
        characterId: 'nova',
        category: 'cultural_exchange',
        message:
          "What role does art play in Lunarian culture? I'd love to experience your world through your eyes.",
        context: {
          requiredAffection: 35,
          characterPersonality: ['artistic', 'cultural'],
        },
        effectiveness: 89,
        used: false,
      },
    ],
  },
  // Continue with other characters...
  astra: {
    compliment: [
      {
        id: 'astra_compliment_1',
        characterId: 'astra',
        category: 'compliment',
        message:
          'Your energy is absolutely infectious! You make everything seem like an exciting adventure.',
        context: {
          requiredAffection: 10,
          characterPersonality: ['energetic', 'adventurous'],
        },
        effectiveness: 85,
        used: false,
      },
    ],
    question: [
      {
        id: 'astra_question_1',
        characterId: 'astra',
        category: 'question',
        message:
          "What's the wildest adventure you've ever been on? I bet it's an amazing story!",
        context: {
          requiredAffection: 15,
          basedOnInterest: 'adventure',
        },
        effectiveness: 88,
        used: false,
      },
    ],
    shared_interest: [
      {
        id: 'astra_interest_1',
        characterId: 'astra',
        category: 'shared_interest',
        message:
          'Want to try something totally crazy and fun together? I have some wild ideas!',
        context: {
          requiredAffection: 20,
          basedOnInterest: 'thrill_seeking',
        },
        effectiveness: 92,
        used: false,
      },
    ],
    humor: [
      {
        id: 'astra_humor_1',
        characterId: 'astra',
        category: 'humor',
        message:
          'I bet you could turn waiting in line into an extreme sport somehow!',
        context: {
          requiredAffection: 30,
          basedOnMood: 'excited',
        },
        effectiveness: 82,
        used: false,
      },
    ],
    observation: [
      {
        id: 'astra_observation_1',
        characterId: 'astra',
        category: 'observation',
        message:
          "You never seem to run out of energy! It's like you have your own personal power core.",
        context: {
          requiredAffection: 5,
          timeOfDay: 'morning',
        },
        effectiveness: 75,
        used: false,
      },
    ],
    cultural_exchange: [
      {
        id: 'astra_culture_1',
        characterId: 'astra',
        category: 'cultural_exchange',
        message:
          'Are all Stellarians as adventurous as you? Your culture must be incredibly exciting!',
        context: {
          requiredAffection: 35,
          characterPersonality: ['adventurous'],
        },
        effectiveness: 80,
        used: false,
      },
    ],
  },
  orion: {
    compliment: [
      {
        id: 'orion_compliment_1',
        characterId: 'orion',
        category: 'compliment',
        message:
          'Your wisdom and thoughtfulness bring such peace to my mind. You have a truly calming presence.',
        context: {
          requiredAffection: 10,
          characterPersonality: ['wise', 'calm'],
        },
        effectiveness: 87,
        used: false,
      },
    ],
    question: [
      {
        id: 'orion_question_1',
        characterId: 'orion',
        category: 'question',
        message:
          'What philosophical questions occupy your thoughts the most? I find your perspective fascinating.',
        context: {
          requiredAffection: 15,
          basedOnInterest: 'philosophy',
        },
        effectiveness: 90,
        used: false,
      },
    ],
    shared_interest: [
      {
        id: 'orion_interest_1',
        characterId: 'orion',
        category: 'shared_interest',
        message:
          "I'd love to meditate or contemplate life's mysteries with you sometime.",
        context: {
          requiredAffection: 20,
          basedOnInterest: 'meditation',
        },
        effectiveness: 85,
        used: false,
      },
    ],
    humor: [
      {
        id: 'orion_humor_1',
        characterId: 'orion',
        category: 'humor',
        message:
          'I think you could find profound meaning in watching paint dry!',
        context: {
          requiredAffection: 40,
          basedOnMood: 'neutral',
        },
        effectiveness: 70,
        used: false,
      },
    ],
    observation: [
      {
        id: 'orion_observation_1',
        characterId: 'orion',
        category: 'observation',
        message:
          'I admire how you always take time to really think before speaking. It shows great wisdom.',
        context: {
          requiredAffection: 5,
          timeOfDay: 'evening',
        },
        effectiveness: 82,
        used: false,
      },
    ],
    cultural_exchange: [
      {
        id: 'orion_culture_1',
        characterId: 'orion',
        category: 'cultural_exchange',
        message:
          "How do Voidborn approach the concept of inner peace? I'd love to learn from your traditions.",
        context: {
          requiredAffection: 35,
          characterPersonality: ['philosophical'],
        },
        effectiveness: 88,
        used: false,
      },
    ],
  },
  luna: {
    compliment: [
      {
        id: 'luna_compliment_1',
        characterId: 'luna',
        category: 'compliment',
        message:
          'Your caring nature and warm spirit make everyone around you feel valued and loved.',
        context: {
          requiredAffection: 10,
          characterPersonality: ['caring', 'warm'],
        },
        effectiveness: 89,
        used: false,
      },
    ],
    question: [
      {
        id: 'luna_question_1',
        characterId: 'luna',
        category: 'question',
        message:
          'How do you always know exactly what people need to feel better? You have such an intuitive gift.',
        context: {
          requiredAffection: 15,
          basedOnInterest: 'helping_others',
        },
        effectiveness: 86,
        used: false,
      },
    ],
    shared_interest: [
      {
        id: 'luna_interest_1',
        characterId: 'luna',
        category: 'shared_interest',
        message:
          "I'd love to help you with your healing work. Maybe we could help others together?",
        context: {
          requiredAffection: 20,
          basedOnInterest: 'healing',
        },
        effectiveness: 92,
        used: false,
      },
    ],
    humor: [
      {
        id: 'luna_humor_1',
        characterId: 'luna',
        category: 'humor',
        message:
          'I think you could probably heal a broken heart just with one of your amazing hugs!',
        context: {
          requiredAffection: 30,
          basedOnMood: 'cheerful',
        },
        effectiveness: 83,
        used: false,
      },
    ],
    observation: [
      {
        id: 'luna_observation_1',
        characterId: 'luna',
        category: 'observation',
        message:
          "I love how your eyes light up when you're helping someone. Your compassion is beautiful.",
        context: {
          requiredAffection: 5,
          timeOfDay: 'afternoon',
        },
        effectiveness: 85,
        used: false,
      },
    ],
    cultural_exchange: [
      {
        id: 'luna_culture_1',
        characterId: 'luna',
        category: 'cultural_exchange',
        message:
          "What healing traditions do Aureliaths practice? I'd love to learn about your culture's approach to wellness.",
        context: {
          requiredAffection: 35,
          characterPersonality: ['healing', 'cultural'],
        },
        effectiveness: 88,
        used: false,
      },
    ],
  },
};

export function getAvailableIcebreakers(
  characterId: string,
  currentAffection: number,
  characterMood: string,
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night'
): IcebreakerMessage[] {
  const characterTemplates = icebreakerTemplates[characterId];
  if (!characterTemplates) return [];

  const available: IcebreakerMessage[] = [];

  Object.values(characterTemplates).forEach(
    (categoryMessages: IcebreakerMessage[]) => {
      categoryMessages.forEach((message: IcebreakerMessage) => {
      if (
        !message.used &&
        currentAffection >= message.context.requiredAffection &&
        (!message.context.timeOfDay || message.context.timeOfDay === timeOfDay)
      ) {
        available.push(message);
      }
      });
    }
  );

  // Sort by effectiveness (highest first)
  return available.sort((a, b) => b.effectiveness - a.effectiveness);
}

export function generateContextualSuggestion(
  _characterId: string,
  _currentAffection: number,
  _recentInteractions: string[]
): string {
  const suggestions = [
    'Ask about their interests and hobbies',
    "Compliment something specific you've noticed about them",
    'Share a relevant personal experience',
    "Ask for their opinion on something you're curious about",
    'Suggest an activity you could do together',
    'Ask about their culture or background',
    'Make a lighthearted observation or joke',
    'Express genuine interest in their thoughts and feelings',
  ];

  return suggestions[Math.floor(Math.random() * suggestions.length)];
}
