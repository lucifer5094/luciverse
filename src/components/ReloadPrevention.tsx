// Quick fix to prevent excessive reloads
'use client'

import { useEffect, useState } from 'react'

export default function ReloadPrevention() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    // Clear any stored reload counts on app start
    if (typeof window !== 'undefined') {
      localStorage.setItem('reload-count', '0')
      
      // Add a flag to prevent cascading reloads
      let reloadAttempted = false
      
      const preventExcessiveReload = () => {
        if (reloadAttempted) {
          console.warn('Reload already attempted, preventing cascade')
          return false
        }
        reloadAttempted = true
        setTimeout(() => {
          reloadAttempted = false
        }, 5000) // Reset after 5 seconds
        return true
      }
      
      // Override window.location.reload to add safety
      const originalReload = window.location.reload
      window.location.reload = function() {
        if (preventExcessiveReload()) {
          console.log('Safe reload initiated')
          originalReload.call(this)
        } else {
          console.log('Reload prevented to avoid cascade')
        }
      }
      
      return () => {
        // Restore original reload function
        window.location.reload = originalReload
      }
    }
  }, [isClient])
  
  return null
}
