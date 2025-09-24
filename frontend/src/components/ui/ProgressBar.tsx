import React from 'react';
import { ProgressBarProps, DEFAULT_PROGRESS_BAR_PROPS } from '../../types/componentProps';
import { Validators } from '../../utils/validators';
import { Logger } from '../../services/Logger';

export const ProgressBar: React.FC<ProgressBarProps> = (props) => {
  const { 
    value, 
    variant, 
    size, 
    showValue, 
    animated, 
    label, 
    className,
    ...restProps 
  } = { ...DEFAULT_PROGRESS_BAR_PROPS({}), ...props };

  const safeValue = React.useMemo(() => {
    try {
      const numValue = typeof value === 'number' ? value : 0;
      return Math.max(0, Math.min(100, numValue));
    } catch (error) {
      Logger.error('Failed to process progress bar value', error);
      return 0;
    }
  }, [value]);

  const sizeClasses = React.useMemo(() => ({
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4'
  }), []);

  const variantClasses = React.useMemo(() => ({
    affection: 'bg-gradient-to-r from-pink-500 to-red-500',
    compatibility: 'bg-gradient-to-r from-blue-500 to-purple-500',
    progress: 'bg-blue-500',
    health: 'bg-gradient-to-r from-green-500 to-emerald-500'
  }), []);

  const progressClasses = React.useMemo(() => {
    const baseClasses = [
      sizeClasses[size],
      'rounded-full',
      variantClasses[variant]
    ];
    
    if (animated) {
      baseClasses.push('transition-all', 'duration-500', 'ease-out');
    }
    
    return baseClasses.join(' ');
  }, [size, variant, animated, sizeClasses, variantClasses]);

  return (
    <div className={`relative ${className || ''}`} {...restProps}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-300">{label}</span>
          {showValue && (
            <span className="text-sm font-semibold text-white">
              {safeValue}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-700 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div 
          className={progressClasses}
          style={{ width: `${safeValue}%` }}
          role="progressbar"
          aria-valuenow={safeValue}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || 'Progress'}
        />
      </div>
      
      {showValue && !label && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-white drop-shadow-sm">
            {safeValue}%
          </span>
        </div>
      )}
    </div>
  );
};

// Specific progress bar variants
export const AffectionBar: React.FC<Omit<ProgressBarProps, 'variant'>> = (props) => (
  <ProgressBar {...props} variant="affection" />
);

export const CompatibilityBar: React.FC<Omit<ProgressBarProps, 'variant'>> = (props) => (
  <ProgressBar {...props} variant="compatibility" />
);

export const HealthBar: React.FC<Omit<ProgressBarProps, 'variant'>> = (props) => (
  <ProgressBar {...props} variant="health" />
);