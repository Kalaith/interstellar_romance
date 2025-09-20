import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { PlayerCharacter } from '../types/game';

export const CharacterCreation: React.FC = () => {
  const { setScreen, createPlayer } = useGameStore();
  
  const [formData, setFormData] = useState({
    name: '',
    species: 'human' as const,
    traits: [] as string[],
    backstory: 'diplomat'
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
      traits: formData.traits,
      backstory: formData.backstory,
      stats: {
        charisma: 5 + (formData.traits.includes('charismatic') ? 2 : 0),
        intelligence: 5 + (formData.traits.includes('intelligent') ? 2 : 0),
        adventure: 5 + (formData.traits.includes('adventurous') ? 2 : 0),
        empathy: 5 + (formData.traits.includes('empathetic') ? 2 : 0),
        technology: 5 + (formData.traits.includes('tech-savvy') ? 2 : 0)
      }
    };

    createPlayer(player);
  };

  const traits = [
    { id: 'charismatic', label: 'Charismatic (+2 Charisma)' },
    { id: 'intelligent', label: 'Intelligent (+2 Intelligence)' },
    { id: 'adventurous', label: 'Adventurous (+2 Adventure)' },
    { id: 'empathetic', label: 'Empathetic (+2 Empathy)' },
    { id: 'tech-savvy', label: 'Tech-Savvy (+2 Technology)' }
  ];

  const backstories = [
    { value: 'diplomat', label: 'Diplomat - Skilled in negotiation and cultural exchange' },
    { value: 'explorer', label: 'Explorer - Experienced in discovering new worlds' },
    { value: 'merchant', label: 'Merchant - Expert in trade and commerce' },
    { value: 'scientist', label: 'Scientist - Researcher of galactic phenomena' },
    { value: 'military', label: 'Military Officer - Trained in strategy and combat' }
  ];

  return (
    <div className="min-h-screen py-8">
      <div className="mx-auto max-w-2xl px-4">
        <div className="card">
          <h2 className="brand text-2xl md:text-3xl mb-6 text-center">Create Your Character<span className="cursor"></span></h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="subtitle block text-sm mb-2">Character Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md bg-slate-800 border-cyan-400/20 text-cyan-100 placeholder-cyan-300/50"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label className="subtitle block text-sm mb-2">Species</label>
              <select
                value={formData.species}
                onChange={(e) => setFormData(prev => ({ ...prev, species: e.target.value as any }))}
                className="w-full px-3 py-2 border rounded-md bg-slate-800 border-cyan-400/20 text-cyan-100"
              >
                <option value="human">Human</option>
                <option value="plantoid">Plantoid</option>
                <option value="aquatic">Aquatic</option>
                <option value="reptilian">Reptilian</option>
              </select>
            </div>

            <div>
              <label className="subtitle block text-sm mb-2">
                Choose Your Traits (Select 2) - <span className="value">{formData.traits.length}/2</span> selected
              </label>
              <div className="space-y-2">
                {traits.map((trait) => (
                  <label key={trait.id} className="card flex items-center space-x-2 cursor-pointer hover:opacity-80">
                    <input
                      type="checkbox"
                      checked={formData.traits.includes(trait.id)}
                      onChange={() => handleTraitToggle(trait.id)}
                      className="rounded accent-cyan-400"
                    />
                    <span className={formData.traits.includes(trait.id) ? 'value' : ''}>{trait.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="subtitle block text-sm mb-2">Backstory</label>
              <select
                value={formData.backstory}
                onChange={(e) => setFormData(prev => ({ ...prev, backstory: e.target.value }))}
                className="w-full px-3 py-2 border rounded-md bg-slate-800 border-cyan-400/20 text-cyan-100"
              >
                {backstories.map((backstory) => (
                  <option key={backstory.value} value={backstory.value}>
                    {backstory.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={() => setScreen('main-menu')}
                className="btn ghost flex-1 px-6 py-3 text-lg"
              >
                🏠 Back to Menu
              </button>
              <button
                type="submit"
                className="btn primary neon-outline flex-1 px-6 py-3 text-lg"
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
