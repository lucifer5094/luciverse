'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Plus, 
  Filter, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Clock, 
  BookOpen, 
  BarChart3, 
  Star, 
  Building, 
  Code, 
  Target,
  Timer,
  TrendingUp,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  Save,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useLocalStorage } from '@/hooks'
import { dataAPI } from '@/utils/dataAPI'

// Types
interface InterviewProblem {
  id: string
  title: string
  description: string
  questionImage?: string // Optional image for the question
  difficulty: 'Easy' | 'Medium' | 'Hard'
  topic: string
  company: string[]
  solution: string
  solutionImage?: string // Optional image for the solution
  notes: string
  timeSpent: number // in seconds
  attempts: number
  solved: boolean
  lastAttempted: Date
  createdAt: Date
  tags: string[]
}

interface PracticeSession {
  id: string
  problemId: string
  startTime: Date
  endTime?: Date
  timeSpent: number
  completed: boolean
  notes: string
}

interface FilterOptions {
  difficulty: string[]
  topic: string[]
  company: string[]
  solved: boolean | null
}

// Predefined options
const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard']
const TOPIC_OPTIONS = [
  'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 
  'Dynamic Programming', 'Greedy', 'Backtracking', 'Math',
  'Two Pointers', 'Sliding Window', 'Binary Search', 'Sorting',
  'Hash Tables', 'Stack', 'Queue', 'Heap', 'Trie'
]
const COMPANY_OPTIONS = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Facebook/Meta',
  'Netflix', 'Uber', 'Airbnb', 'LinkedIn', 'Twitter/X',
  'Spotify', 'Dropbox', 'Adobe', 'Salesforce', 'Oracle'
]

