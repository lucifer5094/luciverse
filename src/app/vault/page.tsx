'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Plus, Download, Eye, Tag, Calendar, Edit, Trash2, Upload, FileDown } from 'lucide-react'
import OwnerControls from '@/components/OwnerControls'
import { Document, documentTypes, getDocumentTypeInfo, formatFileSize, generateDocumentId, validateDocument, sanitizeTags, exportToJson, importFromJson } from '@/utils/vaultUtils'
import { dataAPI } from '@/utils/dataAPI'

export default function VaultPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showPrivate, setShowPrivate] = useState(false)
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'type'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingDoc, setEditingDoc] = useState<Document | null>(null)
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Documents loaded from JSON file
  const [documents, setDocuments] = useState<Document[]>([])

  // Load documents from JSON file on component mount
  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      setLoading(true)
      const docs = await dataAPI.getVaultDocuments()
      setDocuments(docs)
    } catch (error) {
      console.error('Failed to load documents:', error)
      // Fallback to empty array if loading fails
      setDocuments([])
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDocument = async (docData: Partial<Document>) => {
    try {
      if (editingDoc) {
        // Update existing document
        await dataAPI.updateVaultDocument(editingDoc.id, docData)
      } else {
        // Add new document
        const newDoc: Document = {
          id: generateDocumentId(),
          title: docData.title || '',
          type: docData.type || 'note',
          content: docData.content || '',
          tags: docData.tags || [],
          createdAt: new Date(),
          updatedAt: new Date(),
          isPrivate: docData.isPrivate || false,
          description: docData.description || '',
          author: 'Lucifer'
        }
        await dataAPI.addVaultDocument(newDoc)
      }
      
      // Reload documents to get fresh data
      await loadDocuments()
      setShowAddForm(false)
      setEditingDoc(null)
    } catch (error) {
      console.error('Failed to save document:', error)
      alert('Failed to save document')
    }
  }

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    documents.forEach(doc => doc.tags.forEach(tag => tags.add(tag)))
    return Array.from(tags).sort()
  }, [documents])

  // Filter and sort documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents.filter(doc => {
      // Search filter
      const searchMatch = searchTerm === '' || 
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      // Type filter
      const typeMatch = selectedType === 'all' || doc.type === selectedType

      // Tag filter
      const tagMatch = selectedTags.length === 0 || 
        selectedTags.every(tag => doc.tags.includes(tag))

      // Privacy filter
      const privacyMatch = showPrivate || !doc.isPrivate

      return searchMatch && typeMatch && tagMatch && privacyMatch
    })

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'type':
          comparison = a.type.localeCompare(b.type)
          break
        case 'date':
        default:
          comparison = a.updatedAt.getTime() - b.updatedAt.getTime()
          break
      }
      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [documents, searchTerm, selectedTags, selectedType, showPrivate, sortBy, sortOrder])

  const getTypeIcon = (type: string) => {
    return getDocumentTypeInfo(type).icon
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'note': return 'blue'
      case 'pdf': return 'red'
      case 'scratchpad': return 'green'
      case 'prompt-dump': return 'purple'
      case 'link': return 'orange'
      default: return 'gray'
    }
  }

  // Consistent date formatting to avoid hydration issues
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleExportVault = () => {
    exportToJson(documents)
  }

  const handleImportVault = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const importedDocs = await importFromJson(file)
      // Merge with existing documents, avoiding duplicates
      const existingIds = new Set(documents.map(doc => doc.id))
      const newDocs = importedDocs.filter(doc => !existingIds.has(doc.id))
      
      // Update via API
      const allDocs = [...documents, ...newDocs]
      await dataAPI.updateVaultDocuments(allDocs)
      setDocuments(allDocs)
      
      // Reset the file input
      event.target.value = ''
      
      alert(`Successfully imported ${newDocs.length} new documents`)
    } catch (error) {
      alert(`Failed to import vault: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleTagClick = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const handleDocumentAction = async (action: string, doc: Document) => {
    switch (action) {
      case 'view':
        // In a real app, this would open the document viewer
        console.log('Viewing document:', doc.title)
        break
      case 'edit':
        setEditingDoc(doc)
        setShowAddForm(true)
        break
      case 'delete':
        if (confirm('Are you sure you want to delete this document?')) {
          try {
            await dataAPI.deleteVaultDocument(doc.id)
            setDocuments(prev => prev.filter(d => d.id !== doc.id))
          } catch (error) {
            alert('Failed to delete document')
          }
        }
        break
      case 'download':
        if (doc.fileUrl) {
          // In a real app, this would trigger download
          console.log('Downloading:', doc.fileUrl)
        }
        break
    }
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background py-12 px-4">
      <OwnerControls onOpenEditor={() => setShowAddForm(true)} />
      
      {loading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading vault documents...</p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            🏛️ The{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">
              Vault
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Your personal knowledge repository. Store, organize, and access your ideas, notes, and resources.
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-dark-surface rounded-xl p-6 mb-8 shadow-lg"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents, tags, or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-background text-light-text dark:text-dark-text focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-4">
              {/* Type Filter */}                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-background text-light-text dark:text-dark-text"
                >
                  <option value="all">All Types</option>
                  {documentTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>

              {/* Sort Controls */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'type')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-background text-light-text dark:text-dark-text"
              >
                <option value="date">Sort by Date</option>
                <option value="title">Sort by Title</option>
                <option value="type">Sort by Type</option>
              </select>

              <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-background text-light-text dark:text-dark-text hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>

              {/* Privacy Toggle */}
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={showPrivate}
                  onChange={(e) => setShowPrivate(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-600 dark:text-gray-300">Show Private</span>
              </label>
            </div>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all"
              >
                <Plus /> Add Document
              </button>
              
              <button
                onClick={handleExportVault}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
              >
                <FileDown /> Export Vault
              </button>
              
              <label className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all cursor-pointer">
                <Upload /> Import Vault
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportVault}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Filter by Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => handleTagClick(tag)}
                    className={`px-3 py-1 rounded-full text-sm transition-all ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Document Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredDocuments.map((doc, index) => (
              <motion.div
                key={doc.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-dark-surface rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                {/* Document Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getTypeIcon(doc.type)}</span>
                    <div>
                      <h3 className="font-semibold text-lg text-light-text dark:text-dark-text line-clamp-1">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {doc.type.replace('-', ' ')}
                      </p>
                    </div>
                  </div>
                  {doc.isPrivate && (
                    <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-1 rounded-full">
                      Private
                    </span>
                  )}
                </div>

                {/* Description */}
                {doc.description && (
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {doc.description}
                  </p>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {doc.tags.map(tag => (
                    <span
                      key={tag}
                      className={`px-2 py-1 rounded-full text-xs bg-${getTypeColor(doc.type)}-100 dark:bg-${getTypeColor(doc.type)}-900/30 text-${getTypeColor(doc.type)}-600 dark:text-${getTypeColor(doc.type)}-400`}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Date and File Size */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar />
                    <span>Updated {formatDate(doc.updatedAt)}</span>
                  </div>
                  {doc.fileSize && (
                    <span className="text-gray-400">
                      {formatFileSize(doc.fileSize)}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDocumentAction('view', doc)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all text-sm"
                  >
                    <Eye /> View
                  </button>
                  <button
                    onClick={() => handleDocumentAction('edit', doc)}
                    className="flex items-center justify-center px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  >
                    <Edit />
                  </button>
                  {doc.fileUrl && (
                    <button
                      onClick={() => handleDocumentAction('download', doc)}
                      className="flex items-center justify-center px-3 py-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-all"
                    >
                      <Download />
                    </button>
                  )}
                  <button
                    onClick={() => handleDocumentAction('delete', doc)}
                    className="flex items-center justify-center px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-all"
                  >
                    <Trash2 />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredDocuments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No documents found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              {searchTerm || selectedTags.length > 0 || selectedType !== 'all'
                ? 'Try adjusting your filters or search terms'
                : 'Start building your knowledge vault by adding your first document'
              }
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700 transition-all"
            >
              Add Your First Document
            </button>
          </motion.div>
        )}

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 bg-white dark:bg-dark-surface rounded-xl p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold mb-4 text-light-text dark:text-dark-text">
            Vault Statistics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {documentTypes.map(type => {
              const count = documents.filter(doc => doc.type === type.value).length
              return (
                <div key={type.value} className="text-center">
                  <div className="text-2xl mb-1">{type.icon}</div>
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {count}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                    {type.label.replace(/^.+ /, '')}
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => {
              setShowAddForm(false)
              setEditingDoc(null)
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-dark-surface rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-6 text-light-text dark:text-dark-text">
                {editingDoc ? 'Edit Document' : 'Add New Document'}
              </h2>
              <DocumentForm
                document={editingDoc}
                onSave={handleSaveDocument}
                onCancel={() => {
                  setShowAddForm(false)
                  setEditingDoc(null)
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Document Form Component
interface DocumentFormProps {
  document: Document | null
  onSave: (doc: Partial<Document>) => void
  onCancel: () => void
}

function DocumentForm({ document, onSave, onCancel }: DocumentFormProps) {
  const [formData, setFormData] = useState({
    title: document?.title || '',
    type: document?.type || 'note',
    content: document?.content || '',
    description: document?.description || '',
    tags: document?.tags.join(', ') || '',
    isPrivate: document?.isPrivate || false
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const docData: Partial<Document> = {
      title: formData.title,
      type: formData.type as Document['type'],
      content: formData.content,
      description: formData.description,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      isPrivate: formData.isPrivate
    }
    
    onSave(docData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Document title..."
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-background text-light-text dark:text-dark-text"
        required
      />
      
      <select 
        value={formData.type}
        onChange={(e) => setFormData({ ...formData, type: e.target.value as Document['type'] })}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-background text-light-text dark:text-dark-text"
      >
        <option value="note">📝 Note</option>
        <option value="pdf">📄 PDF</option>
        <option value="scratchpad">🗒️ Scratchpad</option>
        <option value="prompt-dump">🤖 Prompt Dump</option>
        <option value="link">🔗 Link</option>
      </select>
      
      <textarea
        placeholder="Content or description..."
        value={formData.content}
        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
        rows={6}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-background text-light-text dark:text-dark-text"
      />
      
      <input
        type="text"
        placeholder="Description..."
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-background text-light-text dark:text-dark-text"
      />
      
      <input
        type="text"
        placeholder="Tags (comma separated)..."
        value={formData.tags}
        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-dark-background text-light-text dark:text-dark-text"
      />
      
      <label className="flex items-center gap-2">
        <input 
          type="checkbox" 
          checked={formData.isPrivate}
          onChange={(e) => setFormData({ ...formData, isPrivate: e.target.checked })}
          className="rounded" 
        />
        <span className="text-light-text dark:text-dark-text">Make private</span>
      </label>
      
      <div className="flex gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button 
          type="submit"
          className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg hover:from-purple-600 hover:to-pink-700"
        >
          {document ? 'Update' : 'Add'} Document
        </button>
      </div>
    </form>
  )
}
