'use client'

import { analyticsAPI } from '@/utils/analyticsAPI'

export default function AnalyticsTestButton() {
  const testAnalytics = async () => {
    // Generate a test interaction
    await analyticsAPI.logInteraction({
      page: '/admin',
      element: 'test-button',
      action: 'click',
      metadata: { test: true }
    })
    
    alert('Test interaction logged! Check the analytics dashboard.')
  }

  return (
    <button
      onClick={testAnalytics}
      className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
    >
      🧪 Test Analytics
    </button>
  )
}
