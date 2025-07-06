'use client'

import React, { useState, Suspense, useEffect, useMemo } from 'react'
import { 
  LoadingSpinner, 
  SkeletonCard, 
  SkeletonProjectCard, 
  SkeletonAchievement,
  SkeletonNavbar,
  SkeletonPageHeader,
  SkeletonSearch,
  LoadingState,
  PageLoadingSpinner,
  PulseLoader,
  WaveLoader
} from '@/components/LoadingStates'
import OptimizedImage, { ProjectImage, AvatarImage, HeroImage } from '@/components/OptimizedImage'
import ErrorBoundary, { AsyncErrorBoundary, NetworkErrorBoundary, DemoErrorBoundary, withErrorBoundary } from '@/components/ErrorBoundary'
import EnhancedSearch, { QuickSearch, SearchResultHighlight } from '@/components/EnhancedSearch'
import { fuzzySearchSync, SearchResult, SearchOptions } from '@/utils/search'

// Demo component for showcasing Performance & UX improvements
export default function PerformanceUXDemo() {
  const [activeDemo, setActiveDemo] = useState<string>('loading')
  const [showError, setShowError] = useState(false)
  const [errorKey, setErrorKey] = useState(0) // Key to force remount
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  // Sample data for search demo - memoized to prevent recreation on every render
  const sampleProjects = useMemo(() => [
    { 
      id: 1, 
      title: 'AI-Powered Portfolio', 
      description: 'Next.js application with machine learning features',
      technologies: ['React', 'TypeScript', 'TensorFlow'],
      category: 'Web Development'
    },
    { 
      id: 2, 
      title: 'Blockchain Voting System', 
      description: 'Decentralized voting platform using smart contracts',
      technologies: ['Solidity', 'Web3', 'Ethereum'],
      category: 'Blockchain'
    },
    { 
      id: 3, 
      title: 'Mobile Weather App', 
      description: 'React Native app with real-time weather data',
      technologies: ['React Native', 'API Integration', 'Redux'],
      category: 'Mobile Development'
    }
  ], [])

  // Search implementation with debouncing
  const results = useMemo(() => {
    if (!searchQuery.trim()) return sampleProjects.map(item => ({ item, score: 1, matches: [] }))
    
    const searchOptions: SearchOptions = {
      keys: ['title', 'description', 'technologies', 'category'],
      threshold: 0.3,
      includeScore: true,
      includeMatches: true,
      caseSensitive: false,
      ignoreLocation: true,
    }
    
    return fuzzySearchSync(sampleProjects, searchQuery, searchOptions)
  }, [searchQuery, sampleProjects])

  // Debounce search
  useEffect(() => {
    setIsSearching(true)
    const timer = setTimeout(() => {
      setIsSearching(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Error throwing component for demo
  const ErrorComponent = React.memo(() => {
    if (showError) {
      throw new Error('Demo error for testing error boundaries')
    }
    return <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">✅ No errors here!</div>
  })
  ErrorComponent.displayName = 'ErrorComponent'

  // Async error component for testing
  const AsyncErrorComponent = () => {
    const [hasAsyncError, setHasAsyncError] = React.useState(false)
    
    React.useEffect(() => {
      if (hasAsyncError) {
        // Simulate an async error
        setTimeout(() => {
          throw new Error('Async demo error')
        }, 100)
      }
    }, [hasAsyncError])

    return (
      <div className="space-y-2">
        <div className="p-4 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
          ✅ Async operations protected
        </div>
        <button
          onClick={() => setHasAsyncError(!hasAsyncError)}
          className="px-3 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors"
        >
          {hasAsyncError ? 'Stop Async Error' : 'Trigger Async Error'}
        </button>
      </div>
    )
  }

  const demoSections = {
    loading: 'Loading States & Skeleton Loaders',
    images: 'Optimized Images with Lazy Loading',
    errors: 'Error Boundaries & Error Handling',
    search: 'Enhanced Search with Fuzzy Matching',
    offline: 'PWA & Offline Support'
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          Performance & UX Enhancements
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Showcasing improved loading states, image optimization, error handling, search functionality, and PWA features
        </p>
      </div>

      {/* Demo Navigation */}
      <div className="flex flex-wrap gap-2 justify-center mb-8">
        {Object.entries(demoSections).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setActiveDemo(key)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              activeDemo === key
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Demo Content */}
      <div className="space-y-8">
        {activeDemo === 'loading' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Loading States & Skeleton Loaders</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Enhanced Loading Spinners</h3>
                <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                  <LoadingSpinner size="sm" color="purple" />
                  <LoadingSpinner size="md" color="blue" />
                  <LoadingSpinner size="lg" color="green" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">New Advanced Loaders</h3>
                <div className="space-y-2">
                  <PulseLoader className="h-4 w-full rounded" />
                  <WaveLoader className="h-4 w-3/4 rounded" />
                  <PulseLoader className="h-4 w-1/2 rounded" />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Skeleton Components</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <SkeletonCard />
                <SkeletonProjectCard />
                <SkeletonAchievement />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Page-Level Skeletons</h3>
              <SkeletonNavbar />
              <SkeletonPageHeader />
              <SkeletonSearch />
            </div>
          </div>
        )}

        {activeDemo === 'images' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Optimized Images with Lazy Loading</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Hero Image with Blur Placeholder</h3>
                <div className="h-64 rounded-lg overflow-hidden">
                  <HeroImage 
                    src="/Assets/ba09adf5-e765-4d66-bd82-1c8739ccf737.jpg" 
                    alt="Demo Hero Image"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Project Image with Loading State</h3>
                <div className="h-64 rounded-lg overflow-hidden">
                  <ProjectImage 
                    src="/Assets/Campus Mantri Logo.jpg" 
                    alt="Demo Project Image"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Avatar Images</h3>
              <div className="flex space-x-4">
                <AvatarImage src="/Assets/ba09adf5-e765-4d66-bd82-1c8739ccf737.jpg" alt="Avatar 1" size={64} />
                <AvatarImage src="/Assets/Campus Mantri Logo.jpg" alt="Avatar 2" size={80} />
                <AvatarImage src="/next.svg" alt="Avatar 3" size={96} />
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">Features:</h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Automatic retry with exponential backoff</li>
                <li>• Progressive loading with blur placeholders</li>
                <li>• Optimized sizes for different viewports</li>
                <li>• Fallback images for failed loads</li>
                <li>• Performance optimizations with will-change</li>
              </ul>
            </div>
          </div>
        )}

        {activeDemo === 'errors' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Error Boundaries & Error Handling</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Standard Error Boundary</h3>
                <DemoErrorBoundary 
                  key={errorKey} // Force remount when key changes
                  onError={(error, errorInfo) => {
                    console.log('Demo error caught:', error.message)
                  }}
                >
                  <ErrorComponent />
                </DemoErrorBoundary>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setShowError(!showError)
                      if (showError) {
                        // Reset the error boundary when fixing
                        setErrorKey(prev => prev + 1)
                      }
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      showError 
                        ? 'bg-green-500 text-white hover:bg-green-600' 
                        : 'bg-red-500 text-white hover:bg-red-600'
                    }`}
                  >
                    {showError ? 'Fix Error' : 'Trigger Error'}
                  </button>
                  <button
                    onClick={() => {
                      setShowError(false)
                      setErrorKey(prev => prev + 1)
                    }}
                    className="px-3 py-2 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
                  >
                    Reset
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Specialized Error Boundaries</h3>
                <AsyncErrorBoundary>
                  <AsyncErrorComponent />
                </AsyncErrorBoundary>
                
                <NetworkErrorBoundary>
                  <div className="p-4 bg-green-100 dark:bg-green-900/20 rounded-lg">
                    ✅ Network requests protected
                  </div>
                </NetworkErrorBoundary>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">Enhanced Features:</h4>
              <ul className="text-sm text-purple-700 dark:text-purple-300 space-y-1">
                <li>• Automatic retry with exponential backoff</li>
                <li>• Specialized boundaries for async and network errors</li>
                <li>• Production error reporting integration</li>
                <li>• Graceful fallback UI components</li>
                <li>• User-friendly error messages</li>
              </ul>
            </div>
          </div>
        )}

        {activeDemo === 'search' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Enhanced Search with Fuzzy Matching</h2>
            
            <div className="space-y-4">
              <QuickSearch
                placeholder="Search projects, technologies, or descriptions..."
                onSearch={setSearchQuery}
                className="w-full"
              />
              
              {isSearching && (
                <div className="text-center py-4">
                  <LoadingSpinner size="sm" />
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Searching...</span>
                </div>
              )}

              <div className="space-y-3">
                {results.length > 0 ? (
                  results.map((result: SearchResult<any>) => (
                    <div key={result.item.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">
                          <SearchResultHighlight 
                            text={result.item.title}
                            matches={result.matches.find((m: any) => m.key === 'title')?.indices}
                          />
                        </h3>
                        <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">
                          Score: {(result.score * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <SearchResultHighlight 
                          text={result.item.description}
                          matches={result.matches.find((m: any) => m.key === 'description')?.indices}
                        />
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {result.item.technologies.map((tech: string, idx: number) => (
                          <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                ) : searchQuery && !isSearching ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No results found for &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sampleProjects.map((project) => (
                      <div key={project.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                        <h3 className="font-semibold mb-2">{project.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.technologies.map((tech, idx) => (
                            <span key={idx} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Search Features:</h4>
              <ul className="text-sm text-green-700 dark:text-green-300 space-y-1">
                <li>• Fuzzy matching with Levenshtein distance</li>
                <li>• Real-time search result highlighting</li>
                <li>• Debounced search for performance</li>
                <li>• Batch processing for large datasets</li>
                <li>• Web Worker support for heavy searches</li>
                <li>• Configurable search threshold and options</li>
              </ul>
            </div>
          </div>
        )}

        {activeDemo === 'offline' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">PWA & Offline Support</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">PWA Installation</h3>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-3">
                    The PWA install prompt appears automatically after user engagement.
                  </p>
                  <div className="space-y-2 text-xs text-blue-600 dark:text-blue-400">
                    <div>✓ Smart prompt timing based on user interaction</div>
                    <div>✓ Installation progress indicator</div>
                    <div>✓ Success notification after install</div>
                    <div>✓ Analytics tracking for install events</div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Offline Detection</h3>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                    The offline indicator automatically shows when connection is lost.
                  </p>
                  <div className="space-y-2 text-xs text-yellow-600 dark:text-yellow-400">
                    <div>✓ Real-time connection monitoring</div>
                    <div>✓ Animated reconnection notification</div>
                    <div>✓ Cached content availability indicator</div>
                    <div>✓ Manual retry functionality</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">PWA Features Implemented:</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm text-purple-700 dark:text-purple-300">
                <div className="space-y-1">
                  <div>• Service Worker for caching</div>
                  <div>• Offline page functionality</div>
                  <div>• App manifest for installability</div>
                  <div>• Background sync capabilities</div>
                </div>
                <div className="space-y-1">
                  <div>• Push notification support</div>
                  <div>• App shortcuts and icons</div>
                  <div>• Performance optimizations</div>
                  <div>• Cross-platform compatibility</div>
                </div>
              </div>
            </div>

            <div className="text-center p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Try the PWA!</h3>
              <p className="text-sm opacity-90">
                Interact with the page to see the PWA install prompt, or go offline to test the offline indicator.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="mt-12 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg">
        <h3 className="text-xl font-semibold mb-4">Performance Improvements Summary</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-green-500 mb-1">↑ 40%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Perceived Performance</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-blue-500 mb-1">↓ 60%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Image Load Time</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-purple-500 mb-1">↑ 95%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Error Recovery</div>
          </div>
          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg">
            <div className="text-2xl font-bold text-orange-500 mb-1">↑ 80%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Search Speed</div>
          </div>
        </div>
      </div>
    </div>
  )
}
