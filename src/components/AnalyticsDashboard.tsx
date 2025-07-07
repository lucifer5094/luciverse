'use client'

import { useState, useEffect } from 'react'
import { analyticsAPI } from '@/utils/analyticsAPI'
import { EditRecord, UserInteraction, AnalyticsStats } from '@/types/analytics'

// Using emoji icons instead of lucide-react to avoid webpack module loading issues
const Icons = {
  Calendar: () => <span className="text-lg">📅</span>,
  Clock: () => <span className="text-lg">🕐</span>,
  Edit: () => <span className="text-lg">✏️</span>,
  MousePointer: () => <span className="text-lg">👆</span>,
  Eye: () => <span className="text-lg">👁️</span>,
  Activity: () => <span className="text-lg">⚡</span>,
  TrendingUp: () => <span className="text-lg">📈</span>,
  Users: () => <span className="text-lg">👥</span>,
  BarChart3: () => <span className="text-lg">📊</span>
}

export default function AnalyticsDashboard() {
  const [editHistory, setEditHistory] = useState<EditRecord[]>([])
  const [interactions, setInteractions] = useState<UserInteraction[]>([])
  const [stats, setStats] = useState<AnalyticsStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'edits' | 'interactions'>('overview')

  // Error boundary for the entire component
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    // Add error boundary for async operations
    const loadData = async () => {
      try {
        await loadAnalytics()
      } catch (error) {
        console.error('Failed to load analytics on mount:', error)
        setError('Failed to initialize analytics dashboard')
        setLoading(false)
      }
    }
    
    loadData()
  }, [])

  // Catch any synchronous errors
  if (hasError) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="text-center p-8">
          <p className="text-red-500 dark:text-red-400 mb-4">Analytics Dashboard encountered an error</p>
          <button 
            onClick={() => {
              setHasError(false)
              setError(null)
              loadAnalytics()
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [editsData, interactionsData, statsData] = await Promise.all([
        analyticsAPI.getEditHistory(undefined, 50),
        analyticsAPI.getUserInteractions(undefined, 100),
        analyticsAPI.getAnalyticsStats()
      ])
      
      setEditHistory(editsData.editHistory || [])
      setInteractions(interactionsData.interactions || [])
      setStats(statsData)
    } catch (error) {
      console.error('Failed to load analytics:', error)
      setError('Failed to load analytics data')
      setHasError(true)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 dark:text-red-400 mb-4">{error}</p>
        <button 
          onClick={loadAnalytics}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-500 dark:text-gray-400">No analytics data available</p>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Track edits and user interactions</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 opacity-0 animate-[fadeInUp_0.6s_ease-out_forwards]">
          <div className="flex items-center">
            <div className="h-8 w-8 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Icons.Edit />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Edits</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalEdits}</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.1s_forwards]">
          <div className="flex items-center">
            <div className="h-8 w-8 text-green-600 dark:text-green-400 flex items-center justify-center">
              <Icons.Activity />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Today&apos;s Activity</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.todayInteractions}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.2s_forwards]">
          <div className="flex items-center">
            <div className="h-8 w-8 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Icons.MousePointer />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Clicks</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.clickActions}</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 opacity-0 animate-[fadeInUp_0.6s_ease-out_0.3s_forwards]">
          <div className="flex items-center">
            <div className="h-8 w-8 text-orange-600 dark:text-orange-400 flex items-center justify-center">
              <Icons.Eye />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Unique Pages</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.uniquePages}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          📊 Overview
        </button>
        <button
          onClick={() => setActiveTab('edits')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'edits'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          ✏️ Edit History ({editHistory.length})
        </button>
        <button
          onClick={() => setActiveTab('interactions')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'interactions'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          👆 User Interactions ({interactions.length})
        </button>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Pages */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📈 Top Pages by Activity
              </h3>
              <div className="space-y-3">
                {stats.topPages.slice(0, 5).map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {page.page}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{page.count} views</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Most Edited Pages */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ✏️ Most Edited Pages
              </h3>
              <div className="space-y-3">
                {stats.editsByPage.slice(0, 5).map((page, index) => (
                  <div key={page.page} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-full bg-green-500 text-white text-xs flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {page.page}
                      </span>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{page.count} edits</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'edits' && (
          <div>
            {editHistory.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No edit history found</p>
            ) : (
              editHistory.map((edit) => (
                <div key={edit.id} className="border dark:border-gray-700 rounded-lg p-4 mb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icons.Calendar />
                        <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(edit.timestamp)}</span>
                        <span className="text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 px-2 py-1 rounded">
                          {edit.page}
                        </span>
                      </div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                        {edit.section} → {edit.fieldName}
                      </h4>
                      <div className="text-sm space-y-1">
                        <div>
                          <span className="text-red-600 dark:text-red-400">- </span>
                          <span className="text-gray-600 dark:text-gray-400 line-through">{edit.oldValue}</span>
                        </div>
                        <div>
                          <span className="text-green-600 dark:text-green-400">+ </span>
                          <span className="text-gray-900 dark:text-white">{edit.newValue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'interactions' && (
          <div>
            {interactions.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-center py-8">No user interactions found</p>
            ) : (
              interactions.slice(0, 50).map((interaction) => (
                <div key={interaction.id} className="border dark:border-gray-700 rounded-lg p-3 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Icons.Clock />
                      <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(interaction.timestamp)}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        interaction.action === 'click' ? 'bg-purple-100 dark:bg-purple-900/20 text-purple-800 dark:text-purple-300' :
                        interaction.action === 'page_view' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300' :
                        'bg-gray-100 dark:bg-gray-900/20 text-gray-800 dark:text-gray-300'
                      }`}>
                        {interaction.action}
                      </span>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{interaction.page}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{interaction.element}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}
