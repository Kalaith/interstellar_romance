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

export function GamePage() {
  const currentScreen = useGameStore(state => state.currentScreen);

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
      case 'activities':
        return <ActivitiesScreen />;
      default:
        return <MainMenu />;
    }
  };

  return (
    <div className="stellaris-theme min-h-screen">
      <div className="starfield"></div>
      <div className="container">
        {renderScreen()}
      </div>
    </div>
  );
}