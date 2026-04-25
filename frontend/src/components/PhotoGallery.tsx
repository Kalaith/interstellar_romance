import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { CharacterPhoto, PhotoRarity } from '../types/game';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { ProgressBar } from './ui/ProgressBar';

export const PhotoGallery: React.FC = () => {
  const { selectedCharacter, setScreen } = useGameStore();
  const [selectedPhoto, setSelectedPhoto] = useState<CharacterPhoto | null>(null);
  const [filterRarity, setFilterRarity] = useState<PhotoRarity | 'all'>('all');

  if (!selectedCharacter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-8 text-center">
          <p className="text-xl text-[var(--text-primary)] mb-4">No character selected!</p>
          <Button onClick={() => setScreen('main-hub')}>Back to Hub</Button>
        </div>
      </div>
    );
  }

  const allPhotos = selectedCharacter.photoGallery;
  const unlockedPhotos = allPhotos.filter(photo => photo.unlocked);
  const nextPhoto = [...allPhotos]
    .filter(photo => !photo.unlocked && photo.unlockedAt > selectedCharacter.affection)
    .sort((a, b) => a.unlockedAt - b.unlockedAt)[0];

  const filteredPhotos =
    filterRarity === 'all' ? allPhotos : allPhotos.filter(photo => photo.rarity === filterRarity);

  const rarityColors: Record<PhotoRarity, string> = {
    common: 'border-gray-400 bg-gray-900/20',
    uncommon: 'border-green-400 bg-green-900/20',
    rare: 'border-blue-400 bg-blue-900/20',
    epic: 'border-purple-400 bg-purple-900/20',
    legendary: 'border-yellow-400 bg-yellow-900/20',
  };

  const rarityIcons: Record<PhotoRarity, string> = {
    common: '⚪',
    uncommon: '🟢',
    rare: '🔵',
    epic: '🟣',
    legendary: '🟡',
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[var(--text-primary)] uppercase tracking-wide">
                  {selectedCharacter.name}'s Photo Gallery
                </h1>
                <p className="text-[var(--text-secondary)]">
                  {unlockedPhotos.length} of {allPhotos.length} photos unlocked
                </p>
              </div>
              <Button onClick={() => setScreen('character-profile')} variant="secondary">
                Back to Profile
              </Button>
            </div>
          </div>

          {/* Progress & Next Photo */}
          <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Progress */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-[var(--accent-cyan)] uppercase tracking-wide">
                  Collection Progress
                </h3>
                <div className="space-y-3">
                  {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as PhotoRarity[]).map(
                    rarity => {
                      const rarityPhotos = allPhotos.filter(photo => photo.rarity === rarity);
                      const unlockedRarity = unlockedPhotos.filter(photo => photo.rarity === rarity);

                      return (
                        <div key={rarity} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span>{rarityIcons[rarity]}</span>
                            <span className="capitalize text-[var(--text-secondary)]">
                              {rarity}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-[var(--text-primary)]">
                              {unlockedRarity.length}/{rarityPhotos.length}
                            </span>
                            <div className="w-20 bg-[var(--bg-item)] border border-[var(--border-inner)] rounded-full h-2 overflow-hidden">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${
                                  rarity === 'common'
                                    ? 'bg-gray-400'
                                    : rarity === 'uncommon'
                                      ? 'bg-green-400'
                                      : rarity === 'rare'
                                        ? 'bg-blue-400'
                                        : rarity === 'epic'
                                          ? 'bg-purple-400'
                                          : 'bg-yellow-400'
                                }`}
                                style={{
                                  width: `${rarityPhotos.length > 0 ? (unlockedRarity.length / rarityPhotos.length) * 100 : 0}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Next Photo */}
              {nextPhoto && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-[var(--resource-energy)] uppercase tracking-wide">
                    Next Photo to Unlock
                  </h3>
                  <div className={`border-2 rounded-lg p-4 ${rarityColors[nextPhoto.rarity]}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <span>{rarityIcons[nextPhoto.rarity]}</span>
                      <h4 className="font-semibold">{nextPhoto.title}</h4>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      {nextPhoto.description}
                    </p>
                    <div className="text-sm">
                      <span className="text-[var(--text-muted)]">Unlocks at: </span>
                      <span className="font-semibold">{nextPhoto.unlockedAt} affection</span>
                      <span className="text-[var(--text-muted)]">
                        {' '}
                        (Current: {selectedCharacter.affection})
                      </span>
                    </div>
                    <ProgressBar
                      value={Math.min(
                        100,
                        (selectedCharacter.affection / nextPhoto.unlockedAt) * 100
                      )}
                      variant="affection"
                      size="sm"
                      className="mt-2"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filter Controls */}
          <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFilterRarity('all')}
                className={`px-4 py-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--bg-space)] ${
                  filterRarity === 'all'
                    ? 'bg-[var(--accent-cyan)] text-[var(--bg-space)]'
                    : 'bg-[var(--bg-section)] border border-[var(--border-inner)] text-[var(--text-secondary)] hover:bg-[var(--bg-item)]'
                }`}
              >
                All Photos
              </button>
              {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as PhotoRarity[]).map(
                rarity => (
                  <button
                    key={rarity}
                    onClick={() => setFilterRarity(rarity)}
                    className={`px-4 py-2 rounded-lg transition-colors capitalize flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[var(--accent-cyan)] focus:ring-offset-2 focus:ring-offset-[var(--bg-space)] ${
                      filterRarity === rarity
                        ? 'bg-[var(--accent-cyan)] text-[var(--bg-space)]'
                        : 'bg-[var(--bg-section)] border border-[var(--border-inner)] text-[var(--text-secondary)] hover:bg-[var(--bg-item)]'
                    }`}
                  >
                    <span>{rarityIcons[rarity]}</span>
                    <span>{rarity}</span>
                  </button>
                )
              )}
            </div>
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {filteredPhotos.map(photo => (
              <div
                key={photo.id}
                onClick={() => photo.unlocked && setSelectedPhoto(photo)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  photo.unlocked
                    ? `cursor-pointer hover:scale-105 ${rarityColors[photo.rarity]}`
                    : 'border-[var(--state-locked)] bg-[var(--bg-item)]/60 cursor-not-allowed'
                }`}
              >
                {photo.unlocked ? (
                  <div className="relative w-full h-full">
                    <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2">
                      <span className="text-lg">{rarityIcons[photo.rarity]}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/75 p-2">
                      <h4 className="text-[var(--text-primary)] text-sm font-semibold truncate">
                        {photo.title}
                      </h4>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[var(--bg-item)]">
                    <div className="text-center text-[var(--text-muted)]">
                      <div className="text-3xl mb-2">🔒</div>
                      <div className="text-xs">
                        Unlock at
                        <br />
                        {photo.unlockedAt} affection
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Modal
            isOpen={!!selectedPhoto}
            onClose={() => setSelectedPhoto(null)}
            title={selectedPhoto?.title}
            modalSize="xl"
          >
            {selectedPhoto && (
              <div>
                <div className="relative -m-6 mb-6">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${
                        selectedPhoto.rarity === 'common'
                          ? 'bg-gray-600 text-white'
                          : selectedPhoto.rarity === 'uncommon'
                            ? 'bg-green-600 text-white'
                            : selectedPhoto.rarity === 'rare'
                              ? 'bg-blue-600 text-white'
                              : selectedPhoto.rarity === 'epic'
                                ? 'bg-purple-600 text-white'
                                : 'bg-yellow-600 text-black'
                      }`}
                    >
                      <span>{rarityIcons[selectedPhoto.rarity]}</span>
                      <span className="capitalize">{selectedPhoto.rarity}</span>
                    </span>
                  </div>
                </div>
                <div className="text-[var(--text-primary)]">
                  <p className="text-[var(--text-secondary)] mb-4">{selectedPhoto.description}</p>
                  <div className="text-sm text-[var(--text-muted)]">
                    {selectedPhoto.unlockedDate && (
                      <p>Unlocked on: {selectedPhoto.unlockedDate.toLocaleDateString()}</p>
                    )}
                    <p>Required affection: {selectedPhoto.unlockedAt}</p>
                  </div>
                </div>
              </div>
            )}
          </Modal>
        </div>
      </div>
    </div>
  );
};
