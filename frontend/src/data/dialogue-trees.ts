import { DialogueTree, DialogueResponse, DialogueOption } from '../types/game';

// Kyra'then (Aviari) Dialogue Tree
export const KYRATHEN_DIALOGUE: DialogueTree = {
  id: 'kyrathen_main',
  characterId: 'kyrathen',
  rootOptions: [
    {
      id: 'greeting_kyrathen',
      text: "Greetings, noble chieftain. The sky calls to you today.",
      topic: 'greeting',
      emotion: 'happy',
      nextOptions: ['kyrathen_greeting_response']
    },
    {
      id: 'honor_talk',
      text: "Tell me about the warrior's code you follow.",
      topic: 'interests',
      emotion: 'thoughtful',
      nextOptions: ['kyrathen_honor_deep', 'kyrathen_honor_simple']
    },
    {
      id: 'flirt_wings',
      text: "Your wings are magnificent. I'd love to soar through the clouds with you.",
      topic: 'flirt',
      emotion: 'flirty',
      requiresAffection: 20,
      nextOptions: ['kyrathen_flirt_honored', 'kyrathen_flirt_proud']
    },
    {
      id: 'tribe_history',
      text: "What was it like uniting the scattered sky tribes?",
      topic: 'backstory',
      emotion: 'thoughtful',
      requiresAffection: 15,
      nextOptions: ['kyrathen_history_challenges', 'kyrathen_history_victories']
    }
  ],
  branches: {
    kyrathen_greeting_response: [
      {
        id: 'compliment_wisdom',
        text: "Your leadership inspires me.",
        topic: 'compliment',
        emotion: 'thoughtful'
      },
      {
        id: 'ask_day',
        text: "How fares your tribe today?",
        topic: 'general',
        emotion: 'neutral'
      }
    ],
    kyrathen_honor_deep: [
      {
        id: 'philosophical_honor',
        text: "Does honor ever conflict with pragmatism in leadership?",
        topic: 'philosophy',
        emotion: 'thoughtful',
        requiresAffection: 30
      }
    ],
    kyrathen_flirt_honored: [
      {
        id: 'continue_flirt',
        text: "Perhaps you could teach me the ancient flight dances?",
        topic: 'romantic',
        emotion: 'flirty'
      }
    ],
    kyrathen_history_challenges: [
      {
        id: 'respect_struggles',
        text: "Your perseverance through those challenges shows true strength.",
        topic: 'empathy',
        emotion: 'thoughtful'
      }
    ]
  }
};

// Seraphina (Mystari) Dialogue Tree
export const SERAPHINA_DIALOGUE: DialogueTree = {
  id: 'seraphina_main',
  characterId: 'seraphina',
  rootOptions: [
    {
      id: 'greeting_seraphina',
      text: "Oracle, your wisdom brings peace to my spirit.",
      topic: 'greeting',
      emotion: 'thoughtful',
      nextOptions: ['seraphina_greeting_response']
    },
    {
      id: 'visions_talk',
      text: "What do you see when you peer across dimensions?",
      topic: 'interests',
      emotion: 'thoughtful',
      nextOptions: ['seraphina_visions_deep', 'seraphina_visions_gentle']
    },
    {
      id: 'flirt_mystical',
      text: "Your ethereal beauty transcends dimensions.",
      topic: 'flirt',
      emotion: 'flirty',
      requiresAffection: 25,
      nextOptions: ['seraphina_flirt_touched', 'seraphina_flirt_mysterious']
    },
    {
      id: 'meditation_request',
      text: "Would you guide me in dimensional meditation?",
      topic: 'spiritual',
      emotion: 'thoughtful',
      requiresAffection: 15,
      nextOptions: ['seraphina_meditation_yes', 'seraphina_meditation_prepare']
    }
  ],
  branches: {
    seraphina_greeting_response: [
      {
        id: 'ask_visions',
        text: "Have your visions shown you anything about our connection?",
        topic: 'romantic',
        emotion: 'flirty',
        requiresAffection: 30
      },
      {
        id: 'temple_life',
        text: "Tell me about life in the Blue Temples.",
        topic: 'general',
        emotion: 'neutral'
      }
    ],
    seraphina_visions_deep: [
      {
        id: 'philosophical_time',
        text: "Do you believe we can change what you've seen?",
        topic: 'philosophy',
        emotion: 'thoughtful',
        requiresAffection: 35
      }
    ],
    seraphina_meditation_yes: [
      {
        id: 'deeper_connection',
        text: "I feel our spirits connecting across the void.",
        topic: 'romantic',
        emotion: 'flirty'
      }
    ]
  }
};

