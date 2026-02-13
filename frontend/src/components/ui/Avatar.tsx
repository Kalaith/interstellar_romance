import React from 'react';
import { AvatarProps, defaultAvatarProps } from '../../types/componentProps';
import { Logger } from '../../services/Logger';

export const Avatar: React.FC<AvatarProps> = (props) => {
  const {
    src,
    alt,
    size,
    shape,
    showBorder,
    status,
    fallbackIcon,
    className,
    ...restProps
  } = { ...defaultAvatarProps({}), ...props };

  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  const sizeClasses = React.useMemo(() => ({
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  }), []);

  const shapeClasses = React.useMemo(() => ({
    square: 'rounded-none',
    circle: 'rounded-full',
    rounded: 'rounded-lg'
  }), []);

  const statusColors = React.useMemo(() => ({
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  }), []);

  const handleImageError = React.useCallback(() => {
    setImageError(true);
    Logger.warn(`Failed to load avatar image: ${src}`);
  }, [src]);

  const handleImageLoad = React.useCallback(() => {
    setImageLoaded(true);
    setImageError(false);
  }, []);

  const avatarClasses = React.useMemo(() => {
    const classes = [
      sizeClasses[size as keyof typeof sizeClasses],
      shapeClasses[shape as keyof typeof shapeClasses],
      'overflow-hidden',
      'bg-gray-600',
      'flex',
      'items-center',
      'justify-center',
      'relative'
    ];

    if (showBorder) {
      classes.push('border-2', 'border-gray-300');
    }

    return classes.join(' ');
  }, [size, shape, showBorder, sizeClasses, shapeClasses]);

  const renderContent = () => {
    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={alt}
          className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
          onError={handleImageError}
          onLoad={handleImageLoad}
        />
      );
    }

    // Fallback content
    if (fallbackIcon) {
      return (
        <span className="text-lg" role="img" aria-label="Avatar">
          {fallbackIcon}
        </span>
      );
    }

    // Default fallback - first letter of alt text
    return (
      <span className="text-gray-400 font-semibold text-sm">
        {alt.charAt(0).toUpperCase()}
      </span>
    );
  };

  return (
    <div className={`relative inline-block ${className || ''}`} {...restProps}>
      <div className={avatarClasses}>
        {renderContent()}
        
        {/* Loading placeholder */}
        {src && !imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gray-700 animate-pulse flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {/* Status indicator */}
      {status && (
        <div
          className={`
            absolute bottom-0 right-0 
            w-3 h-3 rounded-full border-2 border-white
            ${statusColors[status as keyof typeof statusColors]}
          `}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

// Character-specific avatar that uses the character image system
interface CharacterAvatarProps extends Omit<AvatarProps, 'src'> {
  readonly characterId: string;
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ characterId, ...props }) => {
  const [imageSrc, setImageSrc] = React.useState<string>('');

  React.useEffect(() => {
    // Dynamically import assetManager to avoid circular dependencies
    import('../../utils/assetManager').then(({ getCharacterImage }) => {
      const src = getCharacterImage(characterId);
      setImageSrc(src);
    });
  }, [characterId]);

  return (
    <Avatar
      {...props}
      src={imageSrc}
      alt={props.alt || `${characterId} avatar`}
      fallbackIcon="🧑‍🚀"
    />
  );
};