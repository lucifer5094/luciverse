import { useEffect, useRef, useState } from 'react'
import { analyticsAPI } from '@/utils/analyticsAPI'

export function useUserTracking() {
  const isInitializedRef = useRef(false)
  const scrollTimeoutRef = useRef<NodeJS.Timeout>()
  const cleanupFunctionsRef = useRef<(() => void)[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // Prevent multiple initializations and ensure we're on client
    if (isInitializedRef.current || !isClient) return

    // Add error boundary for the entire tracking hook
    try {
      // Track on development and production site
      const isAllowed = window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname === 'luciverseai.vercel.app'
      
      if (!isAllowed) return

      isInitializedRef.current = true
      const currentPage = window.location.pathname

      // Log page view with error handling
      try {
        analyticsAPI.logInteraction({
          page: currentPage,
          element: 'page',
          action: 'page_view'
        })
      } catch (error) {
        console.warn('Failed to log page view:', error)
      }

      // Track clicks
      const handleClick = (e: MouseEvent) => {
        try {
          const target = e.target as HTMLElement
          const element = target.tagName.toLowerCase()
          const id = target.id || 'unknown'
          const className = target.className || 'unknown'

          analyticsAPI.logInteraction({
            page: currentPage,
            element: `${element}${id ? '#' + id : ''}${className ? '.' + className.split(' ')[0] : ''}`,
            action: 'click',
            position: { x: e.clientX, y: e.clientY },
            metadata: {
              text: target.textContent?.slice(0, 50) || '',
              href: target.getAttribute('href')
            }
          })
        } catch (error) {
          // Silently fail to prevent blocking user interactions
        }
      }

      // Track scroll with throttling and better cleanup
      const handleScroll = () => {
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
        
        scrollTimeoutRef.current = setTimeout(() => {
          try {
            const scrollPercent = Math.round(
              (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
            )
            
            analyticsAPI.logInteraction({
              page: currentPage,
              element: 'window',
              action: 'scroll',
              metadata: {
                scrollY: window.scrollY,
                scrollPercent: Math.min(scrollPercent, 100)
              }
            })
          } catch (error) {
            // Silently fail
          }
        }, 1000)
      }

      // Track focus/blur events
      const handleFocus = () => {
        try {
          analyticsAPI.logInteraction({
            page: currentPage,
            element: 'window',
            action: 'focus'
          })
        } catch (error) {
          // Silently fail
        }
      }

      const handleBlur = () => {
        try {
          analyticsAPI.logInteraction({
            page: currentPage,
            element: 'window',
            action: 'blur'
          })
        } catch (error) {
          // Silently fail
        }
      }

      // Track beforeunload to detect page reloads
      const handleBeforeUnload = () => {
        // Clear all timeouts before page unload
        if (scrollTimeoutRef.current) {
          clearTimeout(scrollTimeoutRef.current)
        }
        
        // Execute all cleanup functions
        cleanupFunctionsRef.current.forEach(cleanup => {
          try {
            cleanup()
          } catch (error) {
            // Silently fail during cleanup
          }
        })
      }

      // Add event listeners with passive option where appropriate
      document.addEventListener('click', handleClick)
      window.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('focus', handleFocus)
      window.addEventListener('blur', handleBlur)
      window.addEventListener('beforeunload', handleBeforeUnload)

      // Store cleanup functions
      cleanupFunctionsRef.current = [
        () => document.removeEventListener('click', handleClick),
        () => window.removeEventListener('scroll', handleScroll),
        () => window.removeEventListener('focus', handleFocus),
        () => window.removeEventListener('blur', handleBlur),
        () => window.removeEventListener('beforeunload', handleBeforeUnload),
        () => {
          if (scrollTimeoutRef.current) {
            clearTimeout(scrollTimeoutRef.current)
          }
        }
      ]

      return () => {
        cleanupFunctionsRef.current.forEach(cleanup => {
          try {
            cleanup()
          } catch (error) {
            // Silently fail during cleanup
          }
        })
        cleanupFunctionsRef.current = []
        isInitializedRef.current = false
      }
    } catch (err) {
      console.warn('User tracking hook error:', err)
      isInitializedRef.current = false
    }
  }, [isClient])
}
