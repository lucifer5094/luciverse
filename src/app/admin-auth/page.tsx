'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { validatePassword, setAuthenticated, isAuthenticated as checkAuthenticated } from '@/utils/auth';
import { interviewProblemsAPI, InterviewProblem, DIFFICULTY_OPTIONS, TOPIC_OPTIONS, COMPANY_OPTIONS } from '@/utils/interviewProblemsAPI';
import { Eye, EyeOff, Lock, Shield, Plus, Search, Edit, Trash2 } from 'lucide-react';

export default function AdminAuthPage() {
  // All hooks must be called at the top level, before any conditional logic
  const [mounted, setMounted] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [interviewProblems, setInterviewProblems] = useState<InterviewProblem[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProblem, setEditingProblem] = useState<InterviewProblem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Check if already authenticated
    if (typeof window !== 'undefined') {
      const auth = checkAuthenticated()
      if (auth) {
        setIsAuthenticated(true)
        loadProblems()
      }
    }
  }, []);

  const loadProblems = () => {
    setInterviewProblems(interviewProblemsAPI.getProblems())
  }

  if (!mounted) return null;


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await validatePassword(password);

      if (result.success) {
        setAuthenticated(true);
        setIsAuthenticated(true);
        loadProblems();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If authenticated, show interview problems management
  if (isAuthenticated) {
    return <InterviewProblemsAdminView 
      problems={interviewProblems}
      onUpdateProblems={loadProblems}
      onLogout={() => {
        setAuthenticated(false);
        setIsAuthenticated(false);
        setInterviewProblems([]);
      }}
    />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
            <Shield className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Owner Access
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Enter your password to access the admin dashboard
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                required
                className="relative block w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:z-10 sm:text-sm"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                ) : (
                  <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 dark:bg-red-900/50 p-4">
              <div className="text-sm text-red-700 dark:text-red-200">
                {error}
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading || !password.trim()}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </div>
        </form>

        <div className="text-center">
          <a
            href="/"
            className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-500 dark:hover:text-purple-300"
          >
            ← Back to Homepage
          </a>
        </div>
      </div>
    </div>
  );
}

// Interview Problems Admin View Component
interface InterviewProblemsAdminViewProps {
  problems: InterviewProblem[]
  onUpdateProblems: () => void
  onLogout: () => void
}

