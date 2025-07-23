'use client'

// Types
export interface InterviewProblem {
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

export interface PracticeSession {
  id: string
  problemId: string
  startTime: Date
  endTime?: Date
  timeSpent: number
  completed: boolean
  notes: string
}

// Storage keys
const INTERVIEW_PROBLEMS_KEY = 'interviewProblems'
const PRACTICE_SESSIONS_KEY = 'practiceSessions'

// Predefined options for forms
export const DIFFICULTY_OPTIONS = ['Easy', 'Medium', 'Hard']
export const TOPIC_OPTIONS = [
  'Arrays', 'Strings', 'Linked Lists', 'Trees', 'Graphs', 
  'Dynamic Programming', 'Greedy', 'Backtracking', 'Math',
  'Two Pointers', 'Sliding Window', 'Binary Search', 'Sorting',
  'Hash Tables', 'Stack', 'Queue', 'Heap', 'Trie'
]
export const COMPANY_OPTIONS = [
  'Google', 'Microsoft', 'Amazon', 'Apple', 'Facebook/Meta',
  'Netflix', 'Uber', 'Airbnb', 'LinkedIn', 'Twitter/X',
  'Spotify', 'Dropbox', 'Adobe', 'Salesforce', 'Oracle'
]

class InterviewProblemsAPI {
  // Load problems from localStorage and file system
  getProblems(): InterviewProblem[] {
    if (typeof window === 'undefined') return []
    
    try {
      // Try to load from localStorage first
      const stored = localStorage.getItem(INTERVIEW_PROBLEMS_KEY)
      if (stored) {
        const problems = JSON.parse(stored)
        // Convert date strings back to Date objects
        return problems.map((problem: any) => ({
          ...problem,
          lastAttempted: new Date(problem.lastAttempted),
          createdAt: new Date(problem.createdAt)
        }))
      }
      
      // If no localStorage data, try to load from file system
      this.loadFromFileSystem()
      return []
    } catch (error) {
      console.error('Error loading interview problems:', error)
      return []
    }
  }

  // Load problems from file system via API
  async loadFromFileSystem(): Promise<InterviewProblem[]> {
    try {
      const response = await fetch('/api/data?type=interview-problems')
      if (response.ok) {
        const data = await response.json()
        const problems = data.problems || []
        
        // Convert date strings back to Date objects and save to localStorage
        const processedProblems = problems.map((problem: any) => ({
          ...problem,
          lastAttempted: new Date(problem.lastAttempted),
          createdAt: new Date(problem.createdAt)
        }))
        
        // Save to localStorage for faster access
        if (processedProblems.length > 0) {
          localStorage.setItem(INTERVIEW_PROBLEMS_KEY, JSON.stringify(processedProblems))
        }
        
        return processedProblems
      }
    } catch (error) {
      console.warn('Failed to load from file system:', error)
    }
    return []
  }

  // Save problems to localStorage and file system
  saveProblems(problems: InterviewProblem[]): void {
    if (typeof window === 'undefined') return
    
    try {
      // Save to localStorage
      localStorage.setItem(INTERVIEW_PROBLEMS_KEY, JSON.stringify(problems))
      
      // Also save to file system via API (async, no await to avoid blocking)
      this.saveToFileSystem(problems).catch(error => {
        console.warn('Background file sync failed:', error)
      })
    } catch (error) {
      console.error('Error saving interview problems:', error)
    }
  }

  // Save problems to file system via API
  async saveToFileSystem(problems: InterviewProblem[]): Promise<void> {
    try {
      console.log('🔄 Syncing interview problems to file system...', problems.length, 'problems')
      
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'interview-problems',
          data: {
            problems: problems,
            lastUpdated: new Date().toISOString(),
            totalProblems: problems.length
          }
        })
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.warn('❌ Failed to save to file system:', response.status, response.statusText, errorText)
      } else {
        const result = await response.json()
        console.log('✅ Interview problems saved to file system:', result)
      }
    } catch (error) {
      console.warn('❌ Error saving to file system:', error)
    }
  }

  // Add a new problem
  addProblem(problemData: Omit<InterviewProblem, 'id' | 'timeSpent' | 'attempts' | 'solved' | 'lastAttempted' | 'createdAt'>): InterviewProblem {
    const newProblem: InterviewProblem = {
      id: Date.now().toString(),
      timeSpent: 0,
      attempts: 0,
      solved: false,
      lastAttempted: new Date(),
      createdAt: new Date(),
      ...problemData
    }

    const problems = this.getProblems()
    problems.push(newProblem)
    this.saveProblems(problems)
    
    return newProblem
  }

  // Update an existing problem
  updateProblem(problemId: string, updates: Partial<InterviewProblem>): void {
    const problems = this.getProblems()
    const index = problems.findIndex(p => p.id === problemId)
    
    if (index !== -1) {
      problems[index] = { ...problems[index], ...updates }
      this.saveProblems(problems)
    }
  }

  // Delete a problem
  deleteProblem(problemId: string): void {
    const problems = this.getProblems()
    const filteredProblems = problems.filter(p => p.id !== problemId)
    this.saveProblems(filteredProblems)
    
    // Also delete related practice sessions
    const sessions = this.getSessions()
    const filteredSessions = sessions.filter(s => s.problemId !== problemId)
    this.saveSessions(filteredSessions)
  }

  // Load practice sessions
  getSessions(): PracticeSession[] {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(PRACTICE_SESSIONS_KEY)
      if (!stored) return []
      
      const sessions = JSON.parse(stored)
      // Convert date strings back to Date objects
      return sessions.map((session: any) => ({
        ...session,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : undefined
      }))
    } catch (error) {
      console.error('Error loading practice sessions:', error)
      return []
    }
  }

  // Save practice sessions
  saveSessions(sessions: PracticeSession[]): void {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(PRACTICE_SESSIONS_KEY, JSON.stringify(sessions))
    } catch (error) {
      console.error('Error saving practice sessions:', error)
    }
  }

  // Add a new practice session
  addSession(sessionData: Omit<PracticeSession, 'id'>): PracticeSession {
    const newSession: PracticeSession = {
      id: Date.now().toString(),
      ...sessionData
    }

    const sessions = this.getSessions()
    sessions.push(newSession)
    this.saveSessions(sessions)
    
    return newSession
  }

  // Handle image upload (mock implementation - in real app would upload to server)
  async uploadImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result) // Return base64 data URL
        } else {
          reject(new Error('Failed to read file'))
        }
      }
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsDataURL(file)
    })
  }
}

// Export singleton instance
export const interviewProblemsAPI = new InterviewProblemsAPI()
