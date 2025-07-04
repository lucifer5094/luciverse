'use client'

import React, { useState, useMemo } from 'react'
import { Calendar, Clock, Code, BookOpen, Lightbulb, Star, Filter, Plus, X, Save } from 'lucide-react'
import InlineEdit from '@/components/InlineEdit'

// Types for timeline entries
interface TimelineEntry {
  id: string
  date: string
  topic: string
  description: string
  category: 'learning' | 'building' | 'growth' | 'project'
  tags: string[]
  importance: 1 | 2 | 3 // 1 = low, 2 = medium, 3 = high
}

// Sample data - you can replace this with real data
const sampleEntries: TimelineEntry[] = [
  {
    id: '1',
    date: '2025-06-15',
    topic: 'Graph Algorithms',
    description: 'Learned Graph Algorithms, added XYZ project with pathfinding visualization',
    category: 'learning',
    tags: ['algorithms', 'graphs', 'visualization'],
    importance: 3
  },
  {
    id: '2',
    date: '2025-05-20',
    topic: 'Suno-style Music Generation',
    description: 'Experimented with Suno-style music generation using AI models',
    category: 'building',
    tags: ['ai', 'music', 'generation', 'ml'],
    importance: 2
  },
  {
    id: '3',
    date: '2025-06-01',
    topic: 'React Performance Optimization',
    description: 'Deep dive into React performance patterns, memoization, and lazy loading',
    category: 'learning',
    tags: ['react', 'performance', 'optimization'],
    importance: 2
  },
  {
    id: '4',
    date: '2025-05-05',
    topic: 'Portfolio Website',
    description: 'Built and deployed personal portfolio with Next.js and Tailwind CSS',
    category: 'project',
    tags: ['nextjs', 'tailwind', 'portfolio'],
    importance: 3
  },
  {
    id: '5',
    date: '2025-04-28',
    topic: 'TypeScript Advanced Types',
    description: 'Mastered conditional types, mapped types, and utility types in TypeScript',
    category: 'learning',
    tags: ['typescript', 'types', 'advanced'],
    importance: 2
  }
]

// Generate heatmap data based on timeline entries
function generateHeatmapData(entries: TimelineEntry[]) {
  const data: { [key: string]: number } = {}
  
  entries.forEach(entry => {
    const date = entry.date
    data[date] = (data[date] || 0) + entry.importance
  })
  
  return data
}

