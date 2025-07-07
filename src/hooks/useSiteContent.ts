'use client'

import { useEffect, useState } from 'react'
import { dataAPI } from '@/utils/dataAPI'

interface SiteContent {
  heroTitle: string
  heroSubtitle: string
  highlights: any[]
  stats: {
    projects: number
    years: number
    technologies: number
    achievements: number
  }
}

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>({
    heroTitle: "Welcome to Luciverse",
    heroSubtitle: "Dive into my universe of development, design, and digital experiments",
    highlights: [],
    stats: {
      projects: 0,
      years: 0,
      technologies: 0,
      achievements: 0,
    },
  })
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const loadSiteContent = async () => {
      try {
        setLoading(true)
        const siteContent = await dataAPI.getSiteContent()
        setContent({
          heroTitle: siteContent.heroTitle || "Welcome to Luciverse",
          heroSubtitle: siteContent.heroSubtitle || "Dive into my universe of development, design, and digital experiments",
          highlights: siteContent.highlights || [],
          stats: siteContent.stats || {
            projects: 0,
            years: 0,
            technologies: 0,
            achievements: 0,
          },
        })
      } catch (error) {
        console.warn('Failed to load site content:', error)
        // Keep default content on error
      } finally {
        setLoading(false)
      }
    }

    loadSiteContent()
  }, [isClient])

  return {
    content,
    loading: loading || !isClient,
    isClient,
    updateContent: setContent,
  }
}
