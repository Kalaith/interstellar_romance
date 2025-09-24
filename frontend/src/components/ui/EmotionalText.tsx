import React from 'react';
import { EmotionType } from '../../types/game';

interface EmotionalTextProps {
  text: string;
  emotion: EmotionType;
  className?: string;
}

const emotionStyles: Record<EmotionType, string> = {
  happy: 'text-yellow-400 animate-pulse',
  sad: 'text-blue-400 opacity-80',
  excited: 'text-orange-400 font-bold animate-bounce',
  nervous: 'text-purple-400 italic',
  flirty: 'text-pink-400 font-semibold',
  thoughtful: 'text-green-400 font-light',
  surprised: 'text-red-400 font-bold',
  hopeful: 'text-cyan-400 font-medium',
  neutral: 'text-gray-300'
};

const emotionIcons: Record<EmotionType, string> = {
  happy: '😊',
  sad: '😢',
  excited: '🤩',
  nervous: '😅',
  flirty: '😘',
  thoughtful: '🤔',
  surprised: '😲',
  hopeful: '🌟',
  neutral: '😐'
};

export const EmotionalText: React.FC<EmotionalTextProps> = ({ text, emotion, className = '' }) => {
  return (
    <div className={`flex items-start space-x-2 ${className}`}>
      <span className="text-2xl flex-shrink-0 mt-1">{emotionIcons[emotion]}</span>
      <p className={`flex-1 ${emotionStyles[emotion]}`}>
        {text}
      </p>
    </div>
  );
};