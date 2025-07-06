'use client'

import React, { Component, ReactNode } from 'react'
import { LoadingSpinner } from './LoadingStates'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  showDetails?: boolean
}

interface State {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  retryCount: number
}

export default class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null

  constructor(props: Props) {
    super(props)
    this.state = { 
      hasError: false,
      retryCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({ errorInfo })
    
    // Call optional error callback
    this.props.onError?.(error, errorInfo)

    // In development, we still want to see the error overlay sometimes
    if (process.env.NODE_ENV === 'development' && !this.props.showDetails) {
      // Don't prevent the default error overlay for development errors
      // unless explicitly showing custom error UI
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          console.warn('Error boundary caught error in development. Set showDetails=true to see custom error UI.')
        }
      }, 100)
    }

    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      this.reportError(error, errorInfo)
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
    }
  }

  reportError = (error: Error, errorInfo: React.ErrorInfo) => {
    // Here you would typically send to an error tracking service
    // like Sentry, LogRocket, or your own logging endpoint
    console.log('Reporting error to tracking service:', { error, errorInfo })
  }

  handleRetry = () => {
    const { retryCount } = this.state
    
    if (retryCount < 3) {
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        retryCount: retryCount + 1
      })
    } else {
      // Auto-retry after delay if max retries reached
      this.retryTimeoutId = setTimeout(() => {
        this.setState({ 
          hasError: false, 
          error: undefined, 
          errorInfo: undefined,
          retryCount: 0
        })
      }, 5000)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { error, errorInfo, retryCount } = this.state
      const maxRetries = retryCount >= 3

      return (
        <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background p-4">
          <div className="text-center p-8 max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700">
            {/* Error Icon with Animation */}
            <div className="relative mb-6">
              <div className="text-6xl mb-4 animate-bounce">🌌</div>
              {maxRetries && (
                <div className="absolute -top-2 -right-2">
                  <LoadingSpinner size="sm" color="red" />
                </div>
              )}
            </div>

            {/* Error Message */}
            <h2 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">
              {maxRetries ? 'Service Temporarily Unavailable' : 'Oops! Something went wrong'}
            </h2>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {maxRetries 
                ? 'We\'re experiencing technical difficulties. Please try again in a few moments.'
                : 'Don\'t worry, even the best universes have glitches sometimes.'
              }
            </p>

            {/* Error Details (Development only) */}
            {this.props.showDetails && error && process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h3 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">
                  Error Details (Development)
                </h3>
                <p className="text-xs text-red-600 dark:text-red-300 font-mono break-all">
                  {error.message}
                </p>
                {errorInfo?.componentStack && (
                  <details className="mt-2">
                    <summary className="text-xs text-red-600 dark:text-red-300 cursor-pointer">
                      Component Stack
                    </summary>
                    <pre className="text-xs text-red-500 dark:text-red-400 mt-1 whitespace-pre-wrap">
                      {errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* Retry Count Indicator */}
            {retryCount > 0 && !maxRetries && (
              <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                Attempt {retryCount} of 3
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              {!maxRetries ? (
                <button 
                  onClick={this.handleRetry}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
                >
                  Try Again
                </button>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Auto-retrying in a few seconds...
                </div>
              )}
              
              <button 
                onClick={this.handleReload}
                className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                Reload Page
              </button>

              <a 
                href="/"
                className="block w-full text-center bg-transparent text-purple-600 dark:text-purple-400 px-6 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              >
                Go Home
              </a>
            </div>

            {/* Help Links */}
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                If the problem persists, please{' '}
                <a 
                  href="/contact" 
                  className="text-purple-600 dark:text-purple-400 hover:underline"
                >
                  contact support
                </a>
              </p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

// Specialized error boundaries for different sections
export class AsyncErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Async Error:', error, errorInfo)
    this.setState({ errorInfo })
    this.props.onError?.(error, errorInfo)

    // Auto-retry for async errors
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-center bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="text-yellow-600 dark:text-yellow-400 mb-2">⚠️</div>
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Failed to load component. Refreshing...
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

// Network error boundary
export class NetworkErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    if (error.name === 'NetworkError' || error.message.includes('fetch')) {
      return { hasError: true, error }
    }
    throw error // Re-throw if not a network error
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Network Error:', error, errorInfo)
    this.setState({ errorInfo })
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined })
    // Trigger a network retry
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6 text-center bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="text-red-600 dark:text-red-400 text-3xl mb-4">🌐</div>
          <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-2">
            Connection Problem
          </h3>
          <p className="text-sm text-red-600 dark:text-red-400 mb-4">
            Unable to load content. Please check your internet connection.
          </p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// Simple error boundary for development demos
export class DemoErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.log('Demo error caught:', error.message)
    this.setState({ errorInfo })
    this.props.onError?.(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: undefined, 
      errorInfo: undefined,
      retryCount: this.state.retryCount + 1
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-red-500 text-xl">⚠️</span>
            <h3 className="text-red-800 dark:text-red-200 font-medium">Demo Error Caught!</h3>
          </div>
          <p className="text-sm text-red-600 dark:text-red-400 mb-3">
            {this.state.error?.message || 'An error occurred in this component'}
          </p>
          <button
            onClick={this.handleRetry}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
          >
            Reset Component
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}
