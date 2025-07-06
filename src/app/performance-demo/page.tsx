import React from 'react'
import { Metadata } from 'next'
import PerformanceUXDemo from '@/components/PerformanceUXDemo'

export const metadata: Metadata = {
  title: 'Performance & UX Demo | Luciverse',
  description: 'Showcase of enhanced loading states, image optimization, error handling, search functionality, and PWA features',
  keywords: ['performance', 'ux', 'loading states', 'image optimization', 'error boundaries', 'search', 'PWA'],
}

export default function PerformanceUXDemoPage() {
  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background">
      <div className="container mx-auto py-12">
        <PerformanceUXDemo />
      </div>
    </div>
  )
}
