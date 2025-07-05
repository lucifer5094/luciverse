export interface Document {
  id: string
  title: string
  type: 'note' | 'pdf' | 'scratchpad' | 'prompt-dump' | 'link'
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isPrivate: boolean
  fileUrl?: string
  description?: string
  fileSize?: number
  author?: string
}

export interface VaultState {
  documents: Document[]
  searchTerm: string
  selectedTags: string[]
  selectedType: string
  showPrivate: boolean
  sortBy: 'date' | 'title' | 'type'
  sortOrder: 'asc' | 'desc'
}

export const documentTypes = [
  { value: 'note', label: '📝 Notes', icon: '📝' },
  { value: 'pdf', label: '📄 PDFs', icon: '📄' },
  { value: 'scratchpad', label: '🗒️ Scratchpads', icon: '🗒️' },
  { value: 'prompt-dump', label: '🤖 Prompt Dumps', icon: '🤖' },
  { value: 'link', label: '🔗 Links', icon: '🔗' }
] as const

export const getDocumentTypeInfo = (type: string) => {
  return documentTypes.find(t => t.value === type) || documentTypes[0]
}

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const generateDocumentId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export const validateDocument = (doc: Partial<Document>): string[] => {
  const errors: string[] = []
  
  if (!doc.title?.trim()) {
    errors.push('Title is required')
  }
  
  if (!doc.type) {
    errors.push('Document type is required')
  }
  
  if (doc.type === 'link' && doc.content && !isValidUrl(doc.content)) {
    errors.push('Please enter a valid URL')
  }
  
  return errors
}

export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

export const sanitizeTags = (tagsInput: string): string[] => {
  return tagsInput
    .split(',')
    .map(tag => tag.trim().toLowerCase())
    .filter(tag => tag.length > 0)
    .filter((tag, index, arr) => arr.indexOf(tag) === index) // Remove duplicates
}

export const exportToJson = (documents: Document[]): void => {
  const dataStr = JSON.stringify(documents, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
  
  const exportFileDefaultName = `vault-export-${new Date().toISOString().split('T')[0]}.json`
  
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
}

export const importFromJson = (file: File): Promise<Document[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const documents = JSON.parse(e.target?.result as string)
        // Validate the imported data
        if (Array.isArray(documents)) {
          const validDocs = documents.filter(doc => 
            doc.id && doc.title && doc.type && doc.createdAt
          ).map(doc => ({
            ...doc,
            createdAt: new Date(doc.createdAt),
            updatedAt: new Date(doc.updatedAt || doc.createdAt)
          }))
          resolve(validDocs)
        } else {
          reject(new Error('Invalid file format'))
        }
      } catch (error) {
        reject(new Error('Failed to parse JSON file'))
      }
    }
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}
