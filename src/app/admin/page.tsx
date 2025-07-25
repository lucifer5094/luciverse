'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { dataAPI, isDevelopmentMode, Achievement } from '@/utils/dataAPI'
import { Document } from '@/utils/vaultUtils'
import { interviewProblemsAPI, InterviewProblem, DIFFICULTY_OPTIONS, TOPIC_OPTIONS, COMPANY_OPTIONS } from '@/utils/interviewProblemsAPI'
import LoginForm from '@/components/LoginForm'
import InlineEdit from '@/components/InlineEdit'
import Notification from '@/components/Notification'
import ErrorBoundary from '@/components/ErrorBoundary'
import SimpleAnalyticsDashboard from '@/components/SimpleAnalyticsDashboard'
import AnalyticsTestButton from '@/components/AnalyticsTestButton'

// Remove dynamic imports temporarily to fix webpack module loading issues
 
// Overview Dashboard Component
interface OverviewDashboardProps {
  achievements: Achievement[]
  vaultDocuments: Document[]
  interviewProblems: InterviewProblem[]
  siteContent: any
}

function OverviewDashboard({ achievements, vaultDocuments, interviewProblems, siteContent }: OverviewDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Vault Documents</h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{vaultDocuments.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total documents</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Achievements</h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{achievements.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total achievements</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Interview Problems</h3>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{interviewProblems.length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total problems</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Site Content</h3>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{Object.keys(siteContent).length}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Content sections</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
        <p className="text-gray-500 dark:text-gray-400">System overview and recent changes will appear here.</p>
      </div>
    </div>
  )
}

// Site Content Editor Component
interface SiteContentEditorProps {
  content: any
  onSave: (newContent: any) => Promise<void>
}

function SiteContentEditor({ content, onSave }: SiteContentEditorProps) {
  const [editingContent, setEditingContent] = useState(content)

  const handleSave = async () => {
    await onSave(editingContent)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Site Configuration</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site Title
            </label>
            <input
              type="text"
              value={editingContent?.title || ''}
              onChange={(e) => setEditingContent({ ...editingContent, title: e.target.value })}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site Description
            </label>
            <textarea
              value={editingContent?.description || ''}
              onChange={(e) => setEditingContent({ ...editingContent, description: e.target.value })}
              rows={3}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

// Highlights Manager Component
interface HighlightsManagerProps {
  content: any
  onSave: (newContent: any) => Promise<void>
}

function HighlightsManager({ content, onSave }: HighlightsManagerProps) {
  const [highlights, setHighlights] = useState(content?.highlights || [])

  const handleSave = async () => {
    await onSave({ ...content, highlights })
  }

  const addHighlight = () => {
    setHighlights([...highlights, { title: '', description: '', value: '', icon: '' }])
  }

  const removeHighlight = (index: number) => {
    setHighlights(highlights.filter((_: any, i: number) => i !== index))
  }

  const updateHighlight = (index: number, field: string, value: string) => {
    const updated = highlights.map((highlight: any, i: number) => 
      i === index ? { ...highlight, [field]: value } : highlight
    )
    setHighlights(updated)
  }

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Homepage Highlights</h3>
          <button
            onClick={addHighlight}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
          >
            Add Highlight
          </button>
        </div>
        
        <div className="space-y-4">
          {highlights.map((highlight: any, index: number) => (
            <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={highlight.title}
                  onChange={(e) => updateHighlight(index, 'title', e.target.value)}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={highlight.value}
                  onChange={(e) => updateHighlight(index, 'value', e.target.value)}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={highlight.description}
                  onChange={(e) => updateHighlight(index, 'description', e.target.value)}
                  className="p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Icon"
                    value={highlight.icon}
                    onChange={(e) => updateHighlight(index, 'icon', e.target.value)}
                    className="flex-1 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => removeHighlight(index)}
                    className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button
          onClick={handleSave}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Save Highlights
        </button>
      </div>
    </div>
  )
}

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
  const [interviewProblems, setInterviewProblems] = useState<InterviewProblem[]>([])
  const [siteContent, setSiteContent] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'vault' | 'content' | 'highlights' | 'achievements' | 'interview-problems' | 'analytics'>('overview')
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
        interviewProblems,
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

  const syncInterviewProblemsToFile = async () => {
    try {
      const problems = interviewProblemsAPI.getProblems()
      await dataAPI.updateInterviewProblems(problems)
      showNotification('success', 'Interview problems synced to file system!')
    } catch (error) {
      showNotification('error', 'Failed to sync interview problems')
    }
  }

  const loadInterviewProblemsFromFile = async () => {
    try {
      const fileProblems = await dataAPI.getInterviewProblems()
      if (fileProblems.length > 0) {
        // Save to localStorage
        localStorage.setItem('interview-problems', JSON.stringify(fileProblems))
        // Reload data
        setInterviewProblems(interviewProblemsAPI.getProblems())
        showNotification('success', `Loaded ${fileProblems.length} interview problems from file!`)
      } else {
        showNotification('info', 'No interview problems found in file')
      }
    } catch (error) {
      showNotification('error', 'Failed to load interview problems from file')
    }
  }

  const testSyncFunction = async () => {
    try {
      showNotification('info', 'Testing sync functionality...')
      
      // Create a test problem
      const testProblem = {
        title: 'Test Sync Problem',
        description: 'This is a test problem to verify sync functionality',
        difficulty: 'Easy' as const,
        topic: 'Testing',
        company: ['Test Company'],
        solution: 'This is a test solution',
        notes: 'Test sync notes',
        tags: ['test', 'sync']
      }
      
      // Add via API
      const addedProblem = interviewProblemsAPI.addProblem(testProblem)
      setInterviewProblems(interviewProblemsAPI.getProblems())
      
      showNotification('success', 'Test problem added! Check console for sync logs.')
    } catch (error) {
      console.error('Test sync failed:', error)
      showNotification('error', 'Test sync failed')
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
      } else if (activeTab === 'interview-problems') {
        bulkSelection.forEach(id => interviewProblemsAPI.deleteProblem(id))
        setInterviewProblems(prev => prev.filter(p => !bulkSelection.includes(p.id)))
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
      setInterviewProblems(interviewProblemsAPI.getProblems())
      
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
                  onClick={testSyncFunction}
                  className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
                  title="Test sync functionality"
                >
                  🧪 Test Sync
                </button>
                <button
                  onClick={syncInterviewProblemsToFile}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
                  title="Sync interview problems to file system"
                >
                  💾 Sync to File
                </button>
                <button
                  onClick={loadInterviewProblemsFromFile}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-all duration-200 flex items-center gap-2 shadow-lg"
                  title="Load interview problems from file system"
                >
                  📂 Load from File
                </button>
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
                { id: 'interview-problems', label: `Interview Problems (${interviewProblems.length})`, icon: '🧠' },
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
        {(activeTab === 'vault' || activeTab === 'achievements' || activeTab === 'interview-problems') && (
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
            interviewProblems={interviewProblems}
            siteContent={siteContent}
          />
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h2>
              <AnalyticsTestButton />
            </div>
            <ErrorBoundary fallback={<div className="p-4 text-center text-gray-500">Analytics temporarily unavailable</div>}>
              <SimpleAnalyticsDashboard />
            </ErrorBoundary>
          </div>
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

        {/* Interview Problems Tab */}
        {activeTab === 'interview-problems' && (
          <InterviewProblemsManager 
            problems={interviewProblems}
            onUpdateProblems={() => setInterviewProblems(interviewProblemsAPI.getProblems())}
          />
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
  const [ach, setAch] = useState(achievement)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4">
          {achievement.id ? 'Edit Achievement' : 'Add New Achievement'}
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={ach.title}
              onChange={(e) => setAch({ ...ach, title: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Organization</label>
            <input
              type="text"
              value={ach.organization}
              onChange={(e) => setAch({ ...ach, organization: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={ach.date}
              onChange={(e) => setAch({ ...ach, date: e.target.value })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select
              value={ach.category}
              onChange={(e) => setAch({ ...ach, category: e.target.value as any })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
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
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              value={ach.description}
              onChange={(e) => setAch({ ...ach, description: e.target.value })}
              rows={4}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Skills (comma separated)</label>
            <input
              type="text"
              value={ach.skills.join(', ')}
              onChange={(e) => setAch({ ...ach, skills: e.target.value.split(',').map(s => s.trim()) })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Importance (1=High, 2=Medium, 3=Low)</label>
            <select
              value={ach.importance}
              onChange={(e) => setAch({ ...ach, importance: parseInt(e.target.value) as any })}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
            >
              <option value={1}>High Priority</option>
              <option value={2}>Medium Priority</option>
              <option value={3}>Low Priority</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={ach.isVerified}
              onChange={(e) => setAch({ ...ach, isVerified: e.target.checked })}
              className="mr-2"
            />
            <label className="text-sm">Verified achievement</label>
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
            onClick={() => onSave(ach)}
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

// Interview Problems Manager Component
interface InterviewProblemsManagerProps {
  problems: InterviewProblem[]
  onUpdateProblems: () => void
}

function InterviewProblemsManager({ problems, onUpdateProblems }: InterviewProblemsManagerProps) {
  const [editingProblem, setEditingProblem] = useState<InterviewProblem | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.topic.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddProblem = async (problemData: Omit<InterviewProblem, 'id' | 'timeSpent' | 'attempts' | 'solved' | 'lastAttempted' | 'createdAt'>) => {
    try {
      interviewProblemsAPI.addProblem(problemData)
      onUpdateProblems()
      setShowAddForm(false)
      
      // Auto-sync to file system
      setTimeout(async () => {
        try {
          const problems = interviewProblemsAPI.getProblems()
          await dataAPI.updateInterviewProblems(problems)
          console.log('Interview problems auto-synced to file system')
        } catch (error) {
          console.warn('Auto-sync failed:', error)
        }
      }, 500)
    } catch (error) {
      console.error('Failed to add problem:', error)
    }
  }

  const handleUpdateProblem = async (problemId: string, updates: Partial<InterviewProblem>) => {
    try {
      interviewProblemsAPI.updateProblem(problemId, updates)
      onUpdateProblems()
      setEditingProblem(null)
      
      // Auto-sync to file system
      setTimeout(async () => {
        try {
          const problems = interviewProblemsAPI.getProblems()
          await dataAPI.updateInterviewProblems(problems)
          console.log('Interview problems auto-synced to file system')
        } catch (error) {
          console.warn('Auto-sync failed:', error)
        }
      }, 500)
    } catch (error) {
      console.error('Failed to update problem:', error)
    }
  }

  const handleDeleteProblem = async (problemId: string) => {
    if (confirm('Are you sure you want to delete this problem?')) {
      try {
        interviewProblemsAPI.deleteProblem(problemId)
        onUpdateProblems()
        
        // Auto-sync to file system
        setTimeout(async () => {
          try {
            const problems = interviewProblemsAPI.getProblems()
            await dataAPI.updateInterviewProblems(problems)
            console.log('Interview problems auto-synced to file system')
          } catch (error) {
            console.warn('Auto-sync failed:', error)
          }
        }, 500)
      } catch (error) {
        console.error('Failed to delete problem:', error)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Interview Problems Management</h3>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add New Problem
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search problems..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
      </div>

      <div className="grid gap-4">
        {filteredProblems.map((problem) => (
          <div key={problem.id} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 dark:text-white">{problem.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{problem.description}</p>
                <div className="flex gap-2 mt-2">
                  <span className={`px-2 py-1 text-xs rounded ${
                    problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {problem.difficulty}
                  </span>
                  <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">{problem.topic}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingProblem(problem)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteProblem(problem.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Problem Modal */}
      {(showAddForm || editingProblem) && (
        <InterviewProblemEditor
          problem={editingProblem}
          onSave={editingProblem ? 
            (updates) => handleUpdateProblem(editingProblem.id, updates) :
            handleAddProblem
          }
          onCancel={() => {
            setShowAddForm(false)
            setEditingProblem(null)
          }}
        />
      )}
    </div>
  )
}

// Interview Problem Editor Component
interface InterviewProblemEditorProps {
  problem?: InterviewProblem | null
  onSave: (problemData: any) => void
  onCancel: () => void
}

function InterviewProblemEditor({ problem, onSave, onCancel }: InterviewProblemEditorProps) {
  const [formData, setFormData] = useState({
    title: problem?.title || '',
    description: problem?.description || '',
    questionImage: problem?.questionImage || '',
    difficulty: problem?.difficulty || 'Medium',
    topic: problem?.topic || '',
    company: problem?.company?.join(', ') || '',
    solution: problem?.solution || '',
    solutionImage: problem?.solutionImage || '',
    notes: problem?.notes || '',
    tags: problem?.tags?.join(', ') || ''
  })

  const [questionImageFile, setQuestionImageFile] = useState<File | null>(null)
  const [solutionImageFile, setSolutionImageFile] = useState<File | null>(null)

  const handleImageUpload = async (file: File, type: 'question' | 'solution') => {
    try {
      const imageDataUrl = await interviewProblemsAPI.uploadImage(file)
      if (type === 'question') {
        setFormData(prev => ({ ...prev, questionImage: imageDataUrl }))
      } else {
        setFormData(prev => ({ ...prev, solutionImage: imageDataUrl }))
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const problemData = {
      ...formData,
      company: formData.company.split(',').map(c => c.trim()).filter(Boolean),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    }

    onSave(problemData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {problem ? 'Edit Problem' : 'Add New Problem'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Topic</label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="">Select Topic</option>
                {TOPIC_OPTIONS.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                {DIFFICULTY_OPTIONS.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Companies (comma separated)</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                placeholder="Google, Microsoft, Amazon"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Question Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setQuestionImageFile(file)
                  handleImageUpload(file, 'question')
                }
              }}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            {formData.questionImage && (
              <img src={formData.questionImage} alt="Question" className="mt-2 max-w-xs h-auto rounded" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Solution</label>
            <textarea
              value={formData.solution}
              onChange={(e) => setFormData(prev => ({ ...prev, solution: e.target.value }))}
              rows={6}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white font-mono text-sm"
              placeholder="Solution code or explanation..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Solution Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setSolutionImageFile(file)
                  handleImageUpload(file, 'solution')
                }
              }}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            {formData.solutionImage && (
              <img src={formData.solutionImage} alt="Solution" className="mt-2 max-w-xs h-auto rounded" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Additional notes, hints, or explanations..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="array, hashmap, recursion"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {problem ? 'Update' : 'Add'} Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ...existing code...