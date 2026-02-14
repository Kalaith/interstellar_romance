// Asset management system for game resources
import { Logger } from '../services/Logger';

export type AssetCategory = 'character' | 'background' | 'ui' | 'misc';
export type AssetType = 'image' | 'video' | 'audio';

interface AssetMetadata {
  id: string;
  category: AssetCategory;
  type: AssetType;
  path: string;
  fallbackPath?: string;
  description?: string;
  preload?: boolean;
}

class AssetManager {
  private assets = new Map<string, AssetMetadata>();
  private loadedAssets = new Map<string, boolean>();
  private fallbackImage =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzMzMzMzMyIvPgogIDx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjNjY2NjY2IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zZW0iIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0cHgiPkltYWdlIFVuYXZhaWxhYmxlPC90ZXh0Pgo8L3N2Zz4K';

  constructor() {
    this.initializeCharacterAssets();
  }

  private initializeCharacterAssets() {
    const characterIds = [
      'kyrathen',
      'seraphina',
      'thessarian',
      'lyralynn',
      'zarantha',
      'thalassos',
      'nightshade',
      'kronos',
    ];

    characterIds.forEach(characterId => {
      this.registerAsset({
        id: `character_${characterId}`,
        category: 'character',
        type: 'image',
        path: `./images/characters/${characterId}.png`,
        fallbackPath: this.fallbackImage,
        description: `Portrait image for ${characterId}`,
        preload: true,
      });
    });
  }

  registerAsset(asset: AssetMetadata): void {
    this.assets.set(asset.id, asset);
  }

  getAssetPath(id: string): string {
    const asset = this.assets.get(id);
    if (!asset) {
      Logger.warn(`Asset not found: ${id}`);
      return this.fallbackImage;
    }

    // Check if the asset is actually loadable
    if (asset.type === 'image' && !this.isImageLoadable(asset.path)) {
      Logger.warn(`Image asset not loadable: ${asset.path}, using fallback`);
      return asset.fallbackPath || this.fallbackImage;
    }

    return asset.path;
  }

  getCharacterImage(characterId: string): string {
    return this.getAssetPath(`character_${characterId}`);
  }

  private isImageLoadable(imagePath: string): boolean {
    // For now, assume all paths starting with / are valid
    // In a more sophisticated system, this would check if the file exists
    return (
      imagePath.startsWith('/') ||
      imagePath.startsWith('./') ||
      imagePath.startsWith('http') ||
      imagePath.startsWith('data:')
    );
  }

  async preloadAssets(category?: AssetCategory): Promise<void> {
    const assetsToPreload = Array.from(this.assets.values()).filter(
      asset => asset.preload && (!category || asset.category === category) && asset.type === 'image'
    );

    const preloadPromises = assetsToPreload.map(asset => this.preloadImage(asset));

    try {
      await Promise.all(preloadPromises);
      Logger.info(`Preloaded ${assetsToPreload.length} assets`);
    } catch (error) {
      Logger.warn('Some assets failed to preload:', error);
    }
  }

  private async preloadImage(asset: AssetMetadata): Promise<void> {
    return new Promise(resolve => {
      const img = new Image();

      img.onload = () => {
        this.loadedAssets.set(asset.id, true);
        resolve();
      };

      img.onerror = () => {
        Logger.warn(`Failed to preload image: ${asset.path}`);
        this.loadedAssets.set(asset.id, false);
        // Don't reject - we want to continue loading other assets
        resolve();
      };

      img.src = asset.path;
    });
  }

  isAssetLoaded(id: string): boolean {
    return this.loadedAssets.get(id) === true;
  }

  getAllAssets(category?: AssetCategory): AssetMetadata[] {
    const assets = Array.from(this.assets.values());
    return category ? assets.filter(asset => asset.category === category) : assets;
  }

  getAssetInfo(id: string): AssetMetadata | undefined {
    return this.assets.get(id);
  }

  // Utility method for development - validates that all registered assets exist
  async validateAssets(): Promise<{ valid: string[]; invalid: string[] }> {
    const valid: string[] = [];
    const invalid: string[] = [];

    for (const [id, asset] of this.assets.entries()) {
      if (asset.type === 'image') {
        try {
          await this.preloadImage(asset);
          if (this.loadedAssets.get(id)) {
            valid.push(id);
          } else {
            invalid.push(id);
          }
        } catch {
          invalid.push(id);
        }
      }
    }

    return { valid, invalid };
  }
}

// Create singleton instance
export const assetManager = new AssetManager();

// Utility functions for easy use in components
export const getCharacterImage = (characterId: string): string => {
  return assetManager.getCharacterImage(characterId);
};

export const preloadCharacterAssets = async (): Promise<void> => {
  return assetManager.preloadAssets('character');
};

export const validateAllAssets = async (): Promise<{
  valid: string[];
  invalid: string[];
}> => {
  return assetManager.validateAssets();
};

// Hook for React components to get asset loading status
export const useAssetStatus = (assetId: string) => {
  return {
    isLoaded: assetManager.isAssetLoaded(assetId),
    path: assetManager.getAssetPath(assetId),
  };
};
