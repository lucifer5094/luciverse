import React from 'react'

// Error handling utilities for better UX
export class ErrorHandler {
  private static instance: ErrorHandler
  private errorCallbacks: ((error: Error, context?: string) => void)[] = []

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler()
    }
    return ErrorHandler.instance
  }

  // Global error handler setup
  static setupGlobalErrorHandling() {
    const handler = ErrorHandler.getInstance()

    // Handle unhandled promise rejections
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        console.error('Unhandled promise rejection:', event.reason)
        handler.handleError(new Error(event.reason), 'unhandled-promise')
        
        // Prevent the default browser behavior
        event.preventDefault()
      })

      // Handle global errors
      window.addEventListener('error', (event) => {
        console.error('Global error:', event.error)
        handler.handleError(event.error, 'global-error')
      })

      // Handle resource loading errors
      window.addEventListener('error', (event) => {
        if (event.target && event.target !== window) {
          const target = event.target as HTMLElement
          if (target.tagName) {
            console.error(`Resource loading error: ${target.tagName}`, event)
            handler.handleError(
              new Error(`Failed to load ${target.tagName}: ${(target as any).src || (target as any).href}`),
              'resource-error'
            )
          }
        }
      }, true)
    }
  }

  // Add error callback
  onError(callback: (error: Error, context?: string) => void) {
    this.errorCallbacks.push(callback)
  }

  // Handle error with context
  handleError(error: Error, context?: string) {
    this.errorCallbacks.forEach(callback => {
      try {
        callback(error, context)
      } catch (e) {
        console.error('Error in error callback:', e)
      }
    })
  }

  // Safe async function wrapper
  static wrapAsync<T extends any[], R>(
    fn: (...args: T) => Promise<R>,
    errorHandler?: (error: Error) => R | Promise<R>
  ) {
    return async (...args: T): Promise<R> => {
      try {
        return await fn(...args)
      } catch (error) {
        const handler = ErrorHandler.getInstance()
        handler.handleError(error as Error, 'async-wrapper')
        
        if (errorHandler) {
          return await errorHandler(error as Error)
        }
        throw error
      }
    }
  }

  // Safe function wrapper
  static wrapSync<T extends any[], R>(
    fn: (...args: T) => R,
    errorHandler?: (error: Error) => R
  ) {
    return (...args: T): R => {
      try {
        return fn(...args)
      } catch (error) {
        const handler = ErrorHandler.getInstance()
        handler.handleError(error as Error, 'sync-wrapper')
        
        if (errorHandler) {
          return errorHandler(error as Error)
        }
        throw error
      }
    }
  }
}

// Hook for error handling in React components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const handleError = React.useCallback((error: Error, context?: string) => {
    console.error(`Error in ${context || 'component'}:`, error)
    setError(error)
    
    // Report to global error handler
    ErrorHandler.getInstance().handleError(error, context)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  // Auto-clear error after a delay
  React.useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  return { error, handleError, clearError }
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static metrics: { [key: string]: number } = {}

  static startTimer(name: string) {
    this.metrics[`${name}_start`] = performance.now()
  }

  static endTimer(name: string): number {
    const startTime = this.metrics[`${name}_start`]
    if (startTime) {
      const duration = performance.now() - startTime
      this.metrics[name] = duration
      console.log(`${name}: ${duration.toFixed(2)}ms`)
      return duration
    }
    return 0
  }

  static getMetrics() {
    return { ...this.metrics }
  }

  static measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    return new Promise(async (resolve, reject) => {
      this.startTimer(name)
      try {
        const result = await fn()
        this.endTimer(name)
        resolve(result)
      } catch (error) {
        this.endTimer(name)
        reject(error)
      }
    })
  }
}

// Initialize global error handling
if (typeof window !== 'undefined') {
  ErrorHandler.setupGlobalErrorHandling()
}
