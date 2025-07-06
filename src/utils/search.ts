import React from 'react'

// Fuzzy search utilities with highlighting support

export interface SearchResult<T> {
  item: T
  score: number
  matches: SearchMatch[]
}

export interface SearchMatch {
  key: string
  value: string
  indices: [number, number][]
}

export interface SearchOptions {
  keys: string[]
  threshold?: number
  includeScore?: boolean
  includeMatches?: boolean
  caseSensitive?: boolean
  ignoreLocation?: boolean
  findAllMatches?: boolean
  minMatchCharLength?: number
}

// Calculate Levenshtein distance for fuzzy matching
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null))

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator
      )
    }
  }

  return matrix[str2.length][str1.length]
}

// Find all matches of pattern in text
function findMatches(text: string, pattern: string, caseSensitive = false): [number, number][] {
  const matches: [number, number][] = []
  const searchText = caseSensitive ? text : text.toLowerCase()
  const searchPattern = caseSensitive ? pattern : pattern.toLowerCase()
  
  if (!searchPattern) return matches

  let index = 0
  while ((index = searchText.indexOf(searchPattern, index)) !== -1) {
    matches.push([index, index + searchPattern.length - 1])
    index += searchPattern.length
  }

  return matches
}

// Calculate search score
function calculateScore(text: string, pattern: string, options: SearchOptions): number {
  if (!pattern) return 1

  const searchText = options.caseSensitive ? text : text.toLowerCase()
  const searchPattern = options.caseSensitive ? pattern : pattern.toLowerCase()

  // Exact match gets highest score
  if (searchText === searchPattern) return 1

  // Contains match gets good score
  if (searchText.includes(searchPattern)) {
    const ratio = searchPattern.length / searchText.length
    return 0.8 + (ratio * 0.2)
  }

  // Fuzzy match using Levenshtein distance
  const distance = levenshteinDistance(searchText, searchPattern)
  const maxLength = Math.max(searchText.length, searchPattern.length)
  const similarity = 1 - (distance / maxLength)

  return similarity >= (options.threshold || 0.3) ? similarity : 0
}

// Get nested property value
function getNestedValue(obj: any, path: string): string {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : ''
  }, obj)?.toString() || ''
}

// Enhanced fuzzy search function with performance optimizations
export async function fuzzySearch<T>(
  items: T[],
  query: string,
  options: SearchOptions
): Promise<SearchResult<T>[]> {
  if (!query) {
    return items.map(item => ({
      item,
      score: 1,
      matches: []
    }))
  }

  const results: SearchResult<T>[] = []
  const { keys, threshold = 0.3, includeMatches = true, caseSensitive = false } = options

  // Use batch processing for better performance with large datasets
  const batchSize = Math.min(100, items.length)
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)
    
    for (const item of batch) {
      let bestScore = 0
      const matches: SearchMatch[] = []

      for (const key of keys) {
        const value = getNestedValue(item, key)
        const score = calculateScore(value, query, options)

        if (score > bestScore) {
          bestScore = score
        }

        if (score >= threshold && includeMatches) {
          const indices = findMatches(value, query, caseSensitive)
          if (indices.length > 0) {
            matches.push({
              key,
              value,
              indices
            })
          }
        }
      }

      if (bestScore >= threshold) {
        results.push({
          item,
          score: bestScore,
          matches
        })
      }
    }

    // Yield control to prevent blocking UI for large datasets
    if (i + batchSize < items.length && items.length > 500) {
      await new Promise(resolve => setTimeout(resolve, 0))
    }
  }

  // Sort by score (highest first) and limit results for performance
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 100) // Limit to top 100 results
}

