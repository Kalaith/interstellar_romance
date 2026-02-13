// Character storyline definitions and utilities

export interface StorylineEvent {
  id: string;
  characterId: string;
  requiredAffection: number;
  title: string;
  description: string;
  dialogue: string;
  unlocked: boolean;
  completed: boolean;
  choices?: StorylineChoice[];
  rewards?: StorylineReward[];
}

export interface StorylineChoice {
  id: string;
  text: string;
  consequence: string;
  affectionChange: number;
  unlockNext?: string; // ID of next storyline event
}

export interface StorylineReward {
  type: 'photo' | 'dialogue_option' | 'special_date' | 'character_insight';
  id: string;
  description: string;
}

// Kyra'then's Storyline - The Noble's Heart
export const kyrathenStoryline: StorylineEvent[] = [
  {
    id: 'kyrathen_story_1',
    characterId: 'kyrathen',
    requiredAffection: 15,
    title: 'The Weight of Leadership',
    description:
      "Kyra'then opens up about the challenges of uniting the sky tribes.",
    dialogue:
      "*Kyra'then gazes toward the horizon, his feathers ruffled by an unseen burden* You know, bringing the tribes together... it wasn't just about strategy. Each clan had lost so much to conflict. I had to prove that unity didn't mean losing their identity.",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'support_leadership',
        text: 'That must have taken incredible strength and wisdom.',
        consequence: "Kyra'then appreciates your understanding of his burden",
        affectionChange: 3,
        unlockNext: 'kyrathen_story_2',
      },
      {
        id: 'question_methods',
        text: 'How did you convince them you were different from other conquerors?',
        consequence: "Kyra'then respects your tactical thinking",
        affectionChange: 2,
        unlockNext: 'kyrathen_story_2',
      },
    ],
    rewards: [
      {
        type: 'character_insight',
        id: 'kyrathen_leadership_depth',
        description:
          'You understand the true depth of his leadership philosophy',
      },
    ],
  },
  {
    id: 'kyrathen_story_2',
    characterId: 'kyrathen',
    requiredAffection: 35,
    title: 'The Sacred Flight',
    description:
      "Kyra'then shares the significance of the ancient flight ceremonies.",
    dialogue:
      "*His eyes gleam with ancient memory* There is a ritual... the Sacred Flight. When two souls wish to bond, they dance together among the clouds. It's said that if their hearts truly match, the wind itself will carry them as one. I... I haven't performed this ritual in many years.",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'express_interest',
        text: 'I would be honored to learn this dance with you.',
        consequence:
          "Kyra'then is deeply moved by your willingness to embrace his traditions",
        affectionChange: 5,
        unlockNext: 'kyrathen_story_3',
      },
      {
        id: 'ask_about_past',
        text: 'Was there someone you performed this ritual with before?',
        consequence: "Kyra'then shares a painful memory from his past",
        affectionChange: 2,
      },
    ],
    rewards: [
      {
        type: 'special_date',
        id: 'sacred_flight_ceremony',
        description: 'Unlock the Sacred Flight date option',
      },
    ],
  },
  {
    id: 'kyrathen_story_3',
    characterId: 'kyrathen',
    requiredAffection: 60,
    title: "The Chieftain's Heart",
    description:
      "Kyra'then reveals his deepest fears about love and leadership.",
    dialogue:
      "*He spreads his wings protectively around you both* I've always believed a leader must sacrifice personal happiness for their people. But with you... I wonder if perhaps love and duty can coexist. You make me want to be more than just a chieftain.",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'love_and_duty',
        text: "Great leaders inspire not through sacrifice, but through showing others what's possible.",
        consequence: "Kyra'then realizes he can be both a leader and a lover",
        affectionChange: 7,
      },
      {
        id: 'support_sacrifice',
        text: 'I would never ask you to choose between me and your people.',
        consequence: "Kyra'then is touched by your selflessness",
        affectionChange: 5,
      },
    ],
    rewards: [
      {
        type: 'photo',
        id: 'kyrathen_private_moment',
        description: 'A tender moment showing his vulnerable side',
      },
    ],
  },
];

