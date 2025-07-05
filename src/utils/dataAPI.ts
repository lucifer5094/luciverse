import { Document } from './vaultUtils'

// API base URL - automatically detects environment
const getApiUrl = () => {
  if (typeof window === 'undefined') return 'http://localhost:3000' // Server side
  return window.location.origin // Client side
}

// Fetch data from JSON files via API
export async function fetchData<T>(type: string): Promise<T> {
  try {
    const response = await fetch(`${getApiUrl()}/api/data?type=${type}`)
    if (!response.ok) {
      throw new Error(`Failed to fetch ${type}: ${response.statusText}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching ${type}:`, error)
    throw error
  }
}

// Update data (only works in development/localhost)
export async function updateData<T>(type: string, data: T): Promise<void> {
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
      throw new Error(error.message || 'Failed to update data')
    }
    
    console.log(`${type} updated successfully`)
  } catch (error) {
    console.error(`Error updating ${type}:`, error)
    throw error
  }
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
  }
}

// Check if we're in development mode (for editing features)
export const isDevelopmentMode = (): boolean => {
  if (typeof window === 'undefined') return false
  return window.location.hostname === 'localhost' || 
         window.location.hostname === '127.0.0.1' ||
         process.env.NODE_ENV === 'development'
}
