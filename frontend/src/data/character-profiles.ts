import { CharacterProfile, Interest, ActivityType, ConversationStyle, PersonalValue } from '../types/game';

// Zarath (Plantoid) Profile
export const ZARATH_PROFILE: CharacterProfile = {
  interests: [
    { id: 'botany', name: 'Botany & Plant Biology', category: 'science', intensity: 5 },
    { id: 'ecology', name: 'Ecosystem Harmony', category: 'nature', intensity: 5 },
    { id: 'meditation', name: 'Meditation & Mindfulness', category: 'philosophy', intensity: 4 },
    { id: 'sustainable_tech', name: 'Sustainable Technology', category: 'technology', intensity: 3 },
    { id: 'ancient_wisdom', name: 'Ancient Wisdom', category: 'philosophy', intensity: 4 },
    { id: 'gardening', name: 'Hydroponic Gardening', category: 'nature', intensity: 5 }
  ],
  dealbreakers: [
    'Environmental destruction',
    'Disrespect for nature',
    'Impatience with growth processes',
    'Artificial enhancement obsession'
  ],
  preferredActivities: ['relaxing', 'intellectual', 'cultural'],
  conversationStyle: 'philosophical',
  values: ['harmony', 'growth', 'tradition'],
  background: 'Raised in the Great Conservatory of Verdania, where they learned to commune with the universal plant consciousness',
  goals: 'To help bridge understanding between organic and synthetic life forms across the galaxy',
  favoriteTopics: [
    'The interconnectedness of all life',
    'Symbiotic relationships in nature',
    'Photosynthetic meditation techniques',
    'Galactic ecosystem preservation'
  ]
};

// Vel'nari (Humanoid) Profile
export const VELNARI_PROFILE: CharacterProfile = {
  interests: [
    { id: 'exploration', name: 'Deep Space Exploration', category: 'adventure', intensity: 5 },
    { id: 'diplomacy', name: 'Interstellar Diplomacy', category: 'culture', intensity: 4 },
    { id: 'leadership', name: 'Command & Leadership', category: 'culture', intensity: 4 },
    { id: 'stellar_cartography', name: 'Stellar Cartography', category: 'science', intensity: 3 },
    { id: 'combat_training', name: 'Strategic Combat', category: 'adventure', intensity: 3 },
    { id: 'cultural_exchange', name: 'Cultural Exchange', category: 'culture', intensity: 4 }
  ],
  dealbreakers: [
    'Cowardice in the face of adventure',
    'Dishonesty or betrayal',
    'Disrespect for crew/team',
    'Avoidance of responsibility'
  ],
  preferredActivities: ['adventurous', 'social', 'intellectual'],
  conversationStyle: 'direct',
  values: ['adventure', 'loyalty', 'freedom'],
  background: 'Rose through the ranks of the Stellar Command after single-handedly negotiating peace in the Andorian Conflict',
  goals: 'To explore uncharted sectors and establish peaceful first contact with new civilizations',
  favoriteTopics: [
    'Uncharted star systems',
    'Leadership challenges',
    'First contact protocols',
    'Tales of exploration'
  ]
};

// Kethra (Aquatic) Profile
export const KETHRA_PROFILE: CharacterProfile = {
  interests: [
    { id: 'marine_biology', name: 'Xenomarine Biology', category: 'science', intensity: 5 },
    { id: 'fluid_dynamics', name: 'Fluid Dynamics', category: 'science', intensity: 4 },
    { id: 'underwater_archaeology', name: 'Underwater Archaeology', category: 'culture', intensity: 4 },
    { id: 'bio_luminescence', name: 'Bioluminescent Art', category: 'arts', intensity: 3 },
    { id: 'oceanic_meditation', name: 'Current Meditation', category: 'philosophy', intensity: 3 },
    { id: 'hydroponic_systems', name: 'Advanced Hydroponics', category: 'technology', intensity: 4 }
  ],
  dealbreakers: [
    'Fear of water or aquatic environments',
    'Disregard for scientific method',
    'Pollution or environmental carelessness',
    'Rushed decision-making'
  ],
  preferredActivities: ['intellectual', 'creative', 'relaxing'],
  conversationStyle: 'analytical',
  values: ['growth', 'harmony', 'innovation'],
  background: 'Leading researcher at the Abyssal Institute, specializing in life forms that thrive in extreme aquatic conditions',
  goals: 'To discover new forms of aquatic life and develop sustainable underwater cities',
  favoriteTopics: [
    'Deep ocean mysteries',
    'Adaptive evolution',
    'Underwater civilizations',
    'Bioluminescent communication'
  ]
};

