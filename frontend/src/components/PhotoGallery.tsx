import React, { useState } from 'react';
import { useGameStore } from '../stores/gameStore';
import { CharacterPhoto, PhotoRarity } from '../types/game';
import { getPhotosByRarity, getUnlockedPhotos, getNextPhotoToUnlock } from '../data/photo-galleries';

export const PhotoGallery: React.FC = () => {
  const { selectedCharacter, setScreen } = useGameStore();
  const [selectedPhoto, setSelectedPhoto] = useState<CharacterPhoto | null>(null);
  const [filterRarity, setFilterRarity] = useState<PhotoRarity | 'all'>('all');

  if (!selectedCharacter) {
    return (
      <div className="min-h-screen bg-slate-800 flex items-center justify-center">
        <div className="text-white text-center">
          <p className="text-xl mb-4">No character selected!</p>
          <button
            onClick={() => setScreen('main-hub')}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            Back to Hub
          </button>
        </div>
      </div>
    );
  }

  const allPhotos = selectedCharacter.photoGallery;
  const unlockedPhotos = getUnlockedPhotos(allPhotos);
  const nextPhoto = getNextPhotoToUnlock(allPhotos, selectedCharacter.affection);

  const filteredPhotos = filterRarity === 'all'
    ? allPhotos
    : getPhotosByRarity(allPhotos, filterRarity);

  const rarityColors: Record<PhotoRarity, string> = {
    common: 'border-gray-400 bg-gray-900/20',
    uncommon: 'border-green-400 bg-green-900/20',
    rare: 'border-blue-400 bg-blue-900/20',
    epic: 'border-purple-400 bg-purple-900/20',
    legendary: 'border-yellow-400 bg-yellow-900/20'
  };

  const rarityIcons: Record<PhotoRarity, string> = {
    common: '⚪',
    uncommon: '🟢',
    rare: '🔵',
    epic: '🟣',
    legendary: '🟡'
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-800 to-blue-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white">{selectedCharacter.name}'s Photo Gallery</h1>
              <p className="text-gray-300">
                {unlockedPhotos.length} of {allPhotos.length} photos unlocked
              </p>
            </div>
            <button
              onClick={() => setScreen('character-profile')}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors"
            >
              Back to Profile
            </button>
          </div>

          {/* Progress & Next Photo */}
          <div className="bg-slate-900 rounded-lg p-6 mb-8 text-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Progress */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-300">Collection Progress</h3>
                <div className="space-y-3">
                  {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as PhotoRarity[]).map(rarity => {
                    const rarityPhotos = getPhotosByRarity(allPhotos, rarity);
                    const unlockedRarity = getPhotosByRarity(unlockedPhotos, rarity);

                    return (
                      <div key={rarity} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span>{rarityIcons[rarity]}</span>
                          <span className="capitalize">{rarity}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm">{unlockedRarity.length}/{rarityPhotos.length}</span>
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${
                                rarity === 'common' ? 'bg-gray-400' :
                                rarity === 'uncommon' ? 'bg-green-400' :
                                rarity === 'rare' ? 'bg-blue-400' :
                                rarity === 'epic' ? 'bg-purple-400' : 'bg-yellow-400'
                              }`}
                              style={{
                                width: `${rarityPhotos.length > 0 ? (unlockedRarity.length / rarityPhotos.length) * 100 : 0}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Photo */}
              {nextPhoto && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-yellow-300">Next Photo to Unlock</h3>
                  <div className={`border-2 rounded-lg p-4 ${rarityColors[nextPhoto.rarity]}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <span>{rarityIcons[nextPhoto.rarity]}</span>
                      <h4 className="font-semibold">{nextPhoto.title}</h4>
                    </div>
                    <p className="text-sm text-gray-300 mb-3">{nextPhoto.description}</p>
                    <div className="text-sm">
                      <span className="text-gray-400">Unlocks at: </span>
                      <span className="font-semibold">{nextPhoto.unlockedAt} affection</span>
                      <span className="text-gray-400"> (Current: {selectedCharacter.affection})</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min(100, (selectedCharacter.affection / nextPhoto.unlockedAt) * 100)}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setFilterRarity('all')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filterRarity === 'all'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              All Photos
            </button>
            {(['common', 'uncommon', 'rare', 'epic', 'legendary'] as PhotoRarity[]).map(rarity => (
              <button
                key={rarity}
                onClick={() => setFilterRarity(rarity)}
                className={`px-4 py-2 rounded-lg transition-colors capitalize flex items-center space-x-2 ${
                  filterRarity === rarity
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                <span>{rarityIcons[rarity]}</span>
                <span>{rarity}</span>
              </button>
            ))}
          </div>

          {/* Photo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
            {filteredPhotos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => photo.unlocked && setSelectedPhoto(photo)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                  photo.unlocked
                    ? `cursor-pointer hover:scale-105 ${rarityColors[photo.rarity]}`
                    : 'border-gray-600 bg-gray-800/50 cursor-not-allowed'
                }`}
              >
                {photo.unlocked ? (
                  <div className="relative w-full h-full">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <span className="text-lg">{rarityIcons[photo.rarity]}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-2">
                      <h4 className="text-white text-sm font-semibold truncate">{photo.title}</h4>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <div className="text-center text-gray-400">
                      <div className="text-3xl mb-2">🔒</div>
                      <div className="text-xs">
                        Unlock at<br />
                        {photo.unlockedAt} affection
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Photo Modal */}
          {selectedPhoto && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-slate-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="relative">
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                  <button
                    onClick={() => setSelectedPhoto(null)}
                    className="absolute top-4 right-4 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  >
                    ✕
                  </button>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1 ${
                      selectedPhoto.rarity === 'common' ? 'bg-gray-600 text-white' :
                      selectedPhoto.rarity === 'uncommon' ? 'bg-green-600 text-white' :
                      selectedPhoto.rarity === 'rare' ? 'bg-blue-600 text-white' :
                      selectedPhoto.rarity === 'epic' ? 'bg-purple-600 text-white' : 'bg-yellow-600 text-black'
                    }`}>
                      <span>{rarityIcons[selectedPhoto.rarity]}</span>
                      <span className="capitalize">{selectedPhoto.rarity}</span>
                    </span>
                  </div>
                </div>
                <div className="p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{selectedPhoto.title}</h3>
                  <p className="text-gray-300 mb-4">{selectedPhoto.description}</p>
                  <div className="text-sm text-gray-400">
                    {selectedPhoto.unlockedDate && (
                      <p>Unlocked on: {selectedPhoto.unlockedDate.toLocaleDateString()}</p>
                    )}
                    <p>Required affection: {selectedPhoto.unlockedAt}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};