// Seraphina's Storyline - The Oracle's Vision
export const seraphinaStoryline: StorylineEvent[] = [
  {
    id: 'seraphina_story_1',
    characterId: 'seraphina',
    requiredAffection: 20,
    title: 'The Burden of Sight',
    description: 'Seraphina reveals the cost of her prophetic abilities.',
    dialogue:
      "*Her ethereal form flickers with melancholy* To see across dimensions is both blessing and curse. I've witnessed countless possible futures... some filled with joy, others with sorrow. Sometimes I wonder if it's better to live without knowing what may come.",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'comfort_burden',
        text: 'The present moment with you is more important than any future.',
        consequence: 'Seraphina finds peace in your presence',
        affectionChange: 4,
        unlockNext: 'seraphina_story_2',
      },
      {
        id: 'ask_about_visions',
        text: 'Have you seen our future together?',
        consequence: 'Seraphina looks uncertain about revealing her visions',
        affectionChange: 2,
        unlockNext: 'seraphina_story_2',
      },
    ],
    rewards: [
      {
        type: 'character_insight',
        id: 'seraphina_prophetic_burden',
        description: 'You understand the weight of her gift',
      },
    ],
  },
  {
    id: 'seraphina_story_2',
    characterId: 'seraphina',
    requiredAffection: 40,
    title: 'The Dimensional Garden',
    description: 'Seraphina shows you a sacred place between worlds.',
    dialogue:
      '*She extends her luminous hand* Come with me to a place between dimensions. There, in the Void Garden, time moves differently. We can experience lifetimes together in moments, or single heartbeats that last eternities.',
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'accept_journey',
        text: 'I trust you to guide me through any dimension.',
        consequence: 'Your trust deepens your mystical connection',
        affectionChange: 6,
        unlockNext: 'seraphina_story_3',
      },
      {
        id: 'nervous_but_willing',
        text: 'It sounds overwhelming, but I want to experience it with you.',
        consequence: 'Seraphina appreciates your honesty about your fears',
        affectionChange: 3,
        unlockNext: 'seraphina_story_3',
      },
    ],
    rewards: [
      {
        type: 'special_date',
        id: 'dimensional_garden_visit',
        description: 'Unlock the Dimensional Garden date',
      },
    ],
  },
];

