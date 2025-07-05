'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { dataAPI, isDevelopmentMode } from '@/utils/dataAPI'
import { Document } from '@/utils/vaultUtils'
import LoginForm from '@/components/LoginForm'

export default function AdminPage() {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [loginLoading, setLoginLoading] = useState(false)
  const [vaultDocuments, setVaultDocuments] = useState<Document[]>([])
  const [siteContent, setSiteContent] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'vault' | 'content'>('vault')
  const [editingDoc, setEditingDoc] = useState<Document | null>(null)

  // Check if user is authorized and authenticated
  useEffect(() => {
    checkAuthorization()
  }, [])

  const checkAuthorization = async () => {
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
  }

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

  const handleLogout = async () => {
    try {
      // Clear session cookie by calling logout endpoint (you can create this)
      document.cookie = 'admin-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
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
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your website content locally
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
