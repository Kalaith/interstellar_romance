# Interstellar Romance - Code Review & Improvement Recommendations

**Review Date**: September 24, 2025  
**Reviewer**: Senior Full-Stack Developer  
**Project**: Interstellar Romance Game  

## Overview

This document outlines 12 critical improvements identified during a comprehensive code review of the Interstellar Romance game project. The focus areas include clean code practices, eliminating magic numbers, ensuring proper typing, and maintaining clean separation of concerns between components and layers.

---

## **1. Eliminate Magic Numbers Throughout the Codebase**

### **Issue**
The project has many hardcoded numeric values that lack context and make maintenance difficult.

### **Examples Found**
- `calculateMaxInteractions`: `if (affection >= 80) return 8;` 
- Compatibility scoring: `score = player.stats.charisma >= 60 ? 80 : 60;`
- Personality growth values: `baseValue: 10, maxGrowth: 10, minGrowth: 8`

### **Solution**
Create a constants file with named constants:

```typescript
// src/constants/gameConstants.ts
export const AFFECTION_THRESHOLDS = {
  VERY_HIGH: 80,
  HIGH: 60,
  MEDIUM: 40,
  LOW: 20,
  NONE: 0
} as const;

export const INTERACTION_LIMITS = {
  VERY_HIGH_AFFECTION: 8,
  HIGH_AFFECTION: 6,
  MEDIUM_AFFECTION: 5,
  LOW_MEDIUM_AFFECTION: 4,
  DEFAULT: 3
} as const;

export const COMPATIBILITY_SCORES = {
  EXCELLENT: 90,
  VERY_GOOD: 80,
  GOOD: 70,
  AVERAGE: 60,
  POOR: 50
} as const;

export const STAT_THRESHOLDS = {
  VERY_HIGH: 80,
  HIGH: 70,
  MEDIUM: 60,
  LOW: 50
} as const;
```

### **Why it matters**
Magic numbers make code hard to understand, maintain, and modify. Named constants provide context and make changes easier. When game balance needs adjustment, you only need to change values in one place.

---

## **2. Extract Business Logic from Components**

### **Issue**
Components like `MainHub.tsx` and `CharacterInteraction.tsx` contain complex business logic mixed with UI concerns.

### **Current Problem**
```tsx
// In MainHub.tsx - business logic mixed with rendering
const filteredCharacters = filterCharactersByPreference(characters, player.sexualPreference);
const compatibility = player ? calculateCompatibility(player, character.profile) : null;
```

### **Solution**
Create service layer classes to handle business logic:

```typescript
// src/services/CharacterService.ts
export class CharacterService {
  static filterByPreference(characters: Character[], preference: SexualPreference): Character[] {
    return filterCharactersByPreference(characters, preference);
  }
  
  static calculateDisplayCompatibility(
    player: PlayerCharacter, 
    character: Character
  ): CompatibilityDisplay | null {
    if (!player) return null;
    
    const compatibility = calculateCompatibility(player, character.profile);
    return {
      ...compatibility,
      colorClass: this.getCompatibilityColorClass(compatibility.overall),
      label: this.getCompatibilityLabel(compatibility.overall)
    };
  }
  
  private static getCompatibilityColorClass(score: number): string {
    if (score >= COMPATIBILITY_SCORES.EXCELLENT) return 'text-green-400';
    if (score >= COMPATIBILITY_SCORES.VERY_GOOD) return 'text-blue-400';
    if (score >= COMPATIBILITY_SCORES.GOOD) return 'text-yellow-400';
    return 'text-red-400';
  }
}

// src/services/InteractionService.ts
export class InteractionService {
  static canInteractToday(character: Character): boolean {
    // Move interaction logic here
  }
  
  static processDialogueChoice(
    character: Character, 
    option: DialogueOption
  ): DialogueResult {
    // Move dialogue processing here
  }
}
```

### **Why it matters**
Separating business logic from UI components makes testing easier, improves reusability, and follows the single responsibility principle. Components focus on rendering while services handle game logic.

---

## **3. Improve Type Safety with Branded Types**

### **Issue**
The codebase uses primitive types where more specific types would prevent errors.

### **Current Problem**
```typescript
affection: number; // Could be any number
updateAffection: (characterId: string, amount: number) => void;
```