// Heatmap component
function GitHubStyleHeatmap({ data }: { data: { [key: string]: number } }) {
  const today = new Date()
  const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate())
  
  const weeks = []
  const currentDate = new Date(yearAgo)
  
  // Generate weeks for the past year
  while (currentDate <= today) {
    const week = []
    for (let i = 0; i < 7; i++) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const intensity = data[dateStr] || 0
      week.push({
        date: dateStr,
        intensity,
        display: currentDate.toLocaleDateString()
      })
      currentDate.setDate(currentDate.getDate() + 1)
    }
    weeks.push(week)
  }

  const getIntensityColor = (intensity: number) => {
    if (intensity === 0) return 'bg-gray-100 dark:bg-gray-800'
    if (intensity <= 2) return 'bg-green-200 dark:bg-green-900'
    if (intensity <= 4) return 'bg-green-400 dark:bg-green-700'
    if (intensity <= 6) return 'bg-green-600 dark:bg-green-500'
    return 'bg-green-800 dark:bg-green-300'
  }

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Calendar className="w-5 h-5" />
        Activity Heatmap
      </h3>
      <div className="flex gap-1 overflow-x-auto pb-4">
        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} className="flex flex-col gap-1">
            {week.map((day, dayIndex) => (
              <div
                key={day.date}
                className={`w-3 h-3 rounded-sm ${getIntensityColor(day.intensity)} 
                           hover:ring-2 hover:ring-blue-400 transition-all cursor-pointer`}
                title={`${day.display}: ${day.intensity} activities`}
              />
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-4">
        <span>Less</span>
        <div className="flex gap-1">
          <div className="w-3 h-3 bg-gray-100 dark:bg-gray-800 rounded-sm" />
          <div className="w-3 h-3 bg-green-200 dark:bg-green-900 rounded-sm" />
          <div className="w-3 h-3 bg-green-400 dark:bg-green-700 rounded-sm" />
          <div className="w-3 h-3 bg-green-600 dark:bg-green-500 rounded-sm" />
          <div className="w-3 h-3 bg-green-800 dark:bg-green-300 rounded-sm" />
        </div>
        <span>More</span>
      </div>
    </div>
  )
}

// Timeline card component
function TimelineCard({ entry }: { entry: TimelineEntry }) {
  const categoryIcons = {
    learning: BookOpen,
    building: Code,
    growth: Lightbulb,
    project: Star
  }
  
  const categoryColors = {
    learning: 'bg-blue-100 dark:bg-blue-900 border-blue-300 dark:border-blue-700',
    building: 'bg-purple-100 dark:bg-purple-900 border-purple-300 dark:border-purple-700',
    growth: 'bg-yellow-100 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700',
    project: 'bg-green-100 dark:bg-green-900 border-green-300 dark:border-green-700'
  }
  
  const Icon = categoryIcons[entry.category]
  const formattedDate = new Date(entry.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
  
  return (
    <div className={`p-6 rounded-lg border-2 ${categoryColors[entry.category]} 
                     hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5" />
          <span className="text-sm font-medium capitalize text-gray-600 dark:text-gray-400">
            {entry.category}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {[...Array(entry.importance)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
        {entry.topic}
      </h3>
      
      <p className="text-gray-700 dark:text-gray-300 mb-4">
        {entry.description}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
          <Clock className="w-4 h-4" />
          {formattedDate}
        </div>
        
        <div className="flex flex-wrap gap-1">
          {entry.tags.map(tag => (
            <span key={tag} 
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 
                           text-gray-700 dark:text-gray-300 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

// Add Entry Modal Component
function AddEntryModal({ isOpen, onClose, onAdd }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAdd: (entry: Omit<TimelineEntry, 'id'>) => void; 
}) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    topic: '',
    description: '',
    category: 'learning' as TimelineEntry['category'],
    tags: '',
    importance: 2 as TimelineEntry['importance']
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.topic.trim() || !formData.description.trim()) {
      alert('Please fill in all required fields')
      return
    }

    const tagsArray = formData.tags
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0)

    onAdd({
      date: formData.date,
      topic: formData.topic.trim(),
      description: formData.description.trim(),
      category: formData.category,
      tags: tagsArray,
      importance: formData.importance
    })

    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      topic: '',
      description: '',
      category: 'learning',
      tags: '',
      importance: 2
    })

    onClose()
  }

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Entry</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Topic */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Topic *
            </label>
            <input
              type="text"
              value={formData.topic}
              onChange={(e) => handleChange('topic', e.target.value)}
              placeholder="e.g., Graph Algorithms, React Performance, etc."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Describe what you learned, built, or accomplished..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="learning">📚 Learning</option>
              <option value="building">🔨 Building</option>
              <option value="growth">💡 Growth</option>
              <option value="project">⭐ Project</option>
            </select>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleChange('tags', e.target.value)}
              placeholder="Separate tags with commas (e.g., react, typescript, api)"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Importance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Importance Level
            </label>
            <div className="flex gap-4">
              {[1, 2, 3].map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="importance"
                    value={level}
                    checked={formData.importance === level}
                    onChange={(e) => handleChange('importance', parseInt(e.target.value))}
                    className="text-blue-600"
                  />
                  <span className="flex items-center gap-1">
                    {[...Array(level)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {level === 1 ? 'Low' : level === 2 ? 'Medium' : 'High'}
                    </span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md 
                       transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Entry
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 
                       rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function LogsPage() {
  // Editable content state
  const [pageTitle, setPageTitle] = useState('📆 Work Logs & Timeline')
  const [pageDescription, setPageDescription] = useState('Time-wise track of your learning, building & growth journey')
  
  const [entries, setEntries] = useState<TimelineEntry[]>(sampleEntries)
  const [filter, setFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'date' | 'importance'>('date')
  const [isModalOpen, setIsModalOpen] = useState(false)
  
  const heatmapData = useMemo(() => generateHeatmapData(entries), [entries])
  
  const addNewEntry = (newEntryData: Omit<TimelineEntry, 'id'>) => {
    const newEntry: TimelineEntry = {
      ...newEntryData,
      id: Date.now().toString() // Simple ID generation
    }
    setEntries(prev => [newEntry, ...prev])
  }
  
  const filteredAndSortedEntries = useMemo(() => {
    let filtered = entries
    
    if (filter !== 'all') {
      filtered = entries.filter(entry => entry.category === filter)
    }
    
    return filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      } else {
        return b.importance - a.importance
      }
    })
  }, [entries, filter, sortBy])
  
  const stats = useMemo(() => {
    const categoryStats = entries.reduce((acc, entry) => {
      acc[entry.category] = (acc[entry.category] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return {
      total: entries.length,
      categories: categoryStats,
      totalImportance: entries.reduce((sum, entry) => sum + entry.importance, 0)
    }
  }, [entries])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            <InlineEdit
              type="text"
              value={pageTitle}
              onSave={setPageTitle}
              placeholder="Enter page title..."
              inline={true}
            >
              📆 Work Logs & Timeline
            </InlineEdit>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            <InlineEdit
              type="textarea"
              value={pageDescription}
              onSave={setPageDescription}
              placeholder="Enter page description..."
              maxLength={200}
              inline={true}
            >
              Time-wise track of your learning, building & growth journey
            </InlineEdit>
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Total Entries</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Learning</h3>
            <p className="text-3xl font-bold text-green-600">{stats.categories.learning || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Building</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.categories.building || 0}</p>
          </div>
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Projects</h3>
            <p className="text-3xl font-bold text-yellow-600">{stats.categories.project || 0}</p>
          </div>
        </div>

        {/* GitHub-style Heatmap */}
        <div className="mb-8">
          <GitHubStyleHeatmap data={heatmapData} />
        </div>

        {/* Filters and Controls */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                <label className="font-medium">Filter by category:</label>
              </div>
              <select 
                value={filter} 
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="all">All Categories</option>
                <option value="learning">Learning</option>
                <option value="building">Building</option>
                <option value="growth">Growth</option>
                <option value="project">Projects</option>
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <label className="font-medium">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as 'date' | 'importance')}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="date">Date (Newest First)</option>
                <option value="importance">Importance</option>
              </select>
            </div>
          </div>
        </div>

        {/* Timeline Cards */}
        <div className="space-y-6">
          {filteredAndSortedEntries.map((entry) => (
            <TimelineCard key={entry.id} entry={entry} />
          ))}
        </div>

        {filteredAndSortedEntries.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-gray-500 dark:text-gray-400">
              No entries found for the selected filter.
            </p>
          </div>
        )}

        {/* Add Entry Button */}
        <div className="text-center mt-12">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg 
                       transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            Add New Entry
          </button>
        </div>

        {/* Add Entry Modal */}
        <AddEntryModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAdd={addNewEntry}
        />
      </div>
    </div>
  )
}