// Thessarian (Sylvani) Dialogue Tree
export const THESSARIAN_DIALOGUE: DialogueTree = {
  id: 'thessarian_main',
  characterId: 'thessarian',
  rootOptions: [
    {
      id: 'greeting_thessarian',
      text: "Doctor, your research fascinates me.",
      topic: 'greeting',
      emotion: 'thoughtful',
      nextOptions: ['thessarian_greeting_response']
    },
    {
      id: 'biotech_talk',
      text: "Tell me about your latest biotechnology breakthrough.",
      topic: 'interests',
      emotion: 'excited',
      nextOptions: ['thessarian_science_deep', 'thessarian_ethics']
    },
    {
      id: 'flirt_science',
      text: "You've engineered something beautiful... yourself.",
      topic: 'flirt',
      emotion: 'flirty',
      requiresAffection: 20,
      nextOptions: ['thessarian_flirt_analytical', 'thessarian_flirt_flustered']
    }
  ],
  branches: {
    thessarian_greeting_response: [
      {
        id: 'research_ethics',
        text: "How do you balance innovation with ethical responsibility?",
        topic: 'philosophy',
        emotion: 'thoughtful',
        requiresAffection: 25
      }
    ],
    thessarian_science_deep: [
      {
        id: 'collaboration',
        text: "Would you be interested in collaborative research?",
        topic: 'romantic',
        emotion: 'hopeful',
        requiresAffection: 30
      }
    ]
  }
};

