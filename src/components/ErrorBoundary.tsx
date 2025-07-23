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
    
    // NEVER auto-retry - wait for user action only
    console.log('Error boundary activated. Waiting for user interaction.')
    
    // In development, log helpful debugging info
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 Error Details:', {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      })
      console.log('💡 To fix: Check the component tree above for errors')
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
    // Clear any pending timeouts before retry
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
      this.retryTimeoutId = null
    }

    const { retryCount } = this.state
    
    // STOP all automatic retries - only allow manual user retries
    if (retryCount < 1) { // Only allow 1 manual retry
      console.log(`ErrorBoundary manual retry attempt ${retryCount + 1}`)
      this.setState({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        retryCount: retryCount + 1
      })
    } else {
      // Show user a message that they need to reload manually
      console.warn('Max retries reached. Please refresh the page manually.')
      alert('Maximum retries reached. Please refresh the page manually using your browser refresh button.')
    }
  }

  handleReload = () => {
    // COMPLETELY disable reload in development to prevent infinite loops
    if (process.env.NODE_ENV === 'development') {
      console.warn('🚫 Reload BLOCKED in development mode to prevent infinite loops')
      console.log('💡 If you need to reload, use browser refresh button manually')
      return
    }
    
    // In production, only allow reload if not recently attempted
    const lastReload = localStorage.getItem('last-error-reload')
    const now = Date.now()
    
    if (lastReload && (now - parseInt(lastReload)) < 10000) {
      console.warn('🚫 Reload prevented - too recent (within 10 seconds)')
      return
    }
    
    // Clear any pending timeouts before reload
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId)
      this.retryTimeoutId = null
    }
    
    // Store reload timestamp
    localStorage.setItem('last-error-reload', now.toString())
    
    // Add delay to ensure cleanup is complete
    setTimeout(() => {
      window.location.reload()
    }, 100)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      const { error, errorInfo, retryCount } = this.state
      const maxRetries = retryCount >= 1 // Changed to match handleRetry logic

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
                Attempt {retryCount} of 1
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
                <div className="text-sm text-red-600 dark:text-red-400 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded border">
                  <strong>Maximum retries reached.</strong><br />
                  Please refresh the page manually using your browser's refresh button.
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
  private reloadTimeoutId: NodeJS.Timeout | null = null

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

    // Handle chunk load errors more gracefully
    if (error.name === 'ChunkLoadError' || error.message.includes('Loading chunk')) {
      // Give user a chance to manually refresh instead of automatic reload
      console.warn('Chunk loading failed. Manual refresh may be needed.')
      // Don't auto-reload - let user decide
    }
  }

  componentWillUnmount() {
    if (this.reloadTimeoutId) {
      clearTimeout(this.reloadTimeoutId)
    }
  }

  handleManualReload = () => {
    // Prevent reload in development mode
    if (process.env.NODE_ENV === 'development') {
      console.warn('Manual reload prevented in development mode')
      return
    }
    
    if (this.reloadTimeoutId) {
      clearTimeout(this.reloadTimeoutId)
      this.reloadTimeoutId = null
    }
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const isChunkError = this.state.error?.name === 'ChunkLoadError' || 
                          this.state.error?.message.includes('Loading chunk')
      
      return (
        <div className="p-4 text-center bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="text-yellow-600 dark:text-yellow-400 mb-2">⚠️</div>
          <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
            {isChunkError 
              ? 'Failed to load component. This usually happens after updates.'
              : 'Failed to load component.'
            }
          </p>
          <button
            onClick={this.handleManualReload}
            className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
          >
            Refresh Page
          </button>
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
    // Don't automatically reload - let user decide
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
          <div className="space-x-2">
            <button
              onClick={this.handleRetry}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => {
                // Prevent reload in development mode
                if (process.env.NODE_ENV === 'development') {
                  console.warn('🚫 Manual reload prevented in development mode')
                  alert('Reload blocked in development mode. Use browser refresh button.')
                  return
                }
                window.location.reload()
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
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

// Hydration-specific error boundary
export class HydrationErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, retryCount: 0 }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Only catch hydration errors
    if (error.message.includes('hydrating') || 
        error.message.includes('hydration') ||
        error.message.includes('Hydration failed')) {
      return { hasError: true, error }
    }
    // Re-throw other errors
    throw error
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Hydration Error:', error, errorInfo)
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
        <div className="p-6 text-center bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-blue-600 dark:text-blue-400 text-3xl mb-4">⚡</div>
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
            Content Loading
          </h3>
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-4">
            There was a mismatch in content loading. Retrying...
          </p>
          <button
            onClick={this.handleRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry Loading
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
