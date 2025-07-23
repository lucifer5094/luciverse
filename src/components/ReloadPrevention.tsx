// EMERGENCY: Prevent all reloads in development
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
      
      const isDev = process.env.NODE_ENV === 'development'
      
      // In development, COMPLETELY block all programmatic reloads
      if (isDev) {
        console.log('🚫 DEVELOPMENT MODE: All programmatic reloads BLOCKED')
        
        // Override ALL reload methods
        const originalReload = window.location.reload
        const originalAssign = window.location.assign
        const originalReplace = window.location.replace
        
        // Block window.location.reload
        window.location.reload = function() {
          console.warn('🚫 window.location.reload() BLOCKED in development')
          console.log('💡 Use browser refresh button if needed')
        }
        
        // Block window.location.assign
        window.location.assign = function(url) {
          if (url === window.location.href) {
            console.warn('🚫 window.location.assign(same-url) BLOCKED in development')
            return
          }
          originalAssign.call(this, url)
        }
        
        // Block window.location.replace  
        window.location.replace = function(url) {
          if (url === window.location.href) {
            console.warn('🚫 window.location.replace(same-url) BLOCKED in development')
            return
          }
          originalReplace.call(this, url)
        }
        
        // Also block href assignments that would reload
        const currentHref = window.location.href
        Object.defineProperty(window.location, 'href', {
          get: function() {
            return currentHref
          },
          set: function(url) {
            if (url === currentHref) {
              console.warn('🚫 window.location.href reload BLOCKED in development')
              return
            }
            // Allow actual navigation
            originalAssign.call(this, url)
          }
        })
        
        return () => {
          // Restore original functions on cleanup
          window.location.reload = originalReload
          window.location.assign = originalAssign
          window.location.replace = originalReplace
        }
      }
    }
  }, [isClient])
  
  return null
}