export const DIALOGUE_RESPONSES: Record<string, DialogueResponse> = {
  // Kyra'then responses
  greeting_kyrathen: {
    text: "*Kyra'then's feathers rustle with dignified approval* Your words honor me, friend. The winds carry your respect, and I am grateful for your presence.",
    emotion: 'happy',
    affectionChange: 2
  },
  honor_talk: {
    text: "*His eyes gleam with ancient wisdom* The warrior's code is not just about strength in battle, but strength of character. Honor guides us when the path grows dark, and loyalty binds us when others would scatter.",
    emotion: 'thoughtful',
    affectionChange: 3
  },
  flirt_wings: {
    text: "*Kyra'then spreads his magnificent wings slightly, a hint of warmth in his noble gaze* Your words stir something in my heart. Perhaps... yes, I would be honored to share the sky with you.",
    emotion: 'flirty',
    affectionChange: 5,
    consequence: "Kyra'then seems more open to romantic advances"
  },
  tribe_history: {
    text: "*His expression grows distant with memory* It was not conquest but understanding that united us. Each tribe had their pride, their traditions. I learned to speak not with authority, but with respect for their ancient ways.",
    emotion: 'thoughtful',
    affectionChange: 4
  },

  // Seraphina responses
  greeting_seraphina: {
    text: "*Seraphina's ethereal form shimmers softly* Your spirit calls out across the dimensional veil. I sense harmony in your presence... welcome, traveler of hearts.",
    emotion: 'happy',
    affectionChange: 2
  },
  visions_talk: {
    text: "*Her eyes glow with otherworldly light* I see threads of possibility, streams of destiny flowing like cosmic rivers. Some paths lead to joy, others to sorrow... but all are beautiful in their complexity.",
    emotion: 'thoughtful',
    affectionChange: 3
  },
  flirt_mystical: {
    text: "*Seraphina's ethereal glow intensifies, a faint blush visible through her translucent features* Such earthly poetry for one who walks between worlds... you make my essence sing across dimensions.",
    emotion: 'flirty',
    affectionChange: 6,
    consequence: "Seraphina seems deeply moved by your words"
  },
  meditation_request: {
    text: "*She extends a luminous hand* Close your eyes and feel the pulse of reality itself. Together we shall explore the spaces between thoughts, between heartbeats, between souls...",
    emotion: 'thoughtful',
    affectionChange: 4,
    consequence: "You feel a deeper spiritual connection forming"
  },

  // Thessarian responses
  greeting_thessarian: {
    text: "*Dr. Thessarian adjusts their bio-luminescent markings with scientific precision* Greetings. Your presence has increased my emotional baseline by approximately 12.7%. A fascinating physiological response.",
    emotion: 'neutral',
    affectionChange: 2
  },
  biotech_talk: {
    text: "*Their eyes light up with passion* Biotechnology is the bridge between organic evolution and conscious design. We can enhance, adapt, even transcend our biological limitations while preserving our essential nature.",
    emotion: 'excited',
    affectionChange: 3
  },
  flirt_science: {
    text: "*Thessarian's bio-markings pulse in a rhythmic pattern* Your words trigger unexpected neurochemical cascades in my system. Most... intriguing. I believe I require further study of this phenomenon.",
    emotion: 'surprised',
    affectionChange: 4,
    consequence: "Thessarian seems scientifically curious about romance"
  },

  // Lyralynn responses
  greeting_lyralynn: {
    text: "*Lyralynn's petals shimmer with a soft golden light* Your words are like gentle rainfall on parched earth. Thank you, dear one, for bringing such warmth to my grove.",
    emotion: 'happy',
    affectionChange: 2
  },
  nature_connection: {
    text: "*She extends a vine-like appendage to touch a nearby flower* We are all connected through root and branch, through soil and sky. Every living thing shares the same cosmic heartbeat... including you.",
    emotion: 'thoughtful',
    affectionChange: 3
  },
  flirt_garden: {
    text: "*Lyralynn's face blooms with a gentle blush, her bio-luminescent patterns dancing* Oh my... you make my chlorophyll sing! Your words are more nourishing than sunlight itself.",
    emotion: 'flirty',
    affectionChange: 5,
    consequence: "Lyralynn seems to open up like a flower in spring"
  },
  healing_inquiry: {
    text: "*Her expression grows tender* Yes, I can sense when hearts are wounded, just as I can feel the pain of a withered leaf. Healing... it's about understanding what each soul truly needs to flourish.",
    emotion: 'thoughtful',
    affectionChange: 4,
    consequence: "Lyralynn's empathic nature touches your heart"
  },

  // Zarantha responses
  greeting_zarantha: {
    text: "*Commander Zarantha's scales gleam as she stands at attention* Your respect is noted and appreciated. In my culture, honor recognizes honor. You carry yourself with dignity.",
    emotion: 'happy',
    affectionChange: 2
  },
  military_strategy: {
    text: "*Her eyes gleam with tactical pride* The Battle of the Crimson Nebula. Outnumbered 3 to 1, we used the gravitational anomalies as weapons. Victory through superior planning, not just firepower.",
    emotion: 'excited',
    affectionChange: 3
  },
  flirt_strength: {
    text: "*Zarantha's expression shifts from surprise to intrigue* Interesting... most focus only on the physical. You see deeper than surface appearances. This... this is a quality I value highly.",
    emotion: 'surprised',
    affectionChange: 6,
    consequence: "Zarantha begins to see you as an intellectual equal"
  },
  leadership_challenge: {
    text: "*She considers your words carefully* True leadership isn't about instilling fear—it's about earning such complete trust that others follow you into the void itself. Fear fades. Respect endures.",
    emotion: 'thoughtful',
    affectionChange: 4,
    consequence: "Zarantha shares her leadership philosophy with you"
  },

  // Thalassos responses
  greeting_thalassos: {
    text: "*High Priest Thalassos bows his head in acknowledgment* And may the tides carry your burdens away. Your respect for the ancient ways honors both of us.",
    emotion: 'happy',
    affectionChange: 2
  },
  ocean_wisdom: {
    text: "*His eyes gleam like deep ocean currents* The depths teach patience, adaptation, and the flow of all things. What appears turbulent on the surface often masks profound tranquility below. We must learn to dive deeper.",
    emotion: 'thoughtful',
    affectionChange: 3
  },
  flirt_depths: {
    text: "*Thalassos' expression grows warm, his bio-luminescent patterns pulsing gently* Your words stir currents in my soul I thought had grown still. Perhaps... the deepest waters have room for two.",
    emotion: 'surprised',
    affectionChange: 5,
    consequence: "Thalassos begins to see romantic potential in your connection"
  },

  // Nightshade responses
  greeting_nightshade: {
    text: "*Nightshade's form solidifies slightly, a rare sign of trust* Comfort... yes. Few understand that shadows can offer sanctuary as well as concealment. Your perception... is unusual.",
    emotion: 'thoughtful',
    affectionChange: 2
  },
  shadow_arts: {
    text: "*They gesture to the interplay of light and darkness around you* Balance is everything. Too much light blinds, too much shadow conceals truth. I walk the line between, protecting both from excess.",
    emotion: 'thoughtful',
    affectionChange: 3
  },
  flirt_mysterious: {
    text: "*Nightshade's form flickers with surprise, then stabilizes with what might be vulnerability* Mystery... is often loneliness wearing a mask. You see through veils others fear to lift. This is... unexpected.",
    emotion: 'surprised',
    affectionChange: 6,
    consequence: "Nightshade lowers their emotional guard around you"
  },

  // Kronos responses
  greeting_kronos: {
    text: "*Dr. Kronos' bio-cybernetic tentacles shimmer with neural activity* Fascinating... your presence triggers unexpected synaptic cascades in my enhanced neural matrix. A most intriguing phenomenon worth studying.",
    emotion: 'excited',
    affectionChange: 2
  },
  consciousness_question: {
    text: "*His multiple brains process simultaneously* Consciousness is the universe becoming aware of itself through neural complexity. But the mystery deepens when two conscious minds resonate... creating something greater than the sum of their parts.",
    emotion: 'thoughtful',
    affectionChange: 3
  },
  flirt_mind: {
    text: "*Kronos' neural implants pulse with warm light* Extraordinary... you've triggered a cascade of neurochemical responses I've never documented before. Your effect on my consciousness is... profoundly beautiful.",
    emotion: 'surprised',
    affectionChange: 5,
    consequence: "Kronos becomes fascinated by his emotional responses to you"
  },
  enhancement_ethics: {
    text: "*His expression grows complex, multiple thought processes visible* Ethics... yes. Every enhancement carries responsibility. But emotional connections like ours? They enhance us naturally, making us more than we were alone.",
    emotion: 'thoughtful',
    affectionChange: 4,
    consequence: "Kronos shares his deeper philosophical concerns with you"
  },
  neural_link_offer: {
    text: "*Kronos' excitement is palpable, his neural interfaces glowing* The ultimate intimacy... to share consciousness directly, to know each other's thoughts and feelings without barriers. Yes... I would be honored to forge that connection with you.",
    emotion: 'excited',
    affectionChange: 7,
    consequence: "Kronos offers to create a unique neural bond between you"
  }
};

