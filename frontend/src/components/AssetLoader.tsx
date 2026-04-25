import React from 'react';
import { useAssetLoader } from '../hooks/useAssets';
import { getCharacterImage } from '../utils/assetManager';
import { ProgressBar } from './ui/ProgressBar';
import { StatePanel } from './ui/StatePanel';

interface AssetLoaderProps {
  children: React.ReactNode;
  showProgress?: boolean;
  fallback?: React.ReactNode;
}

export const AssetLoader: React.FC<AssetLoaderProps> = ({
  children,
  showProgress = false,
  fallback,
}) => {
  const { isLoading, progress, hasErrors, isComplete, errors, invalidAssets, loaded, total } =
    useAssetLoader();

  // If loading is complete or we don't want to show loading state, render children
  if (isComplete || !showProgress) {
    return <>{children}</>;
  }

  // If we have a custom fallback, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default loading UI
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <StatePanel
          variant="loading"
          icon={
            <div className="w-16 h-16 mx-auto border-4 border-[var(--accent-cyan)] border-t-transparent rounded-full animate-spin" />
          }
          title="Loading Game Assets"
          message="Preparing your interstellar romance adventure..."
          className="w-full max-w-md"
        >
          <ProgressBar value={progress} variant="progress" size="md" showValue className="mt-4" />
          <div className="mt-2 text-sm text-[var(--text-secondary)]">
            {loaded} of {total} assets loaded ({Math.round(progress)}%)
          </div>

          {hasErrors && (
            <div className="mt-4 text-[var(--resource-energy)] text-sm">
              <p>Some assets are using fallbacks</p>
              {import.meta.env.DEV && invalidAssets.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer">Debug Info</summary>
                  <div className="text-xs text-left bg-[var(--bg-item)] border border-[var(--border-inner)] rounded p-2 mt-1">
                    <p>Invalid assets: {invalidAssets.join(', ')}</p>
                    {errors.map((error, index) => (
                      <p key={index} className="text-[var(--state-deficit)]">
                        {error}
                      </p>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}
        </StatePanel>
      </div>
    );
  }

  // Render children if not loading
  return <>{children}</>;
};

// Simple character image component with fallback handling
interface CharacterImageProps {
  characterId: string;
  alt?: string;
  className?: string;
  fallbackClassName?: string;
}

export const CharacterImage: React.FC<CharacterImageProps> = ({
  characterId,
  alt,
  className = '',
  fallbackClassName = 'bg-[var(--bg-item)]',
}) => {
  const [imageState, setImageState] = React.useState<{
    loaded: boolean;
    error: boolean;
    src: string;
  }>({
    loaded: false,
    error: false,
    src: '',
  });

  const [imageSrc, setImageSrc] = React.useState<string>('');

  React.useEffect(() => {
    const src = getCharacterImage(characterId);
    setImageSrc(src);
    setImageState({ loaded: false, error: false, src });
  }, [characterId]);

  const handleImageLoad = () => {
    setImageState(prev => ({ ...prev, loaded: true, error: false }));
  };

  const handleImageError = () => {
    setImageState(prev => ({ ...prev, loaded: false, error: true }));
  };

  // Show loading placeholder while image source is being determined
  if (!imageSrc) {
    return (
      <div className={`${className} ${fallbackClassName} flex items-center justify-center`}>
        <div className="animate-pulse text-[var(--text-muted)] text-xs">Loading...</div>
      </div>
    );
  }

  // Show error placeholder if image failed to load
  if (imageState.error) {
    return (
      <div
        className={`${className} ${fallbackClassName} flex items-center justify-center text-center p-2`}
      >
        <div className="text-[var(--text-muted)] text-xs">
          <div className="mb-1">📷</div>
          <div>Image Unavailable</div>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt || `${characterId} character image`}
      className={`${className} ${!imageState.loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      onLoad={handleImageLoad}
      onError={handleImageError}
    />
  );
};
