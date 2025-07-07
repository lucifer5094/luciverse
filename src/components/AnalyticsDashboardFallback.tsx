'use client'

import { useState, useEffect } from 'react'

export default function AnalyticsDashboardFallback() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400">Analytics system is being loaded...</p>
      </div>

      {/* Simple Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">📝</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Total Edits</p>
              <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">-</p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center text-white text-sm">⚡</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Today&apos;s Activity</p>
              <p className="text-2xl font-bold text-green-900 dark:text-green-100">-</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm">👆</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Clicks</p>
              <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">-</p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <div className="flex items-center">
            <div className="h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center text-white text-sm">👁️</div>
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600 dark:text-orange-400">Unique Pages</p>
              <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">-</p>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center p-8">
        <p className="text-gray-500 dark:text-gray-400 mb-4">Analytics system is initializing...</p>
        <div className="text-sm text-gray-400">
          The full analytics dashboard will load once all components are ready.
        </div>
      </div>
    </div>
  )
}