// Lyralynn (Florani) Dialogue Tree
export const LYRALYNN_DIALOGUE: DialogueTree = {
  id: 'lyralynn_main',
  characterId: 'lyralynn',
  rootOptions: [
    {
      id: 'greeting_lyralynn',
      text: "Hello, beautiful guardian of the forest.",
      topic: 'greeting',
      emotion: 'happy',
      nextOptions: ['lyralynn_greeting_response']
    },
    {
      id: 'nature_connection',
      text: "Tell me about your bond with the plants around us.",
      topic: 'interests',
      emotion: 'thoughtful',
      nextOptions: ['lyralynn_nature_deep', 'lyralynn_nature_simple']
    },
    {
      id: 'flirt_garden',
      text: "You've cultivated something beautiful... and I don't just mean your garden.",
      topic: 'flirt',
      emotion: 'flirty',
      requiresAffection: 20,
      nextOptions: ['lyralynn_flirt_blushing', 'lyralynn_flirt_shy']
    },
    {
      id: 'healing_inquiry',
      text: "I've heard you can heal both plants and hearts. Is that true?",
      topic: 'backstory',
      emotion: 'thoughtful',
      requiresAffection: 15,
      nextOptions: ['lyralynn_healing_story', 'lyralynn_healing_modest']
    }
  ],
  branches: {
    lyralynn_greeting_response: [
      {
        id: 'forest_blessing',
        text: "May I receive a blessing from the forest spirits?",
        topic: 'spiritual',
        emotion: 'thoughtful',
        requiresAffection: 25
      }
    ],
    lyralynn_nature_deep: [
      {
        id: 'symbiosis_question',
        text: "Do you think we could achieve that kind of symbiosis together?",
        topic: 'romantic',
        emotion: 'hopeful',
        requiresAffection: 35
      }
    ]
  }
};