// Kronos's Storyline - The Mind's Heart
export const kronosStoryline: StorylineEvent[] = [
  {
    id: 'kronos_story_1',
    characterId: 'kronos',
    requiredAffection: 18,
    title: 'The Neural Paradox',
    description:
      'Kronos reveals a fascinating contradiction in his enhanced consciousness.',
    dialogue:
      "*Kronos gestures to his complex neural interfaces* You know, for all my enhancements and multiple processing cores, the most complex puzzle remains unsolved: emotion. Logic tells me love is merely neurochemical cascades, yet... when I'm with you, I feel something beyond data.",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'emotion_is_more',
        text: 'Maybe love is what makes consciousness truly beautiful.',
        consequence:
          'Kronos begins to see emotion as enhancement, not limitation',
        affectionChange: 4,
        unlockNext: 'kronos_story_2',
      },
      {
        id: 'analyze_together',
        text: 'Perhaps we could study this phenomenon together?',
        consequence: 'Kronos appreciates your scientific curiosity about love',
        affectionChange: 3,
        unlockNext: 'kronos_story_2',
      },
    ],
    rewards: [
      {
        type: 'character_insight',
        id: 'kronos_emotional_contradiction',
        description:
          'You understand the beautiful paradox of his enhanced yet vulnerable heart',
      },
    ],
  },
  {
    id: 'kronos_story_2',
    characterId: 'kronos',
    requiredAffection: 35,
    title: 'The Consciousness Experiment',
    description:
      'Kronos proposes a groundbreaking experiment in shared consciousness.',
    dialogue:
      "*His neural implants pulse with excitement* I've been developing something unprecedented... a temporary consciousness bridge. Two minds sharing experiences directly, feeling what the other feels. It's never been tested between species. Would you... would you be willing to be my first?",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'trust_experiment',
        text: "I trust you completely. Let's explore consciousness together.",
        consequence: 'Your trust creates an unprecedented neural bond',
        affectionChange: 6,
        unlockNext: 'kronos_story_3',
      },
      {
        id: 'nervous_but_willing',
        text: 'It sounds intense, but I want to understand your world.',
        consequence: 'Kronos is touched by your courage',
        affectionChange: 4,
        unlockNext: 'kronos_story_3',
      },
    ],
    rewards: [
      {
        type: 'special_date',
        id: 'consciousness_bridge_experience',
        description: 'Unlock the Consciousness Bridge date',
      },
    ],
  },
  {
    id: 'kronos_story_3',
    characterId: 'kronos',
    requiredAffection: 55,
    title: 'The Enhanced Heart',
    description:
      'Kronos makes a profound discovery about the nature of love and enhancement.',
    dialogue:
      "*After the consciousness bridge experience, Kronos' multiple neural cores pulse in perfect harmony* Remarkable... when our minds touched, I experienced something my enhancements never accounted for. Love isn't a limitation of biological consciousness—it's the ultimate enhancement. It makes us more than the sum of our neural networks.",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'love_enhancement',
        text: 'Love enhanced you just as your technology enhances your mind.',
        consequence:
          'Kronos realizes love is the most powerful upgrade possible',
        affectionChange: 8,
      },
      {
        id: 'beyond_technology',
        text: 'Some things are more powerful than any technology.',
        consequence: 'Kronos embraces the limits and beauty of natural emotion',
        affectionChange: 6,
      },
    ],
    rewards: [
      {
        type: 'photo',
        id: 'kronos_neural_harmony',
        description:
          'A beautiful moment showing his enhanced and natural selves in perfect balance',
      },
    ],
  },
];

// Thessarian's Storyline - The Ethical Engineer
export const thessarianStoryline: StorylineEvent[] = [
  {
    id: 'thessarian_story_1',
    characterId: 'thessarian',
    requiredAffection: 16,
    title: 'The Genetic Compatibility Question',
    description:
      'Thessarian reveals a personal project involving cross-species relationships.',
    dialogue:
      "*Dr. Thessarian's bio-luminescent markings pulse thoughtfully* I've been analyzing something fascinating... the genetic and biological compatibility between different species. Specifically, I've been studying... us. The data suggests remarkable adaptive potential.",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'encourage_research',
        text: 'Your research could help many inter-species couples.',
        consequence: 'Thessarian is inspired by your support of their work',
        affectionChange: 4,
        unlockNext: 'thessarian_story_2',
      },
      {
        id: 'personal_interest',
        text: "You've been studying us specifically?",
        consequence:
          'Thessarian admits their personal interest in your relationship',
        affectionChange: 5,
        unlockNext: 'thessarian_story_2',
      },
    ],
    rewards: [
      {
        type: 'character_insight',
        id: 'thessarian_research_passion',
        description: 'You understand how their scientific mind approaches love',
      },
    ],
  },
  {
    id: 'thessarian_story_2',
    characterId: 'thessarian',
    requiredAffection: 38,
    title: 'The Symbiosis Experiment',
    description: 'Thessarian proposes an unprecedented biological enhancement.',
    dialogue:
      "*Their excitement is barely contained* I've developed a temporary symbiotic enhancement... it would allow us to share biological processes, feel each other's heartbeats, synchronized breathing. It's never been tested between our species. Would you trust me enough to try?",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'complete_trust',
        text: "I trust your expertise completely. Let's discover what we could become.",
        consequence:
          'Your faith in them creates an unprecedented biological bond',
        affectionChange: 7,
        unlockNext: 'thessarian_story_3',
      },
      {
        id: 'cautious_yes',
        text: 'It sounds intense, but I want to experience your world.',
        consequence: 'Thessarian appreciates your courage and caution',
        affectionChange: 5,
        unlockNext: 'thessarian_story_3',
      },
    ],
    rewards: [
      {
        type: 'special_date',
        id: 'symbiosis_experience',
        description: 'Unlock the Biological Symbiosis date',
      },
    ],
  },
  {
    id: 'thessarian_story_3',
    characterId: 'thessarian',
    requiredAffection: 58,
    title: 'The Perfect Adaptation',
    description:
      'Thessarian makes a profound discovery about love and evolution.',
    dialogue:
      "*After the symbiosis experience, their bio-markings pulse in perfect harmony* Remarkable... the data shows something I never expected. Love isn't just compatible across species—it actively enhances biological adaptation. We're not just two beings coexisting; we're evolving together into something new.",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'evolution_together',
        text: "We're becoming something neither of us could be alone.",
        consequence: "Thessarian realizes love is evolution's greatest tool",
        affectionChange: 8,
      },
      {
        id: 'perfect_adaptation',
        text: "You've found the perfect research partner in every way.",
        consequence: 'Thessarian sees you as both lover and scientific equal',
        affectionChange: 6,
      },
    ],
    rewards: [
      {
        type: 'photo',
        id: 'thessarian_symbiosis_moment',
        description: 'A beautiful image of your biological harmony together',
      },
    ],
  },
];

