import { SuperLikeEffect } from '../types/game';

export const superLikeEffects: Record<string, SuperLikeEffect> = {
  zara: {
    affectionBonus: 15,
    specialDialogue: true,
    moodBoost: true,
    temporaryCompatibilityBonus: 10,
    duration: 8, // hours
  },
  kai: {
    affectionBonus: 12,
    specialDialogue: true,
    moodBoost: true,
    temporaryCompatibilityBonus: 15,
    duration: 6,
  },
  nova: {
    affectionBonus: 18,
    specialDialogue: true,
    moodBoost: true,
    temporaryCompatibilityBonus: 8,
    duration: 12,
  },
  astra: {
    affectionBonus: 10,
    specialDialogue: true,
    moodBoost: true,
    temporaryCompatibilityBonus: 12,
    duration: 4,
  },
  orion: {
    affectionBonus: 20,
    specialDialogue: true,
    moodBoost: true,
    temporaryCompatibilityBonus: 5,
    duration: 24,
  },
  luna: {
    affectionBonus: 14,
    specialDialogue: true,
    moodBoost: true,
    temporaryCompatibilityBonus: 12,
    duration: 10,
  },
};

export const superLikeResponses: Record<string, string[]> = {
  zara: [
    "Oh wow! That's... incredibly sweet of you. I didn't expect such a bold gesture! 💕",
    "You really know how to make a warrior's heart skip a beat. This means a lot to me.",
    "I'm honestly touched. Your confidence in showing your feelings like this is really attractive.",
    "That's quite the romantic declaration! I have to admit, it's working on me. 😊",
  ],
  kai: [
    'Fascinating! The statistical probability of receiving such focused attention is... actually quite thrilling! 🧠💖',
    'Your direct approach bypasses my usual analytical defenses. Efficiently romantic - I approve!',
    "I've run the calculations, and this gesture significantly increases my emotional investment coefficient.",
    "Intriguing! You've just activated several positive feedback loops in my affection algorithms. 💕",
  ],
  nova: [
    "Oh my... that's so incredibly sweet! I'm literally glowing right now! ✨💕",
    'You just made me the happiest being in the galaxy! This is like something from my favorite romance novels!',
    "I... I don't know what to say! This is the most wonderful surprise! Thank you so much! 🌸",
    "You're making me blush so much I might blind someone! This is absolutely magical! 💫",
  ],
  astra: [
    "WHOA! That's like... the ultimate power-up for my heart! You're totally awesome! ⚡💕",
    "Dude, that's SO cool! You just leveled up our whole relationship status! Epic move!",
    "No way! This is like getting a legendary drop but for feelings! You're the best! 🎮💖",
    "That's absolutely WILD! My heart just went into turbo mode! Thanks for being so amazing! 🚀",
  ],
  orion: [
    'Your gesture demonstrates considerable emotional intelligence. I... find myself surprisingly moved. 🌿',
    'This is a meaningful expression of your intentions. I appreciate the clarity of your feelings.',
    'Intriguing. You continue to exceed my expectations for human emotional complexity. Well done.',
    'I confess, this direct approach has circumvented my usual emotional shields. Quite effective. 💚',
  ],
  luna: [
    "Oh sweetie, that just melted my heart completely! You're such a thoughtful soul! 🧡💕",
    "That's the most beautiful gesture! You have such a caring spirit - it really shows!",
    'You just filled me with so much warmth! This is exactly the kind of loving energy I treasure! ☀️',
    'My heart is practically singing! You have such a gift for making others feel special! 💫',
  ],
};

export const superLikeUnlocks: Record<
  string,
  { dialogue: string[]; content: string[] }
> = {
  zara: {
    dialogue: [
      "I've been thinking about what you said...",
      "You know, I don't usually let people see this side of me...",
      'Your boldness inspired me to be more open too.',
    ],
    content: [
      "Unlocked: Warrior's Heart conversation topic",
      'Unlocked: Private training date option',
      'Unlocked: Vulnerable moments dialogue branch',
    ],
  },
  kai: {
    dialogue: [
      'Your emotional directness has updated my interaction protocols...',
      "I've been analyzing why your gesture affected me so strongly...",
      'Perhaps I should recalibrate my emotional output parameters...',
    ],
    content: [
      'Unlocked: Technical romance conversation topic',
      'Unlocked: Laboratory date scenario',
      'Unlocked: Emotion analysis dialogue branch',
    ],
  },
  nova: {
    dialogue: [
      'I keep thinking about how wonderful you made me feel...',
      'I wrote a little poem about that moment, would you like to hear it?',
      'You inspire me to be even more expressive...',
    ],
    content: [
      'Unlocked: Poetry sharing conversation topic',
      'Unlocked: Artistic collaboration date',
      'Unlocked: Creative expression dialogue branch',
    ],
  },
  astra: {
    dialogue: [
      'That was like the most epic relationship combo ever!',
      "I've been telling everyone about how awesome you are!",
      'Want to try something even more adventurous together?',
    ],
    content: [
      'Unlocked: Adventure buddy conversation topic',
      'Unlocked: Extreme sports date option',
      'Unlocked: High-energy activities dialogue branch',
    ],
  },
  orion: {
    dialogue: [
      "I've been contemplating the implications of your emotional investment...",
      'Your sincerity has prompted some unexpected personal revelations...',
      "Perhaps it's time I shared more of my own feelings...",
    ],
    content: [
      'Unlocked: Deep philosophy conversation topic',
      'Unlocked: Meditation garden date',
      'Unlocked: Emotional vulnerability dialogue branch',
    ],
  },
  luna: {
    dialogue: [
      'Your loving gesture keeps warming my heart...',
      'I feel so comfortable opening up to you now...',
      'You bring out the best parts of my caring nature...',
    ],
    content: [
      'Unlocked: Nurturing bond conversation topic',
      'Unlocked: Healing sanctuary date',
      'Unlocked: Deep empathy dialogue branch',
    ],
  },
};
