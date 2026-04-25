import React from 'react';
import { ButtonProps, defaultButtonProps } from '../../types/componentProps';

export const Button: React.FC<ButtonProps> = props => {
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
  } = { ...defaultButtonProps({}), ...props };

  const baseClasses = React.useMemo(
    () => [
      'inline-flex',
      'items-center',
      'justify-center',
      'font-medium',
      'rounded-lg',
      'transition-all',
      'duration-200',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-[var(--accent-cyan)]',
      'focus:ring-offset-2',
      'focus:ring-offset-[var(--bg-space)]',
      'active:transform',
      'active:scale-95',
    ],
    []
  );

  const variantClasses = React.useMemo(
    () => ({
      primary: [
        'text-[var(--bg-space)]',
        'bg-gradient-to-r',
        'from-[var(--accent-cyan)]',
        'to-[var(--accent-teal)]',
        'hover:from-[var(--accent-teal)]',
        'hover:to-[var(--accent-cyan)]',
        'border',
        'border-[var(--accent-cyan)]',
        'shadow-lg',
        'shadow-[0_0_20px_rgba(0,212,255,0.18)]',
        'disabled:bg-none',
        'disabled:bg-[var(--state-locked)]',
        'disabled:text-[var(--text-muted)]',
      ],
      secondary: [
        'bg-[var(--bg-section)]',
        'hover:bg-[var(--bg-item)]',
        'text-[var(--text-primary)]',
        'border',
        'border-[var(--border-inner)]',
        'shadow-lg',
        'shadow-black/20',
        'disabled:bg-[var(--state-locked)]',
        'disabled:text-[var(--text-muted)]',
      ],
      outline: [
        'border-2',
        'border-[var(--accent-cyan)]',
        'text-[var(--accent-cyan)]',
        'hover:bg-[var(--accent-cyan)]/10',
        'hover:text-[var(--text-primary)]',
        'disabled:border-[var(--state-locked)]',
        'disabled:text-[var(--text-muted)]',
      ],
      ghost: [
        'text-[var(--text-secondary)]',
        'hover:text-[var(--text-primary)]',
        'hover:bg-[var(--bg-section)]',
        'disabled:text-[var(--text-muted)]',
      ],
      danger: [
        'bg-[var(--state-deficit)]',
        'hover:bg-red-700',
        'text-white',
        'border',
        'border-red-400/40',
        'shadow-lg',
        'shadow-red-500/25',
        'focus:ring-red-500',
        'disabled:bg-[var(--state-locked)]',
        'disabled:text-[var(--text-muted)]',
      ],
    }),
    []
  );

  const sizeClasses = React.useMemo(
    () => ({
      xs: ['px-2', 'py-1', 'text-xs'],
      sm: ['px-3', 'py-1.5', 'text-sm'],
      md: ['px-4', 'py-2', 'text-base'],
      lg: ['px-6', 'py-3', 'text-lg'],
      xl: ['px-8', 'py-4', 'text-xl'],
    }),
    []
  );

  const disabledClasses = React.useMemo(
    () => ['cursor-not-allowed', 'opacity-60', 'active:transform-none'],
    []
  );

  const fullWidthClasses = React.useMemo(() => ['w-full'], []);

  const buttonClasses = React.useMemo(() => {
    const classes = [
      ...baseClasses,
      ...variantClasses[variant as keyof typeof variantClasses],
      ...sizeClasses[size as keyof typeof sizeClasses],
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
    fullWidthClasses,
  ]);

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || loading) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    },
    [disabled, loading, onClick]
  );

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
export const PrimaryButton: React.FC<Omit<ButtonProps, 'variant'>> = props => (
  <Button {...props} variant="primary" />
);

export const SecondaryButton: React.FC<Omit<ButtonProps, 'variant'>> = props => (
  <Button {...props} variant="secondary" />
);

export const OutlineButton: React.FC<Omit<ButtonProps, 'variant'>> = props => (
  <Button {...props} variant="outline" />
);

export const GhostButton: React.FC<Omit<ButtonProps, 'variant'>> = props => (
  <Button {...props} variant="ghost" />
);

export const DangerButton: React.FC<Omit<ButtonProps, 'variant'>> = props => (
  <Button {...props} variant="danger" />
);
