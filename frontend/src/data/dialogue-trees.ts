import { DialogueTree, DialogueOption, DialogueResponse, EmotionType } from '../types/game';

// Zarath (Plantoid) Dialogue Tree
export const ZARATH_DIALOGUE: DialogueTree = {
  id: 'zarath_main',
  characterId: 'zarath',
  rootOptions: [
    {
      id: 'greeting_zarath',
      text: "Hello, Zara'thul. You look radiant today.",
      topic: 'greeting',
      emotion: 'happy',
      nextOptions: ['zarath_greeting_response']
    },
    {
      id: 'nature_talk',
      text: "Tell me about your connection to nature.",
      topic: 'interests',
      emotion: 'thoughtful',
      nextOptions: ['zarath_nature_deep', 'zarath_nature_simple']
    },
    {
      id: 'flirt_photosynthesis',
      text: "You must get your energy from the sun... because you're absolutely glowing.",
      topic: 'flirt',
      emotion: 'flirty',
      requiresAffection: 20,
      nextOptions: ['zarath_flirt_positive', 'zarath_flirt_shy']
    }
  ],
  branches: {
    zarath_greeting_response: [
      {
        id: 'compliment_wisdom',
        text: "Your wisdom always amazes me.",
        topic: 'compliment',
        emotion: 'thoughtful'
      },
      {
        id: 'ask_day',
        text: "How has your day been growing?",
        topic: 'general',
        emotion: 'neutral'
      }
    ],
    zarath_nature_deep: [
      {
        id: 'philosophical_nature',
        text: "Do you think all consciousness is connected through nature?",
        topic: 'philosophy',
        emotion: 'thoughtful',
        requiresAffection: 30
      }
    ],
    zarath_flirt_positive: [
      {
        id: 'continue_flirt',
        text: "I'd love to spend more time in your garden.",
        topic: 'romantic',
        emotion: 'flirty'
      }
    ]
  }
};

// Vel'nari (Humanoid) Dialogue Tree
export const VELNARI_DIALOGUE: DialogueTree = {
  id: 'velnari_main',
  characterId: 'velnari',
  rootOptions: [
    {
      id: 'greeting_velnari',
      text: "Captain! Ready for another adventure?",
      topic: 'greeting',
      emotion: 'excited',
      nextOptions: ['velnari_adventure_yes', 'velnari_adventure_maybe']
    },
    {
      id: 'leadership_question',
      text: "What's the most challenging mission you've led?",
      topic: 'backstory',
      emotion: 'thoughtful',
      nextOptions: ['velnari_serious_story', 'velnari_light_story']
    },
    {
      id: 'flirt_captain',
      text: "I'd follow you to the edge of the galaxy, Captain.",
      topic: 'flirt',
      emotion: 'flirty',
      requiresAffection: 25,
      nextOptions: ['velnari_flirt_confident', 'velnari_flirt_surprised']
    }
  ],
  branches: {
    velnari_adventure_yes: [
      {
        id: 'suggest_exploration',
        text: "Let's explore that nebula we talked about.",
        topic: 'adventure',
        emotion: 'excited'
      }
    ],
    velnari_serious_story: [
      {
        id: 'offer_support',
        text: "That must have been incredibly difficult. You're so strong.",
        topic: 'comfort',
        emotion: 'thoughtful'
      }
    ]
  }
};

export const DIALOGUE_RESPONSES: Record<string, DialogueResponse> = {
  // Zarath responses
  greeting_zarath: {
    text: "*Zara'thul's crystalline flowers shimmer as they turn toward you* Your presence brings warmth to my photosynthetic chambers. Thank you for the kind words.",
    emotion: 'happy',
    affectionChange: 2
  },
  nature_talk: {
    text: "*Their root-like feet shift gently* Nature flows through every fiber of my being. I am the soil, the sun, the endless cycle of growth and renewal. Would you like to understand this connection deeper?",
    emotion: 'thoughtful',
    affectionChange: 3
  },
  flirt_photosynthesis: {
    text: "*Zara'thul's bioluminescent patterns pulse with a warm golden light* Such poetry in your words... you make my chlorophyll sing with joy.",
    emotion: 'flirty',
    affectionChange: 5
  },

  // Vel'nari responses
  greeting_velnari: {
    text: "*Captain Vel'nari's blue skin shimmers with excitement* Always! The universe is vast and full of wonders waiting to be discovered. Your enthusiasm matches my own.",
    emotion: 'excited',
    affectionChange: 2
  },
  leadership_question: {
    text: "*Her expression grows serious* There was a time when we had to evacuate an entire colony before a stellar collapse. Every decision meant life or death. Leadership isn't about glory—it's about protecting those who trust you.",
    emotion: 'thoughtful',
    affectionChange: 4
  },
  flirt_captain: {
    text: "*Vel'nari's confident smile falters for just a moment, showing vulnerability* That... that means more to me than you know. The galaxy can be a lonely place for a captain.",
    emotion: 'surprised',
    affectionChange: 6
  }
};

export function getDialogueTree(characterId: string): DialogueTree | null {
  switch (characterId) {
    case 'zarath':
      return ZARATH_DIALOGUE;
    case 'velnari':
      return VELNARI_DIALOGUE;
    default:
      return null;
  }
}

export function getDialogueResponse(optionId: string): DialogueResponse | null {
  return DIALOGUE_RESPONSES[optionId] || null;
}