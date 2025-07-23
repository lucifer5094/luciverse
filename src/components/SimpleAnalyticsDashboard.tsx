'use client'

import { useState, useEffect } from 'react'
import { analyticsAPI } from '@/utils/analyticsAPI'
import { AnalyticsStats } from '@/types/analytics'

export default function SimpleAnalyticsDashboard() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [stats, setStats] = useState<AnalyticsStats>({
    totalEdits: 0,
    totalInteractions: 0,
    todayInteractions: 0,
    uniquePages: 0,
    clickActions: 0,
    topPages: [],
    editsByPage: [],
    hourlyActivity: []
  })
  const [recentInteractions, setRecentInteractions] = useState<any[]>([])

  const fetchRealTimeData = async (showLoading = false) => {
    if (showLoading) setRefreshing(true)
    
    try {
      const [analyticsStats, userInteractions] = await Promise.all([
        analyticsAPI.getAnalyticsStats(),
        analyticsAPI.getUserInteractions(undefined, 100)
      ])

      // Calculate today's interactions
      const today = new Date().toDateString()
      const todayInteractions = userInteractions.interactions?.filter((interaction: any) => 
        new Date(interaction.timestamp).toDateString() === today
      ).length || 0

      // Count unique pages
      const uniquePages = new Set(userInteractions.interactions?.map((i: any) => i.page) || []).size

      // Count click actions
      const clickActions = userInteractions.interactions?.filter((i: any) => i.action === 'click').length || 0

      // Get recent interactions (last 15)
      const recent = userInteractions.interactions?.slice(-15).reverse() || []

      setStats({
        ...analyticsStats,
        totalInteractions: userInteractions.interactions?.length || 0,
        todayInteractions,
        uniquePages,
        clickActions
      })
      
      setRecentInteractions(recent)
      setLastUpdate(new Date())
    } catch (error) {
      console.error('Failed to fetch analytics data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchRealTimeData()
    
    // Only set up intervals in production to avoid dev server conflicts
    if (process.env.NODE_ENV === 'production') {
      // Set up real-time updates every 15 seconds
      const interval = setInterval(() => fetchRealTimeData(), 15000)
      
      // Listen for visibility changes to refresh when tab becomes active
      const handleVisibilityChange = () => {
        if (!document.hidden) {
          fetchRealTimeData()
        }
      }
      
      document.addEventListener('visibilitychange', handleVisibilityChange)
      
      return () => {
        clearInterval(interval)
        document.removeEventListener('visibilitychange', handleVisibilityChange)
      }
    }
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner h-8 w-8"></div>
        <span className="ml-2 text-gray-600 dark:text-gray-400">Loading real-time analytics...</span>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Real-Time Analytics Dashboard</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Live user interactions and activity tracking</p>
          </div>
          <button
            onClick={() => fetchRealTimeData(true)}
            disabled={refreshing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {refreshing ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Refreshing...
              </>
            ) : (
              <>🔄 Refresh</>
            )}
          </button>
        </div>
      </div>

      <div className="card-body">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="state-info rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800">
                ✏️
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Total Edits</p>
                <p className="text-2xl font-bold">{stats.totalEdits}</p>
              </div>
            </div>
          </div>

          <div className="state-success rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-800">
                ⚡
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium">Today&apos;s Activity</p>
                <p className="text-2xl font-bold">{stats.todayInteractions}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 text-purple-600 dark:text-purple-400 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-800">
                👆
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Clicks</p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.clickActions}</p>
              </div>
            </div>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-8 w-8 text-orange-600 dark:text-orange-400 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-800">
                👁️
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Unique Pages</p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.uniquePages}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Total Interactions Card */}
        <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="h-8 w-8 text-indigo-600 dark:text-indigo-400 flex items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-800">
              📊
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400">Total Interactions</p>
              <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">{stats.totalInteractions}</p>
              <p className="text-xs text-indigo-500 dark:text-indigo-400">All tracked user activities</p>
            </div>
          </div>
        </div>

        <div className="state-info rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <p className="text-sm">
                <strong>Live Analytics:</strong> Auto-refreshing every 15 seconds
              </p>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span className="h-6 w-6 text-green-500 mr-2">🟢</span>
            Recent User Activity
          </h3>
          
          {recentInteractions.length > 0 ? (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {recentInteractions.map((interaction, index) => (
                <div key={interaction.id || index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">
                      {interaction.action === 'page_view' ? '👁️' : 
                       interaction.action === 'click' ? '👆' : 
                       interaction.action === 'scroll' ? '📜' :
                       interaction.action === 'focus' ? '🎯' :
                       interaction.action === 'blur' ? '💤' : '⚡'}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {interaction.action.replace('_', ' ').toUpperCase()} on {interaction.page}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Element: {interaction.element}
                        {interaction.metadata?.text && (
                          <span className="ml-2 italic">&quot;{interaction.metadata.text.slice(0, 30)}...&quot;</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(interaction.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">
              No recent activity to display
            </p>
          )}
        </div>
      </div>
    </div>
  )
}