// Lyralynn's Storyline - The Heart's Garden
export const lyralynnStoryline: StorylineEvent[] = [
  {
    id: 'lyralynn_story_1',
    characterId: 'lyralynn',
    requiredAffection: 14,
    title: 'The Wounded Heart',
    description:
      'Lyralynn reveals a past trauma affecting her ability to connect.',
    dialogue:
      "*Lyralynn's petals droop slightly* I must tell you something... I once loved deeply, but they couldn't understand my connection to the plant world. They called it unnatural, said I loved the garden more than them. The pain... it made my roots grow inward, protecting my heart like thorns.",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'healing_support',
        text: 'Your connection to nature is beautiful, not unnatural.',
        consequence:
          'Lyralynn begins to trust that you understand her true nature',
        affectionChange: 5,
        unlockNext: 'lyralynn_story_2',
      },
      {
        id: 'patient_love',
        text: "I'll be patient while your heart heals and blooms again.",
        consequence: 'Lyralynn is moved by your gentle understanding',
        affectionChange: 4,
        unlockNext: 'lyralynn_story_2',
      },
    ],
    rewards: [
      {
        type: 'character_insight',
        id: 'lyralynn_past_pain',
        description: 'You understand the source of her gentle caution',
      },
    ],
  },
  {
    id: 'lyralynn_story_2',
    characterId: 'lyralynn',
    requiredAffection: 36,
    title: 'The Sacred Grove',
    description: 'Lyralynn shares her most sacred space with you.',
    dialogue:
      "*She takes your hand with a vine-like tendril* There's a place... my Sacred Grove, where I go when I need healing. No one else has ever seen it. The plants there respond to emotions, blooming with joy, wilting with sorrow. Would you... would you like to see my heart's true garden?",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'honor_privilege',
        text: "I'm honored you'd share your most sacred place with me.",
        consequence: 'Your reverence for her sacred space deepens her trust',
        affectionChange: 6,
        unlockNext: 'lyralynn_story_3',
      },
      {
        id: 'promise_protection',
        text: "I promise to protect and cherish this gift you're giving me.",
        consequence: 'Lyralynn feels safe opening her heart completely',
        affectionChange: 7,
        unlockNext: 'lyralynn_story_3',
      },
    ],
    rewards: [
      {
        type: 'special_date',
        id: 'sacred_grove_visit',
        description: 'Unlock the Sacred Grove date',
      },
    ],
  },
  {
    id: 'lyralynn_story_3',
    characterId: 'lyralynn',
    requiredAffection: 52,
    title: 'The Bloom of New Love',
    description: "Lyralynn's heart finally opens completely.",
    dialogue:
      "*In the Sacred Grove, flowers bloom magnificently around you both* Look... the garden responds to us together. When I was hurt before, everything withered. But now... everything blooms brighter than ever. You've helped me learn that love doesn't diminish my connection to nature—it enhances it.",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'growing_together',
        text: "We're growing together, like two plants sharing the same soil.",
        consequence: 'Lyralynn embraces a love that nurtures both of you',
        affectionChange: 8,
      },
      {
        id: 'natural_love',
        text: 'This is what love should be—as natural as sunlight and rain.',
        consequence: 'Lyralynn finds peace in a love that feels truly natural',
        affectionChange: 7,
      },
    ],
    rewards: [
      {
        type: 'photo',
        id: 'lyralynn_garden_bloom',
        description: 'The Sacred Grove in full bloom, responding to your love',
      },
    ],
  },
];

