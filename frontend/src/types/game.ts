export interface Character {
  id: string;
  name: string;
  species: string;
  personality: string;
  image: string;
  affection: number;
}

export interface PlayerCharacter {
  name: string;
  species: 'human' | 'plantoid' | 'aquatic' | 'reptilian';
  traits: string[];
  backstory: string;
  stats: {
    charisma: number;
    intelligence: number;
    adventure: number;
    empathy: number;
    technology: number;
  };
}

export interface Activity {
  id: string;
  name: string;
  description: string;
  reward: string;
}

export type GameScreen = 
  | 'main-menu'
  | 'character-creation'
  | 'main-hub'
  | 'character-interaction'
  | 'activities';

export interface DialogueOption {
  id: string;
  text: string;
  topic: string;
}
