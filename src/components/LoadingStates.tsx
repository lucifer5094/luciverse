import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  color?: 'purple' | 'blue' | 'green' | 'red' | 'yellow'
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '',
  color = 'purple'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const colorClasses = {
    purple: 'border-gray-300 border-t-purple-500',
    blue: 'border-gray-300 border-t-blue-500',
    green: 'border-gray-300 border-t-green-500',
    red: 'border-gray-300 border-t-red-500',
    yellow: 'border-gray-300 border-t-yellow-500'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className={`animate-spin rounded-full border-2 ${colorClasses[color]} dark:border-gray-600 dark:border-t-${color}-400 transition-all duration-300`}></div>
    </div>
  )
}

export const SkeletonCard: React.FC = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
    <div className="flex items-center space-x-4 mb-4">
      <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-12 w-12 shimmer"></div>
      <div className="space-y-2 flex-1">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 shimmer"></div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2 shimmer"></div>
      </div>
    </div>
    <div className="space-y-3">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded shimmer"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6 shimmer"></div>
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/6 shimmer"></div>
    </div>
  </div>
)

export const SkeletonProjectCard: React.FC = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
    <div className="h-48 bg-gray-300 dark:bg-gray-600 shimmer"></div>
    <div className="p-6 space-y-4">
      <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4 shimmer"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded shimmer"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-4/5 shimmer"></div>
      </div>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-6 w-16 bg-gray-300 dark:bg-gray-600 rounded-full shimmer"></div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <div className="h-8 w-20 bg-gray-300 dark:bg-gray-600 rounded shimmer"></div>
        <div className="h-8 w-24 bg-gray-300 dark:bg-gray-600 rounded shimmer"></div>
      </div>
    </div>
  </div>
)

export const SkeletonAchievement: React.FC = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md">
    <div className="flex items-start space-x-4">
      <div className="w-16 h-16 bg-gray-300 dark:bg-gray-600 rounded-lg shimmer"></div>
      <div className="flex-1 space-y-3">
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-3/4 shimmer"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 shimmer"></div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded shimmer"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-5/6 shimmer"></div>
        </div>
        <div className="flex space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-6 w-12 bg-gray-300 dark:bg-gray-600 rounded-full shimmer"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
)

export const SkeletonVaultDocument: React.FC = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded shimmer"></div>
        <div className="space-y-2">
          <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-32 shimmer"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16 shimmer"></div>
        </div>
      </div>
      <div className="h-5 w-12 bg-gray-300 dark:bg-gray-600 rounded-full shimmer"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded shimmer"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-4/5 shimmer"></div>
    </div>
    <div className="flex flex-wrap gap-1 mb-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-5 w-12 bg-gray-300 dark:bg-gray-600 rounded-full shimmer"></div>
      ))}
    </div>
    <div className="flex justify-between items-center text-xs mb-4">
      <div className="h-3 w-24 bg-gray-300 dark:bg-gray-600 rounded shimmer"></div>
      <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded shimmer"></div>
    </div>
    <div className="flex gap-2">
      <div className="flex-1 h-8 bg-gray-300 dark:bg-gray-600 rounded shimmer"></div>
      <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded shimmer"></div>
      <div className="h-8 w-8 bg-gray-300 dark:bg-gray-600 rounded shimmer"></div>
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
        className={`h-4 bg-gray-300 dark:bg-gray-600 rounded shimmer ${
          i === lines - 1 ? 'w-3/4' : 'w-full'
        }`} 
      />
    ))}
  </div>
)

export const SkeletonGrid: React.FC<{ 
  count?: number
  columns?: number
  cardType?: 'default' | 'project' | 'achievement' | 'document'
}> = ({ 
  count = 6, 
  columns = 3,
  cardType = 'default'
}) => {
  const gridClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  }

  const getSkeletonCard = () => {
    switch (cardType) {
      case 'project':
        return <SkeletonProjectCard />
      case 'achievement':
        return <SkeletonAchievement />
      case 'document':
        return <SkeletonVaultDocument />
      default:
        return <SkeletonCard />
    }
  }

  return (
    <div className={`grid ${gridClasses[columns as keyof typeof gridClasses] || gridClasses[3]} gap-6`}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} style={{ animationDelay: `${i * 0.1}s` }}>
          {getSkeletonCard()}
        </div>
      ))}
    </div>
  )
}

interface LoadingStateProps {
  type: 'spinner' | 'skeleton' | 'text' | 'grid'
  message?: string
  className?: string
  gridProps?: {
    count?: number
    columns?: number
    cardType?: 'default' | 'project' | 'achievement' | 'document'
  }
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  type, 
  message = 'Loading...', 
  className = '',
  gridProps
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
    case 'grid':
      return <SkeletonGrid {...gridProps} />
    default:
      return null
  }
}

// Page-specific loading components
export const PageLoadingSpinner: React.FC<{ message?: string }> = ({ 
  message = 'Loading...' 
}) => (
  <div className="min-h-screen flex items-center justify-center bg-light-background dark:bg-dark-background">
    <div className="text-center">
      <LoadingSpinner size="xl" className="mx-auto mb-6" />
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {message}
      </h2>
      <div className="flex items-center justify-center space-x-1">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  </div>
)

export const InlineLoadingSpinner: React.FC<{ text?: string }> = ({ 
  text = 'Loading...' 
}) => (
  <div className="flex items-center justify-center space-x-2 py-4">
    <LoadingSpinner size="sm" />
    <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
  </div>
)

// Advanced skeleton loaders with performance optimization
export const PulseLoader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] animate-shimmer ${className}`}></div>
)

export const WaveLoader: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 dark:via-gray-500/40 to-transparent animate-wave"></div>
  </div>
)

export const SkeletonNavbar: React.FC = () => (
  <div className="animate-pulse bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-4">
          <PulseLoader className="h-8 w-32 rounded" />
        </div>
        <div className="flex items-center space-x-4">
          {[1, 2, 3, 4].map(i => (
            <PulseLoader key={i} className="h-6 w-16 rounded" />
          ))}
          <PulseLoader className="h-8 w-8 rounded-full" />
        </div>
      </div>
    </div>
  </div>
)

export const SkeletonPageHeader: React.FC = () => (
  <div className="animate-pulse space-y-6 mb-8">
    <div className="text-center space-y-4">
      <PulseLoader className="h-12 w-3/4 mx-auto rounded" />
      <PulseLoader className="h-6 w-1/2 mx-auto rounded" />
    </div>
    <div className="flex justify-center space-x-4">
      {[1, 2, 3].map(i => (
        <PulseLoader key={i} className="h-10 w-24 rounded-lg" />
      ))}
    </div>
  </div>
)

export const SkeletonSearch: React.FC = () => (
  <div className="animate-pulse space-y-4 mb-8">
    <div className="relative">
      <PulseLoader className="h-12 w-full rounded-lg" />
      <div className="absolute right-3 top-3">
        <PulseLoader className="h-6 w-6 rounded" />
      </div>
    </div>
    <div className="flex flex-wrap gap-2">
      {[1, 2, 3, 4, 5].map(i => (
        <PulseLoader key={i} className="h-8 w-16 rounded-full" />
      ))}
    </div>
  </div>
)