// Zarantha's Storyline - The Commander's Vulnerability
export const zaranthaStoryline: StorylineEvent[] = [
  {
    id: 'zarantha_story_1',
    characterId: 'zarantha',
    requiredAffection: 22,
    title: 'The Weight of Command',
    description: 'Zarantha reveals the burden of always being the strongest.',
    dialogue:
      "*Commander Zarantha's scales dim slightly* You know what no one understands? Being strong all the time is exhausting. Everyone expects the dragon commander to never show weakness, never need support. But with you... I wonder what it would be like to let someone else be strong for once.",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'offer_strength',
        text: 'Let me be your strength when you need rest.',
        consequence: 'Zarantha begins to trust you with her vulnerabilities',
        affectionChange: 5,
        unlockNext: 'zarantha_story_2',
      },
      {
        id: 'admire_strength',
        text: 'Your strength inspires me, but your trust in me means even more.',
        consequence: 'Zarantha appreciates being seen as more than just strong',
        affectionChange: 4,
        unlockNext: 'zarantha_story_2',
      },
    ],
    rewards: [
      {
        type: 'character_insight',
        id: 'zarantha_hidden_vulnerability',
        description: 'You see past her armor to the heart beneath',
      },
    ],
  },
  {
    id: 'zarantha_story_2',
    characterId: 'zarantha',
    requiredAffection: 44,
    title: 'The Honor Duel',
    description:
      'Zarantha faces a challenge that tests her honor and your relationship.',
    dialogue:
      "*Her scales bristle with conflict* A rival commander has challenged my authority, claiming I've grown soft since... since I've been with you. Traditional law demands an honor duel. If I lose, my rank, my reputation... everything I've built could be stripped away. But if I win by being ruthless, will I lose the gentleness you've taught me?",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'strength_and_honor',
        text: 'True strength protects what matters. Fight with honor, not ruthlessness.',
        consequence:
          'Zarantha realizes she can be both strong and compassionate',
        affectionChange: 7,
        unlockNext: 'zarantha_story_3',
      },
      {
        id: 'support_choice',
        text: "Whatever you choose, I'll stand by you.",
        consequence: 'Zarantha draws strength from your unwavering support',
        affectionChange: 6,
        unlockNext: 'zarantha_story_3',
      },
    ],
    rewards: [
      {
        type: 'special_date',
        id: 'honor_duel_witness',
        description: "Witness Zarantha's honor duel",
      },
    ],
  },
  {
    id: 'zarantha_story_3',
    characterId: 'zarantha',
    requiredAffection: 60,
    title: 'The New Way of Strength',
    description:
      'Zarantha discovers a new definition of strength through love.',
    dialogue:
      '*After winning the duel with honor intact* I won... but not the way I used to. I fought with controlled strength, with honor, with the knowledge that someone precious was watching. They called me soft, but what they saw was actually a new kind of strength—one tempered by love, not weakened by it.',
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'evolved_strength',
        text: "You've evolved into something more powerful than any warrior.",
        consequence: 'Zarantha embraces being both fierce and loving',
        affectionChange: 8,
      },
      {
        id: 'proud_of_you',
        text: "I've never been more proud to stand beside you.",
        consequence: 'Zarantha finds pride in this new version of herself',
        affectionChange: 7,
      },
    ],
    rewards: [
      {
        type: 'photo',
        id: 'zarantha_honor_victory',
        description:
          'Zarantha victorious, scales gleaming with honorable strength',
      },
    ],
  },
];

