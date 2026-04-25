import React from 'react';
import { Button } from './Button';

type StatePanelVariant = 'empty' | 'loading' | 'error' | 'locked' | 'unavailable';

interface StatePanelProps {
  readonly variant?: StatePanelVariant;
  readonly icon?: React.ReactNode;
  readonly title: string;
  readonly message?: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly className?: string;
  readonly children?: React.ReactNode;
}

const variantStyles: Record<StatePanelVariant, { icon: string; border: string; text: string }> = {
  empty: {
    icon: 'text-[var(--accent-cyan)]',
    border: 'border-[var(--border-frame)]',
    text: 'text-[var(--accent-cyan)]',
  },
  loading: {
    icon: 'text-[var(--accent-teal)]',
    border: 'border-[var(--accent-teal)]/40',
    text: 'text-[var(--accent-teal)]',
  },
  error: {
    icon: 'text-[var(--state-deficit)]',
    border: 'border-[var(--state-deficit)]/50',
    text: 'text-[var(--state-deficit)]',
  },
  locked: {
    icon: 'text-[var(--state-locked)]',
    border: 'border-[var(--state-locked)]/60',
    text: 'text-[var(--text-muted)]',
  },
  unavailable: {
    icon: 'text-[var(--resource-energy)]',
    border: 'border-[var(--resource-influence)]/50',
    text: 'text-[var(--resource-energy)]',
  },
};

export const StatePanel: React.FC<StatePanelProps> = ({
  variant = 'empty',
  icon,
  title,
  message,
  actionLabel,
  onAction,
  className = '',
  children,
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      className={`bg-[var(--bg-panel)] border ${styles.border} rounded-lg p-8 text-center ${className}`}
    >
      {icon && <div className={`text-5xl mb-4 ${styles.icon}`}>{icon}</div>}
      <h3 className={`text-xl font-bold mb-2 ${styles.text}`}>{title}</h3>
      {message && <p className="text-[var(--text-secondary)] mb-6">{message}</p>}
      {children}
      {actionLabel && onAction && (
        <Button onClick={onAction} variant={variant === 'error' ? 'danger' : 'primary'}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
