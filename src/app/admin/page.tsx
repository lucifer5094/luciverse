'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { dataAPI, isDevelopmentMode } from '@/utils/dataAPI'
import { Document } from '@/utils/vaultUtils'
import LoginForm from '@/components/LoginForm'
import InlineEdit from '@/components/InlineEdit'

export default function AdminPage() {
  // Editable content state - loaded from JSON
  const [pageTitle, setPageTitle] = useState('Admin Dashboard')
  const [pageSubtitle, setPageSubtitle] = useState('Content Management • System Controls')
  const [pageDescription, setPageDescription] = useState('Administrative interface for managing site content, vault documents, and system settings.')
  
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [loginLoading, setLoginLoading] = useState(false)
  const [vaultDocuments, setVaultDocuments] = useState<Document[]>([])
  const [siteContent, setSiteContent] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'vault' | 'content' | 'highlights'>('vault')
  const [editingDoc, setEditingDoc] = useState<Document | null>(null)

  const checkAuthorization = useCallback(async () => {
    try {
      const authorized = isDevelopmentMode()
      setIsAuthorized(authorized)
      
      if (authorized) {
        // Check if already authenticated
        const response = await fetch('/api/admin-auth')
        const result = await response.json()
        setIsAuthenticated(result.authenticated)
        
        if (result.authenticated) {
          loadData()
        } else {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    } catch (error) {
      console.error('Authorization check failed:', error)
      setIsAuthenticated(false)
      setLoading(false)
    } finally {
      setAuthLoading(false)
    }
  }, [])

  // Check if user is authorized and authenticated
  useEffect(() => {
    checkAuthorization()
  }, [checkAuthorization])

  const handleLogin = async (password: string): Promise<boolean> => {
    try {
      setLoginLoading(true)
      const response = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password })
      })
      
      const result = await response.json()
      
      if (response.ok && result.success) {
        setIsAuthenticated(true)
        loadData()
        return true
      } else {
        return false
      }
    } catch (error) {
      console.error('Login failed:', error)
      return false
    } finally {
      setLoginLoading(false)
    }
  }

  const loadData = async () => {
    try {
      setLoading(true)
      const [vault, content] = await Promise.all([
        dataAPI.getVaultDocuments(),
        dataAPI.getSiteContent()
      ])
      setVaultDocuments(vault)
      setSiteContent(content)
      
      // Load page-specific content
      setPageTitle(content.adminTitle)
      setPageSubtitle(content.adminSubtitle)
      setPageDescription(content.adminDescription)
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSaveDocument = async (doc: Document) => {
    try {
      if (editingDoc) {
        await dataAPI.updateVaultDocument(doc.id, doc)
      } else {
        await dataAPI.addVaultDocument(doc)
      }
      await loadData()
      setEditingDoc(null)
    } catch (error) {
      console.error('Failed to save document:', error)
      alert('Failed to save document')
    }
  }

  const handleDeleteDocument = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        await dataAPI.deleteVaultDocument(id)
        await loadData()
      } catch (error) {
        console.error('Failed to delete document:', error)
        alert('Failed to delete document')
      }
    }
  }

  const handleSaveSiteContent = async (newContent: any) => {
    try {
      await dataAPI.updateSiteContent(newContent)
      setSiteContent(newContent)
      alert('Site content updated successfully!')
    } catch (error) {
      console.error('Failed to save site content:', error)
      alert('Failed to save site content')
    }
  }

  const handleSaveTitle = async (newTitle: string) => {
    try {
      const currentContent = await dataAPI.getSiteContent()
      await dataAPI.updateSiteContent({
        ...currentContent,
        adminTitle: newTitle
      })
      setPageTitle(newTitle)
    } catch (error) {
      console.error('Failed to save admin title:', error)
    }
  }

  const handleSaveSubtitle = async (newSubtitle: string) => {
    try {
      const currentContent = await dataAPI.getSiteContent()
      await dataAPI.updateSiteContent({
        ...currentContent,
        adminSubtitle: newSubtitle
      })
      setPageSubtitle(newSubtitle)
    } catch (error) {
      console.error('Failed to save admin subtitle:', error)
    }
  }

  const handleSaveDescription = async (newDescription: string) => {
    try {
      const currentContent = await dataAPI.getSiteContent()
      await dataAPI.updateSiteContent({
        ...currentContent,
        adminDescription: newDescription
      })
      setPageDescription(newDescription)
    } catch (error) {
      console.error('Failed to save admin description:', error)
    }
  }

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear session cookie
      await fetch('/api/admin-auth', {
        method: 'DELETE'
      })
      setIsAuthenticated(false)
      setVaultDocuments([])
      setSiteContent({})
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Admin interface is only available in development mode (localhost)
          </p>
        </div>
      </div>
    )
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} loading={loginLoading} />
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p>Loading admin interface...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              <InlineEdit
                type="text"
                value={pageTitle}
                onSave={handleSaveTitle}
                placeholder="Enter page title..."
                inline={true}
              >
                {pageTitle}
              </InlineEdit>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              <InlineEdit
                type="text"
                value={pageSubtitle}
                onSave={handleSaveSubtitle}
                placeholder="Enter page subtitle..."
                inline={true}
              >
                {pageSubtitle}
              </InlineEdit>
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500 max-w-lg">
              <InlineEdit
                type="textarea"
                value={pageDescription}
                onSave={handleSaveDescription}
                placeholder="Enter page description..."
                maxLength={200}
              >
                {pageDescription}
              </InlineEdit>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            🚪 Logout
          </button>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('vault')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'vault'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Vault Documents ({vaultDocuments.length})
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Site Content
              </button>
              <button
                onClick={() => setActiveTab('highlights')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'highlights'
                    ? 'border-accent text-accent'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Highlights & Stats
              </button>
            </nav>
          </div>
        </div>

        {/* Vault Documents Tab */}
        {activeTab === 'vault' && (
          <div>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Vault Documents
              </h2>
              <button
                onClick={() => setEditingDoc({
                  id: Date.now().toString(),
                  title: '',
                  type: 'note',
                  content: '',
                  tags: [],
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  isPrivate: false,
                  description: '',
                  author: 'Lucifer'
                } as Document)}
                className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
              >
                Add New Document
              </button>
            </div>

            <div className="grid gap-4">
              {vaultDocuments.map((doc) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {doc.type} • {doc.tags.join(', ')}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingDoc(doc)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDocument(doc.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {doc.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Site Content Tab */}
        {activeTab === 'content' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Site Content
            </h2>
            <SiteContentEditor 
              content={siteContent} 
              onSave={handleSaveSiteContent}
            />
          </div>
        )}

        {/* Highlights & Stats Tab */}
        {activeTab === 'highlights' && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
              Homepage Highlights & Statistics
            </h2>
            <HighlightsManager 
              content={siteContent} 
              onSave={handleSaveSiteContent}
            />
          </div>
        )}

        {/* Document Editor Modal */}
        {editingDoc && (
          <DocumentEditor
            document={editingDoc}
            onSave={handleSaveDocument}
            onCancel={() => setEditingDoc(null)}
          />
        )}
      </div>
    </div>
  )
}

// Document Editor Component
function DocumentEditor({ 
  document, 
  onSave, 
  onCancel 
}: { 
  document: Document
  onSave: (doc: Document) => void
  onCancel: () => void 
}) {
  const [doc, setDoc] = useState(document)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">
          {document.id === Date.now().toString() ? 'Add New Document' : 'Edit Document'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={doc.title}
              onChange={(e) => setDoc({ ...doc, title: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select
              value={doc.type}
              onChange={(e) => setDoc({ ...doc, type: e.target.value as any })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value="note">Note</option>
              <option value="prompt-dump">Prompt Dump</option>
              <option value="scratchpad">Scratchpad</option>
              <option value="link">Link</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={doc.description}
              onChange={(e) => setDoc({ ...doc, description: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={doc.tags.join(', ')}
              onChange={(e) => setDoc({ ...doc, tags: e.target.value.split(',').map(t => t.trim()) })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <textarea
              value={doc.content}
              onChange={(e) => setDoc({ ...doc, content: e.target.value })}
              rows={10}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={doc.isPrivate}
              onChange={(e) => setDoc({ ...doc, isPrivate: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm">Private document</label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave({ ...doc, updatedAt: new Date() })}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// Site Content Editor Component
function SiteContentEditor({ 
  content, 
  onSave 
}: { 
  content: any
  onSave: (content: any) => void 
}) {
  const [editedContent, setEditedContent] = useState(content)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Hero Title</label>
          <input
            type="text"
            value={editedContent.heroTitle || ''}
            onChange={(e) => setEditedContent({ ...editedContent, heroTitle: e.target.value })}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Hero Subtitle</label>
          <textarea
            value={editedContent.heroSubtitle || ''}
            onChange={(e) => setEditedContent({ ...editedContent, heroSubtitle: e.target.value })}
            rows={3}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">About Title</label>
          <input
            type="text"
            value={editedContent.aboutTitle || ''}
            onChange={(e) => setEditedContent({ ...editedContent, aboutTitle: e.target.value })}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">About Subtitle</label>
          <input
            type="text"
            value={editedContent.aboutSubtitle || ''}
            onChange={(e) => setEditedContent({ ...editedContent, aboutSubtitle: e.target.value })}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">About Content</label>
          <textarea
            value={editedContent.aboutContent || ''}
            onChange={(e) => setEditedContent({ ...editedContent, aboutContent: e.target.value })}
            rows={6}
            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        
        <button
          onClick={() => onSave(editedContent)}
          className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
        >
          Save Site Content
        </button>
      </div>
    </div>
  )
}

// Highlights Manager Component
function HighlightsManager({ 
  content, 
  onSave 
}: { 
  content: any
  onSave: (content: any) => void 
}) {
  const [editedContent, setEditedContent] = useState(content)
  const [editingHighlight, setEditingHighlight] = useState<any>(null)
  const [showAddForm, setShowAddForm] = useState(false)

  const highlights = editedContent.highlights || []
  const stats = editedContent.stats || { projects: 0, years: 0, technologies: 0, achievements: 0 }

  const handleAddHighlight = () => {
    const newHighlight = {
      id: Date.now(),
      title: '',
      description: '',
      icon: '🚀',
      image: '',
      date: new Date().toISOString().substring(0, 7), // YYYY-MM format
      category: 'Development',
      featured: true
    }
    setEditingHighlight(newHighlight)
    setShowAddForm(true)
  }

  const handleSaveHighlight = (highlight: any) => {
    let updatedHighlights
    if (highlights.find((h: any) => h.id === highlight.id)) {
      updatedHighlights = highlights.map((h: any) => h.id === highlight.id ? highlight : h)
    } else {
      updatedHighlights = [...highlights, highlight]
    }

    const updatedContent = {
      ...editedContent,
      highlights: updatedHighlights
    }
    setEditedContent(updatedContent)
    setEditingHighlight(null)
    setShowAddForm(false)
  }

  const handleDeleteHighlight = (id: number) => {
    const updatedHighlights = highlights.filter((h: any) => h.id !== id)
    const updatedContent = {
      ...editedContent,
      highlights: updatedHighlights
    }
    setEditedContent(updatedContent)
  }

  const handleUpdateStats = (field: string, value: number) => {
    const updatedStats = { ...stats, [field]: value }
    const updatedContent = {
      ...editedContent,
      stats: updatedStats
    }
    setEditedContent(updatedContent)
  }

  return (
    <div className="space-y-8">
      {/* Statistics Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Homepage Statistics
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(stats).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                {key}
              </label>
              <input
                type="number"
                value={value as number}
                onChange={(e) => handleUpdateStats(key, parseInt(e.target.value) || 0)}
                className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                min="0"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Highlights Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Work Highlights ({highlights.length})
          </h3>
          <button
            onClick={handleAddHighlight}
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors flex items-center gap-2"
          >
            <span>➕</span>
            Add Highlight
          </button>
        </div>

        <div className="space-y-4">
          {highlights.map((highlight: any) => (              <div key={highlight.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 flex-1">
                    {/* Image/Icon Preview */}
                    <div className="flex-shrink-0">
                      {highlight.image ? (
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700 border">
                          <img 
                            src={highlight.image} 
                            alt={highlight.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Fallback to icon if image fails to load
                              e.currentTarget.style.display = 'none';
                              const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                          <div className="w-full h-full bg-gray-100 dark:bg-gray-700 items-center justify-center text-xl hidden">
                            {highlight.icon}
                          </div>
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-xl border">
                          {highlight.icon}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{highlight.title}</h4>
                        <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                          {highlight.category}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{highlight.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>📅 {highlight.date}</span>
                        <span>{highlight.featured ? '⭐ Featured' : '📌 Regular'}</span>
                        {highlight.image && <span>🖼️ Has Image</span>}
                      </div>
                    </div>
                  </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingHighlight(highlight)
                      setShowAddForm(true)
                    }}
                    className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteHighlight(highlight.id)}
                    className="text-red-600 hover:text-red-800 text-sm px-2 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {highlights.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p>No highlights added yet.</p>
              <p className="text-sm">Click &quot;Add Highlight&quot; to showcase your achievements!</p>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
          <button
            onClick={() => onSave(editedContent)}
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Save All Changes
          </button>
        </div>
      </div>

      {/* Add/Edit Highlight Modal */}
      {showAddForm && editingHighlight && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
              {editingHighlight.title ? 'Edit Highlight' : 'Add New Highlight'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                  type="text"
                  value={editingHighlight.title}
                  onChange={(e) => setEditingHighlight({...editingHighlight, title: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Achievement or project title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editingHighlight.description}
                  onChange={(e) => setEditingHighlight({...editingHighlight, description: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  rows={3}
                  placeholder="Brief description of the achievement"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Icon</label>
                  <input
                    type="text"
                    value={editingHighlight.icon}
                    onChange={(e) => setEditingHighlight({...editingHighlight, icon: e.target.value})}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                    placeholder="🚀"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Date</label>
                  <input
                    type="month"
                    value={editingHighlight.date}
                    onChange={(e) => setEditingHighlight({...editingHighlight, date: e.target.value})}
                    className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
                <input
                  type="url"
                  value={editingHighlight.image || ''}
                  onChange={(e) => setEditingHighlight({...editingHighlight, image: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                  placeholder="https://example.com/image.jpg or leave empty to use icon"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Tip: If you add an image URL, it will be displayed instead of the icon
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={editingHighlight.category}
                  onChange={(e) => setEditingHighlight({...editingHighlight, category: e.target.value})}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
                >
                  <option value="Development">Development</option>
                  <option value="AI/ML">AI/ML</option>
                  <option value="Design">Design</option>
                  <option value="Achievement">Achievement</option>
                  <option value="Learning">Learning</option>
                  <option value="Project">Project</option>
                </select>
              </div>
              
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editingHighlight.featured}
                    onChange={(e) => setEditingHighlight({...editingHighlight, featured: e.target.checked})}
                    className="rounded"
                  />
                  <span className="text-sm">Featured highlight</span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-2 mt-6">
              <button
                onClick={() => handleSaveHighlight(editingHighlight)}
                className="flex-1 bg-accent text-white py-2 rounded hover:bg-accent/90 transition-colors"
                disabled={!editingHighlight.title.trim()}
              >
                Save
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false)
                  setEditingHighlight(null)
                }}
                className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