### **Solution**
Use branded types for better type safety:

```typescript
// src/types/brandedTypes.ts
export type AffectionLevel = number & { readonly __brand: unique symbol };
export type CharacterId = string & { readonly __brand: unique symbol };
export type PercentageScore = number & { readonly __brand: unique symbol };
export type Week = number & { readonly __brand: unique symbol };

// Type guards and creators
export const createAffectionLevel = (value: number): AffectionLevel => {
  if (value < 0 || value > 100) {
    throw new ValidationError('Affection must be between 0-100');
  }
  return value as AffectionLevel;
};

export const createCharacterId = (value: string): CharacterId => {
  if (!value || typeof value !== 'string') {
    throw new ValidationError('Character ID must be a non-empty string');
  }
  return value as CharacterId;
};

export const createPercentageScore = (value: number): PercentageScore => {
  if (value < 0 || value > 100) {
    throw new ValidationError('Percentage must be between 0-100');
  }
  return value as PercentageScore;
};

// Usage in interfaces
export interface Character {
  id: CharacterId;
  affection: AffectionLevel;
  // ... other properties
}
```

### **Why it matters**
Branded types prevent mixing up similar primitive types and catch errors at compile time. For example, you can't accidentally pass a compatibility score where an affection level is expected.

---

## **4. Reduce Zustand Store Complexity**

### **Issue**
The `gameStore.ts` has over 300 lines with multiple concerns mixed together.

### **Current Problem**
Single massive store handling characters, achievements, storylines, and navigation.

### **Solution**
Split into focused stores using composition:

```typescript
// src/stores/characterStore.ts
interface CharacterStore {
  characters: Character[];
  selectedCharacter: Character | null;
  selectCharacter: (id: CharacterId) => void;
  updateAffection: (id: CharacterId, amount: number) => void;
  updateMood: (id: CharacterId, mood: CharacterMood) => void;
  canInteractToday: (id: CharacterId) => boolean;
  useDailyInteraction: (id: CharacterId) => boolean;
}

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  characters: [...CHARACTERS],
  selectedCharacter: null,
  
  selectCharacter: (id) => {
    const character = get().characters.find(c => c.id === id);
    set({ selectedCharacter: character || null });
  },
  
  updateAffection: (id, amount) => {
    const validAmount = Validators.validateAffectionAmount(amount);
    set((state) => ({
      characters: state.characters.map(char =>
        char.id === id 
          ? { ...char, affection: createAffectionLevel(char.affection + validAmount) }
          : char
      )
    }));
  },
  
  // ... other character-specific methods
}));

// src/stores/gameStateStore.ts  
interface GameStateStore {
  currentScreen: GameScreen;
  currentWeek: Week;
  player: PlayerCharacter | null;
  setScreen: (screen: GameScreen) => void;
  createPlayer: (player: PlayerCharacter) => void;
  nextWeek: () => void;
}

export const useGameStateStore = create<GameStateStore>((set) => ({
  currentScreen: 'main-menu',
  currentWeek: createWeek(1),
  player: null,
  
  setScreen: (screen) => set({ currentScreen: screen }),
  createPlayer: (player) => set({ player, currentScreen: 'main-hub' }),
  nextWeek: () => set((state) => ({ currentWeek: createWeek(state.currentWeek + 1) })),
}));

// src/stores/achievementStore.ts
interface AchievementStore {
  achievements: Achievement[];
  updateAchievements: () => void;
  checkAchievement: (id: string) => boolean;
}

// src/stores/useGameStore.ts - Compose stores
export const useGameStore = () => {
  const characterStore = useCharacterStore();
  const gameStateStore = useGameStateStore();
  const achievementStore = useAchievementStore();
  
  return { 
    ...characterStore, 
    ...gameStateStore, 
    ...achievementStore 
  };
};
```

### **Why it matters**
Smaller, focused stores are easier to test, debug, and maintain. Composition provides flexibility while keeping concerns separated. Each store can be tested and reasoned about independently.

---

## **5. Remove Direct Console Logging**

### **Issue**
Scattered `console.log`, `console.warn`, and `console.error` calls throughout the codebase (25+ instances found).

