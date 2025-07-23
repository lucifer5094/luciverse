import { Document } from './vaultUtils'

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// API base URL - automatically detects environment
const getApiUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:3000' // Server side
  return window.location.origin // Client side
}

// Enhanced error handling
class DataAPIError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message)
    this.name = 'DataAPIError'
  }
}

// Fetch data from JSON files via API with caching
export async function fetchData<T>(type: string, useCache = true): Promise<T> {
  const cacheKey = `data_${type}`
  
  // Check cache first
  if (useCache) {
    const cached = cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data
    }
  }

  try {
    const response = await fetch(`${getApiUrl()}/api/data?type=${type}`)
    if (!response.ok) {
      throw new DataAPIError(
        `Failed to fetch ${type}: ${response.statusText}`,
        response.status
      )
    }
    
    const data = await response.json()
    
    // Cache the result
    if (useCache) {
      cache.set(cacheKey, { data, timestamp: Date.now() })
    }
    
    return data
  } catch (error) {
    console.error(`Error fetching ${type}:`, error)
    
    // Return cached data if available, even if expired
    const cached = cache.get(cacheKey)
    if (cached) {
      console.warn(`Using stale cache for ${type}`)
      return cached.data
    }
    
    throw error
  }
}

// Update data (only works in development/localhost) with optimistic updates
export async function updateData<T>(type: string, data: T): Promise<void> {
  const cacheKey = `data_${type}`
  
  // Optimistic update - update cache immediately
  cache.set(cacheKey, { data, timestamp: Date.now() })
  
  try {
    const response = await fetch(`${getApiUrl()}/api/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ type, data })
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new DataAPIError(error.message || 'Failed to update data', response.status)
    }
    
    const result = await response.json()
    console.log(`${type} updated successfully at ${result.timestamp}`)
  } catch (error) {
    // Rollback optimistic update on failure
    cache.delete(cacheKey)
    console.error(`Error updating ${type}:`, error)
    throw error
  }
}

// Achievement interface
export interface Achievement {
  id: string
  title: string
  organization: string
  date: string
  category: 'certification' | 'award' | 'achievement' | 'competition' | 'leadership' | 'project'
  description: string
  imageUrl?: string
  certificateUrl?: string
  verificationUrl?: string
  skills: string[]
  importance: 1 | 2 | 3 // 1 = High, 2 = Medium, 3 = Low
  isVerified: boolean
  location?: string
  duration?: string
  grade?: string
  issueDate?: string
  expiryDate?: string
  prize?: string
}

// Specific functions for different data types
export const dataAPI = {
  // Vault documents
  getVaultDocuments: (): Promise<Document[]> => 
    fetchData<Document[]>('vault-documents'),
    
  updateVaultDocuments: (documents: Document[]): Promise<void> => 
    updateData('vault-documents', documents),
  
  // Site content
  getSiteContent: (): Promise<{
    heroTitle: string
    heroSubtitle: string
    aboutTitle: string
    aboutSubtitle: string
    aboutContent: string
    contactInfo: any
    projectsTitle: string
    projectsSubtitle: string
    projectsDescription: string
    labTitle: string
    labSubtitle: string
    labDescription: string
    contactTitle: string
    contactSubtitle: string
    logsTitle: string
    logsSubtitle: string
    logsDescription: string
    adminTitle: string
    adminSubtitle: string
    adminDescription: string
    highlights: any[]
    stats: {
      projects: number
      years: number
      technologies: number
      achievements: number
    }
    lastUpdated: string
  }> => fetchData('site-content'),
  
  updateSiteContent: (content: any): Promise<void> => 
    updateData('site-content', content),
  
  // Add new document to vault
  addVaultDocument: async (newDoc: Document): Promise<void> => {
    const documents = await dataAPI.getVaultDocuments()
    documents.push(newDoc)
    return dataAPI.updateVaultDocuments(documents)
  },
  
  // Update existing document
  updateVaultDocument: async (id: string, updatedDoc: Partial<Document>): Promise<void> => {
    const documents = await dataAPI.getVaultDocuments()
    const index = documents.findIndex(doc => doc.id === id)
    if (index !== -1) {
      documents[index] = { ...documents[index], ...updatedDoc, updatedAt: new Date() }
      return dataAPI.updateVaultDocuments(documents)
    }
    throw new Error('Document not found')
  },
  
  // Delete document
  deleteVaultDocument: async (id: string): Promise<void> => {
    const documents = await dataAPI.getVaultDocuments()
    const filteredDocs = documents.filter(doc => doc.id !== id)
    return dataAPI.updateVaultDocuments(filteredDocs)
  },

  // Achievements management
  getAchievements: async (): Promise<Achievement[]> => {
    const data = await fetchData<Record<string, Achievement | string>>('achievements')
    // Filter out non-achievement properties like 'lastUpdated'
    const achievements = Object.values(data).filter((item): item is Achievement => 
      typeof item === 'object' && item !== null && 'id' in item
    )
    return achievements
  },
  
  updateAchievements: async (achievements: Achievement[]): Promise<void> => {
    // Convert array back to object format for storage
    const achievementsObj: Record<string, Achievement | string> = {}
    achievements.forEach((achievement, index) => {
      achievementsObj[index.toString()] = achievement
    })
    achievementsObj.lastUpdated = new Date().toISOString()
    return updateData('achievements', achievementsObj)
  },
  
  // Add new achievement
  addAchievement: async (newAchievement: Achievement): Promise<void> => {
    const achievements = await dataAPI.getAchievements()
    achievements.push(newAchievement)
    return dataAPI.updateAchievements(achievements)
  },
  
  // Update existing achievement
  updateAchievement: async (id: string, updatedAchievement: Partial<Achievement>): Promise<void> => {
    const achievements = await dataAPI.getAchievements()
    const index = achievements.findIndex(achievement => achievement.id === id)
    if (index !== -1) {
      achievements[index] = { ...achievements[index], ...updatedAchievement }
      return dataAPI.updateAchievements(achievements)
    }
    throw new Error('Achievement not found')
  },
  
  // Delete achievement
  deleteAchievement: async (id: string): Promise<void> => {
    const achievements = await dataAPI.getAchievements()
    const filteredAchievements = achievements.filter(achievement => achievement.id !== id)
    return dataAPI.updateAchievements(filteredAchievements)
  },

  // Interview Problems management
  getInterviewProblems: async (): Promise<any[]> => {
    try {
      const data = await fetchData<{ problems: any[]; lastUpdated?: string }>('interview-problems')
      return data.problems || []
    } catch (error) {
      console.warn('No interview problems file found, returning empty array')
      return []
    }
  },
  
  updateInterviewProblems: async (problems: any[]): Promise<void> => {
    const data = {
      problems: problems,
      lastUpdated: new Date().toISOString(),
      totalProblems: problems.length
    }
    return updateData('interview-problems', data)
  }
}

// Check if we're in development mode (for editing features)
export const isDevelopmentMode = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         process.env.NODE_ENV === 'development'
}