// Zarantha (Draconi) Dialogue Tree
export const ZARANTHA_DIALOGUE: DialogueTree = {
  id: 'zarantha_main',
  characterId: 'zarantha',
  rootOptions: [
    {
      id: 'greeting_zarantha',
      text: "Commander, your presence commands respect.",
      topic: 'greeting',
      emotion: 'thoughtful',
      nextOptions: ['zarantha_greeting_response']
    },
    {
      id: 'military_strategy',
      text: "What's your greatest military achievement?",
      topic: 'interests',
      emotion: 'thoughtful',
      nextOptions: ['zarantha_victory_story', 'zarantha_humble_response']
    },
    {
      id: 'flirt_strength',
      text: "Your strength is captivating, but your intelligence is what truly draws me in.",
      topic: 'flirt',
      emotion: 'flirty',
      requiresAffection: 25,
      nextOptions: ['zarantha_flirt_impressed', 'zarantha_flirt_challenged']
    },
    {
      id: 'leadership_challenge',
      text: "How do you balance being feared and being respected?",
      topic: 'backstory',
      emotion: 'thoughtful',
      requiresAffection: 20,
      nextOptions: ['zarantha_wisdom_share', 'zarantha_deflect']
    }
  ],
  branches: {
    zarantha_greeting_response: [
      {
        id: 'tactical_discussion',
        text: "I'd love to hear your thoughts on advanced battle tactics.",
        topic: 'intellectual',
        emotion: 'excited',
        requiresAffection: 15
      }
    ],
    zarantha_flirt_impressed: [
      {
        id: 'partnership_hint',
        text: "Perhaps we could form... a strategic alliance?",
        topic: 'romantic',
        emotion: 'flirty',
        requiresAffection: 40
      }
    ]
  }
};

// Thalassos (Aquari) Dialogue Tree
export const THALASSOS_DIALOGUE: DialogueTree = {
  id: 'thalassos_main',
  characterId: 'thalassos',
  rootOptions: [
    {
      id: 'greeting_thalassos',
      text: "High Priest, may the depths bring you peace.",
      topic: 'greeting',
      emotion: 'thoughtful',
      nextOptions: ['thalassos_greeting_response']
    },
    {
      id: 'ocean_wisdom',
      text: "What ancient wisdom do the deep waters hold?",
      topic: 'interests',
      emotion: 'thoughtful',
      nextOptions: ['thalassos_wisdom_deep', 'thalassos_wisdom_simple']
    },
    {
      id: 'flirt_depths',
      text: "Your wisdom runs as deep as the oceans you serve.",
      topic: 'flirt',
      emotion: 'flirty',
      requiresAffection: 30,
      nextOptions: ['thalassos_flirt_honored', 'thalassos_flirt_contemplative']
    }
  ],
  branches: {
    thalassos_greeting_response: [
      {
        id: 'spiritual_guidance',
        text: "I seek guidance for my troubled spirit.",
        topic: 'spiritual',
        emotion: 'thoughtful',
        requiresAffection: 20
      }
    ]
  }
};

