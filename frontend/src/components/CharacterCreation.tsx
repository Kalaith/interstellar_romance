import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { PlayerCharacter, Gender, SexualPreference } from '../types/game';

export const CharacterCreation: React.FC = () => {
  const { setScreen, createPlayer } = useGameStore();

  const [formData, setFormData] = useState<{
    name: string;
    species: 'human' | 'plantoid' | 'aquatic' | 'reptilian';
    gender: Gender;
    sexualPreference: SexualPreference;
    traits: string[];
    backstory: string;
  }>({
    name: '',
    species: 'human',
    gender: 'male',
    sexualPreference: 'all',
    traits: [],
    backstory: 'diplomat',
  });

  const handleTraitToggle = (trait: string) => {
    setFormData(prev => {
      const newTraits = prev.traits.includes(trait)
        ? prev.traits.filter(t => t !== trait)
        : prev.traits.length < 2
          ? [...prev.traits, trait]
          : prev.traits;

      return { ...prev, traits: newTraits };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.traits.length !== 2) {
      alert('Please fill in your name and select exactly 2 traits.');
      return;
    }

    const player: PlayerCharacter = {
      name: formData.name,
      species: formData.species,
      gender: formData.gender,
      sexualPreference: formData.sexualPreference,
      traits: formData.traits,
      backstory: formData.backstory,
      stats: {
        charisma: 5 + (formData.traits.includes('charismatic') ? 2 : 0),
        intelligence: 5 + (formData.traits.includes('intelligent') ? 2 : 0),
        adventure: 5 + (formData.traits.includes('adventurous') ? 2 : 0),
        empathy: 5 + (formData.traits.includes('empathetic') ? 2 : 0),
        technology: 5 + (formData.traits.includes('tech-savvy') ? 2 : 0),
      },
    };

    createPlayer(player);
  };

  const traits = [
    {
      id: 'charismatic',
      label: 'Charismatic',
      icon: '💬',
      bonus: '+2 Charisma',
    },
    {
      id: 'intelligent',
      label: 'Intelligent',
      icon: '🧠',
      bonus: '+2 Intelligence',
    },
    {
      id: 'adventurous',
      label: 'Adventurous',
      icon: '🚀',
      bonus: '+2 Adventure',
    },
    { id: 'empathetic', label: 'Empathetic', icon: '💖', bonus: '+2 Empathy' },
    {
      id: 'tech-savvy',
      label: 'Tech-Savvy',
      icon: '🔧',
      bonus: '+2 Technology',
    },
  ];

  const species = [
    {
      value: 'human' as const,
      label: 'Human',
      icon: '👤',
      description: 'Diplomatic and versatile',
    },
    {
      value: 'plantoid' as const,
      label: 'Plantoid',
      icon: '🌿',
      description: 'Patient and wise',
    },
    {
      value: 'aquatic' as const,
      label: 'Aquatic',
      icon: '🐠',
      description: 'Graceful and mysterious',
    },
    {
      value: 'reptilian' as const,
      label: 'Reptilian',
      icon: '🦎',
      description: 'Strategic and honor-bound',
    },
  ];

  const backstories = [
    {
      value: 'diplomat',
      label: 'Diplomat',
      icon: '🏛️',
      description: 'Skilled in negotiation and cultural exchange',
    },
    {
      value: 'explorer',
      label: 'Explorer',
      icon: '🌌',
      description: 'Experienced in discovering new worlds',
    },
    {
      value: 'merchant',
      label: 'Merchant',
      icon: '💰',
      description: 'Expert in trade and commerce',
    },
    {
      value: 'scientist',
      label: 'Scientist',
      icon: '🔬',
      description: 'Researcher of galactic phenomena',
    },
    {
      value: 'military',
      label: 'Military Officer',
      icon: '⚔️',
      description: 'Trained in strategy and combat',
    },
  ];

  const genders = [
    { value: 'male' as const, label: 'Male', icon: '♂️' },
    { value: 'female' as const, label: 'Female', icon: '♀️' },
    { value: 'non-binary' as const, label: 'Non-Binary', icon: '⚧️' },
    { value: 'other' as const, label: 'Other', icon: '🌈' },
  ];

  const sexualPreferences = [
    {
      value: 'men' as const,
      label: 'Men',
      icon: '♂️',
      description: 'Attracted to male characters',
    },
    {
      value: 'women' as const,
      label: 'Women',
      icon: '♀️',
      description: 'Attracted to female characters',
    },
    {
      value: 'all' as const,
      label: 'All Genders',
      icon: '🌈',
      description: 'Open to all gender identities',
    },
    {
      value: 'non-binary' as const,
      label: 'Non-Binary',
      icon: '⚧️',
      description: 'Attracted to non-binary characters',
    },
    {
      value: 'alien-species' as const,
      label: 'Any Species',
      icon: '👽',
      description: 'Open to all alien species regardless of gender',
    },
  ];

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Space background with subtle stars */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-stellaris-cyan/5 to-transparent"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4">
        {/* Main Panel */}
        <div className="bg-slate-800/90 border border-stellaris-cyan/30 rounded-xl p-8 backdrop-blur-md shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-white tracking-wide uppercase mb-2">
              Character Creation
              <span className="animate-pulse text-stellaris-cyan">|</span>
            </h2>
            <p className="text-slate-300 text-lg">Design your interstellar persona</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Input */}
            <div className="bg-slate-700/50 border border-stellaris-cyan/20 rounded-lg p-6 mb-6">
              <label className="block text-stellaris-cyan text-sm font-semibold mb-3 uppercase tracking-wide">
                Character Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-stellaris-cyan focus:outline-none focus:ring-1 focus:ring-stellaris-cyan transition-colors"
                placeholder="Enter your name..."
              />
            </div>

            {/* Species Selection Grid */}
            <div className="bg-slate-700/50 border border-stellaris-cyan/20 rounded-lg p-6 mb-6">
              <label className="block text-stellaris-cyan text-sm font-semibold mb-4 uppercase tracking-wide">
                Species
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {species.map(spec => (
                  <button
                    key={spec.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, species: spec.value }))}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      formData.species === spec.value
                        ? 'border-stellaris-cyan bg-stellaris-cyan/20 shadow-lg shadow-stellaris-cyan/40 scale-105'
                        : 'border-slate-600 bg-slate-800/60 hover:border-stellaris-cyan/60 hover:bg-stellaris-cyan/10'
                    }`}
                  >
                    <div className="text-3xl mb-2">{spec.icon}</div>
                    <div
                      className={`font-semibold ${formData.species === spec.value ? 'text-stellaris-cyan' : 'text-white'}`}
                    >
                      {spec.label}
                    </div>
                    <div className="text-xs text-slate-400">{spec.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Selection Grid */}
            <div className="bg-slate-700/50 border border-stellaris-cyan/20 rounded-lg p-6 mb-6">
              <label className="block text-stellaris-cyan text-sm font-semibold mb-4 uppercase tracking-wide">
                Gender
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {genders.map(gender => (
                  <button
                    key={gender.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, gender: gender.value }))}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      formData.gender === gender.value
                        ? 'border-purple-400 bg-purple-400/20 shadow-lg shadow-purple-400/40 scale-105'
                        : 'border-slate-600 bg-slate-800/60 hover:border-purple-400/60 hover:bg-purple-400/10'
                    }`}
                  >
                    <div className="text-3xl mb-2">{gender.icon}</div>
                    <div
                      className={`font-semibold ${formData.gender === gender.value ? 'text-purple-300' : 'text-white'}`}
                    >
                      {gender.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Traits Selection Grid */}
            <div className="bg-slate-700/50 border border-stellaris-cyan/20 rounded-lg p-6 mb-6">
              <label className="block text-stellaris-cyan text-sm font-semibold mb-3 uppercase tracking-wide">
                Choose Traits ({formData.traits.length}/2 selected)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {traits.map(trait => (
                  <button
                    key={trait.id}
                    type="button"
                    onClick={() => handleTraitToggle(trait.id)}
                    disabled={!formData.traits.includes(trait.id) && formData.traits.length >= 2}
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      formData.traits.includes(trait.id)
                        ? 'border-green-400 bg-green-400/20 shadow-lg shadow-green-400/40 scale-105'
                        : formData.traits.length >= 2
                          ? 'border-slate-600 bg-slate-800/40 opacity-50 cursor-not-allowed'
                          : 'border-slate-600 bg-slate-800/60 hover:border-green-400/60 hover:bg-green-400/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{trait.icon}</span>
                      <span
                        className={`font-semibold ${formData.traits.includes(trait.id) ? 'text-green-300' : 'text-white'}`}
                      >
                        {trait.label}
                      </span>
                    </div>
                    <div className="text-xs text-yellow-300">{trait.bonus}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sexual Preference Selection Grid */}
            <div className="bg-slate-700/50 border border-stellaris-cyan/20 rounded-lg p-6 mb-6">
              <label className="block text-stellaris-cyan text-sm font-semibold mb-4 uppercase tracking-wide">
                Romantic Interest
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sexualPreferences.map(preference => (
                  <button
                    key={preference.value}
                    type="button"
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        sexualPreference: preference.value,
                      }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      formData.sexualPreference === preference.value
                        ? 'border-pink-400 bg-pink-400/20 shadow-lg shadow-pink-400/40 scale-105'
                        : 'border-slate-600 bg-slate-800/60 hover:border-pink-400/60 hover:bg-pink-400/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{preference.icon}</span>
                      <span
                        className={`font-semibold ${formData.sexualPreference === preference.value ? 'text-pink-300' : 'text-white'}`}
                      >
                        {preference.label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{preference.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Backstory Selection Grid */}
            <div className="bg-slate-700/50 border border-stellaris-cyan/20 rounded-lg p-6 mb-6">
              <label className="block text-stellaris-cyan text-sm font-semibold mb-4 uppercase tracking-wide">
                Backstory
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {backstories.map(backstory => (
                  <button
                    key={backstory.value}
                    type="button"
                    onClick={() =>
                      setFormData(prev => ({
                        ...prev,
                        backstory: backstory.value,
                      }))
                    }
                    className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                      formData.backstory === backstory.value
                        ? 'border-orange-400 bg-orange-400/20 shadow-lg shadow-orange-400/40 scale-105'
                        : 'border-slate-600 bg-slate-800/60 hover:border-orange-400/60 hover:bg-orange-400/10'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{backstory.icon}</span>
                      <span
                        className={`font-semibold ${formData.backstory === backstory.value ? 'text-orange-300' : 'text-white'}`}
                      >
                        {backstory.label}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{backstory.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setScreen('main-menu')}
                className="flex-1 px-6 py-4 text-lg font-semibold text-white bg-slate-700 hover:bg-slate-600 border border-slate-600 rounded-lg transition-all duration-300 hover:scale-105"
              >
                🏠 Back to Menu
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-4 text-lg font-semibold text-white bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-400 hover:to-blue-400 border border-green-400 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-400/50"
              >
                ✨ Create Character
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
