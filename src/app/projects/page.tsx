'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, Variants } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import InlineEdit from '@/components/InlineEdit'
import { dataAPI } from '@/utils/dataAPI'

// Types
interface Project {
  id: string
  title: string
  description: string
  longDescription: string
  image: string
  stack: string[]
  category: 'AI/ML' | 'Web Dev' | 'Hardware' | 'College'
  status: 'completed' | 'ongoing' | 'notable'
  githubUrl?: string
  liveUrl?: string
  demoUrl?: string
  tags: string[]
}

// Sample projects data - you can replace this with your actual projects
const projects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Portfolio Website',
    description: 'Personal portfolio with AI-enhanced features and modern design',
    longDescription: 'A modern portfolio website built with Next.js, featuring AI-powered content generation, dynamic animations, and responsive design.',
    image: '/next.svg', // Replace with actual project images
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    category: 'Web Dev',
    status: 'completed',
    githubUrl: 'https://github.com/yourusername/portfolio',
    liveUrl: 'https://yourportfolio.com',
    tags: ['react', 'typescript', 'portfolio', 'ai']
  },
  {
    id: '2',
    title: 'Machine Learning Classifier',
    description: 'Advanced ML model for image classification with 95% accuracy',
    longDescription: 'Deep learning model using TensorFlow and Python for multi-class image classification with data augmentation and transfer learning.',
    image: '/next.svg',
    stack: ['Python', 'TensorFlow', 'Keras', 'OpenCV'],
    category: 'AI/ML',
    status: 'completed',
    githubUrl: 'https://github.com/yourusername/ml-classifier',
    tags: ['machine-learning', 'python', 'tensorflow', 'computer-vision']
  },
  {
    id: '3',
    title: 'IoT Smart Home System',
    description: 'Arduino-based home automation with mobile control',
    longDescription: 'Complete smart home solution using Arduino, sensors, and mobile app for controlling lights, temperature, and security systems.',
    image: '/next.svg',
    stack: ['Arduino', 'C++', 'React Native', 'Firebase'],
    category: 'Hardware',
    status: 'ongoing',
    githubUrl: 'https://github.com/yourusername/smart-home',
    tags: ['iot', 'arduino', 'automation', 'mobile']
  },
  {
    id: '4',
    title: 'College Management System',
    description: 'Full-stack web application for academic administration',
    longDescription: 'Comprehensive college management system with student portal, faculty dashboard, and administrative tools built with MERN stack.',
    image: '/next.svg',
    stack: ['MongoDB', 'Express.js', 'React', 'Node.js'],
    category: 'College',
    status: 'completed',
    githubUrl: 'https://github.com/yourusername/college-management',
    liveUrl: 'https://college-system.com',
    tags: ['fullstack', 'mern', 'database', 'web-app']
  },
  {
    id: '5',
    title: 'Neural Network Visualization',
    description: 'Interactive tool for visualizing neural network architectures',
    longDescription: 'Web-based tool for creating, visualizing, and training neural networks with real-time performance metrics.',
    image: '/next.svg',
    stack: ['Python', 'D3.js', 'Flask', 'PyTorch'],
    category: 'AI/ML',
    status: 'ongoing',
    githubUrl: 'https://github.com/yourusername/nn-visualizer',
    demoUrl: 'https://nn-viz-demo.com',
    tags: ['neural-networks', 'visualization', 'pytorch', 'web']
  },
  {
    id: '6',
    title: 'E-commerce Platform',
    description: 'Modern e-commerce solution with payment integration',
    longDescription: 'Full-featured e-commerce platform with user authentication, product management, cart functionality, and secure payment processing.',
    image: '/next.svg',
    stack: ['Next.js', 'PostgreSQL', 'Stripe', 'Prisma'],
    category: 'Web Dev',
    status: 'notable',
    githubUrl: 'https://github.com/yourusername/ecommerce',
    liveUrl: 'https://your-ecommerce.com',
    tags: ['ecommerce', 'nextjs', 'database', 'payments']
  }
]

const categories = ['All', 'AI/ML', 'Web Dev', 'Hardware', 'College'] as const
const statuses = ['All', 'completed', 'ongoing', 'notable'] as const

