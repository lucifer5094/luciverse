// 📁 File: src/app/page.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion, useScroll, useTransform, Variants } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import OwnerControls from '@/components/OwnerControls'
import OwnerEditPanel from '@/components/OwnerEditPanel'
import InlineEdit from '@/components/InlineEdit'
import { dataAPI } from '@/utils/dataAPI'

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [showEditPanel, setShowEditPanel] = useState(false)
  const [loading, setLoading] = useState(true)

  // Editable content state - loaded from JSON
  const [heroTitle, setHeroTitle] = useState('Welcome to Luciverse')
  const [heroSubtitle, setHeroSubtitle] = useState('Dive into my universe of development, design, and digital experiments')
  const [highlights, setHighlights] = useState<any[]>([])
  const [stats, setStats] = useState({ projects: 0, years: 0, technologies: 0, achievements: 0 })

  // Load content from JSON file
  useEffect(() => {
    loadSiteContent()
  }, [])

  const loadSiteContent = async () => {
    try {
      setLoading(true)
      const content = await dataAPI.getSiteContent() as any
      setHeroTitle(content.heroTitle)
      setHeroSubtitle(content.heroSubtitle)
      setHighlights(content.highlights || [])
      setStats(content.stats || { projects: 0, years: 0, technologies: 0, achievements: 0 })
    } catch (error) {
      console.error('Failed to load site content:', error)
      // Keep default values if loading fails
    } finally {
      setLoading(false)
    }
  }

  const handleSaveHeroTitle = async (newTitle: string) => {
    try {
      const currentContent = await dataAPI.getSiteContent()
      await dataAPI.updateSiteContent({
        ...currentContent,
        heroTitle: newTitle
      })
      setHeroTitle(newTitle)
    } catch (error) {
      console.error('Failed to save hero title:', error)
    }
  }

  const handleSaveHeroSubtitle = async (newSubtitle: string) => {
    try {
      const currentContent = await dataAPI.getSiteContent()
      await dataAPI.updateSiteContent({
        ...currentContent,
        heroSubtitle: newSubtitle
      })
      setHeroSubtitle(newSubtitle)
    } catch (error) {
      console.error('Failed to save hero subtitle:', error)
    }
  }

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6
      }
    }
  }

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accentone/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Additional floating elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 left-1/4 w-52 h-52 bg-blue-500/8 rounded-full blur-2xl animate-pulse delay-300"></div>

        {/* Geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-accent/10 rounded-lg rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 border border-accentone/10 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
      </div>

      <main className="min-h-screen flex flex-col justify-center items-center px-4 py-16 bg-gradient-to-br from-light-background via-white to-gray-50 dark:from-dark-surface dark:via-dark-background dark:to-black transition-colors duration-300">
        <motion.div
          style={{ y, opacity }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-center text-light-text dark:text-white mb-6 leading-tight"
          >
            <InlineEdit
              type="text"
              value={heroTitle}
              onSave={handleSaveHeroTitle}
              placeholder="Enter hero title..."
              maxLength={50}
              inline={true}
            >
              Welcome to{' '}
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accentone"
                initial={{ backgroundPosition: "0%" }}
                animate={{ backgroundPosition: "100%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              >
                Luciverse
              </motion.span>
            </InlineEdit>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="relative"
          >
            <p className="max-w-3xl text-center text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              <InlineEdit
                type="textarea"
                value={heroSubtitle}
                onSave={handleSaveHeroSubtitle}
                placeholder="Enter hero subtitle..."
                maxLength={200}
                inline={true}
              >
                Dive into my universe of{' '}
                <motion.span
                  className="text-accent font-semibold"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  development
                </motion.span>
                ,{' '}
                <motion.span
                  className="text-accentone font-semibold"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  design
                </motion.span>
                , and digital experiments
              </InlineEdit>
            </p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-1 w-32 bg-gradient-to-r from-accent to-accentone mx-auto rounded-full"
            />
          </motion.div>
        </motion.div>

        {/* Enhanced Dynamic Highlights Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="w-full max-w-7xl mx-auto mb-20 px-4 relative"
        >
          {/* Enhanced background decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Geometric patterns */}
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 25, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute top-10 right-10 w-40 h-40 border-2 border-accent/8 rounded-full"
            />
            <motion.div
              animate={{ 
                rotate: [360, 0],
                scale: [1, 0.9, 1]
              }}
              transition={{ 
                duration: 30, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="absolute top-16 right-16 w-28 h-28 border border-accentone/6 rounded-full"
            />
            
            {/* Floating gradient orbs */}
            <motion.div
              animate={{ 
                y: [-30, 30, -30],
                x: [-10, 10, -10],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 8, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="absolute bottom-20 left-10 w-32 h-32 bg-gradient-to-r from-accent/10 to-accentone/10 rounded-full blur-2xl"
            />
            <motion.div
              animate={{ 
                y: [20, -20, 20],
                x: [10, -10, 10],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 2
              }}
              className="absolute top-32 left-1/3 w-24 h-24 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-xl"
            />
            
            {/* Grid pattern overlay */}
            <div 
              className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(79, 70, 229, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(79, 70, 229, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px'
              }}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="text-center mb-16 relative z-10"
          >
            {/* Enhanced animated title with special effects */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="relative inline-block mb-6"
            >
              <motion.h2 
                className="text-4xl md:text-5xl font-bold text-light-text dark:text-white relative z-10"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(79, 70, 229, 0.2)",
                    "0 0 35px rgba(79, 70, 229, 0.4)",
                    "0 0 20px rgba(79, 70, 229, 0.2)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <motion.span
                  animate={{ 
                    rotate: [0, 15, -10, 0],
                    scale: [1, 1.2, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    repeatType: "loop",
                    type: "tween",
                    ease: "easeInOut"
                  }}
                  className="inline-block mr-4 text-3xl md:text-4xl"
                >
                  ✨
                </motion.span>
                <span className="bg-gradient-to-r from-accent via-purple-600 to-accentone bg-clip-text text-transparent">
                  Work Highlights
                </span>
                <motion.span
                  animate={{ 
                    rotate: [0, -15, 10, 0],
                    scale: [1, 1.2, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    repeatType: "loop",
                    delay: 2,
                    type: "tween",
                    ease: "easeInOut"
                  }}
                  className="inline-block ml-4 text-3xl md:text-4xl"
                >
                  🌟
                </motion.span>
              </motion.h2>

              {/* Enhanced glowing background effect */}
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.1, 0.3, 0.1],
                  rotate: [0, 180, 360]
                }}
                transition={{ duration: 6, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-accent via-purple-500 to-accentone blur-3xl rounded-full -z-10"
              />
              
              {/* Additional accent elements */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -top-2 -bottom-2 -left-8 -right-8 bg-gradient-to-r from-transparent via-accent/10 to-transparent blur-xl rounded-full -z-20"
              />
            </motion.div>

            {/* Enhanced animated subtitle with typing effect */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="relative"
            >
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto relative leading-relaxed">
                Recent achievements, featured projects, and notable milestones in my development journey
                
                {/* Enhanced pulsing dot indicator */}
                <motion.span
                  animate={{ 
                    opacity: [0, 1, 0],
                    scale: [1, 1.8, 1]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity 
                  }}
                  className="inline-block w-2.5 h-2.5 bg-gradient-to-r from-accent to-accentone rounded-full ml-3"
                />
              </p>

              {/* Decorative line underneath */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 2, duration: 1.2, ease: "easeOut" }}
                className="mt-6 h-0.5 w-24 bg-gradient-to-r from-accent to-accentone mx-auto rounded-full"
              />
            </motion.div>

            {/* Enhanced floating attention grabbers */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: [0, 1, 0],
                y: [30, -15, 30],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, 10, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                delay: 2.5,
                type: "tween",
                ease: "easeInOut"
              }}
              className="absolute -top-12 right-1/4 text-3xl md:text-4xl"
            >
              👀
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ 
                opacity: [0, 1, 0],
                y: [30, -15, 30],
                scale: [0.8, 1.2, 0.8],
                rotate: [0, -10, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                delay: 5,
                type: "tween",
                ease: "easeInOut"
              }}
              className="absolute -top-12 left-1/4 text-3xl md:text-4xl"
            >
              💫
            </motion.div>
          </motion.div>

          {/* Empty State - Owner can add highlights */}
          {highlights.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className="text-center py-16 relative"
            >
              {/* Floating particles around empty state */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-accent/30 rounded-full"
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${30 + (i % 3) * 20}%`,
                    }}
                    animate={{
                      y: [-10, 10, -10],
                      x: [-5, 5, -5],
                      opacity: [0.3, 0.8, 0.3],
                      scale: [0.8, 1.2, 0.8],
                    }}
                    transition={{
                      duration: 3 + i * 0.5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "easeInOut",
                    }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ 
                  scale: 1.1,
                  rotate: 10
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                  type: "tween"
                }}
                className="text-6xl mb-6 relative z-10"
              >
                ✨
              </motion.div>
              
              <motion.h3 
                className="text-2xl font-bold text-light-text dark:text-white mb-4"
                animate={{
                  y: [0, -5, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                Highlights Coming Soon
              </motion.h3>
              
              <motion.p 
                className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.8, duration: 1 }}
              >
                This space will showcase amazing work highlights, achievements, and featured projects.
              </motion.p>

              <motion.div
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 0 30px rgba(79, 70, 229, 0.3)"
                }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent/10 to-accentone/10 border border-accent/20 rounded-full text-accent font-medium relative overflow-hidden"
              >
                {/* Shimmer effect */}
                <motion.div
                  animate={{
                    x: [-100, 100]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                />
                
                <motion.span
                  animate={{
                    rotate: [0, 360]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                >
                  🚀
                </motion.span>
                <span className="relative z-10">Stay tuned for exciting updates!</span>
              </motion.div>
            </motion.div>
          ) : (
            /* Active Highlights Display */
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.3, duration: 0.6 }}
              className={`grid gap-6 relative ${
                highlights.filter((h: any) => h.featured).length === 1 
                  ? 'grid-cols-1' 
                  : highlights.filter((h: any) => h.featured).length === 2 
                    ? 'grid-cols-1 md:grid-cols-2' 
                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {/* Spotlight effect for highlights */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.1, 0.2, 0.1]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-transparent blur-3xl pointer-events-none"
              />

              {highlights.filter((h: any) => h.featured).slice(0, 6).map((highlight: any, index: number) => (
                <motion.div
                  key={highlight.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    delay: 1.5 + index * 0.15, 
                    duration: 0.6,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -12, 
                    scale: 1.02,
                    boxShadow: "0 25px 50px rgba(79, 70, 229, 0.25)"
                  }}
                  className={`group bg-white/90 dark:bg-dark-background/90 backdrop-blur-md border border-gray-200/60 dark:border-gray-700/60 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-700 relative overflow-hidden cursor-pointer ${
                    highlights.filter((h: any) => h.featured).length === 1 ? 'max-w-3xl mx-auto' : ''
                  }`}
                >
                  {/* Enhanced animated border glow with gradient */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{
                      background: "linear-gradient(135deg, rgba(79, 70, 229, 0.1), rgba(236, 72, 153, 0.1), rgba(79, 70, 229, 0.1))",
                    }}
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                  />

                  {/* Floating particles effect */}
                  <motion.div
                    className="absolute top-4 right-4 w-2 h-2 bg-accent/40 rounded-full opacity-0 group-hover:opacity-100"
                    animate={{
                      y: [-5, 5, -5],
                      scale: [1, 1.2, 1],
                      opacity: [0.4, 0.8, 0.4]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-accentone/40 rounded-full opacity-0 group-hover:opacity-100"
                    animate={{
                      y: [5, -5, 5],
                      scale: [1, 1.3, 1],
                      opacity: [0.4, 0.9, 0.4]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
                  />

                  {/* Enhanced Content Layout */}
                  <div className="relative z-10">
                    {/* Header with Image and Title */}
                    <div className="flex items-start gap-6 mb-4">
                      {/* Enhanced Image/Icon Section */}
                      <div className="flex-shrink-0">
                        {highlight.image ? (
                          <motion.div
                            className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-accent/20 to-accentone/20 border-2 border-gray-200 dark:border-gray-700 shadow-lg"
                            whileHover={{ 
                              scale: 1.05,
                              rotate: 2,
                              boxShadow: "0 10px 25px rgba(79, 70, 229, 0.3)"
                            }}
                            transition={{ 
                              duration: 0.4,
                              type: "spring",
                              stiffness: 300
                            }}
                          >
                            <Image 
                              src={highlight.image} 
                              alt={highlight.title}
                              width={400}
                              height={240}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              onError={(e) => {
                                // Fallback to icon if image fails to load
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextElementSibling?.classList.remove('hidden');
                              }}
                            />
                            {/* Fallback icon (hidden by default) */}
                            <div className="hidden absolute inset-0 flex items-center justify-center bg-gradient-to-br from-accent/10 to-accentone/10">
                              <span className="text-3xl">{highlight.icon}</span>
                            </div>
                            
                            {/* Image overlay effect */}
                            <motion.div
                              className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            />
                            
                            {/* Corner accent */}
                            <motion.div
                              className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0, 1, 0.7]
                              }}
                              transition={{ duration: 2, repeat: Infinity }}
                            />
                          </motion.div>
                        ) : (
                          <motion.div
                            className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent/15 to-accentone/15 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center shadow-lg"
                            whileHover={{ 
                              scale: 1.1,
                              rotate: 8,
                              boxShadow: "0 10px 25px rgba(79, 70, 229, 0.2)"
                            }}
                            transition={{ 
                              duration: 0.5,
                              type: "spring",
                              stiffness: 300
                            }}
                          >
                            <span className="text-3xl">{highlight.icon}</span>
                          </motion.div>
                        )}
                      </div>

                      {/* Title and Category Section */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <motion.h4 
                            className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-accent transition-colors duration-300 leading-tight"
                            whileHover={{ x: 3 }}
                          >
                            {highlight.title}
                          </motion.h4>
                          
                          <motion.span 
                            className="flex-shrink-0 text-xs font-medium bg-gradient-to-r from-accent/15 to-accentone/15 text-accent px-3 py-1.5 rounded-full border border-accent/20 relative overflow-hidden"
                            whileHover={{ 
                              scale: 1.05,
                              boxShadow: "0 4px 12px rgba(79, 70, 229, 0.2)"
                            }}
                          >
                            <motion.div
                              animate={{
                                x: [-20, 20, -20]
                              }}
                              transition={{
                                duration: 4,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                            />
                            <span className="relative z-10">{highlight.category}</span>
                          </motion.span>
                        </div>

                        {/* Enhanced Description */}
                        <motion.p 
                          className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4"
                          initial={{ opacity: 0.9 }}
                          whileHover={{ opacity: 1 }}
                          transition={{ duration: 0.2 }}
                        >
                          {highlight.description}
                        </motion.p>

                        {/* Bottom Section with Date and Interaction */}
                        <motion.div 
                          className="flex items-center justify-between"
                          initial={{ opacity: 0.8 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                            <motion.span
                              animate={{ rotate: [0, 10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              📅
                            </motion.span>
                            <span className="font-medium">
                              {new Date(highlight.date + '-01').toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                          </div>

                          {/* Enhanced Hover indicator */}
                          <motion.div
                            className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300"
                            whileHover={{ x: 5 }}
                          >
                            <span className="text-xs text-accent font-medium">Explore</span>
                            <motion.svg 
                              width="18" 
                              height="18" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="text-accent"
                              whileHover={{ rotate: 45 }}
                              transition={{ duration: 0.3 }}
                            >
                              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </motion.svg>
                          </motion.div>
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced corner decorations */}
                  <motion.div
                    className="absolute top-3 right-3 w-1.5 h-1.5 bg-accent/40 rounded-full opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: [1, 1.8, 1],
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="absolute bottom-3 left-3 w-1 h-1 bg-accentone/40 rounded-full opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: [1, 2, 1],
                      opacity: [0.4, 1, 0.4]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 1.2 }}
                  />
                  
                  {/* Additional sparkle effects */}
                  <motion.div
                    className="absolute top-1/2 right-2 w-0.5 h-0.5 bg-purple-400/60 rounded-full opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: [0, 1.5, 0],
                      opacity: [0, 0.8, 0]
                    }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Stats - Owner controlled */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12"
          >
            {[
              { number: stats.projects || "---", label: "Projects", icon: "🚀" },
              { number: stats.years || "---", label: "Years", icon: "⏱️" },
              { number: stats.technologies || "---", label: "Technologies", icon: "💻" },
              { number: stats.achievements || "---", label: "Achievements", icon: "🏆" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2.2 + index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="text-center p-4 rounded-xl bg-white/50 dark:bg-dark-background/50 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className={`text-2xl font-bold mb-1 ${stat.number === '---' ? 'text-gray-400 dark:text-gray-500' : 'text-accent'}`}>
                  {stat.number}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Owner controlled CTA */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5, duration: 0.6 }}
            className="text-center mt-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 border border-gray-300 dark:border-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-400">
              <span>⚡</span>
              <span>Owner can add highlights here</span>
            </div>
          </motion.div> */}
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl px-4 mb-16"
        >
          {[
            {
              title: 'Projects',
              path: '/projects',
              icon: '🛠️',
              description: 'Explore my latest creations and innovations',
              gradient: 'from-blue-500 to-purple-600',
              accentColor: 'blue'
            },
            {
              title: 'About Me',
              path: '/about',
              icon: '👨‍🚀',
              description: 'Discover my journey and expertise',
              gradient: 'from-green-500 to-teal-600',
              accentColor: 'green'
            },
            {
              title: 'Achievements',
              path: '/achievements',
              icon: '🏆',
              description: 'View my certifications, awards & accomplishments',
              gradient: 'from-yellow-500 to-orange-600',
              accentColor: 'yellow'
            },
            {
              title: 'Vault',
              path: '/vault',
              icon: '🧠',
              description: 'Access my knowledge repository',
              gradient: 'from-purple-500 to-pink-600',
              accentColor: 'purple'
            },
            {
              title: 'Lab',
              path: '/lab',
              icon: '🧪',
              description: 'Witness experiments in progress',
              gradient: 'from-orange-500 to-red-600',
              accentColor: 'orange'
            },
            {
              title: 'Logs',
              path: '/logs',
              icon: '📓',
              description: 'Read my thoughts and insights',
              gradient: 'from-indigo-500 to-blue-600',
              accentColor: 'indigo'
            },
            {
              title: 'Contact',
              path: '/contact',
              icon: '📬',
              description: 'Let\'s connect and collaborate',
              gradient: 'from-pink-500 to-rose-600',
              accentColor: 'pink'
            }
          ].map(({ title, path, icon, description, gradient, accentColor }, index) => (
            <motion.div
              key={path}
              custom={index}
              variants={cardVariants}
              whileHover="hover"
              onHoverStart={() => setHoveredCard(path)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group"
            >
              <Link href={path} className="block">
                <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-dark-background/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 p-8 h-full">
                  {/* Enhanced gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500 rounded-2xl`}
                  />

                  {/* Glowing border effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                    style={{
                      background: `linear-gradient(135deg, transparent, transparent), linear-gradient(135deg, var(--accent), var(--accentone))`,
                      backgroundClip: 'border-box, border-box',
                      WebkitBackgroundClip: 'border-box, border-box'
                    }}
                  />

                  {/* Floating icon effect with enhanced animation */}
                  <motion.div
                    className="text-5xl mb-6 relative z-10 filter drop-shadow-lg"
                    animate={hoveredCard === path ? {
                      y: 8,
                      rotate: 8,
                      scale: 1.1
                    } : {}}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", type: "tween" }}
                  >
                    {icon}
                  </motion.div>

                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 relative z-10 group-hover:text-accent transition-colors duration-300">
                    {title}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed relative z-10 mb-4">
                    {description}
                  </p>

                  {/* Progress bar animation */}
                  <motion.div
                    className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative z-10 mb-4"
                    initial={{ width: 0 }}
                  >
                    <motion.div
                      className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                      initial={{ x: '-100%' }}
                      animate={hoveredCard === path ? { x: '0%' } : { x: '-100%' }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </motion.div>

                  {/* Animated arrow with enhanced styling */}
                  <motion.div
                    className="absolute bottom-6 right-6 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300"
                    animate={hoveredCard === path ? {
                      x: 8,
                      scale: 1.2
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity, type: "tween" }}
                  >
                    <div className="relative">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-md"
                      >
                        <path
                          d="M7 17L17 7M17 7H7M17 7V17"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-accent/20 rounded-full blur-md scale-150 opacity-50"></div>
                    </div>
                  </motion.div>

                  {/* Corner decorations */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-accentone/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="relative mt-16 w-full max-w-6xl"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/10 via-purple-500/10 to-accentone/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-2xl p-12">
            {/* Animated background pattern */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-accent/20 to-transparent rotate-12 transform scale-150"></div>
              <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-accentone/20 to-transparent -rotate-12 transform scale-150"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.2, duration: 0.6 }}
                className="text-5xl mb-6"
              >
                📬
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.4, duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold text-light-text dark:text-white mb-6"
              >
                Let&apos;s Connect
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.6, duration: 0.6 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
              >
                Ready to collaborate on something amazing? Let&apos;s discuss your ideas and bring them to life together.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.8, duration: 0.6 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-accentone text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span>Get In Touch</span>
                    <motion.div
                      animate={{ x: 5 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", type: "tween", repeatType: "reverse" }}
                    >
                      ✨
                    </motion.div>
                  </motion.button>
                </Link>

                <Link href="/projects">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-light-text dark:text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    View My Work
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Floating elements */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-gradient-to-r from-accent to-accentone rounded-full opacity-60"
                  style={{
                    left: `${15 + i * 12}%`,
                    top: `${20 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [-15, 15, -15],
                    x: [-10, 10, -10],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center relative"
          >
            <motion.div
              animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-4 bg-gradient-to-b from-accent to-accentone rounded-full mt-2"
            />

            {/* Glow effect */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 border-2 border-accent/30 rounded-full blur-sm"
            />
          </motion.div>
        </motion.div>

        {/* About Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="w-full max-w-6xl mx-auto mb-20 px-4"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-dark-background/90 dark:to-dark-surface/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 md:p-12">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-full"></div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="text-3xl md:text-4xl font-bold text-light-text dark:text-white mb-4"
                >
                  Meet the Creator
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                >
                  I&apos;m a passionate developer crafting digital experiences that blend creativity with cutting-edge technology.
                  From web applications to experimental projects, I explore the boundaries of what&apos;s possible.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                >
                  <Link href="/about">
                    <motion.button
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accentone text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Read More
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.button>
                  </Link>
                </motion.div>
              </div>

              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                  className="relative w-full h-64 bg-gradient-to-br from-accent/20 to-accentone/20 rounded-2xl flex items-center justify-center"
                >
                  <div className="text-6xl">👨‍💻</div>
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accentone/10 rounded-2xl blur-xl"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Lab Teaser Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="w-full max-w-6xl mx-auto mb-20 px-4"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl p-8 md:p-12">
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-transparent rounded-br-full"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-orange-500/20 to-transparent rounded-tl-full"></div>

            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                className="text-6xl mb-6"
              >
                🧪
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-light-text dark:text-white mb-4"
              >
                The Experiment Lab
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.6 }}
                className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
              >
                Step into my digital laboratory where ideas come to life. Interactive demos,
                experimental features, and playground projects await your exploration.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.6 }}
              >
                <Link href="/lab">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span>Try Something Fun</span>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      ⚡
                    </motion.div>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Owner Controls */}
        <OwnerControls onOpenEditor={() => setShowEditPanel(true)} />

        {/* Owner Edit Panel */}
        <OwnerEditPanel 
          isVisible={showEditPanel} 
          onClose={() => setShowEditPanel(false)} 
        />
      </main>
    </div>
  )
}
