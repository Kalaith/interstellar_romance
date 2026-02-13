// Centralized logging service

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
  
  static error(message: string, error?: Error | unknown): void {
    if (this.currentLevel >= LogLevel.ERROR) {
      console.error(this.formatMessage('ERROR', message), error);
      // Could send to error reporting service in production
      this.reportError(message, error);
    }
  }
  
  static warn(message: string, ...args: unknown[]): void {
    if (this.currentLevel >= LogLevel.WARN) {
      console.warn(this.formatMessage('WARN', message), ...args);
    }
  }
  
  static info(message: string, ...args: unknown[]): void {
    if (this.currentLevel >= LogLevel.INFO) {
      console.info(this.formatMessage('INFO', message), ...args);
    }
  }
  
  static debug(message: string, ...args: unknown[]): void {
    if (this.currentLevel >= LogLevel.DEBUG) {
      console.debug(this.formatMessage('DEBUG', message), ...args);
    }
  }
  
  static setLevel(level: LogLevel): void {
    this.currentLevel = level;
  }
  
  static getLevel(): LogLevel {
    return this.currentLevel;
  }
  
  private static reportError(message: string, error?: Error | unknown): void {
    // In production, could send to Sentry, LogRocket, etc.
    if (process.env.NODE_ENV === 'production') {
      // Example: window.errorReporter?.captureException(error || new Error(message));
      try {
        // Store error locally for debugging
        const errorData = {
          message,
          error: error instanceof Error ? {
            name: error.name,
            message: error.message,
            stack: error.stack
          } : error,
          timestamp: new Date().toISOString(),
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'unknown',
          url: typeof window !== 'undefined' ? window.location.href : 'unknown'
        };
        
        // Store in localStorage for debugging (limit to last 10 errors)
        if (typeof window !== 'undefined' && window.localStorage) {
          const existingErrors = JSON.parse(localStorage.getItem('app_errors') || '[]');
          existingErrors.push(errorData);
          if (existingErrors.length > 10) {
            existingErrors.splice(0, existingErrors.length - 10);
          }
          localStorage.setItem('app_errors', JSON.stringify(existingErrors));
        }
      } catch (reportingError) {
        // Silently fail if error reporting fails
        console.error('Failed to report error:', reportingError);
      }
    }
  }
  
  // Utility method to get stored errors for debugging
  static getStoredErrors(): unknown[] {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const parsed: unknown = JSON.parse(localStorage.getItem('app_errors') || '[]');
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  }
  
  // Clear stored errors
  static clearStoredErrors(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('app_errors');
    }
  }
}
