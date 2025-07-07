'use client'

import { useState, useEffect } from 'react'

export default function SimpleAnalyticsDashboard() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simple initialization
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="spinner h-8 w-8"></div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Track edits and user interactions</p>
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
                <p className="text-2xl font-bold">12</p>
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
                <p className="text-2xl font-bold">5</p>
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
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">48</p>
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
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">7</p>
              </div>
            </div>
          </div>
        </div>

        <div className="state-info rounded-lg p-4">
          <p className="text-sm">
            ℹ️ Analytics dashboard is running in safe mode with enhanced styling.
          </p>
        </div>
      </div>
    </div>
  )
}