export default function ProjectsPage() {
  // Editable content state - loaded from JSON
  const [pageTitle, setPageTitle] = useState('All Projects')
  const [pageSubtitle, setPageSubtitle] = useState('Showcasing innovative solutions and creative experiments')
  const [pageDescription, setPageDescription] = useState('Explore my portfolio of projects spanning AI/ML, web development, and experimental technologies. Each project represents a unique challenge and learning opportunity.')
  const [loading, setLoading] = useState(true)
  
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [searchQuery, setSearchQuery] = useState('')

  // Load content from JSON file
  useEffect(() => {
    loadSiteContent()
  }, [])

  const loadSiteContent = async () => {
    try {
      setLoading(true)
      const content = await dataAPI.getSiteContent()
      setPageTitle(content.projectsTitle)
      setPageSubtitle(content.projectsSubtitle)
      setPageDescription(content.projectsDescription)
    } catch (error) {
      console.error('Failed to load site content:', error)
      // Keep default values if loading fails
    } finally {
      setLoading(false)
    }
  }

  const handleSaveTitle = async (newTitle: string) => {
    try {
      const currentContent = await dataAPI.getSiteContent()
      await dataAPI.updateSiteContent({
        ...currentContent,
        projectsTitle: newTitle
      })
      setPageTitle(newTitle)
    } catch (error) {
      console.error('Failed to save projects title:', error)
    }
  }

  const handleSaveSubtitle = async (newSubtitle: string) => {
    try {
      const currentContent = await dataAPI.getSiteContent()
      await dataAPI.updateSiteContent({
        ...currentContent,
        projectsSubtitle: newSubtitle
      })
      setPageSubtitle(newSubtitle)
    } catch (error) {
      console.error('Failed to save projects subtitle:', error)
    }
  }

  const handleSaveDescription = async (newDescription: string) => {
    try {
      const currentContent = await dataAPI.getSiteContent()
      await dataAPI.updateSiteContent({
        ...currentContent,
        projectsDescription: newDescription
      })
      setPageDescription(newDescription)
    } catch (error) {
      console.error('Failed to save projects description:', error)
    }
  }

  // Filter projects based on selected filters and search query
  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const categoryMatch = selectedCategory === 'All' || project.category === selectedCategory
      const statusMatch = selectedStatus === 'All' || project.status === selectedStatus
      const searchMatch = searchQuery === '' || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.stack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase())) ||
        project.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      
      return categoryMatch && statusMatch && searchMatch
    })
  }, [selectedCategory, selectedStatus, searchQuery])

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
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
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.02,
      y: -5,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500'
      case 'ongoing': return 'bg-yellow-500'
      case 'notable': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'ongoing': return 'In Progress'
      case 'notable': return 'Notable Work'
      default: return status
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-accent to-accentone bg-clip-text text-transparent">
            <InlineEdit
              type="text"
              value={pageTitle}
              onSave={handleSaveTitle}
              placeholder="Enter page title..."
              inline={true}
            >
              {pageTitle}
            </InlineEdit>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-4">
            <InlineEdit
              type="text"
              value={pageSubtitle}
              onSave={handleSaveSubtitle}
              placeholder="Enter page subtitle..."
              inline={true}
            >
              {pageSubtitle}
            </InlineEdit>
          </p>
          <p className="text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            <InlineEdit
              type="textarea"
              value={pageDescription}
              onSave={handleSaveDescription}
              placeholder="Enter page description..."
              maxLength={300}
            >
              {pageDescription}
            </InlineEdit>
          </p>
        </motion.div>

        {/* Search and Filters Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12 space-y-6"
        >
          {/* Search Bar */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search projects, technologies, or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-surface text-light-text dark:text-dark-text focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 self-center mr-2">Category:</span>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-accent text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm font-medium text-gray-600 dark:text-gray-300 self-center mr-2">Status:</span>
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    selectedStatus === status
                      ? 'bg-accentone text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {status === 'All' ? 'All Status' : getStatusText(status)}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mb-8"
        >
          <p className="text-gray-600 dark:text-gray-300">
            Showing <span className="font-semibold text-accent">{filteredProjects.length}</span> projects
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              variants={cardVariants}
              whileHover="hover"
              className="bg-white dark:bg-dark-surface rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-200 dark:border-gray-700"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-accent/20 to-accentone/20">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(project.status)}`}>
                    {getStatusText(project.status)}
                  </span>
                </div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-dark-background/90 text-gray-800 dark:text-gray-200">
                    {project.category}
                  </span>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {project.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {project.stack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.stack.length > 4 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs font-medium">
                        +{project.stack.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Project Links */}
                <div className="flex gap-3">
                  {project.githubUrl && (
                    <Link
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-gray-900 dark:bg-gray-700 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-300 text-sm font-medium"
                    >
                      GitHub
                    </Link>
                  )}
                  {project.liveUrl && (
                    <Link
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-accent text-white text-center py-2 px-4 rounded-lg hover:bg-accent/90 transition-colors duration-300 text-sm font-medium"
                    >
                      Live Demo
                    </Link>
                  )}
                  {project.demoUrl && !project.liveUrl && (
                    <Link
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-accentone text-white text-center py-2 px-4 rounded-lg hover:bg-accentone/90 transition-colors duration-300 text-sm font-medium"
                    >
                      Demo
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* No Results Message */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No projects found</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Try adjusting your search criteria or filters to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedCategory('All')
                setSelectedStatus('All')
              }}
              className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors duration-300 font-medium"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mt-16"
        >
          <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
            Interested in collaborating?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            I&apos;m always open to discussing new opportunities, innovative projects, and creative collaborations.
          </p>
          <Link
            href="/contact"
            className="bg-gradient-to-r from-accent to-accentone text-white px-8 py-3 rounded-lg hover:scale-105 transition-all duration-300 font-medium inline-block"
          >
            Get In Touch
          </Link>
        </motion.div>
      </div>
    </div>
  )
}