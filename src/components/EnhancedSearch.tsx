'use client'

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, X, Filter, SortAsc, SortDesc } from 'lucide-react'
import { fuzzySearchSync, highlightMatches, SearchResult, SearchOptions, SearchFilter, applyFilters } from '@/utils/search'
import { motion, AnimatePresence } from 'framer-motion'

interface EnhancedSearchProps<T> {
  items: T[]
  searchKeys: string[]
  onResults: (results: SearchResult<T>[]) => void
  placeholder?: string
  className?: string
  showFilters?: boolean
  filters?: SearchFilter[]
  onFiltersChange?: (filters: SearchFilter[]) => void
  sortOptions?: Array<{
    key: string
    label: string
  }>
  onSort?: (key: string, direction: 'asc' | 'desc') => void
  debounceMs?: number
}

export default function EnhancedSearch<T>({
  items,
  searchKeys,
  onResults,
  placeholder = 'Search...',
  className = '',
  showFilters = false,
  filters = [],
  onFiltersChange,
  sortOptions = [],
  onSort,
  debounceMs = 300
}: EnhancedSearchProps<T>) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [showFilterPanel, setShowFilterPanel] = useState(false)
  const [sortKey, setSortKey] = useState('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')

  const searchOptions: SearchOptions = useMemo(() => ({
    keys: searchKeys,
    threshold: 0.3,
    includeScore: true,
    includeMatches: true,
    caseSensitive: false,
    ignoreLocation: true,
    findAllMatches: true,
    minMatchCharLength: 1
  }), [searchKeys])

  const performSearch = useCallback(() => {
    // Apply filters first
    let filteredItems = filters.length > 0 ? applyFilters(items, filters) : items

    // Then apply search
    const results = fuzzySearchSync(filteredItems, query, searchOptions)
    
    onResults(results)
  }, [query, filters, items, searchOptions, onResults])

  // Debounced search effect
  useEffect(() => {
    setIsSearching(true)
    const timer = setTimeout(() => {
      performSearch()
      setIsSearching(false)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [performSearch, debounceMs])

  const handleClear = () => {
    setQuery('')
  }

  const handleSort = (key: string) => {
    const newDirection = sortKey === key && sortDirection === 'asc' ? 'desc' : 'asc'
    setSortKey(key)
    setSortDirection(newDirection)
    onSort?.(key, newDirection)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Main Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isSearching ? (
            <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-purple-500 rounded-full"></div>
          ) : (
            <Search className="h-5 w-5 text-gray-400" />
          )}
        </div>
        
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
          {query && (
            <button
              onClick={handleClear}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          
          {showFilters && (
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`p-1 transition-colors ${
                showFilterPanel || filters.length > 0
                  ? 'text-purple-600 dark:text-purple-400'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'
              }`}
            >
              <Filter className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Stats */}
      {query && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-gray-500 dark:text-gray-400"
        >
          {isSearching ? 'Searching...' : `Found ${items.length} results`}
        </motion.div>
      )}

      {/* Sort Options */}
      {sortOptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 flex flex-wrap gap-2"
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
          {sortOptions.map((option) => (
            <button
              key={option.key}
              onClick={() => handleSort(option.key)}
              className={`inline-flex items-center space-x-1 px-2 py-1 text-xs rounded-md transition-colors ${
                sortKey === option.key
                  ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              <span>{option.label}</span>
              {sortKey === option.key && (
                sortDirection === 'asc' ? 
                  <SortAsc className="h-3 w-3" /> : 
                  <SortDesc className="h-3 w-3" />
              )}
            </button>
          ))}
        </motion.div>
      )}

      {/* Filter Panel */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                Filters
              </h3>
              <button
                onClick={() => onFiltersChange?.([])}
                className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
              >
                Clear all
              </button>
            </div>
            
            {/* Filter content would go here */}
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Advanced filters coming soon...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Search result highlighting component
export function SearchResultHighlight({ 
  text, 
  matches, 
  className = '' 
}: { 
  text: string
  matches?: [number, number][]
  className?: string 
}) {
  if (!matches || matches.length === 0) {
    return <span className={className}>{text}</span>
  }

  return (
    <span className={className}>
      {highlightMatches(text, matches)}
    </span>
  )
}

// Quick search component for simple use cases
export function QuickSearch({
  placeholder = 'Quick search...',
  onSearch,
  className = ''
}: {
  placeholder?: string
  onSearch: (query: string) => void
  className?: string
}) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(query)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, onSearch])

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
      />
      {query && (
        <button
          onClick={() => setQuery('')}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </div>
  )
}
