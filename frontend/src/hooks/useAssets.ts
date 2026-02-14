import { useState, useEffect } from 'react';
import { assetManager, preloadCharacterAssets, validateAllAssets } from '../utils/assetManager';

interface AssetLoadingState {
  isLoading: boolean;
  loaded: number;
  total: number;
  errors: string[];
  validAssets: string[];
  invalidAssets: string[];
}

export const useAssetLoader = () => {
  const [state, setState] = useState<AssetLoadingState>({
    isLoading: true,
    loaded: 0,
    total: 0,
    errors: [],
    validAssets: [],
    invalidAssets: [],
  });

  useEffect(() => {
    let isMounted = true;

    const loadAssets = async () => {
      try {
        setState(prev => ({ ...prev, isLoading: true }));

        // Get total number of character assets
        const characterAssets = assetManager.getAllAssets('character');

        if (isMounted) {
          setState(prev => ({
            ...prev,
            total: characterAssets.length,
            loaded: 0,
          }));
        }

        // Preload character assets
        await preloadCharacterAssets();

        // Validate all assets
        const { valid, invalid } = await validateAllAssets();

        if (isMounted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            loaded: valid.length,
            validAssets: valid,
            invalidAssets: invalid,
            errors: invalid.length > 0 ? [`Failed to load ${invalid.length} assets`] : [],
          }));
        }

        // Log results in development
        if (import.meta.env.DEV) {
          console.log('Asset Loading Complete:', {
            valid: valid.length,
            invalid: invalid.length,
            invalidAssets: invalid,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState(prev => ({
            ...prev,
            isLoading: false,
            errors: [...prev.errors, `Asset loading failed: ${error}`],
          }));
        }
        console.error('Asset loading error:', error);
      }
    };

    loadAssets();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    ...state,
    progress: state.total > 0 ? (state.loaded / state.total) * 100 : 0,
    hasErrors: state.errors.length > 0 || state.invalidAssets.length > 0,
    isComplete: !state.isLoading && state.loaded === state.total,
  };
};

// Hook to get specific character image status
export const useCharacterImage = (characterId: string) => {
  const [imageStatus, setImageStatus] = useState<{
    isLoaded: boolean;
    src: string;
    error: boolean;
  }>({
    isLoaded: false,
    src: '',
    error: false,
  });

  useEffect(() => {
    const assetId = `character_${characterId}`;
    const imagePath = assetManager.getAssetPath(assetId);

    setImageStatus(prev => ({ ...prev, src: imagePath }));

    // Test if image loads
    const img = new Image();
    img.onload = () => {
      setImageStatus(prev => ({
        ...prev,
        isLoaded: true,
        error: false,
      }));
    };
    img.onerror = () => {
      setImageStatus(prev => ({
        ...prev,
        isLoaded: false,
        error: true,
      }));
    };
    img.src = imagePath;

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [characterId]);

  return imageStatus;
};

// Hook for asset management utilities
export const useAssetManager = () => {
  return {
    getCharacterImage: (characterId: string) => assetManager.getCharacterImage(characterId),
    preloadAssets: () => preloadCharacterAssets(),
    validateAssets: () => validateAllAssets(),
    getAllAssets: (category?: 'character' | 'background' | 'ui' | 'misc') =>
      assetManager.getAllAssets(category),
  };
};
