import React from 'react';
import { Logger } from '../services/Logger';

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
    Logger.debug('Error Info', errorInfo);
    
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

// Default error fallback component
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
            <pre className="text-xs mt-2 overflow-auto max-h-32">{error.message}</pre>
            {error.stack && (
              <pre className="text-xs mt-2 overflow-auto max-h-32 opacity-75">{error.stack}</pre>
            )}
          </details>
        )}
        
        <div className="flex gap-3 justify-center">
          <button 
            onClick={retry}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors"
          >
            Try Again
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors"
          >
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};

// Specific error boundaries for different sections
export const GameErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        Logger.error('Game Error', error);
        Logger.debug('Game Error Info', errorInfo);
      }}
      fallback={({ error: _error, retry }) => (
        <div className="min-h-screen bg-gradient-to-b from-slate-800 to-blue-900 flex items-center justify-center">
          <div className="bg-slate-900 rounded-lg p-8 max-w-md text-center text-white">
            <div className="text-6xl mb-4">🎮</div>
            <h2 className="text-2xl font-bold mb-4">Game Error</h2>
            <p className="text-gray-300 mb-6">
              The game encountered an error. Your progress has been saved.
            </p>
            <button 
              onClick={retry}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 rounded-lg font-semibold transition-all"
            >
              Restart Game
            </button>
          </div>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export const CharacterErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={({ error: _error, retry }) => (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
          <div className="text-red-400 text-2xl mb-2">⚠️</div>
          <div className="text-red-300 text-sm mb-3">Character data error</div>
          <button 
            onClick={retry}
            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-xs"
          >
            Retry
          </button>
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
