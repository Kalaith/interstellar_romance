import React from 'react';
import { CharacterMood } from '../../types/game';
import { MOOD_DESCRIPTIONS } from '../../data/moods';

interface MoodDisplayProps {
  mood: CharacterMood;
  characterName: string;
  className?: string;
}

const moodColors: Record<CharacterMood, string> = {
  cheerful: 'text-yellow-400 bg-yellow-900/20',
  melancholy: 'text-blue-400 bg-blue-900/20',
  romantic: 'text-pink-400 bg-pink-900/20',
  analytical: 'text-green-400 bg-green-900/20',
  adventurous: 'text-orange-400 bg-orange-900/20',
  tired: 'text-gray-400 bg-gray-900/20',
  excited: 'text-red-400 bg-red-900/20',
  neutral: 'text-gray-300 bg-gray-800/20'
};

const moodIcons: Record<CharacterMood, string> = {
  cheerful: '☀️',
  melancholy: '🌙',
  romantic: '💕',
  analytical: '🧠',
  adventurous: '⚡',
  tired: '😴',
  excited: '✨',
  neutral: '⚖️'
};

export const MoodDisplay: React.FC<MoodDisplayProps> = ({ mood, characterName, className = '' }) => {
  return (
    <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full border ${moodColors[mood]} ${className}`}>
      <span className="text-sm">{moodIcons[mood]}</span>
      <span className="text-sm font-medium capitalize">{mood}</span>
      <span className="text-xs opacity-75">
        {characterName} {MOOD_DESCRIPTIONS[mood]}
      </span>
    </div>
  );
};