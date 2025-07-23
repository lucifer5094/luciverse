'use client'

import React, { useEffect, useState } from 'react'
import { ReloadDetector } from '@/utils/errorHandling'

interface ReloadHelperProps {
  onReloadDetected?: () => void
}

export default function ReloadHelper({ onReloadDetected }: ReloadHelperProps) {
  const [showHelper, setShowHelper] = useState(false)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    // Disable in development to prevent interference
    if (process.env.NODE_ENV === 'development') {
      console.log('🚫 ReloadHelper disabled in development mode')
      return
    }
    
    // Track reload frequency
    const reloadCountFromStorage = parseInt(localStorage.getItem('reload-count') || '0')
    setReloadCount(reloadCountFromStorage)

    // Show helper if user has reloaded frequently
    if (reloadCountFromStorage >= 5) { // Increased threshold
      setShowHelper(true)
    }

    // Listen for reload attempts
    const handleBeforeUnload = () => {
      // Get fresh count from storage to avoid stale closure
      const currentCount = parseInt(localStorage.getItem('reload-count') || '0')
      const newCount = currentCount + 1
      localStorage.setItem('reload-count', newCount.toString())
      onReloadDetected?.()
    }

    ReloadDetector.onBeforeReload(handleBeforeUnload)

    // Reset count after 10 minutes (increased time)
    const resetTimer = setTimeout(() => {
      localStorage.setItem('reload-count', '0')
      setReloadCount(0)
      setShowHelper(false)
    }, 10 * 60 * 1000) // 10 minutes instead of 5

    return () => {
      ReloadDetector.removeBeforeReloadHandler(handleBeforeUnload)
      clearTimeout(resetTimer)
    }
  }, [onReloadDetected])

  const handleClearCache = () => {
    // Clear various caches
    if ('caches' in window) {
      caches.keys().then(names => {
        names.forEach(name => {
          caches.delete(name)
        })
      })
    }
    
    // Clear localStorage related to app state
    const keysToKeep = ['theme', 'user-preferences']
    const allKeys = Object.keys(localStorage)
    allKeys.forEach(key => {
      if (!keysToKeep.includes(key)) {
        localStorage.removeItem(key)
      }
    })

    setShowHelper(false)
    setReloadCount(0)
    localStorage.setItem('reload-count', '0')
    
    // Ask user before reload
    if (confirm('Cache cleared! Do you want to reload the page now?')) {
      window.location.reload()
    }
  }

  const handleDismiss = () => {
    setShowHelper(false)
    localStorage.setItem('reload-count', '0')
    setReloadCount(0)
  }

  if (!showHelper) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 shadow-lg">
      <div className="flex items-start space-x-3">
        <div className="text-yellow-600 dark:text-yellow-400 text-xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-200 mb-1">
            Experiencing Issues?
          </h3>
          <p className="text-xs text-yellow-700 dark:text-yellow-300 mb-3">
            You&apos;ve reloaded {reloadCount} times recently. This might help:
          </p>
          <div className="space-y-2">
            <button
              onClick={handleClearCache}
              className="w-full text-xs bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 transition-colors"
            >
              Clear Cache & Reload
            </button>
            <button
              onClick={handleDismiss}
              className="w-full text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
