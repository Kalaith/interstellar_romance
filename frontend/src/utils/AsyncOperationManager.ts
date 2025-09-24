import { Logger } from '../services/Logger';

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
      Logger.debug(`Cancelled existing operation: ${key}`);
    }
    
    const timeoutId = setTimeout(() => {
      try {
        operation();
        Logger.debug(`Completed async operation: ${key}`);
      } catch (error) {
        Logger.error(`Async operation failed for key: ${key}`, error);
      } finally {
        this.pendingOperations.delete(key);
      }
    }, delay);
    
    this.pendingOperations.set(key, timeoutId);
    Logger.debug(`Scheduled async operation: ${key} (delay: ${delay}ms)`);
  }
  
  static cancelOperation(key: string): boolean {
    const timeoutId = this.pendingOperations.get(key);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.pendingOperations.delete(key);
      Logger.debug(`Cancelled operation: ${key}`);
      return true;
    }
    return false;
  }
  
  static cancelAllOperations(): number {
    const count = this.pendingOperations.size;
    for (const [key, timeoutId] of this.pendingOperations) {
      clearTimeout(timeoutId);
    }
    this.pendingOperations.clear();
    Logger.debug(`Cancelled ${count} pending operations`);
    return count;
  }
  
  static hasPendingOperation(key: string): boolean {
    return this.pendingOperations.has(key);
  }
  
  static getPendingOperationCount(): number {
    return this.pendingOperations.size;
  }
  
  static getAllPendingOperations(): string[] {
    return Array.from(this.pendingOperations.keys());
  }
  
  // Debounce utility
  static debounce(
    key: string,
    operation: () => void,
    delay: number
  ): void {
    this.scheduleOperation(key, operation, delay);
  }
  
  // Throttle utility - only execute if not already pending
  static throttle(
    key: string,
    operation: () => void,
    delay: number = 0
  ): boolean {
    if (this.hasPendingOperation(key)) {
      return false; // Operation already scheduled
    }
    
    this.scheduleOperation(key, operation, delay);
    return true;
  }
}

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    AsyncOperationManager.cancelAllOperations();
  });
}