// Synchronous version for backward compatibility
export function fuzzySearchSync<T>(
  items: T[],
  query: string,
  options: SearchOptions
): SearchResult<T>[] {
  if (!query) {
    return items.map(item => ({
      item,
      score: 1,
      matches: []
    }))
  }

  const results: SearchResult<T>[] = []
  const { keys, threshold = 0.3, includeMatches = true, caseSensitive = false } = options

  for (const item of items) {
    let bestScore = 0
    const matches: SearchMatch[] = []

    for (const key of keys) {
      const value = getNestedValue(item, key)
      const score = calculateScore(value, query, options)

      if (score > bestScore) {
        bestScore = score
      }

      if (score >= threshold && includeMatches) {
        const indices = findMatches(value, query, caseSensitive)
        if (indices.length > 0) {
          matches.push({
            key,
            value,
            indices
          })
        }
      }
    }

    if (bestScore >= threshold) {
      results.push({
        item,
        score: bestScore,
        matches
      })
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 100)
}

// Highlight matches in text
export function highlightMatches(
  text: string,
  matches: [number, number][],
  highlightClass = 'bg-yellow-200 dark:bg-yellow-800 font-semibold'
): React.ReactNode {
  if (!matches || matches.length === 0) {
    return text
  }

  const parts: React.ReactNode[] = []
  let lastIndex = 0

  // Sort matches by start index
  const sortedMatches = matches.sort((a, b) => a[0] - b[0])

  for (let i = 0; i < sortedMatches.length; i++) {
    const [start, end] = sortedMatches[i]

    // Add text before match
    if (start > lastIndex) {
      parts.push(text.slice(lastIndex, start))
    }

    // Add highlighted match
    parts.push(
      React.createElement(
        'span',
        { key: `match-${i}`, className: highlightClass },
        text.slice(start, end + 1)
      )
    )

    lastIndex = end + 1
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return React.createElement(React.Fragment, null, ...parts)
}

// Search hook for React components
export function useSearch<T>(
  items: T[],
  searchKeys: string[],
  options: Partial<SearchOptions> = {}
) {
  const defaultOptions: SearchOptions = {
    keys: searchKeys,
    threshold: 0.3,
    includeScore: true,
    includeMatches: true,
    caseSensitive: false,
    ignoreLocation: true,
    findAllMatches: false,
    minMatchCharLength: 1,
    ...options
  }

  const search = async (query: string): Promise<SearchResult<T>[]> => {
    return await fuzzySearch(items, query, defaultOptions)
  }

  return { search }
}

// Debounced search hook
export function useDebouncedSearch<T>(
  items: T[],
  searchKeys: string[],
  delay = 300,
  options: Partial<SearchOptions> = {}
) {
  const [query, setQuery] = React.useState('')
  const [debouncedQuery, setDebouncedQuery] = React.useState('')
  const [results, setResults] = React.useState<SearchResult<T>[]>([])
  const [isSearching, setIsSearching] = React.useState(false)

  const { search } = useSearch(items, searchKeys, options)

  // Debounce the query
  React.useEffect(() => {
    setIsSearching(true)
    const timer = setTimeout(() => {
      setDebouncedQuery(query)
    }, delay)

    return () => clearTimeout(timer)
  }, [query, delay])

  // Perform search when debounced query changes
  React.useEffect(() => {
    const performSearch = async () => {
      const searchResults = await search(debouncedQuery)
      setResults(searchResults)
      setIsSearching(false)
    }
    
    performSearch()
  }, [debouncedQuery, search])

  return {
    query,
    setQuery,
    results,
    isSearching
  }
}

// Advanced search filters
export interface SearchFilter {
  key: string
  operator: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'gt' | 'lt' | 'gte' | 'lte'
  value: any
}

export function applyFilters<T>(items: T[], filters: SearchFilter[]): T[] {
  return items.filter(item => {
    return filters.every(filter => {
      const value = getNestedValue(item, filter.key)
      
      switch (filter.operator) {
        case 'equals':
          return value === filter.value
        case 'contains':
          return value.toLowerCase().includes(filter.value.toLowerCase())
        case 'startsWith':
          return value.toLowerCase().startsWith(filter.value.toLowerCase())
        case 'endsWith':
          return value.toLowerCase().endsWith(filter.value.toLowerCase())
        case 'gt':
          return parseFloat(value) > filter.value
        case 'lt':
          return parseFloat(value) < filter.value
        case 'gte':
          return parseFloat(value) >= filter.value
        case 'lte':
          return parseFloat(value) <= filter.value
        default:
          return true
      }
    })
  })
}