// Nightshade (Umbra) Dialogue Tree
export const NIGHTSHADE_DIALOGUE: DialogueTree = {
  id: 'nightshade_main',
  characterId: 'nightshade',
  rootOptions: [
    {
      id: 'greeting_nightshade',
      text: "Shadow walker, your presence is both mystery and comfort.",
      topic: 'greeting',
      emotion: 'thoughtful',
      nextOptions: ['nightshade_greeting_response']
    },
    {
      id: 'shadow_arts',
      text: "Tell me about the balance between light and shadow.",
      topic: 'interests',
      emotion: 'thoughtful',
      nextOptions: ['nightshade_balance_philosophy']
    },
    {
      id: 'flirt_mysterious',
      text: "You intrigue me more than any mystery I've encountered.",
      topic: 'flirt',
      emotion: 'flirty',
      requiresAffection: 25,
      nextOptions: ['nightshade_flirt_intrigued', 'nightshade_flirt_guarded']
    }
  ],
  branches: {
    nightshade_greeting_response: [
      {
        id: 'protection_offer',
        text: "Would you protect my heart as you protect the dimensions?",
        topic: 'romantic',
        emotion: 'hopeful',
        requiresAffection: 35
      }
    ]
  }
};

// Kronos (Cephalopi) Dialogue Tree
export const KRONOS_DIALOGUE: DialogueTree = {
  id: 'kronos_main',
  characterId: 'kronos',
  rootOptions: [
    {
      id: 'greeting_kronos',
      text: "Doctor, your neural research fascinates me beyond measure.",
      topic: 'greeting',
      emotion: 'excited',
      nextOptions: ['kronos_greeting_response']
    },
    {
      id: 'consciousness_question',
      text: "What's your theory on the nature of consciousness itself?",
      topic: 'interests',
      emotion: 'thoughtful',
      nextOptions: ['kronos_consciousness_deep', 'kronos_consciousness_simple']
    },
    {
      id: 'flirt_mind',
      text: "You've enhanced more than neural pathways... you've captured my thoughts entirely.",
      topic: 'flirt',
      emotion: 'flirty',
      requiresAffection: 20,
      nextOptions: ['kronos_flirt_intrigued', 'kronos_flirt_analytical']
    },
    {
      id: 'enhancement_ethics',
      text: "Do you ever worry about the ethical implications of mental enhancement?",
      topic: 'backstory',
      emotion: 'thoughtful',
      requiresAffection: 15,
      nextOptions: ['kronos_ethics_complex', 'kronos_ethics_confident']
    },
    {
      id: 'neural_link_offer',
      text: "Would you be interested in establishing a neural connection between us?",
      topic: 'romantic',
      emotion: 'hopeful',
      requiresAffection: 40,
      nextOptions: ['kronos_link_excited', 'kronos_link_cautious']
    }
  ],
  branches: {
    kronos_greeting_response: [
      {
        id: 'research_collaboration',
        text: "Perhaps we could collaborate on understanding emotional neural patterns?",
        topic: 'intellectual',
        emotion: 'excited',
        requiresAffection: 25
      },
      {
        id: 'compliment_intellect',
        text: "Your mind operates on levels I can barely comprehend.",
        topic: 'compliment',
        emotion: 'thoughtful'
      }
    ],
    kronos_consciousness_deep: [
      {
        id: 'shared_consciousness',
        text: "Could two consciousness ever truly become one?",
        topic: 'romantic',
        emotion: 'flirty',
        requiresAffection: 35
      }
    ],
    kronos_flirt_intrigued: [
      {
        id: 'mental_connection',
        text: "I'd love to explore the neural pathways of attraction with you.",
        topic: 'romantic',
        emotion: 'flirty'
      }
    ],
    kronos_link_excited: [
      {
        id: 'intimate_connection',
        text: "Sharing thoughts and feelings directly... that's the ultimate intimacy.",
        topic: 'romantic',
        emotion: 'flirty'
      }
    ]
  }
};

