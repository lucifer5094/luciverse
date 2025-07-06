'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Award, 
  Trophy, 
  Star, 
  Calendar, 
  ExternalLink, 
  Download, 
  Filter, 
  Search, 
  Medal, 
  FileText as Certificate, 
  Eye,
  Share2,
  Printer as Print,
  Grid3X3,
  List,
  SortAsc,
  SortDesc,
  ChevronDown,
  X,
  Play,
  BookOpen,
  Code,
  Briefcase,
  Users,
  Target,
  CheckCircle,
  Clock,
  MapPin,
  Globe
} from 'lucide-react'
import { useLocalStorage, useAsyncData } from '@/hooks'
import InlineEdit from '@/components/InlineEdit'
import Image from 'next/image'
import { dataAPI, Achievement } from '@/utils/dataAPI'

// Category configurations
const categoryConfig = {
  all: { icon: Trophy, color: 'text-purple-600', bgColor: 'bg-purple-100', label: 'All Achievements' },
  certification: { icon: Certificate, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Certifications' },
  award: { icon: Award, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Awards' },
  achievement: { icon: Medal, color: 'text-green-600', bgColor: 'bg-green-100', label: 'Achievements' },
  competition: { icon: Trophy, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Competitions' },
  leadership: { icon: Users, color: 'text-indigo-600', bgColor: 'bg-indigo-100', label: 'Leadership' },
  project: { icon: Code, color: 'text-orange-600', bgColor: 'bg-orange-100', label: 'Projects' }
}

// View modes
type ViewMode = 'grid' | 'masonry' | 'list' | 'timeline'
type SortOption = 'date-desc' | 'date-asc' | 'importance' | 'alphabetical'

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [filteredAchievements, setFilteredAchievements] = useState<Achievement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>('achievementsViewMode', 'grid')
  const [sortOption, setSortOption] = useLocalStorage<SortOption>('achievementsSortOption', 'date-desc')
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showShareModal, setShowShareModal] = useState<Achievement | null>(null)

  // Load achievements from API
  useEffect(() => {
    const loadAchievements = async () => {
      try {
        setLoading(true)
        const achievementsData = await dataAPI.getAchievements()
        setAchievements(achievementsData)
        setFilteredAchievements(achievementsData)
      } catch (error) {
        console.error('Failed to load achievements:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadAchievements()
  }, [])
  
  // Statistics
  const stats = {
    total: achievements.length,
    certifications: achievements.filter(a => a.category === 'certification').length,
    awards: achievements.filter(a => a.category === 'award').length,
    competitions: achievements.filter(a => a.category === 'competition').length,
    verified: achievements.filter(a => a.isVerified).length
  }

  // Filter and sort effects
  useEffect(() => {
    let filtered = achievements

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(achievement =>
        achievement.title.toLowerCase().includes(query) ||
        achievement.organization.toLowerCase().includes(query) ||
        achievement.description.toLowerCase().includes(query) ||
        achievement.skills.some(skill => skill.toLowerCase().includes(query))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(achievement => achievement.category === selectedCategory)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime()
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime()
        case 'importance':
          return a.importance - b.importance
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })

    setFilteredAchievements(filtered)
  }, [achievements, searchQuery, selectedCategory, sortOption])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0
    }
  }

  // Utility functions
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getImportanceColor = (importance: number) => {
    switch (importance) {
      case 1: return 'text-red-500'
      case 2: return 'text-yellow-500'
      case 3: return 'text-green-500'
      default: return 'text-gray-500'
    }
  }

  const getImportanceLabel = (importance: number) => {
    switch (importance) {
      case 1: return 'High'
      case 2: return 'Medium'
      case 3: return 'Low'
      default: return 'Unknown'
    }
  }

  const shareAchievement = (achievement: Achievement) => {
    if (navigator.share) {
      navigator.share({
        title: achievement.title,
        text: `Check out my achievement: ${achievement.title} from ${achievement.organization}`,
        url: window.location.href + '?achievement=' + achievement.id
      })
    } else {
      setShowShareModal(achievement)
    }
  }

  const downloadCertificate = (achievement: Achievement) => {
    if (achievement.certificateUrl) {
      const link = document.createElement('a')
      link.href = achievement.certificateUrl
      link.download = `${achievement.title.replace(/\s+/g, '_')}_Certificate.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const printAchievement = (achievement: Achievement) => {
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${achievement.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .content { max-width: 600px; margin: 0 auto; }
              .skill { display: inline-block; background: #f0f0f0; padding: 4px 8px; margin: 2px; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="content">
              <div class="header">
                <h1>${achievement.title}</h1>
                <h2>${achievement.organization}</h2>
                <p><strong>Date:</strong> ${formatDate(achievement.date)}</p>
              </div>
              <p><strong>Description:</strong> ${achievement.description}</p>
              <p><strong>Skills:</strong></p>
              <div>
                ${achievement.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
              </div>
              ${achievement.verificationUrl ? `<p><strong>Verification:</strong> ${achievement.verificationUrl}</p>` : ''}
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen px-4 md:px-6 py-16 md:py-24 bg-gradient-to-br from-light-background via-white to-gray-50 dark:from-dark-surface dark:via-black dark:to-gray-900 transition-colors duration-500">
        <div className="max-w-7xl mx-auto flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading achievements...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen px-4 md:px-6 py-16 md:py-24 bg-gradient-to-br from-light-background via-white to-gray-50 dark:from-dark-surface dark:via-black dark:to-gray-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="relative inline-block">
            <motion.div
              className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-accentone/20 rounded-2xl blur-xl"
              animate={{
                scale: [1, 1.05, 1],
                opacity: [0.5, 0.8, 0.5]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <h1 className="relative text-4xl md:text-6xl font-bold bg-gradient-to-r from-accent to-accentone bg-clip-text text-transparent mb-4">
              🏆 Achievements & Certifications
            </h1>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A showcase of my professional journey, certifications, awards, and accomplishments that reflect my commitment to continuous learning and excellence.
          </p>
        </motion.div>

        {/* Statistics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-12"
        >
          {[
            { label: 'Total Achievements', value: stats.total, icon: Trophy, color: 'purple' },
            { label: 'Certifications', value: stats.certifications, icon: Certificate, color: 'blue' },
            { label: 'Awards Won', value: stats.awards, icon: Award, color: 'yellow' },
            { label: 'Competitions', value: stats.competitions, icon: Medal, color: 'red' },
            { label: 'Verified', value: stats.verified, icon: CheckCircle, color: 'green' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 text-center group cursor-pointer"
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
              </div>
              <div className={`text-3xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400 mb-1`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 mb-8"
        >
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search achievements, organizations, skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setSelectedCategory(key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedCategory === key
                      ? `${config.bgColor} ${config.color} shadow-md scale-105`
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <config.icon className="w-4 h-4" />
                  {config.label}
                </button>
              ))}
            </div>

            {/* View Mode and Sort Controls */}
            <div className="flex items-center gap-4">
              {/* Sort Options */}
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-accent focus:border-transparent"
              >
                <option value="date-desc">Latest First</option>
                <option value="date-asc">Oldest First</option>
                <option value="importance">By Importance</option>
                <option value="alphabetical">Alphabetical</option>
              </select>

              {/* View Mode Toggles */}
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {[
                  { mode: 'grid' as ViewMode, icon: Grid3X3, label: 'Grid' },
                  { mode: 'list' as ViewMode, icon: List, label: 'List' }
                ].map(({ mode, icon: Icon, label }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    title={label}
                    className={`p-2 rounded-md transition-all duration-200 ${
                      viewMode === mode
                        ? 'bg-accent text-white shadow-md'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Achievements Display */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : viewMode === 'masonry'
              ? 'columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8'
              : 'space-y-6'
          }
        >
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              variants={itemVariants}
              layout
              whileHover={{ y: -5, scale: 1.02 }}
              className={`
                bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 dark:border-gray-700/50 overflow-hidden group cursor-pointer transition-all duration-500 hover:shadow-2xl
                ${viewMode === 'list' ? 'flex items-center gap-6 p-6' : 'p-6'}
                ${viewMode === 'masonry' ? 'break-inside-avoid mb-8' : ''}
              `}
              onClick={() => setSelectedAchievement(achievement)}
            >
              {/* Achievement Image/Icon */}
              <div className={`${viewMode === 'list' ? 'flex-shrink-0 w-24 h-24' : 'mb-4'} relative`}>
                {achievement.imageUrl ? (
                  <div className="relative w-full h-24 rounded-xl overflow-hidden bg-gradient-to-br from-accent/10 to-accentone/10">
                    <Image
                      src={achievement.imageUrl}
                      alt={achievement.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className={`w-full h-24 rounded-xl bg-gradient-to-br ${categoryConfig[achievement.category].bgColor} flex items-center justify-center`}>
                    {React.createElement(categoryConfig[achievement.category].icon, {
                      className: `w-8 h-8 ${categoryConfig[achievement.category].color}`
                    })}
                  </div>
                )}
                
                {/* Verification Badge */}
                {achievement.isVerified && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                {/* Header */}
                <div className="mb-3">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-accent transition-colors duration-300 line-clamp-2">
                      {achievement.title}
                    </h3>
                    <div className="flex items-center gap-1">
                      {[...Array(3)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (4 - achievement.importance)
                              ? 'text-yellow-400 fill-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-medium">{achievement.organization}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {formatDate(achievement.date)}
                    </span>
                    {achievement.location && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {achievement.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
                  {achievement.description}
                </p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {achievement.skills.slice(0, viewMode === 'list' ? 8 : 4).map((skill, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-md font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                  {achievement.skills.length > (viewMode === 'list' ? 8 : 4) && (
                    <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md">
                      +{achievement.skills.length - (viewMode === 'list' ? 8 : 4)} more
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex gap-2">
                    {achievement.certificateUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadCertificate(achievement)
                        }}
                        className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                        title="Download Certificate"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    )}
                    
                    {achievement.verificationUrl && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          window.open(achievement.verificationUrl, '_blank')
                        }}
                        className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors duration-200"
                        title="Verify Certificate"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        shareAchievement(achievement)
                      }}
                      className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors duration-200"
                      title="Share Achievement"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <span className={`text-xs font-medium ${getImportanceColor(achievement.importance)}`}>
                    {getImportanceLabel(achievement.importance)} Priority
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results Message */}
        {filteredAchievements.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Search className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              No achievements found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search criteria or filters
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('all')
              }}
              className="px-6 py-3 bg-accent text-white rounded-xl font-medium hover:bg-accent/90 transition-colors duration-200"
            >
              Clear Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Achievement Detail Modal */}
      <AnimatePresence>
        {selectedAchievement && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedAchievement(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setSelectedAchievement(null)}
                  className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
                
                <div className="flex items-start gap-4">
                  {/* Achievement Image/Icon */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-accent/10 to-accentone/10 flex-shrink-0">
                    {selectedAchievement.imageUrl ? (
                      <Image
                        src={selectedAchievement.imageUrl}
                        alt={selectedAchievement.title}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className={`w-full h-full ${categoryConfig[selectedAchievement.category].bgColor} flex items-center justify-center`}>
                        {React.createElement(categoryConfig[selectedAchievement.category].icon, {
                          className: `w-8 h-8 ${categoryConfig[selectedAchievement.category].color}`
                        })}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedAchievement.title}
                    </h2>
                    <p className="text-lg text-accent font-medium mb-1">
                      {selectedAchievement.organization}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {formatDate(selectedAchievement.date)}
                      </span>
                      {selectedAchievement.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {selectedAchievement.location}
                        </span>
                      )}
                      {selectedAchievement.isVerified && (
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                          <CheckCircle className="w-4 h-4" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Description
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {selectedAchievement.description}
                  </p>
                </div>

                {/* Additional Details */}
                {(selectedAchievement.grade || selectedAchievement.duration || selectedAchievement.expiryDate) && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {selectedAchievement.grade && (
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-2xl font-bold text-accent mb-1">
                            {selectedAchievement.grade}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Grade
                          </div>
                        </div>
                      )}
                      {selectedAchievement.duration && (
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                            <Clock className="w-4 h-4 inline mr-1" />
                            {selectedAchievement.duration}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Duration
                          </div>
                        </div>
                      )}
                      {selectedAchievement.expiryDate && (
                        <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                            {formatDate(selectedAchievement.expiryDate)}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Expires
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                    Skills & Technologies
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedAchievement.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-2 bg-accent/10 text-accent rounded-lg font-medium text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {selectedAchievement.certificateUrl && (
                    <button
                      onClick={() => downloadCertificate(selectedAchievement)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <Download className="w-4 h-4" />
                      Download Certificate
                    </button>
                  )}
                  
                  {selectedAchievement.verificationUrl && (
                    <button
                      onClick={() => window.open(selectedAchievement.verificationUrl, '_blank')}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors duration-200"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Verify Online
                    </button>
                  )}
                  
                  <button
                    onClick={() => shareAchievement(selectedAchievement)}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Share2 className="w-4 h-4" />
                    Share
                  </button>
                  
                  <button
                    onClick={() => printAchievement(selectedAchievement)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors duration-200"
                  >
                    <Print className="w-4 h-4" />
                    Print
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowShareModal(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Share Achievement
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Share &quot;{showShareModal.title}&quot; with others
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href + '?achievement=' + showShareModal.id)
                    setShowShareModal(null)
                  }}
                  className="w-full flex items-center gap-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  <Globe className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  Copy Link
                </button>
                
                <button
                  onClick={() => {
                    const text = `Check out my achievement: ${showShareModal.title} from ${showShareModal.organization}`
                    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href + '?achievement=' + showShareModal.id)}`
                    window.open(url, '_blank')
                    setShowShareModal(null)
                  }}
                  className="w-full flex items-center gap-3 p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors duration-200"
                >
                  <Share2 className="w-5 h-5" />
                  Share on Twitter
                </button>
              </div>
              
              <button
                onClick={() => setShowShareModal(null)}
                className="w-full mt-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