### **Current Problem**
```typescript
console.warn(`Asset not found: ${id}`);
console.log(`Preloaded ${assetsToPreload.length} assets`);
console.error('getAvailableStorylines: Error processing storylines', error);
```

### **Solution**
Implement a proper logging service:

```typescript
// src/services/Logger.ts
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export class Logger {
  private static currentLevel = process.env.NODE_ENV === 'development' 
    ? LogLevel.DEBUG 
    : LogLevel.ERROR;
  
  private static formatMessage(level: string, message: string): string {
    return `[${new Date().toISOString()}] ${level}: ${message}`;
  }
  
  static error(message: string, error?: Error): void {
    if (this.currentLevel >= LogLevel.ERROR) {
      console.error(this.formatMessage('ERROR', message), error);
      // Could send to error reporting service in production
      this.reportError(message, error);
    }
  }
  
  static warn(message: string, ...args: any[]): void {
    if (this.currentLevel >= LogLevel.WARN) {
      console.warn(this.formatMessage('WARN', message), ...args);
    }
  }
  
  static info(message: string, ...args: any[]): void {
    if (this.currentLevel >= LogLevel.INFO) {
      console.info(this.formatMessage('INFO', message), ...args);
    }
  }
  
  static debug(message: string, ...args: any[]): void {
    if (this.currentLevel >= LogLevel.DEBUG) {
      console.debug(this.formatMessage('DEBUG', message), ...args);
    }
  }
  
  private static reportError(message: string, error?: Error): void {
    // In production, could send to Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // window.errorReporter?.captureException(error || new Error(message));
    }
  }
}

// Usage throughout codebase:
// Replace: console.warn(`Asset not found: ${id}`);
// With: Logger.warn(`Asset not found: ${id}`);
```

### **Why it matters**
Centralized logging allows for better control over log levels, formatting, and potential remote logging in production. It's easier to disable logs in production or route them to monitoring services.

---

## **6. Add Runtime Validation for Critical Paths**

### **Issue**
Functions assume valid inputs without validation, leading to potential runtime errors.

### **Current Problem**
```typescript
updateAffection: (characterId, amount) => {
  const character = state.characters.find(c => c.id === characterId);
  // No validation if character exists or amount is valid
  const newAffection = character.affection + amount; // Potential null reference
}
```

### **Solution**
Add validation with proper error handling:

```typescript
// src/utils/validators.ts
export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class Validators {
  static validateCharacterId(id: unknown): CharacterId {
    if (!id || typeof id !== 'string') {
      throw new ValidationError('Character ID must be a non-empty string', 'characterId');
    }
    return id as CharacterId;
  }
  
  static validateAffectionAmount(amount: unknown): number {
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new ValidationError('Affection amount must be a number', 'amount');
    }
    if (amount < -100 || amount > 100) {
      throw new ValidationError('Affection amount must be between -100 and 100', 'amount');
    }
    return amount;
  }
  
  static validateCharacterExists(character: Character | undefined): Character {
    if (!character) {
      throw new ValidationError('Character not found');
    }
    return character;
  }
  
  static validatePlayerExists(player: PlayerCharacter | null): PlayerCharacter {
    if (!player) {
      throw new ValidationError('Player character not found');
    }
    return player;
  }
}

// Updated store method with validation
updateAffection: (characterId, amount) => {
  try {
    const validId = Validators.validateCharacterId(characterId);
    const validAmount = Validators.validateAffectionAmount(amount);
    
    set((state) => {
      const character = state.characters.find(c => c.id === validId);
      Validators.validateCharacterExists(character);
      
      const newAffection = Math.max(0, Math.min(100, character.affection + validAmount));
      
      return {
        characters: state.characters.map(char =>
          char.id === validId ? { ...char, affection: newAffection } : char
        )
      };
    });
  } catch (error) {
    Logger.error(`Failed to update affection for character ${characterId}`, error);
    throw error; // Re-throw to let UI handle it
  }
}
```

### **Why it matters**
Runtime validation catches errors early and provides better debugging information. It prevents silent failures and makes the app more robust.

---

## **7. Implement Proper Error Boundaries**

### **Issue**
No error handling at the React component level means errors crash the entire app.

### **Solution**
Add error boundaries for graceful degradation:

