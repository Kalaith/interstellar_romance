import React from 'react';
import { useAssetLoader } from '../hooks/useAssets';

interface AssetLoaderProps {
  children: React.ReactNode;
  showProgress?: boolean;
  fallback?: React.ReactNode;
}

export const AssetLoader: React.FC<AssetLoaderProps> = ({
  children,
  showProgress = false,
  fallback
}) => {
  const {
    isLoading,
    progress,
    hasErrors,
    isComplete,
    errors,
    invalidAssets,
    loaded,
    total
  } = useAssetLoader();

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
      <div className="min-h-screen bg-gradient-to-b from-slate-800 to-blue-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <h2 className="text-2xl font-bold mb-2">Loading Game Assets</h2>
            <p className="text-blue-200">Preparing your interstellar romance adventure...</p>
          </div>

          <div className="w-80 bg-slate-700 rounded-full h-3 mx-auto">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="mt-2 text-sm text-gray-300">
            {loaded} of {total} assets loaded ({Math.round(progress)}%)
          </div>

          {hasErrors && (
            <div className="mt-4 text-yellow-400 text-sm">
              <p>Some assets are using fallbacks</p>
              {process.env.NODE_ENV === 'development' && invalidAssets.length > 0 && (
                <details className="mt-2">
                  <summary className="cursor-pointer">Debug Info</summary>
                  <div className="text-xs text-left bg-slate-800 rounded p-2 mt-1">
                    <p>Invalid assets: {invalidAssets.join(', ')}</p>
                    {errors.map((error, index) => (
                      <p key={index} className="text-red-400">
                        {error}
                      </p>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}
        </div>
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
  fallbackClassName = 'bg-slate-600'
}) => {
  const [imageState, setImageState] = React.useState<{
    loaded: boolean;
    error: boolean;
    src: string;
  }>({
    loaded: false,
    error: false,
    src: ''
  });

  const [imageSrc, setImageSrc] = React.useState<string>('');

  React.useEffect(() => {
    // Dynamically import assetManager to avoid circular dependencies
    import('../utils/assetManager').then(({ getCharacterImage }) => {
      const src = getCharacterImage(characterId);
      setImageSrc(src);
      setImageState(prev => ({ ...prev, src }));
    });
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
        <div className="animate-pulse text-gray-400 text-xs">Loading...</div>
      </div>
    );
  }

  // Show error placeholder if image failed to load
  if (imageState.error) {
    return (
      <div className={`${className} ${fallbackClassName} flex items-center justify-center text-center p-2`}>
        <div className="text-gray-400 text-xs">
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