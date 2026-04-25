import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { MainMenu } from '../components/MainMenu';
import { CharacterCreation } from '../components/CharacterCreation';
import { MainHub } from '../components/MainHub';
import { EnhancedCharacterInteraction } from '../components/EnhancedCharacterInteraction';
import { ActivitiesScreen } from '../components/ActivitiesScreen';
import { CharacterProfile } from '../components/CharacterProfile';
import { DatePlanning } from '../components/DatePlanning';
import { PhotoGallery } from '../components/PhotoGallery';
import { Achievements } from '../components/Achievements';
import { RelationshipTimeline } from '../components/RelationshipTimeline';
import { SelfImprovementScreen } from '../components/SelfImprovementScreen';
import { CharacterJournal } from '../components/CharacterJournal';

export function GamePage() {
  const currentScreen = useGameStore(state => state.currentScreen);
  const isLoading = useGameStore(state => state.isLoading);
  const error = useGameStore(state => state.error);

  const renderScreen = () => {
    switch (currentScreen) {
      case 'main-menu':
        return <MainMenu />;
      case 'character-creation':
        return <CharacterCreation />;
      case 'main-hub':
        return <MainHub />;
      case 'character-interaction':
        return <EnhancedCharacterInteraction />;
      case 'character-profile':
        return <CharacterProfile />;
      case 'date-planning':
        return <DatePlanning />;
      case 'photo-gallery':
        return <PhotoGallery />;
      case 'achievements':
        return <Achievements />;
      case 'relationship-timeline':
        return <RelationshipTimeline />;
      case 'character-journal':
        return <CharacterJournal />;
      case 'activities':
        return <ActivitiesScreen />;
      case 'self-improvement':
        return <SelfImprovementScreen />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="stellaris-theme min-h-screen relative">
      <div className="starfield"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <div className="bg-[var(--bg-panel)] border border-[var(--border-frame)] rounded-lg p-8 text-center">
              <div className="text-xl text-[var(--text-primary)]">Loading save data...</div>
            </div>
          </div>
        ) : (
          <>
            {error && (
              <div className="mx-auto mb-4 max-w-3xl rounded-lg border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-100">
                {error}
              </div>
            )}
            {renderScreen()}
          </>
        )}
      </div>
    </div>
  );
}