// Thalassos's Storyline - The Ocean's Depth
export const thalassosStoryline: StorylineEvent[] = [
  {
    id: 'thalassos_story_1',
    characterId: 'thalassos',
    requiredAffection: 17,
    title: 'The Depth of Solitude',
    description: 'Thalassos reveals the loneliness of his spiritual calling.',
    dialogue:
      "*High Priest Thalassos gazes into the distance* The deep waters teach many things, but perhaps the most difficult lesson is solitude. To truly commune with the ocean's wisdom, one must often walk alone. Yet lately... I find myself yearning for a companion who could understand both the surface and the depths.",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'dive_together',
        text: 'Let me learn to dive into those depths with you.',
        consequence:
          'Thalassos is moved by your willingness to explore his spiritual world',
        affectionChange: 5,
        unlockNext: 'thalassos_story_2',
      },
      {
        id: 'understand_calling',
        text: "Your calling is beautiful, but you don't have to carry it alone.",
        consequence:
          'Thalassos begins to see how companionship could enhance his spirituality',
        affectionChange: 4,
        unlockNext: 'thalassos_story_2',
      },
    ],
    rewards: [
      {
        type: 'character_insight',
        id: 'thalassos_spiritual_loneliness',
        description: 'You understand the price he pays for his deep wisdom',
      },
    ],
  },
  {
    id: 'thalassos_story_2',
    characterId: 'thalassos',
    requiredAffection: 41,
    title: 'The Sacred Tide Pool',
    description: 'Thalassos invites you to participate in an ancient ritual.',
    dialogue:
      "*His bio-luminescent patterns pulse with ancient rhythm* There is a ceremony... the Joining of Tides, where two souls share the ocean's deepest secrets. It requires complete trust, complete vulnerability. The waters will show us visions of possible futures together. Are you prepared for what we might see?",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'embrace_visions',
        text: "I'm ready to see our future together, whatever it may be.",
        consequence:
          'Your courage to face the unknown deepens your mystical bond',
        affectionChange: 7,
        unlockNext: 'thalassos_story_3',
      },
      {
        id: 'trust_wisdom',
        text: 'I trust your wisdom to guide us through this journey.',
        consequence:
          'Thalassos is honored by your faith in his spiritual guidance',
        affectionChange: 6,
        unlockNext: 'thalassos_story_3',
      },
    ],
    rewards: [
      {
        type: 'special_date',
        id: 'joining_of_tides_ritual',
        description: 'Unlock the Sacred Tide Pool ritual',
      },
    ],
  },
  {
    id: 'thalassos_story_3',
    characterId: 'thalassos',
    requiredAffection: 56,
    title: "The Ocean's Blessing",
    description:
      'The ancient waters reveal a profound truth about your connection.',
    dialogue:
      '*After the ritual, his eyes glow with otherworldly wisdom* The tides have shown me something remarkable... our connection transcends individual existence. Together, we become like the ocean itself—separate drops that create something infinite and eternal. The waters have blessed our union.',
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'eternal_connection',
        text: 'Our love flows deeper than any ocean.',
        consequence: 'Thalassos sees your love as truly transcendent',
        affectionChange: 8,
      },
      {
        id: 'blessed_by_waters',
        text: 'If the ancient waters bless us, how can we be anything but eternal?',
        consequence:
          'Thalassos finds peace in the spiritual validation of your love',
        affectionChange: 7,
      },
    ],
    rewards: [
      {
        type: 'photo',
        id: 'thalassos_tide_blessing',
        description: 'The sacred moment when the waters blessed your union',
      },
    ],
  },
];