```typescript
// src/components/ErrorBoundary.tsx
interface Props {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    Logger.error('Component Error Boundary Triggered', error);
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      const Fallback = this.props.fallback || DefaultErrorFallback;
      return <Fallback error={this.state.error!} retry={this.handleRetry} />;
    }
    
    return this.props.children;
  }
}

// src/components/DefaultErrorFallback.tsx
interface ErrorFallbackProps {
  error: Error;
  retry: () => void;
}

export const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({ error, retry }) => {
  return (
    <div className="min-h-screen bg-slate-800 flex items-center justify-center">
      <div className="bg-slate-900 rounded-lg p-8 max-w-md text-center text-white">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="text-gray-300 mb-6">
          We encountered an unexpected error. You can try again or return to the main menu.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <details className="text-left bg-red-900 p-3 rounded mb-4">
            <summary className="cursor-pointer font-semibold">Error Details</summary>
            <pre className="text-xs mt-2 overflow-auto">{error.message}</pre>
          </details>
        )}
        
        <div className="flex gap-3 justify-center">
          <button 
            onClick={retry}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

// Usage in App.tsx
<ErrorBoundary>
  <GamePage />
</ErrorBoundary>
```

### **Why it matters**
Error boundaries prevent complete app crashes and provide better user experience. They allow for graceful degradation and recovery from errors.

---

## **8. Eliminate Hardcoded setTimeout Usage**

### **Issue**
Multiple `setTimeout` calls with magic numbers for debouncing and async operations.

### **Current Problem**
```typescript
setTimeout(() => {
  get().unlockCharacterInfo(characterId, 'species');
}, 0); // Magic number

setTimeout(() => get().batchUpdate('', { achievements: true }), 0); // Another magic number
```

### **Solution**
Create a proper async operation manager:

```typescript
// src/utils/AsyncOperationManager.ts
export class AsyncOperationManager {
  private static pendingOperations = new Map<string, NodeJS.Timeout>();
  
  static scheduleOperation(
    key: string, 
    operation: () => void, 
    delay: number = 0
  ): void {
    // Cancel existing operation with same key
    if (this.pendingOperations.has(key)) {
      clearTimeout(this.pendingOperations.get(key)!);
    }
    
    const timeoutId = setTimeout(() => {
      try {
        operation();
      } catch (error) {
        Logger.error(`Async operation failed for key: ${key}`, error);
      } finally {
        this.pendingOperations.delete(key);
      }
    }, delay);
    
    this.pendingOperations.set(key, timeoutId);
  }
  
  static cancelOperation(key: string): void {
    const timeoutId = this.pendingOperations.get(key);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.pendingOperations.delete(key);
    }
  }
  
  static cancelAllOperations(): void {
    for (const [key, timeoutId] of this.pendingOperations) {
      clearTimeout(timeoutId);
    }
    this.pendingOperations.clear();
  }
  
  static hasPendingOperation(key: string): boolean {
    return this.pendingOperations.has(key);
  }
}

// src/constants/asyncOperations.ts
export const ASYNC_OPERATION_KEYS = {
  CHARACTER_INFO_UNLOCK: (characterId: string) => `unlock-info-${characterId}`,
  BATCH_UPDATE: (type: string) => `batch-update-${type}`,
  ACHIEVEMENT_UPDATE: 'achievement-update',
  STORYLINE_UPDATE: (characterId: string) => `storyline-update-${characterId}`,
} as const;

export const ASYNC_DELAYS = {
  IMMEDIATE: 0,
  DEBOUNCE_SHORT: 150,
  DEBOUNCE_MEDIUM: 300,
  DEBOUNCE_LONG: 500,
} as const;

// Updated usage:
// Replace: setTimeout(() => get().unlockCharacterInfo(characterId, 'species'), 0);
// With:
AsyncOperationManager.scheduleOperation(
  ASYNC_OPERATION_KEYS.CHARACTER_INFO_UNLOCK(characterId),
  () => get().unlockCharacterInfo(characterId, 'species'),
  ASYNC_DELAYS.IMMEDIATE
);
```

### **Why it matters**
Proper async operation management prevents memory leaks, provides better control over timing, and makes it easier to cancel operations when components unmount.

---

## **9. Fix Component Prop Interface Inconsistencies**

### **Issue**
Inconsistent prop definitions and missing optional/required markers.

