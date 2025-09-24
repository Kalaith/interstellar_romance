import React from 'react';
import { ButtonProps, DEFAULT_BUTTON_PROPS } from '../../types/componentProps';

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    children,
    variant,
    size,
    disabled,
    loading,
    loadingText,
    iconLeft,
    iconRight,
    fullWidth,
    className,
    onClick,
    ...restProps
  } = { ...DEFAULT_BUTTON_PROPS({}), ...props };

  const baseClasses = React.useMemo(() => [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'active:transform',
    'active:scale-95'
  ], []);

  const variantClasses = React.useMemo(() => ({
    primary: [
      'bg-purple-600',
      'hover:bg-purple-700',
      'text-white',
      'shadow-lg',
      'shadow-purple-500/25',
      'focus:ring-purple-500',
      'disabled:bg-purple-400'
    ],
    secondary: [
      'bg-gray-700',
      'hover:bg-gray-600',
      'text-white',
      'shadow-lg',
      'shadow-gray-500/25',
      'focus:ring-gray-500',
      'disabled:bg-gray-500'
    ],
    outline: [
      'border-2',
      'border-purple-600',
      'text-purple-600',
      'hover:bg-purple-600',
      'hover:text-white',
      'focus:ring-purple-500',
      'disabled:border-purple-400',
      'disabled:text-purple-400'
    ],
    ghost: [
      'text-gray-300',
      'hover:text-white',
      'hover:bg-gray-700',
      'focus:ring-gray-500',
      'disabled:text-gray-500'
    ],
    danger: [
      'bg-red-600',
      'hover:bg-red-700',
      'text-white',
      'shadow-lg',
      'shadow-red-500/25',
      'focus:ring-red-500',
      'disabled:bg-red-400'
    ]
  }), []);

  const sizeClasses = React.useMemo(() => ({
    xs: ['px-2', 'py-1', 'text-xs'],
    sm: ['px-3', 'py-1.5', 'text-sm'],
    md: ['px-4', 'py-2', 'text-base'],
    lg: ['px-6', 'py-3', 'text-lg'],
    xl: ['px-8', 'py-4', 'text-xl']
  }), []);

  const disabledClasses = React.useMemo(() => [
    'cursor-not-allowed',
    'opacity-60',
    'active:transform-none'
  ], []);

  const fullWidthClasses = React.useMemo(() => ['w-full'], []);

  const buttonClasses = React.useMemo(() => {
    const classes = [
      ...baseClasses,
      ...variantClasses[variant as keyof typeof variantClasses],
      ...sizeClasses[size as keyof typeof sizeClasses]
    ];

    if (disabled || loading) {
      classes.push(...disabledClasses);
    }

    if (fullWidth) {
      classes.push(...fullWidthClasses);
    }

    if (className) {
      classes.push(className);
    }

    return classes.join(' ');
  }, [
    baseClasses,
    variant,
    size,
    disabled,
    loading,
    fullWidth,
    className,
    variantClasses,
    sizeClasses,
    disabledClasses,
    fullWidthClasses
  ]);

  const handleClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  }, [disabled, loading, onClick]);

  const renderLoadingSpinner = () => (
    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  );

  const renderContent = () => {
    if (loading) {
      return (
        <>
          {renderLoadingSpinner()}
          {loadingText && <span className="ml-2">{loadingText}</span>}
        </>
      );
    }

    return (
      <>
        {iconLeft && <span className="mr-2">{iconLeft}</span>}
        {children}
        {iconRight && <span className="ml-2">{iconRight}</span>}
      </>
    );
  };

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      {...restProps}
    >
      {renderContent()}
    </button>
  );
};

// Convenience components for common button patterns
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="secondary" />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="outline" />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="ghost" />
);

export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = (props) => (
  <Button {...props} variant="danger" />
);