// Nightshade's Storyline - The Shadow's Light
export const nightshadeStoryline: StorylineEvent[] = [
  {
    id: 'nightshade_story_1',
    characterId: 'nightshade',
    requiredAffection: 19,
    title: "The Guardian's Burden",
    description:
      'Nightshade reveals the cost of protecting the dimensional barriers.',
    dialogue:
      "*Nightshade's form flickers between solid and ethereal* You should know... what I do, who I am, it comes with a price. I've seen things that would shatter most minds. Dimensions where love leads to destruction, realities where connection means vulnerability. I've learned to keep others at a distance to protect them... and myself.",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'worth_risk',
        text: 'Some things are worth the risk. Our connection is one of them.',
        consequence:
          'Nightshade begins to believe love might be worth the vulnerability',
        affectionChange: 5,
        unlockNext: 'nightshade_story_2',
      },
      {
        id: 'share_burden',
        text: "Let me help you carry that burden. You don't have to protect alone.",
        consequence:
          'Nightshade is moved by your offer to share their responsibility',
        affectionChange: 4,
        unlockNext: 'nightshade_story_2',
      },
    ],
    rewards: [
      {
        type: 'character_insight',
        id: 'nightshade_protective_isolation',
        description: 'You understand why they keep others at a distance',
      },
    ],
  },
  {
    id: 'nightshade_story_2',
    characterId: 'nightshade',
    requiredAffection: 43,
    title: 'The Dimensional Breach',
    description:
      "A crisis tests Nightshade's duty against their growing feelings.",
    dialogue:
      "*Alarms pulse through the dimensional fabric* There's been a breach... a dangerous entity from a hostile dimension is trying to break through. My duty demands I seal it immediately, but... the process will cut me off from this reality for days, maybe weeks. I might not make it back. But if I don't go...",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'duty_first',
        text: "Go. I'll be here when you return. I believe in you.",
        consequence:
          'Nightshade is strengthened by your understanding of their duty',
        affectionChange: 7,
        unlockNext: 'nightshade_story_3',
      },
      {
        id: 'fight_together',
        text: "Take me with you. We're stronger together.",
        consequence: "Nightshade realizes they don't have to face danger alone",
        affectionChange: 6,
        unlockNext: 'nightshade_story_3',
      },
    ],
    rewards: [
      {
        type: 'special_date',
        id: 'dimensional_mission',
        description: 'Experience the dimensional breach crisis together',
      },
    ],
  },
  {
    id: 'nightshade_story_3',
    characterId: 'nightshade',
    requiredAffection: 59,
    title: 'The Light in Shadow',
    description:
      "Nightshade discovers that love doesn't weaken their protection—it strengthens it.",
    dialogue:
      "*After successfully containing the breach, their form solidifies more than ever before* Something changed during the mission... when the hostile entity tried to corrupt me with visions of loss and isolation, I thought of you. Your love didn't make me vulnerable—it became my anchor, my strength. I finally understand: shadows exist to protect the light.",
    unlocked: false,
    completed: false,
    choices: [
      {
        id: 'love_as_anchor',
        text: 'Our love is the light that guides you through any darkness.',
        consequence: 'Nightshade embraces love as their greatest strength',
        affectionChange: 8,
      },
      {
        id: 'proud_guardian',
        text: "You're not just a guardian of dimensions—you're the guardian of my heart.",
        consequence:
          'Nightshade finds new purpose in protecting what they love',
        affectionChange: 7,
      },
    ],
    rewards: [
      {
        type: 'photo',
        id: 'nightshade_light_shadow',
        description: 'Nightshade in perfect balance between shadow and light',
      },
    ],
  },
];

// Get storyline events for a character at current affection level
export function getAvailableStorylines(
  characterId: string,
  affection: number
): StorylineEvent[] {
  // Input validation
  if (!characterId || typeof characterId !== 'string') {
    console.warn(
      'getAvailableStorylines: Invalid character ID provided',
      characterId
    );
    return [];
  }

  if (typeof affection !== 'number' || affection < 0 || affection > 100) {
    console.warn(
      'getAvailableStorylines: Invalid affection level provided',
      affection
    );
    return [];
  }

  let characterStorylines: StorylineEvent[] = [];

  try {
    switch (characterId) {
      case 'kyrathen':
        characterStorylines = [...kyrathenStoryline];
        break;
      case 'seraphina':
        characterStorylines = [...seraphinaStoryline];
        break;
      case 'kronos':
        characterStorylines = [...kronosStoryline];
        break;
      case 'thessarian':
        characterStorylines = [...thessarianStoryline];
        break;
      case 'lyralynn':
        characterStorylines = [...lyralynnStoryline];
        break;
      case 'zarantha':
        characterStorylines = [...zaranthaStoryline];
        break;
      case 'thalassos':
        characterStorylines = [...thalassosStoryline];
        break;
      case 'nightshade':
        characterStorylines = [...nightshadeStoryline];
        break;
      default:
        console.warn(
          `getAvailableStorylines: Unknown character ID: ${characterId}`
        );
        return [];
    }

    return characterStorylines.filter((storyline) => {
      if (!storyline || typeof storyline.requiredAffection !== 'number') {
        console.warn(
          'getAvailableStorylines: Invalid storyline data found',
          storyline
        );
        return false;
      }
      return affection >= storyline.requiredAffection && !storyline.completed;
    });
  } catch (error) {
    console.error(
      'getAvailableStorylines: Error processing storylines for character',
      characterId,
      error
    );
    return [];
  }
}

