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
    let isReloading = false

    // Detect if page is reloading
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        isReloading = true
      })
    }

    // Handle unhandled promise rejections
    if (typeof window !== 'undefined') {
      window.addEventListener('unhandledrejection', (event) => {
        // Skip error handling during page reload
        if (isReloading) return

        console.error('Unhandled promise rejection:', event.reason)
        
        // Skip common Next.js/React development errors that don't need handling
        const reasonStr = String(event.reason?.message || event.reason || '')
        const skipPatterns = [
          'Cannot read properties of undefined',
          'Loading chunk',
          'ChunkLoadError',
          'Module not found',
          'Failed to fetch dynamically imported module'
        ]
        
        const shouldSkip = skipPatterns.some(pattern => reasonStr.includes(pattern))
        
        if (!shouldSkip) {
          handler.handleError(new Error(event.reason), 'unhandled-promise')
        }
        
        // Only prevent default for non-critical errors
        if (!reasonStr.includes('Cannot read properties of undefined')) {
          event.preventDefault()
        }
      })

      // Handle global errors with specific webpack error detection
      window.addEventListener('error', (event) => {
        // Skip error handling during page reload
        if (isReloading) return

        console.error('Global error:', event.error)
        
        // Special handling for webpack module loading errors
        const errorMessage = event.error?.message || ''
        if (errorMessage.includes('Cannot read properties of undefined (reading \'call\')') ||
            errorMessage.includes('Loading chunk') ||
            errorMessage.includes('ChunkLoadError')) {
          console.warn('Module loading error detected. This is usually temporary during development.')
          // Don't handle these errors as they're handled by Next.js HMR
          return
        }
        
        // Skip common development errors that don't need user-facing handling
        const skipPatterns = [
          'ResizeObserver loop limit exceeded',
          'Non-Error promise rejection captured',
          'Script error'
        ]
        
        const shouldSkip = skipPatterns.some(pattern => errorMessage.includes(pattern))
        
        if (!shouldSkip) {
          handler.handleError(event.error, 'global-error')
        }
      })

      // Handle resource loading errors with better filtering
      window.addEventListener('error', (event) => {
        if (isReloading) return
        
        if (event.target && event.target !== window) {
          const target = event.target as HTMLElement
          if (target.tagName) {
            // Only handle critical resource errors
            const criticalResources = ['SCRIPT', 'LINK', 'IMG']
            if (criticalResources.includes(target.tagName)) {
              console.error(`Resource loading error: ${target.tagName}`, event)
              handler.handleError(
                new Error(`Failed to load ${target.tagName}: ${(target as any).src || (target as any).href}`),
                'resource-error'
              )
            }
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

// Reload detection utility
export class ReloadDetector {
  private static isReloading = false
  private static beforeUnloadHandlers: (() => void)[] = []

  static isPageReloading(): boolean {
    return this.isReloading
  }

  static onBeforeReload(handler: () => void) {
    this.beforeUnloadHandlers.push(handler)
  }

  static removeBeforeReloadHandler(handler: () => void) {
    const index = this.beforeUnloadHandlers.indexOf(handler)
    if (index > -1) {
      this.beforeUnloadHandlers.splice(index, 1)
    }
  }

  static initialize() {
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', () => {
        this.isReloading = true
        this.beforeUnloadHandlers.forEach(handler => {
          try {
            handler()
          } catch (error) {
            console.warn('Error in beforeunload handler:', error)
          }
        })
      })

      // Reset after a delay in case beforeunload was cancelled
      window.addEventListener('focus', () => {
        setTimeout(() => {
          this.isReloading = false
        }, 100)
      })
    }
  }
}

// Initialize global error handling
if (typeof window !== 'undefined') {
  ErrorHandler.setupGlobalErrorHandling()
}

// Initialize reload detection
if (typeof window !== 'undefined') {
  ReloadDetector.initialize()
}