export default function InterviewPrepPage() {
  // State management
  const [problems, setProblems] = useLocalStorage<InterviewProblem[]>('interviewProblems', [])
  const [sessions, setSessions] = useLocalStorage<PracticeSession[]>('practiceSessions', [])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<FilterOptions>({
    difficulty: [],
    topic: [],
    company: [],
    solved: null
  })
  const [viewMode, setViewMode] = useLocalStorage<'grid' | 'list'>('interviewPrepViewMode', 'grid')
  const [sortBy, setSortBy] = useLocalStorage<string>('interviewPrepSortBy', 'createdAt')
  const [showFilters, setShowFilters] = useState(false)
  const [editingProblem, setEditingProblem] = useState<InterviewProblem | null>(null)
  const [selectedProblem, setSelectedProblem] = useState<InterviewProblem | null>(null)
  
  // Timer state
  const [activeTimer, setActiveTimer] = useState<string | null>(null)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (activeTimer && !isPaused) {
      interval = setInterval(() => {
        setTimerSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [activeTimer, isPaused])

  // Auto-load interview problems from file system on initial load
  useEffect(() => {
    const loadInterviewProblems = async () => {
      try {
        setLoading(true)
        console.log('Loading interview problems from file system...')
        const fileSystemProblems = await dataAPI.getInterviewProblems()
        
        if (fileSystemProblems && fileSystemProblems.length > 0) {
          // Convert date strings to Date objects if needed
          const processedProblems = fileSystemProblems.map((problem: any) => ({
            ...problem,
            lastAttempted: problem.lastAttempted ? new Date(problem.lastAttempted) : new Date(),
            createdAt: problem.createdAt ? new Date(problem.createdAt) : new Date()
          }))
          
          console.log(`Loaded ${processedProblems.length} interview problems from file system`)
          setProblems(processedProblems)
        } else {
          console.log('No interview problems found in file system')
        }
      } catch (error) {
        console.warn('Failed to load interview problems from file system:', error)
        // Fallback to localStorage data if file system fails
        console.log('Using localStorage data as fallback')
      } finally {
        setLoading(false)
      }
    }

    // Always try to load from file system first, regardless of localStorage state
    // This ensures data is refreshed on new hosts or after deployments
    loadInterviewProblems()
  }, []) // Empty dependency array to run only on mount

  // Auto-sync problems to file system when they change
  useEffect(() => {
    const syncToFileSystem = async () => {
      if (problems.length > 0) {
        try {
          console.log('Syncing interview problems to file system...')
          await dataAPI.updateInterviewProblems(problems)
          console.log('Interview problems synced successfully')
        } catch (error) {
          console.warn('Failed to sync interview problems to file system:', error)
        }
      }
    }

    // Debounce the sync to avoid too frequent saves
    const timeoutId = setTimeout(syncToFileSystem, 2000)
    return () => clearTimeout(timeoutId)
  }, [problems]) // Sync whenever problems change

  // Filter and sort problems
  const filteredProblems = useMemo(() => {
    let filtered = problems.filter(problem => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (!problem.title.toLowerCase().includes(query) &&
            !problem.description.toLowerCase().includes(query) &&
            !problem.topic.toLowerCase().includes(query) &&
            !problem.company.some(c => c.toLowerCase().includes(query)) &&
            !problem.tags.some(t => t.toLowerCase().includes(query))) {
          return false
        }
      }

      // Difficulty filter
      if (filters.difficulty.length > 0 && !filters.difficulty.includes(problem.difficulty)) {
        return false
      }

      // Topic filter
      if (filters.topic.length > 0 && !filters.topic.includes(problem.topic)) {
        return false
      }

      // Company filter
      if (filters.company.length > 0) {
        const hasCompany = problem.company.some(c => filters.company.includes(c))
        if (!hasCompany) return false
      }

      // Solved filter
      if (filters.solved !== null && problem.solved !== filters.solved) {
        return false
      }

      return true
    })

    // Sort problems
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title)
        case 'difficulty':
          const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case 'topic':
          return a.topic.localeCompare(b.topic)
        case 'attempts':
          return b.attempts - a.attempts
        case 'timeSpent':
          return b.timeSpent - a.timeSpent
        case 'lastAttempted':
          return new Date(b.lastAttempted).getTime() - new Date(a.lastAttempted).getTime()
        case 'createdAt':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

    return filtered
  }, [problems, searchQuery, filters, sortBy])

  // Helper function for calculating streak
  const calculateSolvedStreak = (problems: InterviewProblem[]) => {
    const sortedProblems = problems
      .filter(p => p.solved)
      .sort((a, b) => new Date(b.lastAttempted).getTime() - new Date(a.lastAttempted).getTime())
    
    let streak = 0
    const today = new Date()
    
    for (const problem of sortedProblems) {
      const problemDate = new Date(problem.lastAttempted)
      const daysDiff = Math.floor((today.getTime() - problemDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff <= streak + 1) {
        streak++
      } else {
        break
      }
    }
    
    return streak
  }

  // Statistics
  const stats = useMemo(() => {
    const total = problems.length
    const solved = problems.filter(p => p.solved).length
    const totalTime = problems.reduce((sum, p) => sum + p.timeSpent, 0)
    const averageTime = total > 0 ? totalTime / total : 0
    const recentStreak = calculateSolvedStreak(problems)
    
    const difficultyStats = DIFFICULTY_OPTIONS.map(diff => ({
      difficulty: diff,
      total: problems.filter(p => p.difficulty === diff).length,
      solved: problems.filter(p => p.difficulty === diff && p.solved).length
    }))

    const topicStats = TOPIC_OPTIONS.map(topic => ({
      topic,
      total: problems.filter(p => p.topic === topic).length,
      solved: problems.filter(p => p.topic === topic && p.solved).length
    })).filter(stat => stat.total > 0)

    return {
      total,
      solved,
      solvedPercentage: total > 0 ? Math.round((solved / total) * 100) : 0,
      totalTime,
      averageTime,
      recentStreak,
      difficultyStats,
      topicStats
    }
  }, [problems])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  const startTimer = (problemId: string) => {
    setActiveTimer(problemId)
    setTimerSeconds(0)
    setIsPaused(false)
  }

  const pauseTimer = () => {
    setIsPaused(!isPaused)
  }

  const stopTimer = () => {
    if (activeTimer) {
      // Update problem time spent
      setProblems(prev => prev.map(p => 
        p.id === activeTimer 
          ? { ...p, timeSpent: p.timeSpent + timerSeconds, attempts: p.attempts + 1, lastAttempted: new Date() }
          : p
      ))
      
      // Save session
      const newSession: PracticeSession = {
        id: Date.now().toString(),
        problemId: activeTimer,
        startTime: new Date(Date.now() - timerSeconds * 1000),
        endTime: new Date(),
        timeSpent: timerSeconds,
        completed: false,
        notes: ''
      }
      setSessions(prev => [...prev, newSession])
    }
    
    setActiveTimer(null)
    setTimerSeconds(0)
    setIsPaused(false)
  }

  const markAsSolved = (problemId: string) => {
    setProblems(prev => prev.map(p => 
      p.id === problemId ? { ...p, solved: true, lastAttempted: new Date() } : p
    ))
    if (activeTimer === problemId) {
      stopTimer()
    }
  }

  const deleteProblem = (problemId: string) => {
    setProblems(prev => prev.filter(p => p.id !== problemId))
    setSessions(prev => prev.filter(s => s.problemId !== problemId))
    if (activeTimer === problemId) {
      setActiveTimer(null)
      setTimerSeconds(0)
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400'
      case 'Medium': return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400'
      case 'Hard': return 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400'
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-lg">Loading interview problems...</p>
          </div>
        )}
        
        {/* Main Content */}
        {!loading && (
          <>
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-8"
            >
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                🚀 Interview Prep Hub
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Master your coding interviews with organized practice, tracking, and insights
              </p>
            </motion.div>

        {/* Statistics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
        >
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Problems</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.solved}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Solved</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.solvedPercentage}%</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{formatTime(Math.round(stats.averageTime))}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Time</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{stats.recentStreak}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Day Streak</div>
          </div>
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-4 text-center border border-gray-200/50 dark:border-gray-700/50">
            <div className="text-2xl font-bold text-pink-600 dark:text-pink-400">{formatTime(stats.totalTime)}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Time</div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search problems, topics, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200 ${
                  showFilters 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="createdAt">Newest First</option>
                <option value="title">Title A-Z</option>
                <option value="difficulty">Difficulty</option>
                <option value="topic">Topic</option>
                <option value="attempts">Most Attempted</option>
                <option value="timeSpent">Most Time Spent</option>
                <option value="lastAttempted">Recently Attempted</option>
              </select>

              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 shadow-sm'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                </button>
              </div>


            </div>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid md:grid-cols-4 gap-4">
                  {/* Difficulty Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Difficulty
                    </label>
                    <div className="space-y-1">
                      {DIFFICULTY_OPTIONS.map(difficulty => (
                        <label key={difficulty} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.difficulty.includes(difficulty)}
                            onChange={(e) => {
                              setFilters(prev => ({
                                ...prev,
                                difficulty: e.target.checked
                                  ? [...prev.difficulty, difficulty]
                                  : prev.difficulty.filter(d => d !== difficulty)
                              }))
                            }}
                            className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{difficulty}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Topic Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Topic
                    </label>
                    <select
                      multiple
                      value={filters.topic}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value)
                        setFilters(prev => ({ ...prev, topic: values }))
                      }}
                      className="w-full h-20 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {TOPIC_OPTIONS.map(topic => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>

                  {/* Company Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company
                    </label>
                    <select
                      multiple
                      value={filters.company}
                      onChange={(e) => {
                        const values = Array.from(e.target.selectedOptions, option => option.value)
                        setFilters(prev => ({ ...prev, company: values }))
                      }}
                      className="w-full h-20 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {COMPANY_OPTIONS.map(company => (
                        <option key={company} value={company}>{company}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <div className="space-y-1">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="solved"
                          checked={filters.solved === null}
                          onChange={() => setFilters(prev => ({ ...prev, solved: null }))}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">All</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="solved"
                          checked={filters.solved === true}
                          onChange={() => setFilters(prev => ({ ...prev, solved: true }))}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Solved</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="solved"
                          checked={filters.solved === false}
                          onChange={() => setFilters(prev => ({ ...prev, solved: false }))}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700 dark:text-gray-300">Unsolved</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => setFilters({ difficulty: [], topic: [], company: [], solved: null })}
                    className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Clear All Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Problems Grid/List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filteredProblems.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No problems found
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mb-4">
                {problems.length === 0 
                  ? "Problems will be added by administrators. Check back soon!"
                  : "Try adjusting your filters or search query."
                }
              </p>
            </div>
          ) : (
            <div className={
              viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }>
              <AnimatePresence>
                {filteredProblems.map((problem, index) => (
                  <motion.div
                    key={problem.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.05 }}
                    className={`bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-200 group ${
                      viewMode === 'list' ? 'flex items-center p-4' : 'p-6'
                    }`}
                  >
                    {/* Card Content */}
                    <div className={viewMode === 'list' ? 'flex-1' : 'mb-4'}>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2">
                            {problem.title}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(problem.difficulty)}`}>
                              {problem.difficulty}
                            </span>
                            {problem.topic && (
                              <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                {problem.topic}
                              </span>
                            )}
                            {problem.solved && (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                        </div>
                      </div>

                      {viewMode === 'grid' && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                          {problem.description}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTime(problem.timeSpent)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-3 h-3" />
                            {problem.attempts} attempts
                          </span>
                        </div>
                        {problem.company.length > 0 && (
                          <span className="flex items-center gap-1">
                            <Building className="w-3 h-3" />
                            {problem.company.slice(0, 2).join(', ')}
                            {problem.company.length > 2 && ' +' + (problem.company.length - 2)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Timer and Actions */}
                    <div className={`flex items-center gap-2 ${viewMode === 'list' ? 'ml-4' : 'mt-4 pt-4 border-t border-gray-200 dark:border-gray-700'}`}>
                      {activeTimer === problem.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-mono font-semibold text-blue-600 dark:text-blue-400">
                            {formatTime(timerSeconds)}
                          </span>
                          <button
                            onClick={pauseTimer}
                            className="p-1 text-orange-500 hover:text-orange-600 transition-colors"
                            title={isPaused ? "Resume" : "Pause"}
                          >
                            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={stopTimer}
                            className="p-1 text-red-500 hover:text-red-600 transition-colors"
                            title="Stop Timer"
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startTimer(problem.id)}
                          className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1"
                        >
                          <Timer className="w-3 h-3" />
                          Start Timer
                        </button>
                      )}

                      {!problem.solved && (
                        <button
                          onClick={() => markAsSolved(problem.id)}
                          className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors flex items-center gap-1"
                        >
                          <CheckCircle className="w-3 h-3" />
                          Mark Solved
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedProblem(problem)}
                        className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Problem Details Modal */}
        <AnimatePresence>
          {selectedProblem && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProblem.title}</h2>
                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${getDifficultyColor(selectedProblem.difficulty)}`}>
                      {selectedProblem.difficulty}
                    </span>
                    {selectedProblem.solved && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedProblem(null)}
                    className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Problem Description</h3>
                      <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedProblem.description}</p>
                      </div>
                    </div>

                    {selectedProblem.questionImage && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Question Image</h3>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                          <img 
                            src={selectedProblem.questionImage} 
                            alt="Question" 
                            className="max-w-full h-auto rounded border shadow-sm"
                          />
                        </div>
                      </div>
                    )}

                    {selectedProblem.solution && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Solution</h3>
                        <div className="p-4 bg-gray-900 rounded-lg overflow-x-auto">
                          <pre className="text-green-400 text-sm whitespace-pre-wrap">{selectedProblem.solution}</pre>
                        </div>
                      </div>
                    )}

                    {selectedProblem.solutionImage && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Solution Image</h3>
                        <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                          <img 
                            src={selectedProblem.solutionImage} 
                            alt="Solution" 
                            className="max-w-full h-auto rounded border shadow-sm"
                          />
                        </div>
                      </div>
                    )}

                    {selectedProblem.notes && (
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Notes</h3>
                        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{selectedProblem.notes}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Problem Stats</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Time Spent:</span>
                          <span className="font-medium">{formatTime(selectedProblem.timeSpent)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Attempts:</span>
                          <span className="font-medium">{selectedProblem.attempts}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Status:</span>
                          <span className={`font-medium ${selectedProblem.solved ? 'text-green-600' : 'text-orange-600'}`}>
                            {selectedProblem.solved ? 'Solved' : 'Not Solved'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Last Attempted:</span>
                          <span className="font-medium text-sm">
                            {new Date(selectedProblem.lastAttempted).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {selectedProblem.topic && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Topic</h3>
                        <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm">
                          {selectedProblem.topic}
                        </span>
                      </div>
                    )}

                    {selectedProblem.company.length > 0 && (
                      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Companies</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProblem.company.map(company => (
                            <span key={company} className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded text-sm">
                              {company}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedProblem.tags.length > 0 && (
                      <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedProblem.tags.map(tag => (
                            <span key={tag} className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded text-sm">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col gap-3">
                      {!selectedProblem.solved && (
                        <button
                          onClick={() => {
                            markAsSolved(selectedProblem.id)
                            setSelectedProblem(prev => prev ? { ...prev, solved: true } : null)
                          }}
                          className="w-full px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Mark as Solved
                        </button>
                      )}
                      
                      {activeTimer !== selectedProblem.id && (
                        <button
                          onClick={() => {
                            startTimer(selectedProblem.id)
                            setSelectedProblem(null)
                          }}
                          className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center justify-center gap-2"
                        >
                          <Timer className="w-4 h-4" />
                          Start Practice Timer
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        </>
        )}
      </div>
    </div>
  )
}