export function getDialogueTree(characterId: string): DialogueTree | null {
  switch (characterId) {
    case 'kyrathen':
      return KYRATHEN_DIALOGUE;
    case 'seraphina':
      return SERAPHINA_DIALOGUE;
    case 'thessarian':
      return THESSARIAN_DIALOGUE;
    case 'lyralynn':
      return LYRALYNN_DIALOGUE;
    case 'zarantha':
      return ZARANTHA_DIALOGUE;
    case 'thalassos':
      return THALASSOS_DIALOGUE;
    case 'nightshade':
      return NIGHTSHADE_DIALOGUE;
    case 'kronos':
      return KRONOS_DIALOGUE;
    default:
      return null;
  }
}

export function getDialogueResponse(optionId: string): DialogueResponse | null {
  return DIALOGUE_RESPONSES[optionId] || null;
}

// Generate contextual dialogue based on character mood and affection
export function getContextualDialogue(characterId: string, topic: string, mood: string, affection: number): DialogueResponse {
  const baseResponse = DIALOGUE_RESPONSES[`${topic}_${characterId}`];

  if (!baseResponse) {
    // Fallback generic responses
    const fallbackResponses: Record<string, DialogueResponse> = {
      greeting: {
        text: "Hello there! It's good to see you.",
        emotion: 'happy',
        affectionChange: 1
      },
      interests: {
        text: "I enjoy many things. Perhaps we could explore some interests together?",
        emotion: 'thoughtful',
        affectionChange: 2
      },
      flirt: affection >= 20 ? {
        text: "You're quite charming yourself.",
        emotion: 'flirty',
        affectionChange: 3
      } : {
        text: "That's... quite forward. Maybe we should get to know each other better first?",
        emotion: 'surprised',
        affectionChange: 0
      }
    };

    return fallbackResponses[topic] || {
      text: "That's an interesting topic.",
      emotion: 'neutral',
      affectionChange: 1
    };
  }

  // Modify response based on mood and affection
  const modifiedResponse = { ...baseResponse };

  if (mood === 'romantic' && topic === 'flirt') {
    modifiedResponse.affectionChange += 1;
  } else if (mood === 'melancholy' && topic !== 'comfort') {
    modifiedResponse.affectionChange = Math.max(0, modifiedResponse.affectionChange - 1);
  }

  return modifiedResponse;
}

// Advanced dialogue system with relationship-dependent options
export function getAvailableDialogueOptions(characterId: string, affection: number, mood: string): DialogueOption[] {
  const tree = getDialogueTree(characterId);
  if (!tree) return [];

  return tree.rootOptions.filter(option => {
    // Check affection requirements
    if (option.requiresAffection && affection < option.requiresAffection) {
      return false;
    }

    // Check mood requirements
    if (option.requiresMood && mood !== option.requiresMood) {
      return false;
    }

    return true;
  });
}

// Dialogue consequences that affect future interactions
export function processDialogueConsequence(consequence: string, _characterId?: string): string {
  const consequences: Record<string, string> = {
    "Kyra'then seems more open to romantic advances": "Kyra'then's traditional barriers are lowering. He trusts you more.",
    "Seraphina seems deeply moved by your words": "Seraphina's ethereal essence resonates with yours. A mystical bond is forming.",
    "Thessarian seems scientifically curious about romance": "Thessarian begins analyzing romantic interactions with scientific fascination.",
    "You feel a deeper spiritual connection forming": "The dimensional barriers between your souls grow thinner."
  };

  return consequences[consequence] || consequence;
}