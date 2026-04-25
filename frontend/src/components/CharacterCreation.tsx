import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { PlayerCreationInput, Gender, SexualPreference } from '../types/game';
import { Button } from './ui/Button';
import { StatePanel } from './ui/StatePanel';

export const CharacterCreation: React.FC = () => {
  const { setScreen, createPlayer, isSaving } = useGameStore();

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
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || formData.traits.length !== 2) {
      setValidationMessage('Enter your name and select exactly two traits before launching.');
      return;
    }

    const player: PlayerCreationInput = {
      name: formData.name,
      species: formData.species,
      gender: formData.gender,
      sexualPreference: formData.sexualPreference,
      traits: formData.traits,
      backstory: formData.backstory,
    };

    try {
      await createPlayer(player);
    } catch (error) {
      setValidationMessage(
        error instanceof Error ? error.message : 'Unable to create your character.'
      );
    }
  };

  const selectionClass = (selected: boolean, disabled = false) =>
    `p-4 rounded-lg border-2 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--bg-space)] ${
      selected
        ? 'border-[var(--accent-cyan)] bg-[var(--accent-cyan)]/15 shadow-lg shadow-[rgba(0,212,255,0.18)] scale-105'
        : disabled
          ? 'border-[var(--state-locked)] bg-[var(--bg-item)]/50 opacity-50 cursor-not-allowed'
          : 'border-[var(--border-inner)] bg-[var(--bg-item)] hover:border-[var(--accent-cyan)] hover:bg-[var(--bg-section)]'
    }`;

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
    <div className="min-h-screen py-8">
      {/* Space background with subtle stars */}
      <div className="fixed inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-t from-transparent via-[var(--accent-cyan)]/5 to-transparent"></div>
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4">
        {/* Main Panel */}
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-8 backdrop-blur-md shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-[var(--text-primary)] tracking-wide uppercase mb-2">
              Character Creation
              <span className="cursor"></span>
            </h2>
            <p className="text-[var(--text-secondary)] text-lg">Design your interstellar persona</p>
          </div>

          {validationMessage && (
            <StatePanel
              variant="unavailable"
              icon="⚠"
              title="Launch Requirements Missing"
              message={validationMessage}
              className="mb-6 p-4"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name Input */}
            <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6 mb-6">
              <label className="block text-[var(--accent-cyan)] text-sm font-semibold mb-3 uppercase tracking-wide">
                Character Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => {
                  setFormData(prev => ({ ...prev, name: e.target.value }));
                  setValidationMessage(null);
                }}
                className="w-full px-4 py-3 bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:border-[var(--accent-cyan)] focus:outline-none focus:ring-1 focus:ring-[var(--accent-cyan)] transition-colors"
                placeholder="Enter your name..."
              />
            </div>

            {/* Species Selection Grid */}
            <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6 mb-6">
              <label className="block text-[var(--accent-cyan)] text-sm font-semibold mb-4 uppercase tracking-wide">
                Species
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {species.map(spec => (
                  <button
                    key={spec.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, species: spec.value }))}
                    className={selectionClass(formData.species === spec.value)}
                  >
                    <div className="text-3xl mb-2">{spec.icon}</div>
                    <div
                      className={`font-semibold ${formData.species === spec.value ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-primary)]'}`}
                    >
                      {spec.label}
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">{spec.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gender Selection Grid */}
            <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6 mb-6">
              <label className="block text-[var(--accent-cyan)] text-sm font-semibold mb-4 uppercase tracking-wide">
                Gender
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {genders.map(gender => (
                  <button
                    key={gender.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, gender: gender.value }))}
                    className={selectionClass(formData.gender === gender.value)}
                  >
                    <div className="text-3xl mb-2">{gender.icon}</div>
                    <div
                      className={`font-semibold ${formData.gender === gender.value ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-primary)]'}`}
                    >
                      {gender.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Traits Selection Grid */}
            <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6 mb-6">
              <label className="block text-[var(--accent-cyan)] text-sm font-semibold mb-3 uppercase tracking-wide">
                Choose Traits ({formData.traits.length}/2 selected)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {traits.map(trait => (
                  <button
                    key={trait.id}
                    type="button"
                    onClick={() => handleTraitToggle(trait.id)}
                    disabled={!formData.traits.includes(trait.id) && formData.traits.length >= 2}
                    className={`${selectionClass(
                      formData.traits.includes(trait.id),
                      !formData.traits.includes(trait.id) && formData.traits.length >= 2
                    )} text-left`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{trait.icon}</span>
                      <span
                        className={`font-semibold ${formData.traits.includes(trait.id) ? 'text-[var(--state-available)]' : 'text-[var(--text-primary)]'}`}
                      >
                        {trait.label}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--resource-energy)]">{trait.bonus}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Sexual Preference Selection Grid */}
            <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6 mb-6">
              <label className="block text-[var(--accent-cyan)] text-sm font-semibold mb-4 uppercase tracking-wide">
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
                    className={`${selectionClass(formData.sexualPreference === preference.value)} text-left`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{preference.icon}</span>
                      <span
                        className={`font-semibold ${formData.sexualPreference === preference.value ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-primary)]'}`}
                      >
                        {preference.label}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">{preference.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Backstory Selection Grid */}
            <div className="bg-[var(--bg-section)] border border-[var(--border-inner)] rounded-lg p-6 mb-6">
              <label className="block text-[var(--accent-cyan)] text-sm font-semibold mb-4 uppercase tracking-wide">
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
                    className={`${selectionClass(formData.backstory === backstory.value)} text-left`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{backstory.icon}</span>
                      <span
                        className={`font-semibold ${formData.backstory === backstory.value ? 'text-[var(--accent-cyan)]' : 'text-[var(--text-primary)]'}`}
                      >
                        {backstory.label}
                      </span>
                    </div>
                    <div className="text-xs text-[var(--text-muted)]">{backstory.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Button
                type="button"
                onClick={() => setScreen('main-menu')}
                variant="secondary"
                size="lg"
                fullWidth
              >
                🏠 Back to Menu
              </Button>
              <Button type="submit" variant="primary" size="lg" fullWidth disabled={isSaving}>
                {isSaving ? 'Creating...' : '✨ Create Character'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