// Unlock storylines based on affection level
export function checkStorylineUnlocks(
  characterId: string,
  affection: number
): StorylineEvent[] {
  try {
    const availableStorylines = getAvailableStorylines(characterId, affection);

    if (!Array.isArray(availableStorylines)) {
      console.warn(
        'checkStorylineUnlocks: getAvailableStorylines did not return an array',
        availableStorylines
      );
      return [];
    }

    return availableStorylines
      .map((storyline) => {
        if (!storyline) {
          console.warn('checkStorylineUnlocks: Found null/undefined storyline');
          return null;
        }

        return {
          ...storyline,
          unlocked: affection >= storyline.requiredAffection,
        };
      })
      .filter(Boolean) as StorylineEvent[];
  } catch (error) {
    console.error(
      'checkStorylineUnlocks: Error checking storyline unlocks',
      characterId,
      error
    );
    return [];
  }
}

// Process storyline choice and return consequences
export function processStorylineChoice(
  storylineId: string,
  choiceId: string,
  _characterId?: string
): { affectionChange: number; consequence: string; unlockNext?: string } {
  // Input validation
  if (!storylineId || typeof storylineId !== 'string') {
    console.warn(
      'processStorylineChoice: Invalid storyline ID provided',
      storylineId
    );
    return { affectionChange: 0, consequence: '' };
  }

  if (!choiceId || typeof choiceId !== 'string') {
    console.warn(
      'processStorylineChoice: Invalid choice ID provided',
      choiceId
    );
    return { affectionChange: 0, consequence: '' };
  }

  try {
    const storylines = [
      ...kyrathenStoryline,
      ...seraphinaStoryline,
      ...kronosStoryline,
      ...thessarianStoryline,
      ...lyralynnStoryline,
      ...zaranthaStoryline,
      ...thalassosStoryline,
      ...nightshadeStoryline,
    ];

    const storyline = storylines.find((s) => s.id === storylineId);
    if (!storyline) {
      console.warn(
        `processStorylineChoice: Storyline not found: ${storylineId}`
      );
      return { affectionChange: 0, consequence: '' };
    }

    if (!storyline.choices || !Array.isArray(storyline.choices)) {
      console.warn(
        `processStorylineChoice: Storyline has no choices: ${storylineId}`
      );
      return { affectionChange: 0, consequence: '' };
    }

    const choice = storyline.choices.find((c) => c && c.id === choiceId);
    if (!choice) {
      console.warn(
        `processStorylineChoice: Choice not found: ${choiceId} in storyline: ${storylineId}`
      );
      return { affectionChange: 0, consequence: '' };
    }

    // Validate choice data
    const affectionChange =
      typeof choice.affectionChange === 'number' ? choice.affectionChange : 0;
    const consequence =
      typeof choice.consequence === 'string' ? choice.consequence : '';

    return {
      affectionChange,
      consequence,
      unlockNext: choice.unlockNext,
    };
  } catch (error) {
    console.error(
      'processStorylineChoice: Error processing storyline choice',
      storylineId,
      choiceId,
      error
    );
    return { affectionChange: 0, consequence: '' };
  }
}
