import { CharacterPhoto, PhotoRarity } from '../types/game';

// Aerarfin (Ethereal Wind Elemental) Photo Gallery
export const aerarfinPhotos: CharacterPhoto[] = [
  {
    id: 'aerarfin_portrait',
    url: './images/characters/aerarfin.png',
    title: 'Wind Dance Portrait',
    description: 'Aerarfin floating gracefully among the clouds, hair flowing with ethereal wind',
    unlockedAt: 0,
    unlocked: true,
    rarity: 'common',
  },
  {
    id: 'aerarfin_storm',
    url: './images/characters/aerarfin.png',
    title: 'Storm Calling',
    description: 'Aerarfin commanding lightning and wind in a spectacular aerial display',
    unlockedAt: 15,
    unlocked: false,
    rarity: 'uncommon',
  },
  {
    id: 'aerarfin_sunset',
    url: './images/characters/aerarfin.png',
    title: 'Sunset Flight',
    description: 'A breathtaking moment of freedom as Aerarfin soars through twilight skies',
    unlockedAt: 35,
    unlocked: false,
    rarity: 'rare',
  },
];

// Bellasnor (Celestial Star Touched) Photo Gallery
export const bellasnorPhotos: CharacterPhoto[] = [
  {
    id: 'bellasnor_portrait',
    url: './images/characters/bellasnor.png',
    title: 'Starlight Portrait',
    description: 'Bellasnor radiating celestial light, stars reflecting in her luminous eyes',
    unlockedAt: 0,
    unlocked: true,
    rarity: 'common',
  },
  {
    id: 'bellasnor_healing',
    url: './images/characters/bellasnor.png',
    title: 'Light Healing',
    description: 'Channeling pure starlight to heal and comfort those in need',
    unlockedAt: 15,
    unlocked: false,
    rarity: 'uncommon',
  },
  {
    id: 'bellasnor_cosmic',
    url: './images/characters/bellasnor.png',
    title: 'Cosmic Meditation',
    description: 'In deep communion with the cosmos, surrounded by swirling galaxies',
    unlockedAt: 35,
    unlocked: false,
    rarity: 'rare',
  },
];

// Celanlas (Sylvan Forest Guardian) Photo Gallery
export const celanlasPhotos: CharacterPhoto[] = [
  {
    id: 'celanlas_portrait',
    url: './images/characters/celanlas.png',
    title: 'Forest Guardian',
    description: 'Celanlas standing watch over the ancient woodland, one with nature',
    unlockedAt: 0,
    unlocked: true,
    rarity: 'common',
  },
  {
    id: 'celanlas_animals',
    url: './images/characters/celanlas.png',
    title: 'Wild Council',
    description: 'Communing with forest creatures, speaking their ancient language',
    unlockedAt: 15,
    unlocked: false,
    rarity: 'uncommon',
  },
  {
    id: 'celanlas_treeheart',
    url: './images/characters/celanlas.png',
    title: 'Heart of the Forest',
    description: 'Connected to the great tree spirits, channeling their wisdom',
    unlockedAt: 35,
    unlocked: false,
    rarity: 'rare',
  },
];

// Lyraiel (Melodic Song Weaver) Photo Gallery
export const lyraielPhotos: CharacterPhoto[] = [
  {
    id: 'lyraiel_portrait',
    url: './images/characters/lyraiel.png',
    title: 'Song Portrait',
    description: 'Lyraiel in the midst of a beautiful melody, music made visible around her',
    unlockedAt: 0,
    unlocked: true,
    rarity: 'common',
  },
  {
    id: 'lyraiel_performance',
    url: './images/characters/lyraiel.png',
    title: 'Grand Performance',
    description: 'Enchanting an audience with songs that touch the very soul',
    unlockedAt: 15,
    unlocked: false,
    rarity: 'uncommon',
  },
  {
    id: 'lyraiel_harmony',
    url: './images/characters/lyraiel.png',
    title: 'Universal Harmony',
    description: 'Creating music that bridges worlds, connecting all hearts through melody',
    unlockedAt: 35,
    unlocked: false,
    rarity: 'rare',
  },
];

// Moriaion (Shadow Void Walker) Photo Gallery
export const moriaionPhotos: CharacterPhoto[] = [
  {
    id: 'moriaion_portrait',
    url: './images/characters/moriaion.png',
    title: 'Shadow Guardian',
    description: 'Moriaion emerging from the void, darkness and light in perfect balance',
    unlockedAt: 0,
    unlocked: true,
    rarity: 'common',
  },
  {
    id: 'moriaion_dimensional',
    url: './images/characters/moriaion.png',
    title: 'Dimensional Walk',
    description: 'Stepping between realms, master of both shadow and space',
    unlockedAt: 15,
    unlocked: false,
    rarity: 'uncommon',
  },
  {
    id: 'moriaion_protection',
    url: './images/characters/moriaion.png',
    title: 'Protective Barrier',
    description: 'Shielding others with shadow magic, strength born from dedication',
    unlockedAt: 35,
    unlocked: false,
    rarity: 'rare',
  },
];

// Quinaelmir (Crystal Gem Heart) Photo Gallery
export const quinaelmirPhotos: CharacterPhoto[] = [
  {
    id: 'quinaelmir_portrait',
    url: './images/characters/quinaelmir.png',
    title: 'Crystal Clarity',
    description:
      'Quinaelmir displaying perfect geometric beauty, light refracting through crystalline form',
    unlockedAt: 0,
    unlocked: true,
    rarity: 'common',
  },
  {
    id: 'quinaelmir_mathematics',
    url: './images/characters/quinaelmir.png',
    title: 'Living Mathematics',
    description: 'Equations and geometric patterns flowing around them like living art',
    unlockedAt: 15,
    unlocked: false,
    rarity: 'uncommon',
  },
  {
    id: 'quinaelmir_prism',
    url: './images/characters/quinaelmir.png',
    title: 'Prismatic Harmony',
    description: 'Creating rainbows of impossible beauty through crystal manipulation',
    unlockedAt: 35,
    unlocked: false,
    rarity: 'rare',
  },
];

// Function to check and unlock photos based on affection level
export const checkPhotoUnlocks = (
  photos: CharacterPhoto[],
  affection: number
): CharacterPhoto[] => {
  return photos.map(photo => ({
    ...photo,
    unlocked: affection >= photo.unlockedAt,
  }));
};

// Function to filter photos by rarity
export const getPhotosByRarity = (
  photos: CharacterPhoto[],
  rarity: PhotoRarity
): CharacterPhoto[] => {
  return photos.filter(photo => photo.rarity === rarity);
};

// Function to get only unlocked photos
export const getUnlockedPhotos = (photos: CharacterPhoto[]): CharacterPhoto[] => {
  return photos.filter(photo => photo.unlocked);
};

// Function to get the next photo that could be unlocked
export const getNextPhotoToUnlock = (
  photos: CharacterPhoto[],
  currentAffection: number
): CharacterPhoto | null => {
  const lockedPhotos = photos.filter(photo => !photo.unlocked);
  if (lockedPhotos.length === 0) return null;

  // Sort by unlock threshold and return the next one
  const sortedLocked = lockedPhotos.sort((a, b) => a.unlockedAt - b.unlockedAt);
  return sortedLocked.find(photo => photo.unlockedAt > currentAffection) || null;
};

// Export object for easy access
export const characterPhotoGalleries = {
  aerarfin: aerarfinPhotos,
  bellasnor: bellasnorPhotos,
  celanlas: celanlasPhotos,
  lyraiel: lyraielPhotos,
  moriaion: moriaionPhotos,
  quinaelmir: quinaelmirPhotos,
};
