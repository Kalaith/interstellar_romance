// Branded types for enhanced type safety

// Validation Error class
export class ValidationError extends Error {
  constructor(
    message: string,
    public field?: string
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Branded types
export type AffectionLevel = number & { readonly __brand: unique symbol };
export type CharacterId = string & { readonly __brand: unique symbol };
export type PercentageScore = number & { readonly __brand: unique symbol };
export type Week = number & { readonly __brand: unique symbol };

// Type creators with validation
export const createAffectionLevel = (value: number): AffectionLevel => {
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError('Affection must be a valid number');
  }
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
  if (typeof value !== 'number' || isNaN(value)) {
    throw new ValidationError('Percentage must be a valid number');
  }
  if (value < 0 || value > 100) {
    throw new ValidationError('Percentage must be between 0-100');
  }
  return value as PercentageScore;
};

export const createWeek = (value: number): Week => {
  if (typeof value !== 'number' || isNaN(value) || value < 1) {
    throw new ValidationError('Week must be a positive number');
  }
  return value as Week;
};

// Type guards
export const isAffectionLevel = (value: unknown): value is AffectionLevel => {
  return typeof value === 'number' && value >= 0 && value <= 100;
};

export const isCharacterId = (value: unknown): value is CharacterId => {
  return typeof value === 'string' && value.length > 0;
};

export const isPercentageScore = (value: unknown): value is PercentageScore => {
  return typeof value === 'number' && value >= 0 && value <= 100;
};

export const isWeek = (value: unknown): value is Week => {
  return typeof value === 'number' && value >= 1;
};