// Ryxtal (Reptilian) Profile
export const RYXTAL_PROFILE: CharacterProfile = {
  interests: [
    { id: 'military_strategy', name: 'Military Strategy', category: 'culture', intensity: 5 },
    { id: 'honor_codes', name: 'Honor & Duty', category: 'philosophy', intensity: 5 },
    { id: 'weapons_training', name: 'Weapons Mastery', category: 'adventure', intensity: 4 },
    { id: 'ancient_history', name: 'Warrior History', category: 'culture', intensity: 4 },
    { id: 'protection_tech', name: 'Defensive Technology', category: 'technology', intensity: 3 },
    { id: 'thermal_regulation', name: 'Thermal Dynamics', category: 'science', intensity: 2 }
  ],
  dealbreakers: [
    'Dishonor or cowardice',
    'Betrayal of trust',
    'Abandoning those under protection',
    'Mockery of traditions'
  ],
  preferredActivities: ['adventurous', 'intellectual', 'cultural'],
  conversationStyle: 'serious',
  values: ['honor', 'loyalty', 'tradition'],
  background: 'Elite warrior-commander from the Scaled Imperium, sworn to protect the innocent across all star systems',
  goals: 'To uphold honor while forging alliances between warrior cultures and peaceful civilizations',
  favoriteTopics: [
    'Code of honor',
    'Strategic warfare',
    'Protective duties',
    'Ancient warrior traditions'
  ]
};

// Morgeth (Molluscoid) Profile
export const MORGETH_PROFILE: CharacterProfile = {
  interests: [
    { id: 'empathic_arts', name: 'Empathic Arts', category: 'arts', intensity: 5 },
    { id: 'collective_consciousness', name: 'Collective Consciousness', category: 'philosophy', intensity: 5 },
    { id: 'emotional_healing', name: 'Emotional Healing', category: 'philosophy', intensity: 4 },
    { id: 'tentacle_art', name: 'Multi-limb Sculpture', category: 'arts', intensity: 4 },
    { id: 'harmonic_resonance', name: 'Harmonic Communication', category: 'culture', intensity: 3 },
    { id: 'neural_networks', name: 'Organic Neural Networks', category: 'technology', intensity: 3 }
  ],
  dealbreakers: [
    'Emotional cruelty or callousness',
    'Rejection of empathy',
    'Isolation from community',
    'Destruction of art or beauty'
  ],
  preferredActivities: ['creative', 'romantic', 'intellectual'],
  conversationStyle: 'emotional',
  values: ['empathy', 'harmony', 'growth'],
  background: 'Revered sage and artist from the Collective Minds of Tentacularis, specializing in emotional healing through art',
  goals: 'To create universal understanding through empathic art and heal interspecies emotional wounds',
  favoriteTopics: [
    'Shared emotional experiences',
    'Artistic expression of feelings',
    'Collective consciousness',
    'Healing through empathy'
  ]
};

// Thexik (Arthropoid) Profile
export const THEXIK_PROFILE: CharacterProfile = {
  interests: [
    { id: 'quantum_engineering', name: 'Quantum Engineering', category: 'technology', intensity: 5 },
    { id: 'hive_efficiency', name: 'Efficiency Optimization', category: 'technology', intensity: 5 },
    { id: 'nano_construction', name: 'Nano-Construction', category: 'technology', intensity: 4 },
    { id: 'logical_puzzles', name: 'Complex Logic Puzzles', category: 'science', intensity: 4 },
    { id: 'crystalline_structures', name: 'Crystalline Structures', category: 'science', intensity: 3 },
    { id: 'swarm_coordination', name: 'Swarm Coordination', category: 'culture', intensity: 3 }
  ],
  dealbreakers: [
    'Inefficiency or waste',
    'Illogical decision-making',
    'Disruption of productive workflow',
    'Dismissal of technological progress'
  ],
  preferredActivities: ['intellectual', 'creative', 'social'],
  conversationStyle: 'analytical',
  values: ['innovation', 'efficiency', 'growth'],
  background: 'Brilliant engineer from the Chitinous Collective, responsible for designing the galaxy\'s most efficient space stations',
  goals: 'To optimize interstellar infrastructure and create perfect harmony between organic and artificial systems',
  favoriteTopics: [
    'Engineering marvels',
    'Efficiency improvements',
    'Technological innovation',
    'Systematic optimization'
  ]
};

export const CHARACTER_PROFILES: Record<string, CharacterProfile> = {
  zarath: ZARATH_PROFILE,
  velnari: VELNARI_PROFILE,
  kethra: KETHRA_PROFILE,
  ryxtal: RYXTAL_PROFILE,
  morgeth: MORGETH_PROFILE,
  thexik: THEXIK_PROFILE
};