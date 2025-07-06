'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { dataAPI, isDevelopmentMode, Achievement } from '@/utils/dataAPI'
import { Document } from '@/utils/vaultUtils'
import LoginForm from '@/components/LoginForm'
import InlineEdit from '@/components/InlineEdit'
import Notification from '@/components/Notification'

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
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [siteContent, setSiteContent] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'vault' | 'content' | 'highlights' | 'achievements' | 'analytics'>('overview')
  const [editingDoc, setEditingDoc] = useState<Document | null>(null)
  const [editingAchievement, setEditingAchievement] = useState<Achievement | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info', message: string } | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [bulkSelection, setBulkSelection] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)

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

  const showNotification = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const exportData = async () => {
    try {
      const data = {
        vault: vaultDocuments,
        achievements,
        siteContent,
        exportDate: new Date().toISOString()
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `luciverse-backup-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      showNotification('success', 'Data exported successfully!')
    } catch (error) {
      showNotification('error', 'Failed to export data')
    }
  }

  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = searchTerm === '' || 
      achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === '' || achievement.category === filterCategory
    
    return matchesSearch && matchesCategory
  })

  const filteredDocuments = vaultDocuments.filter(doc => {
    const matchesSearch = searchTerm === '' || 
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      doc.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = filterCategory === '' || doc.type === filterCategory
    
    return matchesSearch && matchesCategory
  })

  const handleBulkSelect = (id: string) => {
    setBulkSelection(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleBulkDelete = async () => {
    if (bulkSelection.length === 0) return
    
    if (!confirm(`Are you sure you want to delete ${bulkSelection.length} items?`)) return
    
    try {
      if (activeTab === 'achievements') {
        await Promise.all(bulkSelection.map(id => dataAPI.deleteAchievement(id)))
        setAchievements(prev => prev.filter(a => !bulkSelection.includes(a.id)))
      } else if (activeTab === 'vault') {
        await Promise.all(bulkSelection.map(id => dataAPI.deleteVaultDocument(id)))
        setVaultDocuments(prev => prev.filter(d => !bulkSelection.includes(d.id)))
      }
      setBulkSelection([])
      showNotification('success', `Successfully deleted ${bulkSelection.length} items`)
    } catch (error) {
      showNotification('error', 'Failed to delete items')
    }
  }

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
      const [vault, content, achievementsData] = await Promise.all([
        dataAPI.getVaultDocuments(),
        dataAPI.getSiteContent(),
        dataAPI.getAchievements()
      ])
      setVaultDocuments(vault)
      setSiteContent(content)
      setAchievements(achievementsData)
      
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
        showNotification('success', 'Document updated successfully!')
      } else {
        await dataAPI.addVaultDocument(doc)
        showNotification('success', 'Document created successfully!')
      }
      await loadData()
      setEditingDoc(null)
    } catch (error) {
      console.error('Failed to save document:', error)
      showNotification('error', 'Failed to save document')
    }
  }

  const handleDeleteDocument = async (id: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      try {
        await dataAPI.deleteVaultDocument(id)
        await loadData()
        showNotification('success', 'Document deleted successfully!')
      } catch (error) {
        console.error('Failed to delete document:', error)
        showNotification('error', 'Failed to delete document')
      }
    }
  }

  const handleSaveSiteContent = async (newContent: any) => {
    try {
      await dataAPI.updateSiteContent(newContent)
      setSiteContent(newContent)
      showNotification('success', 'Site content updated successfully!')
    } catch (error) {
      console.error('Failed to save site content:', error)
      showNotification('error', 'Failed to save site content')
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
      setAchievements([])
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // Achievement management functions
  const handleSaveAchievement = async (achievement: Achievement) => {
    try {
      if (editingAchievement && editingAchievement.id) {
        // Update existing achievement
        await dataAPI.updateAchievement(editingAchievement.id, achievement)
        setAchievements(prev => prev.map(a => a.id === editingAchievement.id ? achievement : a))
        showNotification('success', 'Achievement updated successfully!')
      } else {
        // Add new achievement
        const newAchievement = {
          ...achievement,
          id: Date.now().toString()
        }
        await dataAPI.addAchievement(newAchievement)
        setAchievements(prev => [...prev, newAchievement])
        showNotification('success', 'Achievement created successfully!')
      }
      setEditingAchievement(null)
    } catch (error) {
      console.error('Failed to save achievement:', error)
      showNotification('error', 'Failed to save achievement')
    }
  }

  const handleDeleteAchievement = async (id: string) => {
    if (confirm('Are you sure you want to delete this achievement?')) {
      try {
        await dataAPI.deleteAchievement(id)
        setAchievements(prev => prev.filter(a => a.id !== id))
        showNotification('success', 'Achievement deleted successfully!')
      } catch (error) {
        console.error('Failed to delete achievement:', error)
        showNotification('error', 'Failed to delete achievement')
      }
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          isVisible={true}
          onClose={() => setNotification(null)}
        />
      )}
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
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
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-3">
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
                <p className="text-gray-500 dark:text-gray-500 max-w-2xl">
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
              
              <div className="flex items-center gap-3">
                <button
                  onClick={exportData}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  📦 Export Data
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <nav className="flex flex-wrap">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'vault', label: `Vault (${vaultDocuments.length})`, icon: '🔒' },
                { id: 'content', label: 'Site Content', icon: '📝' },
                { id: 'highlights', label: 'Highlights', icon: '⭐' },
                { id: 'achievements', label: `Achievements (${achievements.length})`, icon: '🏆' },
                { id: 'analytics', label: 'Analytics', icon: '📈' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any)
                    setBulkSelection([])
                    setSearchTerm('')
                    setFilterCategory('')
                  }}
                  className={`flex-1 min-w-0 py-4 px-6 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span>{tab.icon}</span>
                    <span className="truncate">{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Search and Filter Bar for applicable tabs */}
        {(activeTab === 'vault' || activeTab === 'achievements') && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex flex-1 gap-4">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    placeholder={`Search ${activeTab}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    🔍
                  </div>
                </div>
                
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
                >
                  <option value="">All Categories</option>
                  {activeTab === 'achievements' ? (
                    <>
                      <option value="certification">Certifications</option>
                      <option value="award">Awards</option>
                      <option value="achievement">Achievements</option>
                      <option value="competition">Competitions</option>
                      <option value="leadership">Leadership</option>
                      <option value="project">Projects</option>
                    </>
                  ) : (
                    <>
                      <option value="note">Notes</option>
                      <option value="prompt-dump">Prompt Dumps</option>
                      <option value="scratchpad">Scratchpads</option>
                      <option value="link">Links</option>
                      <option value="pdf">PDFs</option>
                    </>
                  )}
                </select>
              </div>

              {bulkSelection.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {bulkSelection.length} selected
                  </span>
                  <button
                    onClick={handleBulkDelete}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Delete Selected
                  </button>
                  <button
                    onClick={() => setBulkSelection([])}
                    className="bg-gray-500 text-white px-3 py-1 rounded-lg hover:bg-gray-600 transition-colors text-sm"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <OverviewDashboard 
            achievements={achievements}
            vaultDocuments={vaultDocuments}
            siteContent={siteContent}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard 
            achievements={achievements}
            vaultDocuments={vaultDocuments}
            siteContent={siteContent}
          />
        )}
        {activeTab === 'vault' && (
          <div>
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Vault Documents
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredDocuments.length} of {vaultDocuments.length})
                </span>
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
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                ➕ Add New Document
              </button>
            </div>

            <div className="grid gap-4">
              <AnimatePresence>
                {filteredDocuments.map((doc) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={bulkSelection.includes(doc.id)}
                        onChange={() => handleBulkSelect(doc.id)}
                        className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {doc.title}
                            </h3>
                            <div className="flex flex-wrap gap-2 mb-3">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                                {doc.type}
                              </span>
                              {doc.isPrivate && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                  🔒 Private
                                </span>
                              )}
                              {doc.tags.map((tag, index) => (
                                <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                                  {tag}
                                </span>
                              ))}
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                              {doc.description || 'No description'}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Created: {new Date(doc.createdAt).toLocaleDateString()} • 
                              Updated: {new Date(doc.updatedAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => setEditingDoc(doc)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredDocuments.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-lg mb-2">
                    {searchTerm || filterCategory ? 'No documents match your search' : 'No documents yet'}
                  </p>
                  <p className="text-sm">
                    {searchTerm || filterCategory ? 'Try adjusting your search criteria' : 'Add your first document to get started!'}
                  </p>
                </div>
              )}
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

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div>
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Achievements Management
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({filteredAchievements.length} of {achievements.length})
                </span>
              </h2>
              <button
                onClick={() => setEditingAchievement({
                  id: '',
                  title: '',
                  organization: '',
                  date: new Date().toISOString().split('T')[0],
                  category: 'achievement',
                  description: '',
                  skills: [],
                  importance: 2,
                  isVerified: false
                } as Achievement)}
                className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
              >
                ➕ Add Achievement
              </button>
            </div>

            <div className="grid gap-4">
              <AnimatePresence>
                {filteredAchievements.map((achievement) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-200"
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={bulkSelection.includes(achievement.id)}
                        onChange={() => handleBulkSelect(achievement.id)}
                        className="mt-1 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {achievement.title}
                              </h3>
                              {achievement.isVerified && (
                                <span className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                  ✓ Verified
                                </span>
                              )}
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                achievement.importance === 1 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                                achievement.importance === 2 ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                              }`}>
                                {achievement.importance === 1 ? '🔥 High' : achievement.importance === 2 ? '⚡ Medium' : '📌 Low'} Priority
                              </span>
                              <span className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 text-xs px-2 py-1 rounded-full">
                                {achievement.category}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                              🏢 {achievement.organization} • 📅 {new Date(achievement.date).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 leading-relaxed">
                              {achievement.description}
                            </p>
                            {achievement.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-3">
                                {achievement.skills.map((skill, index) => (
                                  <span key={index} className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs px-2 py-1 rounded">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            )}
                            {(achievement.certificateUrl || achievement.verificationUrl) && (
                              <div className="flex gap-2 text-xs">
                                {achievement.certificateUrl && (
                                  <a href={achievement.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                                    📜 Certificate
                                  </a>
                                )}
                                {achievement.verificationUrl && (
                                  <a href={achievement.verificationUrl} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300">
                                    🔗 Verify
                                  </a>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => setEditingAchievement(achievement)}
                              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 text-sm px-3 py-1 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAchievement(achievement.id)}
                              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 text-sm px-3 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {filteredAchievements.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <div className="text-6xl mb-4">🏆</div>
                  <p className="text-lg mb-2">
                    {searchTerm || filterCategory ? 'No achievements match your search' : 'No achievements yet'}
                  </p>
                  <p className="text-sm">
                    {searchTerm || filterCategory ? 'Try adjusting your search criteria' : 'Add your first achievement to get started!'}
                  </p>
                </div>
              )}
            </div>
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

        {/* Achievement Editor Modal */}
        {editingAchievement && (
          <AchievementEditor
            achievement={editingAchievement}
            onSave={handleSaveAchievement}
            onCancel={() => setEditingAchievement(null)}
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
                          <Image 
                            src={highlight.image} 
                            alt={highlight.title}
                            width={48}
                            height={48}
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

// Achievement Editor Component
function AchievementEditor({ 
  achievement, 
  onSave, 
  onCancel 
}: { 
  achievement: Achievement
  onSave: (achievement: Achievement) => void
  onCancel: () => void 
}) {
  const [achieve, setAchieve] = useState(achievement)

  const handleSkillsChange = (skillsString: string) => {
    const skills = skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0)
    setAchieve({ ...achieve, skills })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {!achievement.id || achievement.id === '' ? 'Add New Achievement' : 'Edit Achievement'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              value={achieve.title}
              onChange={(e) => setAchieve({ ...achieve, title: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Achievement title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Organization</label>
            <input
              type="text"
              value={achieve.organization}
              onChange={(e) => setAchieve({ ...achieve, organization: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Issuing organization"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              value={achieve.description}
              onChange={(e) => setAchieve({ ...achieve, description: e.target.value })}
              rows={3}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Achievement description"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Date</label>
              <input
                type="date"
                value={achieve.date}
                onChange={(e) => setAchieve({ ...achieve, date: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Issue Date (Optional)</label>
              <input
                type="date"
                value={achieve.issueDate || ''}
                onChange={(e) => setAchieve({ ...achieve, issueDate: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Category</label>
              <select
                value={achieve.category}
                onChange={(e) => setAchieve({ ...achieve, category: e.target.value as Achievement['category'] })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="certification">Certification</option>
                <option value="award">Award</option>
                <option value="achievement">Achievement</option>
                <option value="competition">Competition</option>
                <option value="leadership">Leadership</option>
                <option value="project">Project</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Importance</label>
              <select
                value={achieve.importance}
                onChange={(e) => setAchieve({ ...achieve, importance: Number(e.target.value) as 1 | 2 | 3 })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value={1}>High</option>
                <option value={2}>Medium</option>
                <option value={3}>Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Skills (comma-separated)</label>
            <input
              type="text"
              value={achieve.skills.join(', ')}
              onChange={(e) => handleSkillsChange(e.target.value)}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="JavaScript, React, Node.js"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Location (Optional)</label>
              <input
                type="text"
                value={achieve.location || ''}
                onChange={(e) => setAchieve({ ...achieve, location: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="City, Country"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Duration (Optional)</label>
              <input
                type="text"
                value={achieve.duration || ''}
                onChange={(e) => setAchieve({ ...achieve, duration: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="6 months"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Grade (Optional)</label>
              <input
                type="text"
                value={achieve.grade || ''}
                onChange={(e) => setAchieve({ ...achieve, grade: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="A+, 95%"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Expiry Date (Optional)</label>
              <input
                type="date"
                value={achieve.expiryDate || ''}
                onChange={(e) => setAchieve({ ...achieve, expiryDate: e.target.value })}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Image URL (Optional)</label>
            <input
              type="url"
              value={achieve.imageUrl || ''}
              onChange={(e) => setAchieve({ ...achieve, imageUrl: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Certificate URL (Optional)</label>
            <input
              type="url"
              value={achieve.certificateUrl || ''}
              onChange={(e) => setAchieve({ ...achieve, certificateUrl: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="https://example.com/certificate.pdf"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Verification URL (Optional)</label>
            <input
              type="url"
              value={achieve.verificationUrl || ''}
              onChange={(e) => setAchieve({ ...achieve, verificationUrl: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="https://verify.example.com/certificate"
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={achieve.isVerified}
              onChange={(e) => setAchieve({ ...achieve, isVerified: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">Verified achievement</label>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(achieve)}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
            disabled={!achieve.title.trim() || !achieve.organization.trim()}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// Overview Dashboard Component
function OverviewDashboard({ 
  achievements, 
  vaultDocuments, 
  siteContent 
}: { 
  achievements: Achievement[]
  vaultDocuments: Document[]
  siteContent: any
}) {
  const stats = {
    totalAchievements: achievements.length,
    verifiedAchievements: achievements.filter(a => a.isVerified).length,
    highPriorityAchievements: achievements.filter(a => a.importance === 1).length,
    totalDocuments: vaultDocuments.length,
    privateDocuments: vaultDocuments.filter(d => d.isPrivate).length,
    totalHighlights: siteContent.highlights?.length || 0
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Achievements</p>
              <p className="text-3xl font-bold">{stats.totalAchievements}</p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
          <div className="mt-4 text-purple-100 text-sm">
            {stats.verifiedAchievements} verified • {stats.highPriorityAchievements} high priority
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Vault Documents</p>
              <p className="text-3xl font-bold">{stats.totalDocuments}</p>
            </div>
            <div className="text-4xl">📝</div>
          </div>
          <div className="mt-4 text-blue-100 text-sm">
            {stats.privateDocuments} private documents
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Highlights</p>
              <p className="text-3xl font-bold">{stats.totalHighlights}</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
          <div className="mt-4 text-green-100 text-sm">
            Featured content pieces
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Site Stats</p>
              <p className="text-3xl font-bold">{siteContent.stats?.projects || 0}</p>
            </div>
            <div className="text-4xl">📊</div>
          </div>
          <div className="mt-4 text-orange-100 text-sm">
            Projects completed
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// Analytics Dashboard Component  
function AnalyticsDashboard({ 
  achievements, 
  vaultDocuments, 
  siteContent 
}: { 
  achievements: Achievement[]
  vaultDocuments: Document[]
  siteContent: any
}) {
  const skillsCount = achievements.reduce((acc, achievement) => {
    achievement.skills.forEach(skill => {
      acc[skill] = (acc[skill] || 0) + 1
    })
    return acc
  }, {} as Record<string, number>)

  const topSkills = Object.entries(skillsCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white shadow-lg"
      >
        <h2 className="text-2xl font-bold mb-2">Analytics Dashboard</h2>
        <p className="text-purple-100">
          Insights into your achievements, content, and growth patterns
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Top Skills
        </h3>
        <div className="space-y-3">
          {topSkills.map(([skill, count], index) => (
            <div key={skill} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {skill}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-16 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${topSkills.length > 0 ? (count / topSkills[0][1]) * 100 : 0}%` }}
                  ></div>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white w-6">
                  {count}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
