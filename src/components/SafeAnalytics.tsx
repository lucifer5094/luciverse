'use client'

import { useEffect, useState } from 'react'

// Safe Analytics wrapper to prevent webpack module loading issues
export default function SafeAnalytics() {
  const [isClient, setIsClient] = useState(false)
  const [AnalyticsComponent, setAnalyticsComponent] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Only load Analytics on client side to prevent webpack issues
    if (typeof window !== 'undefined') {
      import('@vercel/analytics/react')
        .then(({ Analytics }) => {
          setAnalyticsComponent(() => Analytics)
        })
        .catch((error) => {
          console.warn('Analytics failed to load:', error)
          // Analytics is optional, so we don't throw an error
        })
    }
  }, [])

  // Don't render anything on server side or if Analytics failed to load
  if (!isClient || !AnalyticsComponent || typeof AnalyticsComponent !== 'function') {
    if (!isClient) return null;
    if (!AnalyticsComponent) {
      console.warn('SafeAnalytics: AnalyticsComponent not loaded.');
      return null;
    }
    if (typeof AnalyticsComponent !== 'function') {
      console.error('SafeAnalytics: AnalyticsComponent is not a valid React component:', AnalyticsComponent);
      return null;
    }
  }

  try {
    return <AnalyticsComponent />
  } catch (error) {
    console.warn('Analytics rendering error:', error)
    return null
  }
}
