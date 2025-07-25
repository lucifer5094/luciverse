'use client'

import { usePWA } from './PWAInstallPrompt'
import { useState, useEffect } from 'react'

export default function OfflineIndicator() {
  const { isOnline } = usePWA()
  const [showReconnected, setShowReconnected] = useState(false)
  const [wasOffline, setWasOffline] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    if (!isOnline) {
      setWasOffline(true)
    } else if (wasOffline) {
      setShowReconnected(true)
      const timer = setTimeout(() => {
        setShowReconnected(false)
        setWasOffline(false)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOnline, wasOffline, isClient])

  // Only render after client-side hydration to prevent mismatches
  if (!isClient) {
    return null
  }

  // Show reconnected message
  if (showReconnected) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-green-500 text-white px-4 py-2 text-center text-sm font-medium animate-slide-down">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>🎉 Back online! All features restored.</span>
        </div>
      </div>
    )
  }

  // Show offline message
  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium animate-slide-down">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-yellow-900 rounded-full animate-pulse"></div>
          <span>📱 You&apos;re offline. Cached content available.</span>
          <button 
            onClick={() => {
              // In development, never reload to prevent loops
              if (process.env.NODE_ENV === 'development') {
                console.log('🚫 Reload blocked in development mode')
                console.log('💡 Connection status:', navigator.onLine ? 'Online' : 'Offline')
                return
              }
              
              // Try to reconnect instead of hard reload
              if (navigator.onLine) {
                window.location.reload()
              } else {
                // Just check connection status
                console.log('Still offline, please check your connection')
              }
            }}
            className="ml-4 px-2 py-1 bg-yellow-600 text-yellow-100 rounded text-xs hover:bg-yellow-700 transition-colors"
          >
            Check Connection
          </button>
        </div>
      </div>
    )
  }

  return null
}
