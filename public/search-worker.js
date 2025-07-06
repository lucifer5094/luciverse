// Web Worker for handling heavy search operations
self.onmessage = function(e) {
  const { items, query, options } = e.data
  
  try {
    const results = performSearch(items, query, options)
    self.postMessage(results)
  } catch (error) {
    self.postMessage({ error: error.message })
  }
}

function performSearch(items, query, options) {
  if (!query) {
    return items.map(item => ({
      item,
      score: 1,
      matches: []
    }))
  }

  const results = []
  const { keys, threshold = 0.3, includeMatches = true, caseSensitive = false } = options

  for (const item of items) {
    let bestScore = 0
    const matches = []

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

  return results.sort((a, b) => b.score - a.score).slice(0, 100)
}

// Helper functions (duplicated from main search utilities)
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : ''
  }, obj)?.toString() || ''
}

function calculateScore(text, pattern, options) {
  if (!pattern) return 1

  const searchText = options.caseSensitive ? text : text.toLowerCase()
  const searchPattern = options.caseSensitive ? pattern : pattern.toLowerCase()

  if (searchText === searchPattern) return 1

  if (searchText.includes(searchPattern)) {
    const ratio = searchPattern.length / searchText.length
    return 0.8 + (ratio * 0.2)
  }

  const distance = levenshteinDistance(searchText, searchPattern)
  const maxLength = Math.max(searchText.length, searchPattern.length)
  const similarity = 1 - (distance / maxLength)

  return similarity >= (options.threshold || 0.3) ? similarity : 0
}

function findMatches(text, pattern, caseSensitive = false) {
  const matches = []
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

function levenshteinDistance(str1, str2) {
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
