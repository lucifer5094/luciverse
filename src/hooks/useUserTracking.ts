import { useEffect } from 'react'
import { analyticsAPI } from '@/utils/analyticsAPI'

export function useUserTracking() {
  useEffect(() => {
    // Only track in development mode
    const isDevelopment = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1'
    
    if (!isDevelopment) return

    const currentPage = window.location.pathname

    // Log page view
    analyticsAPI.logInteraction({
      page: currentPage,
      element: 'page',
      action: 'page_view'
    })

    // Track clicks
    const handleClick = (e: MouseEvent) => {
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
    }

    // Track scroll with throttling
    let scrollTimeout: NodeJS.Timeout
    const handleScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
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
      }, 1000)
    }

    // Track focus/blur events
    const handleFocus = () => {
      analyticsAPI.logInteraction({
        page: currentPage,
        element: 'window',
        action: 'focus'
      })
    }

    const handleBlur = () => {
      analyticsAPI.logInteraction({
        page: currentPage,
        element: 'window',
        action: 'blur'
      })
    }

    // Add event listeners
    document.addEventListener('click', handleClick)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    return () => {
      document.removeEventListener('click', handleClick)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      clearTimeout(scrollTimeout)
    }
  }, [])
}
