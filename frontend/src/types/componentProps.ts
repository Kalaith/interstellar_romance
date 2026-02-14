import React from 'react';
import { CharacterId, PercentageScore } from './brandedTypes';
import { Character, PlayerCharacter, CharacterMood, EmotionType, GameScreen } from './game';

// Standard component props that all components should extend
export interface StandardComponentProps {
  readonly className?: string;
  readonly 'data-testid'?: string;
  readonly children?: React.ReactNode;
}

// UI Component Props
export interface MoodDisplayProps extends StandardComponentProps {
  readonly mood: CharacterMood;
  readonly characterName: string;
  readonly size?: 'small' | 'medium' | 'large';
  readonly showLabel?: boolean;
  readonly variant?: 'default' | 'compact' | 'detailed';
}

export interface EmotionalTextProps extends StandardComponentProps {
  readonly text: string;
  readonly emotion: EmotionType;
  readonly intensity?: 'low' | 'medium' | 'high';
  readonly animated?: boolean;
}

export interface ProgressBarProps extends StandardComponentProps {
  readonly value: PercentageScore | number;
  readonly variant?: 'affection' | 'compatibility' | 'progress' | 'health';
  readonly size?: 'xs' | 'sm' | 'md' | 'lg';
  readonly showValue?: boolean;
  readonly animated?: boolean;
  readonly label?: string;
}

export interface AvatarProps extends StandardComponentProps {
  readonly src?: string;
  readonly alt: string;
  readonly size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  readonly shape?: 'square' | 'circle' | 'rounded';
  readonly showBorder?: boolean;
  readonly status?: 'online' | 'offline' | 'busy' | 'away';
  readonly fallbackIcon?: string;
}

// Character Component Props
export interface CharacterImageProps extends StandardComponentProps {
  readonly characterId: CharacterId;
  readonly alt?: string;
  readonly size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  readonly shape?: 'square' | 'circle' | 'rounded';
  readonly showBorder?: boolean;
  readonly fallbackClassName?: string;
}

export interface CharacterCardProps extends StandardComponentProps {
  readonly character: Character;
  readonly player?: PlayerCharacter;
  readonly onSelect?: (characterId: CharacterId) => void;
  readonly showCompatibility?: boolean;
  readonly showInteractionStatus?: boolean;
  readonly variant?: 'compact' | 'detailed' | 'minimal';
  readonly selectable?: boolean;
}

export interface DailyInteractionStatusProps extends StandardComponentProps {
  readonly character: Character;
  readonly variant?: 'inline' | 'detailed' | 'badge';
  readonly showReset?: boolean;
}

// Game Component Props
export interface GameScreenProps extends StandardComponentProps {
  readonly currentScreen: GameScreen;
  readonly onScreenChange?: (screen: GameScreen) => void;
}

export interface StorylinePanelProps extends StandardComponentProps {
  readonly characterId: CharacterId;
  readonly variant?: 'compact' | 'detailed';
  readonly maxStorylines?: number;
}

export interface PersonalityGrowthTrackerProps extends StandardComponentProps {
  readonly characterId: CharacterId;
  readonly showHistory?: boolean;
  readonly variant?: 'summary' | 'detailed';
}

// Modal and Overlay Props
export interface ModalProps extends StandardComponentProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly size?: 'sm' | 'md' | 'lg' | 'xl';
  readonly closeOnOverlayClick?: boolean;
  readonly showCloseButton?: boolean;
}

export interface SuperLikeModalProps extends StandardComponentProps {
  readonly character: Character;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onConfirm: () => void;
  readonly superLikesRemaining: number;
}

// Error Component Props
export interface ErrorFallbackProps extends StandardComponentProps {
  readonly error: Error;
  readonly retry: () => void;
  readonly variant?: 'minimal' | 'detailed';
}

export interface ErrorBoundaryProps extends StandardComponentProps {
  readonly fallback?: React.ComponentType<ErrorFallbackProps>;
  readonly onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

// Form Component Props
export interface FormFieldProps extends StandardComponentProps {
  readonly label: string;
  readonly name: string;
  readonly error?: string;
  readonly required?: boolean;
  readonly disabled?: boolean;
}

export interface ButtonProps extends StandardComponentProps {
  readonly variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  readonly size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  readonly disabled?: boolean;
  readonly loading?: boolean;
  readonly loadingText?: string;
  readonly iconLeft?: React.ReactNode;
  readonly iconRight?: React.ReactNode;
  readonly onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  readonly type?: 'button' | 'submit' | 'reset';
  readonly fullWidth?: boolean;
}

// Modal Component Props
export interface ModalProps extends StandardComponentProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly title?: string;
  readonly modalSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  readonly showCloseButton?: boolean;
  readonly closeOnOverlay?: boolean;
  readonly closeOnEscape?: boolean;
}

// Default props helpers
export const createDefaultProps = <T extends Record<string, unknown>>(defaults: T) => {
  return (props: Partial<T>): T => ({
    ...defaults,
    ...props,
  });
};

// Common default props
export const defaultMoodDisplayProps = createDefaultProps({
  size: 'medium' as const,
  showLabel: true,
  variant: 'default' as const,
});

export const defaultProgressBarProps = createDefaultProps({
  variant: 'progress' as const,
  size: 'md' as const,
  showValue: false,
  animated: true,
});

export const defaultAvatarProps = createDefaultProps({
  size: 'md' as const,
  shape: 'circle' as const,
  showBorder: false,
});

export const defaultCharacterCardProps = createDefaultProps({
  showCompatibility: true,
  showInteractionStatus: true,
  variant: 'detailed' as const,
  selectable: true,
});

export const defaultButtonProps = createDefaultProps({
  variant: 'primary' as const,
  size: 'md' as const,
  disabled: false,
  loading: false,
  loadingText: undefined,
  iconLeft: undefined,
  iconRight: undefined,
  type: 'button' as const,
  fullWidth: false,
});

export const defaultModalProps = createDefaultProps({
  modalSize: 'md' as const,
  showCloseButton: true,
  closeOnOverlay: true,
  closeOnEscape: true,
});