### **Current Problem**
```tsx
interface MoodDisplayProps {
  mood: CharacterMood;
  characterName: string;
  className?: string; // Good - optional is marked
}

// But then used inconsistently:
export const MoodDisplay: React.FC<MoodDisplayProps> = ({ 
  mood, 
  characterName, 
  className = '' // Default parameter instead of interface default
}) => {
```

### **Solution**
Standardize prop interfaces with clear required/optional markers:

```typescript
// src/types/componentProps.ts
export interface StandardComponentProps {
  readonly className?: string;
  readonly 'data-testid'?: string;
  readonly children?: React.ReactNode;
}

export interface MoodDisplayProps extends StandardComponentProps {
  readonly mood: CharacterMood;
  readonly characterName: string;
  readonly size?: 'small' | 'medium' | 'large';
  readonly showLabel?: boolean;
  readonly variant?: 'default' | 'compact' | 'detailed';
}

// Default props pattern
const defaultMoodDisplayProps: Required<Pick<MoodDisplayProps, 'size' | 'showLabel' | 'variant'>> = {
  size: 'medium',
  showLabel: true,
  variant: 'default',
};

export const MoodDisplay: React.FC<MoodDisplayProps> = (props) => {
  const { mood, characterName, className, size, showLabel, variant } = {
    ...defaultMoodDisplayProps,
    ...props
  };
  
  // Component implementation
};

// src/types/characterProps.ts
export interface CharacterImageProps extends StandardComponentProps {
  readonly characterId: CharacterId;
  readonly alt?: string;
  readonly size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  readonly shape?: 'square' | 'circle' | 'rounded';
  readonly showBorder?: boolean;
}

export interface CharacterCardProps extends StandardComponentProps {
  readonly character: Character;
  readonly player: PlayerCharacter;
  readonly onSelect?: (characterId: CharacterId) => void;
  readonly showCompatibility?: boolean;
  readonly showInteractionStatus?: boolean;
  readonly variant?: 'compact' | 'detailed' | 'minimal';
}
```

### **Why it matters**
Consistent interfaces reduce confusion, improve component reusability, and make it easier for other developers to understand and use components correctly.

---

## **10. Extract Inline Styles to Proper Style System**

### **Issue**
Many components have hardcoded style values and CSS-in-JS scattered throughout.

### **Current Problem**
```tsx
<div className="w-32 h-32 rounded-lg object-cover">
<div style={{ width: `${character.affection}%` }}> // Inline styles
<div className="text-2xl font-bold text-[var(--text-primary)] tracking-wide uppercase">
```

### **Solution**
Create a proper design system with standardized components:

```typescript
// src/components/ui/ProgressBar.tsx
interface ProgressBarProps extends StandardComponentProps {
  readonly value: PercentageScore;
  readonly variant?: 'affection' | 'compatibility' | 'progress' | 'health';
  readonly size?: 'xs' | 'sm' | 'md' | 'lg';
  readonly showValue?: boolean;
  readonly animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  variant = 'progress', 
  size = 'md',
  showValue = false,
  animated = true,
  className,
  ...props 
}) => {
  const sizeClasses = {
    xs: 'h-1',
    sm: 'h-2',
    md: 'h-3', 
    lg: 'h-4'
  };
  
  const variantClasses = {
    affection: 'bg-gradient-to-r from-pink-500 to-red-500',
    compatibility: 'bg-gradient-to-r from-blue-500 to-purple-500',
    progress: 'bg-blue-500',
    health: 'bg-gradient-to-r from-green-500 to-emerald-500'
  };
  
  const safeValue = Math.max(0, Math.min(100, value));
  
  return (
    <div className={`relative ${className}`} {...props}>
      <div className={`w-full bg-gray-700 rounded-full ${sizeClasses[size]} overflow-hidden`}>
        <div 
          className={`
            ${sizeClasses[size]} 
            rounded-full 
            ${animated ? 'transition-all duration-500 ease-out' : ''}
            ${variantClasses[variant]}
          `}
          style={{ width: `${safeValue}%` }}
        />
      </div>
      
      {showValue && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xs font-semibold text-white drop-shadow-sm">
            {safeValue}%
          </span>
        </div>
      )}
    </div>
  );
};

// src/components/ui/Avatar.tsx
interface AvatarProps extends StandardComponentProps {
  readonly src?: string;
  readonly alt: string;
  readonly size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  readonly shape?: 'square' | 'circle' | 'rounded';
  readonly showBorder?: boolean;
  readonly status?: 'online' | 'offline' | 'busy' | 'away';
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  shape = 'circle',
  showBorder = false,
  status,
  className,
  ...props
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
    '2xl': 'w-32 h-32'
  };
  
  const shapeClasses = {
    square: 'rounded-none',
    circle: 'rounded-full',
    rounded: 'rounded-lg'
  };
  
  const statusColors = {
    online: 'bg-green-500',
    offline: 'bg-gray-500',
    busy: 'bg-red-500',
    away: 'bg-yellow-500'
  };
  
  return (
    <div className={`relative inline-block ${className}`} {...props}>
      <div className={`
        ${sizeClasses[size]} 
        ${shapeClasses[shape]}
        ${showBorder ? 'border-2 border-gray-300' : ''}
        overflow-hidden
        bg-gray-600
        flex items-center justify-center
      `}>
        {src ? (
          <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-gray-400 font-semibold">
            {alt.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      
      {status && (
        <div className={`
          absolute bottom-0 right-0 
          w-3 h-3 rounded-full border-2 border-white
          ${statusColors[status]}
        `} />
      )}
    </div>
  );
};

// src/styles/designSystem.ts
export const DESIGN_TOKENS = {
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    full: '9999px',
  },
  
  colors: {
    affection: {
      50: '#fef2f2',
      500: '#ef4444',
      900: '#7f1d1d',
    },
    compatibility: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    },
  },
} as const;
```

### **Why it matters**
Consistent styling reduces code duplication, makes the UI more maintainable, and ensures a cohesive design language across the application.

---

## **11. Implement Proper Data Access Layer**

### **Issue**
Direct data manipulation scattered throughout components and stores.

### **Current Problem**
```typescript
// Direct array manipulation in store
const updatedCharacters = state.characters.map(char =>
  char.id === characterId ? { ...char, affection: newAffection } : char
);
```

### **Solution**
Create a proper data access layer:

```typescript
// src/data/repositories/CharacterRepository.ts
export class CharacterRepository {
  private static instance: CharacterRepository;
  
  static getInstance(): CharacterRepository {
    if (!this.instance) {
      this.instance = new CharacterRepository();
    }
    return this.instance;
  }
  
  findById(characters: Character[], id: CharacterId): Character | null {
    const character = characters.find(c => c.id === id);
    if (!character) {
      Logger.warn(`Character not found: ${id}`);
      return null;
    }
    return character;
  }
  
  updateAffection(characters: Character[], id: CharacterId, amount: number): Character[] {
    const validId = Validators.validateCharacterId(id);
    const validAmount = Validators.validateAffectionAmount(amount);
    
    return characters.map(character => {
      if (character.id === validId) {
        const newAffection = createAffectionLevel(
          Math.max(0, Math.min(100, character.affection + validAmount))
        );
        
        return {
          ...character,
          affection: newAffection,
          // Update related properties
          dailyInteractions: {
            ...character.dailyInteractions,
            maxInteractions: calculateMaxInteractions(newAffection)
          },
          // Check for milestone achievements
          milestones: this.checkMilestones(character.milestones, newAffection),
          // Update photo unlocks
          photoGallery: this.checkPhotoUnlocks(character.photoGallery, newAffection)
        };
      }
      return character;
    });
  }
  
  filterByPreference(
    characters: Character[], 
    preference: SexualPreference
  ): Character[] {
    // Centralized filtering logic with proper validation
    return characters.filter(character => 
      this.isCompatibleWithPreference(character, preference)
    );
  }
  
  private isCompatibleWithPreference(
    character: Character, 
    preference: SexualPreference
  ): boolean {
    // Implementation of preference matching logic
    switch (preference) {
      case 'all':
        return true;
      case 'men':
        return character.gender === 'male';
      case 'women':
        return character.gender === 'female';
      case 'non-binary':
        return character.gender === 'non-binary';
      case 'alien-species':
        return !['male', 'female', 'non-binary'].includes(character.gender);
      default:
        return false;
    }
  }
  
  private checkMilestones(
    milestones: RelationshipMilestone[], 
    affection: AffectionLevel
  ): RelationshipMilestone[] {
    return milestones.map(milestone => ({
      ...milestone,
      achieved: affection >= milestone.unlockedAt ? true : milestone.achieved,
      achievedDate: !milestone.achieved && affection >= milestone.unlockedAt 
        ? new Date() 
        : milestone.achievedDate
    }));
  }
  
  private checkPhotoUnlocks(
    photoGallery: CharacterPhoto[], 
    affection: AffectionLevel
  ): CharacterPhoto[] {
    return photoGallery.map(photo => ({
      ...photo,
      unlocked: affection >= photo.unlockedAt ? true : photo.unlocked,
      unlockedDate: !photo.unlocked && affection >= photo.unlockedAt 
        ? new Date() 
        : photo.unlockedDate
    }));
  }
}

// src/data/repositories/AchievementRepository.ts
export class AchievementRepository {
  private static instance: AchievementRepository;
  
  static getInstance(): AchievementRepository {
    if (!this.instance) {
      this.instance = new AchievementRepository();
    }
    return this.instance;
  }
  
  checkAchievements(
    achievements: Achievement[], 
    gameStats: GameStats
  ): Achievement[] {
    return achievements.map(achievement => {
      if (achievement.achieved) return achievement;
      
      const meetsCondition = this.evaluateAchievementCondition(
        achievement.condition, 
        gameStats
      );
      
      if (meetsCondition) {
        return {
          ...achievement,
          achieved: true,
          achievedDate: new Date(),
          progress: 100
        };
      }
      
      return {
        ...achievement,
        progress: this.calculateProgress(achievement.condition, gameStats)
      };
    });
  }
  
  private evaluateAchievementCondition(
    condition: AchievementCondition, 
    stats: GameStats
  ): boolean {
    switch (condition.type) {
      case 'affection':
        return stats.maxAffection >= condition.target;
      case 'date_count':
        return stats.totalDates >= condition.target;
      case 'conversation_count':
        return stats.totalConversations >= condition.target;
      default:
        return false;
    }
  }
}
```

### **Why it matters**
Centralized data access reduces duplication, improves consistency, makes testing easier, and provides a single place to handle data validation and transformation.

---

## **12. Add Performance Monitoring and Memory Management**

### **Issue**
The app has performance monitoring hooks but lacks proper memory cleanup and optimization.

### **Current Problem**
Components create new objects on every render and don't clean up subscriptions.

### **Solution**
Implement proper memory management and optimization:

```typescript
// src/hooks/useOptimizedCharacter.ts
export const useOptimizedCharacter = (characterId: CharacterId) => {
  const character = useGameStore(
    useCallback((state) => 
      state.characters.find(c => c.id === characterId), 
      [characterId]
    )
  );
  
  const player = useGameStore(state => state.player);
  
  const memoizedCompatibility = useMemo(() => {
    if (!character || !player) return null;
    return calculateCompatibility(player, character.profile);
  }, [
    character?.affection, 
    character?.profile, 
    player?.stats,
    player?.traits
  ]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any pending operations for this character
      AsyncOperationManager.cancelOperation(
        ASYNC_OPERATION_KEYS.CHARACTER_INFO_UNLOCK(characterId)
      );
      AsyncOperationManager.cancelOperation(
        ASYNC_OPERATION_KEYS.STORYLINE_UPDATE(characterId)
      );
    };
  }, [characterId]);
  
  return { 
    character, 
    compatibility: memoizedCompatibility,
    isLoading: !character 
  };
};

// src/hooks/useMemoryMonitor.ts
export const useMemoryMonitor = (componentName: string) => {
  const renderCount = useRef(0);
  const mountTime = useRef(Date.now());
  
  useEffect(() => {
    renderCount.current++;
    
    if (renderCount.current > 50) {
      Logger.warn(`High render count detected for ${componentName}: ${renderCount.current}`);
    }
  });
  
  useEffect(() => {
    return () => {
      const lifetime = Date.now() - mountTime.current;
      Logger.debug(`Component ${componentName} unmounted after ${lifetime}ms, ${renderCount.current} renders`);
    };
  }, [componentName]);
  
  return {
    renderCount: renderCount.current,
    lifetime: Date.now() - mountTime.current
  };
};

// src/hooks/useOptimizedGameStore.ts
export const useOptimizedGameStore = () => {
  // Selective subscriptions to prevent unnecessary re-renders
  const player = useGameStore(state => state.player);
  const currentScreen = useGameStore(state => state.currentScreen);
  const currentWeek = useGameStore(state => state.currentWeek);
  
  // Only subscribe to characters when needed
  const characters = useGameStore(
    state => state.characters,
    shallow // Use shallow comparison for arrays
  );
  
  const actions = useGameStore(
    useCallback((state) => ({
      setScreen: state.setScreen,
      selectCharacter: state.selectCharacter,
      updateAffection: state.updateAffection,
      createPlayer: state.createPlayer,
    }), [])
  );
  
  return {
    player,
    currentScreen,
    currentWeek,
    characters,
    ...actions
  };
};

// src/utils/PerformanceProfiler.ts
export class PerformanceProfiler {
  private static measurements = new Map<string, number[]>();
  
  static startMeasurement(key: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (!this.measurements.has(key)) {
        this.measurements.set(key, []);
      }
      
      this.measurements.get(key)!.push(duration);
      
      // Log slow operations
      if (duration > PERFORMANCE_THRESHOLDS.SLOW_OPERATION) {
        Logger.warn(`Slow operation detected: ${key} took ${duration.toFixed(2)}ms`);
      }
    };
  }
  
  static getAverageTime(key: string): number {
    const times = this.measurements.get(key) || [];
    return times.length > 0 
      ? times.reduce((sum, time) => sum + time, 0) / times.length 
      : 0;
  }
  
  static getPerformanceReport(): Record<string, { 
    average: number; 
    count: number; 
    max: number; 
    min: number; 
  }> {
    const report: Record<string, any> = {};
    
    for (const [key, times] of this.measurements.entries()) {
      if (times.length > 0) {
        report[key] = {
          average: times.reduce((sum, time) => sum + time, 0) / times.length,
          count: times.length,
          max: Math.max(...times),
          min: Math.min(...times)
        };
      }
    }
    
    return report;
  }
}

// Usage in components:
export const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  const endMeasurement = PerformanceProfiler.startMeasurement('CharacterCard.render');
  const { compatibility } = useOptimizedCharacter(character.id);
  const memoryStats = useMemoryMonitor('CharacterCard');
  
  useEffect(() => {
    endMeasurement();
  });
  
  // Component implementation
};
```

### **Why it matters**
Proper memory management prevents memory leaks and improves app performance, especially important for a game that might run for extended periods. Performance monitoring helps identify bottlenecks and optimization opportunities.

---

## **Implementation Priority**

### **High Priority (Implement First)**
1. **Constants for Magic Numbers** - Quick wins with immediate impact
2. **Runtime Validation** - Prevents critical runtime errors
3. **Error Boundaries** - Improves user experience immediately
4. **Logging Service** - Essential for debugging and monitoring

### **Medium Priority (Implement Second)**
1. **Store Separation** - Improves maintainability significantly
2. **Branded Types** - Enhances type safety
3. **Business Logic Extraction** - Better architecture
4. **Component Interface Standardization** - Reduces confusion

### **Lower Priority (Implement Later)**
1. **Design System Components** - Nice to have, implement gradually
2. **Data Access Layer** - Refactor existing functionality
3. **Performance Monitoring** - Optimize after other improvements
4. **Async Operation Manager** - Replace existing setTimeout usage

## **Estimated Implementation Time**

- **High Priority Items**: 2-3 days
- **Medium Priority Items**: 4-5 days  
- **Lower Priority Items**: 6-8 days
- **Total Estimated Time**: 12-16 days for complete implementation

## **Benefits After Implementation**

- **Reduced bugs** through better validation and type safety
- **Improved maintainability** with cleaner separation of concerns
- **Better performance** through proper memory management
- **Enhanced developer experience** with consistent interfaces and better error handling
- **Easier testing** with separated business logic and proper error boundaries
- **Production readiness** with proper logging and monitoring

This comprehensive improvement plan will transform the codebase into a more professional, maintainable, and robust application following modern React and TypeScript best practices.