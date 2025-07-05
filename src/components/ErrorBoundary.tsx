'use client'

import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background">
          <div className="text-center p-8 max-w-md">
            <div className="text-6xl mb-4">🌌</div>
            <h2 className="text-2xl font-bold mb-4 text-light-text dark:text-dark-text">
              Oops! Something went wrong in the Luciverse
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Don't worry, even the best universes have glitches sometimes.
            </p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:scale-105 transition-transform duration-200"
            >
              Try Again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
