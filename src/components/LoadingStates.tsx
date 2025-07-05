import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="animate-spin rounded-full border-2 border-gray-300 border-t-purple-500"></div>
    </div>
  )
}

export const SkeletonCard: React.FC = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
    <div className="flex items-center space-x-4 mb-4">
      <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-12 w-12"></div>
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6"></div>
    </div>
  </div>
)

export const SkeletonText: React.FC<{ lines?: number; className?: string }> = ({ 
  lines = 3, 
  className = '' 
}) => (
  <div className={`animate-pulse space-y-3 ${className}`}>
    {Array.from({ length: lines }, (_, i) => (
      <div 
        key={i} 
        className={`h-4 bg-gray-300 dark:bg-gray-600 rounded ${
          i === lines - 1 ? 'w-3/4' : 'w-full'
        }`} 
      />
    ))}
  </div>
)

interface LoadingStateProps {
  type: 'spinner' | 'skeleton' | 'text'
  message?: string
  className?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  type, 
  message = 'Loading...', 
  className = '' 
}) => {
  switch (type) {
    case 'spinner':
      return (
        <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      )
    case 'skeleton':
      return <SkeletonCard />
    case 'text':
      return <SkeletonText />
    default:
      return null
  }
}