function InterviewProblemsAdminView({ problems, onUpdateProblems, onLogout }: InterviewProblemsAdminViewProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProblem, setEditingProblem] = useState<InterviewProblem | null>(null)

  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.topic.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddProblem = async (problemData: Omit<InterviewProblem, 'id' | 'timeSpent' | 'attempts' | 'solved' | 'lastAttempted' | 'createdAt'>) => {
    try {
      interviewProblemsAPI.addProblem(problemData)
      onUpdateProblems()
      setShowAddForm(false)
      
      // Auto-sync to file system
      setTimeout(async () => {
        try {
          const problems = interviewProblemsAPI.getProblems()
          await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'interview-problems',
              data: { problems, lastUpdated: new Date().toISOString(), totalProblems: problems.length }
            })
          })
          console.log('Interview problems auto-synced to file system')
        } catch (error) {
          console.warn('Auto-sync failed:', error)
        }
      }, 500)
    } catch (error) {
      console.error('Failed to add problem:', error)
    }
  }

  const handleUpdateProblem = async (problemId: string, updates: Partial<InterviewProblem>) => {
    try {
      interviewProblemsAPI.updateProblem(problemId, updates)
      onUpdateProblems()
      setEditingProblem(null)
      
      // Auto-sync to file system
      setTimeout(async () => {
        try {
          const problems = interviewProblemsAPI.getProblems()
          await fetch('/api/data', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'interview-problems',
              data: { problems, lastUpdated: new Date().toISOString(), totalProblems: problems.length }
            })
          })
          console.log('Interview problems auto-synced to file system')
        } catch (error) {
          console.warn('Auto-sync failed:', error)
        }
      }, 500)
    } catch (error) {
      console.error('Failed to update problem:', error)
    }
  }

  const handleDeleteProblem = async (problemId: string) => {
    if (confirm('Are you sure you want to delete this problem?')) {
      try {
        interviewProblemsAPI.deleteProblem(problemId)
        onUpdateProblems()
        
        // Auto-sync to file system
        setTimeout(async () => {
          try {
            const problems = interviewProblemsAPI.getProblems()
            await fetch('/api/data', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                type: 'interview-problems',
                data: { problems, lastUpdated: new Date().toISOString(), totalProblems: problems.length }
              })
            })
            console.log('Interview problems auto-synced to file system')
          } catch (error) {
            console.warn('Auto-sync failed:', error)
          }
        }, 500)
      } catch (error) {
        console.error('Failed to delete problem:', error)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                🧠 Interview Problems Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage interview problems for the prep section
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Problem
              </button>
              <button
                onClick={onLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Search */}
          <div className="mt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search problems by title, description, or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="grid gap-6">
          {filteredProblems.map((problem) => (
            <div key={problem.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {problem.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs rounded font-medium ${
                      problem.difficulty === 'Easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      problem.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {problem.difficulty}
                    </span>
                    {problem.topic && (
                      <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">
                        {problem.topic}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-3">
                    {problem.description}
                  </p>

                  {problem.company && problem.company.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {problem.company.map((comp, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 rounded">
                          {comp}
                        </span>
                      ))}
                    </div>
                  )}

                  {problem.tags && problem.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {problem.tags.map((tag, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => setEditingProblem(problem)}
                    className="text-blue-500 hover:text-blue-700 p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProblem(problem.id)}
                    className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Show images if available */}
              <div className="mt-4 grid md:grid-cols-2 gap-4">
                {problem.questionImage && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Question Image:</p>
                    <img src={problem.questionImage} alt="Question" className="max-w-full h-auto rounded border" />
                  </div>
                )}
                {problem.solutionImage && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Solution Image:</p>
                    <img src={problem.solutionImage} alt="Solution" className="max-w-full h-auto rounded border" />
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredProblems.length === 0 && (
            <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
              <div className="text-6xl mb-4">🧠</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {searchTerm ? 'No problems found' : 'No problems yet'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm ? 'Try adjusting your search terms' : 'Add your first interview problem to get started'}
              </p>
            </div>
          )}
        </div>

        {/* Add/Edit Problem Modal */}
        {(showAddForm || editingProblem) && (
          <SimpleProblemEditor
            problem={editingProblem}
            onSave={editingProblem ? 
              (updates) => handleUpdateProblem(editingProblem.id, updates) :
              handleAddProblem
            }
            onCancel={() => {
              setShowAddForm(false)
              setEditingProblem(null)
            }}
          />
        )}
      </div>
    </div>
  )
}

// Simple Problem Editor Component
interface SimpleProblemEditorProps {
  problem?: InterviewProblem | null
  onSave: (problemData: any) => void
  onCancel: () => void
}

function SimpleProblemEditor({ problem, onSave, onCancel }: SimpleProblemEditorProps) {
  const [formData, setFormData] = useState({
    title: problem?.title || '',
    description: problem?.description || '',
    questionImage: problem?.questionImage || '',
    difficulty: problem?.difficulty || 'Medium',
    topic: problem?.topic || '',
    company: problem?.company?.join(', ') || '',
    solution: problem?.solution || '',
    solutionImage: problem?.solutionImage || '',
    notes: problem?.notes || '',
    tags: problem?.tags?.join(', ') || ''
  })

  const handleImageUpload = async (file: File, type: 'question' | 'solution') => {
    try {
      const imageDataUrl = await interviewProblemsAPI.uploadImage(file)
      if (type === 'question') {
        setFormData(prev => ({ ...prev, questionImage: imageDataUrl }))
      } else {
        setFormData(prev => ({ ...prev, solutionImage: imageDataUrl }))
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const problemData = {
      ...formData,
      company: formData.company.split(',').map(c => c.trim()).filter(Boolean),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    }

    onSave(problemData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          {problem ? 'Edit Problem' : 'Add New Problem'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Topic</label>
              <select
                value={formData.topic}
                onChange={(e) => setFormData(prev => ({ ...prev, topic: e.target.value }))}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                <option value="">Select Topic</option>
                {TOPIC_OPTIONS.map(topic => (
                  <option key={topic} value={topic}>{topic}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value as any }))}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              >
                {DIFFICULTY_OPTIONS.map(diff => (
                  <option key={diff} value={diff}>{diff}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Companies (comma separated)</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
                placeholder="Google, Microsoft, Amazon"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Question Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleImageUpload(file, 'question')
                }
              }}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            {formData.questionImage && (
              <img src={formData.questionImage} alt="Question" className="mt-2 max-w-xs h-auto rounded" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Solution</label>
            <textarea
              value={formData.solution}
              onChange={(e) => setFormData(prev => ({ ...prev, solution: e.target.value }))}
              rows={6}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white font-mono text-sm"
              placeholder="Solution code or explanation..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Solution Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  handleImageUpload(file, 'solution')
                }
              }}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
            />
            {formData.solutionImage && (
              <img src={formData.solutionImage} alt="Solution" className="mt-2 max-w-xs h-auto rounded" />
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="Additional notes, hints, or explanations..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">Tags (comma separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
              className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-gray-900 dark:text-white"
              placeholder="array, hashmap, recursion"
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {problem ? 'Update' : 'Add'} Problem
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
