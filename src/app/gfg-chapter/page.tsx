'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { 
  Users, 
  Calendar, 
  Trophy, 
  Code, 
  BookOpen, 
  Star, 
  ChevronRight,
  ExternalLink,
  Mail,
  Instagram,
  Linkedin,
  Github,
  Target,
  Heart,
  Award,
  Lightbulb,
  Zap,
  Rocket,
  Globe,
  Play,
  Download,
  UserPlus,
  Clock,
  MapPin,
  Archive,
  MessageCircle
} from 'lucide-react'

// Types for GFG Campus Body data
interface TeamMember {
  id: string
  name: string
  role: string
  image?: string
  linkedin?: string
  github?: string
  email?: string
  instagram?: string
  description: string
  achievements?: string[]
  responsibilities?: string[]
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  venue: string
  type: 'workshop' | 'contest' | 'hackathon' | 'lecture' | 'meetup'
  status: 'upcoming' | 'completed'
  registrationLink?: string
  images?: string[]
  participants?: number
  expectedParticipants?: number
  prerequisites?: string
  highlights?: string[]
  duration?: string
  outcome?: string
  teams?: number
  prizes?: string
  sponsors?: string[]
  winners?: Array<{ position: number; team: string; project: string }>
  speaker?: {
    name: string
    designation: string
    experience: string
  }
}

interface Achievement {
  id: string
  title: string
  description: string
  date: string
  type: 'hackathon' | 'contest' | 'project' | 'recognition'
  members?: string[]
  awardedBy?: string
  significance?: string
  media?: string
  impact?: string
  partners?: string[]
  project?: string
  achievement?: string
  milestone?: string
  timeframe?: string
  companies?: string[]
  placements?: string
  internships?: string
  contests?: string[]
}

interface Partnership {
  name: string
  type: string
  established: string
}

interface Testimonial {
  name: string
  role: string
  company?: string
  achievement?: string
  message: string
  rating: number
}

interface GFGChapterData {
  about: {
    tagline: string
    shortIntro: string
    vision: string
    mission: string
    history: string
    chapterEstablished: string
    collegePartnership: string
    officialRecognition: string
    whatWeDo: string[]
  }
  team: TeamMember[]
  events: Event[]
  achievements: Achievement[]
  resources: {
    title: string
    description: string
    link: string
    type: 'article' | 'roadmap' | 'practice' | 'tool'
    language?: string
    difficulty?: string
    estimatedTime?: string
    problems?: string
    companies?: string
    topics?: string[]
    level?: string
    focus?: string
    audience?: string
    features?: string[]
    free?: boolean
    stack?: string
    duration?: string
    projects?: string
    platforms?: string
    frameworks?: string[]
    tools?: string[]
    skills?: string[]
    resources?: string[]
    custom?: boolean
  }[]
  contact: {
    email: string
    chapterEmail: string
    joinFormLink: string
    whatsappGroup: string
    discordServer: string
    socialMedia: {
      instagram: string
      linkedin: string
      twitter?: string
      youtube?: string
      github?: string
      discord?: string
      whatsapp?: string
    }
    meetingSchedule: {
      weeklyMeetings: string
      location: string
      onlineMeetings: string
      officeHours: string
    }
    mentorship: {
      signupLink: string
      description: string
      duration: string
      areas: string[]
    }
  }
  stats: {
    totalMembers: number
    eventsHosted: number
    workshopsCompleted: number
    activeProjects: number
    industryConnections: number
    placementAssistance: number
    mentorshipPairs: number
    competitionWinners: number
    monthlyGrowth: string
    averageAttendance: string
  }
  upcomingInitiatives: Array<{
    title: string
    description: string
    timeline: string
    expectedImpact: string
    partners?: string[]
    scope?: string
  }>
  partnerships: {
    industryPartners: Partnership[]
    academicPartners: Partnership[]
  }
  testimonials: Testimonial[]
}

export default function GFGChapterPage() {
  const [chapterData, setChapterData] = useState<GFGChapterData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('about')
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const isHeroInView = useInView(heroRef, { once: true })
  const isStatsInView = useInView(statsRef, { once: true })

  useEffect(() => {
    loadChapterData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadChapterData = async () => {
    try {
      setLoading(true)
      // In a real implementation, this would load from your API
      // For now, using default data
      const data = getDefaultChapterData()
      setChapterData(data)
    } catch (error) {
      console.error('Failed to load GFG campus body data:', error)
      setChapterData(getDefaultChapterData())
    } finally {
      setLoading(false)
    }
  }

  const getDefaultChapterData = (): GFGChapterData => ({
    about: {
      tagline: "Learn to Code, Grow Together, Conquer the Future! 🚀",
      shortIntro: "We are the official campus body of GFG, helping students develop coding skills, prepare for competitions, and connect with the tech world. Our mission at GfG Campus Body - GITAM, Jhajjar is to make every student industry-ready.",
      vision: "Building a strong coding culture in our college to prepare every student for the tech industry and connect them with industry experts",
      mission: "Providing students with practical coding skills, competitive programming, interview preparation, and industry connections through hands-on workshops, real-world projects, and collaborative learning environment",
      history: "Our GeeksforGeeks Campus Body - GITAM, Jhajjar was established in September 2024. What initially started with 20 enthusiastic students has now grown into a strong community of 500+ active members.",
      chapterEstablished: "September 2024",
      collegePartnership: "GITAM University, Jhajjar Campus",
      officialRecognition: "GeeksforGeeks Certified Campus Body - GITAM, Jhajjar",
      whatWeDo: [
        "Weekly Coding Workshops (DSA, Web Dev, Mobile Dev)",
        "Competitive Programming Sessions and Contest Training", 
        "Technical Interview Preparation and Mock Interviews",
        "Industry Expert Guest Lectures and Mentorship",
        "Hackathons and Coding Contests (CodeFest 2024)",
        "Project Collaboration and Team Building",
        "Career Guidance and Resume Building Workshops",
        "1-on-1 Mentorship Program (30+ Mentor-Mentee Pairs)"
      ]
    },
    team: [
      {
        id: "1",
        name: "Ankit Kumar",
        role: "Campus Body President - GfG Campus Body, GITAM Jhajjar",
        description: "Leading the campus body with passion for competitive programming and community building",
        linkedin: "https://linkedin.com/in/ankitkumar",
        github: "https://github.com/ankitkumar"
      },
      {
        id: "2", 
        name: "Team Member 2",
        role: "Vice President",
        description: "Organizing events and managing technical workshops"
      },
      {
        id: "3",
        name: "Team Member 3", 
        role: "Event Coordinator",
        description: "Coordinating events and building industry connections"
      },
      {
        id: "4",
        name: "Team Member 4",
        role: "Technical Lead",
        description: "Leading technical initiatives and code review sessions"
      }
    ],
    events: [
      {
        id: "1",
        title: "Web Development Bootcamp",
        description: "3-day intensive bootcamp covering React, Node.js, and MongoDB",
        date: "2025-08-15",
        time: "10:00 AM - 4:00 PM",
        venue: "Computer Lab, Block A",
        type: "workshop",
        status: "upcoming",
        registrationLink: "https://forms.google.com/webdev-bootcamp"
      },
      {
        id: "2",
        title: "Coding Contest 2024",
        description: "Annual coding competition with exciting prizes",
        date: "2024-12-10",
        time: "2:00 PM - 5:00 PM", 
        venue: "Main Auditorium",
        type: "contest",
        status: "completed",
        participants: 150
      }
    ],
    achievements: [
      {
        id: "1",
        title: "1st Place - Inter-College Hackathon",
        description: "Our team won first place at the regional hackathon with an innovative AI solution",
        date: "2024-11-20",
        type: "hackathon",
        members: ["Ankit Kumar", "Team Member 2", "Team Member 3"]
      },
      {
        id: "2",
        title: "Best Campus Body Award",
        description: "Recognized as the most active GFG campus body in the region",
        date: "2024-10-15",
        type: "recognition"
      }
    ],
    resources: [
      {
        title: "DSA Complete Roadmap",
        description: "Comprehensive guide for Data Structures and Algorithms",
        link: "https://geeksforgeeks.org/dsa-roadmap",
        type: "roadmap"
      },
      {
        title: "Interview Preparation Kit",
        description: "Essential problems and concepts for technical interviews",
        link: "https://geeksforgeeks.org/interview-preparation",
        type: "practice"
      },
      {
        title: "Competitive Programming Guide",
        description: "Step-by-step guide to excel in competitive programming",
        link: "https://geeksforgeeks.org/competitive-programming",
        type: "article"
      }
    ],
    contact: {
      email: "gfg.campusbody@gitam.edu",
      chapterEmail: "ankit.president@gfgchapter.com",
      joinFormLink: "https://forms.google.com/join-gfg-gitam-chapter",
      whatsappGroup: "https://chat.whatsapp.com/gfgchapter-gitam",
      discordServer: "https://discord.gg/gfgchapter-gitam",
      socialMedia: {
        instagram: "https://instagram.com/gfg_gitam_chapter",
        linkedin: "https://linkedin.com/company/gfg-gitam-chapter",
        discord: "https://discord.gg/gfgchapter",
        whatsapp: "https://chat.whatsapp.com/gfgchapter"
      },
      meetingSchedule: {
        weeklyMeetings: "Every Saturday 4:00 PM - 6:00 PM",
        location: "Computer Lab, Block A",
        onlineMeetings: "Discord Server",
        officeHours: "Monday-Friday 2:00 PM - 4:00 PM"
      },
      mentorship: {
        signupLink: "https://forms.google.com/mentorship-program",
        description: "1-on-1 mentorship program with industry professionals and senior students",
        duration: "3-6 months",
        areas: ["DSA", "Web Development", "Mobile Apps", "AI/ML", "Competitive Programming"]
      }
    },
    stats: {
      totalMembers: 500,
      eventsHosted: 50,
      workshopsCompleted: 25,
      activeProjects: 8,
      industryConnections: 15,
      placementAssistance: 20,
      mentorshipPairs: 30,
      competitionWinners: 12,
      monthlyGrowth: "15%",
      averageAttendance: "85%"
    },
    upcomingInitiatives: [],
    partnerships: {
      industryPartners: [],
      academicPartners: []
    },
    testimonials: []
  })

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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'workshop': return BookOpen
      case 'contest': return Trophy
      case 'hackathon': return Code
      case 'lecture': return Lightbulb
      default: return Calendar
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'workshop': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'contest': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'hackathon': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'lecture': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!chapterData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Failed to load chapter data
          </h1>
          <button 
            onClick={loadChapterData}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-black">
      {/* Hero Section */}
      <motion.section 
        ref={heroRef}
        initial="hidden"
        animate={isHeroInView ? "visible" : "hidden"}
        variants={containerVariants}
        className="relative py-20 px-6 overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute top-20 left-10 w-20 h-20 bg-green-500 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-16 h-16 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-purple-500 rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          <motion.div variants={itemVariants} className="text-center mb-12">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Code className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white">
                  GfG <span className="text-green-600">Campus Body</span>
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  GITAM, Jhajjar - Official Campus Body
                </p>
              </div>
            </div>
            
            <motion.h2 
              variants={itemVariants}
              className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4"
            >
              {chapterData.about.tagline}
            </motion.h2>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8"
            >
              {chapterData.about.shortIntro}
            </motion.p>

            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4"
            >
              <button className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 hover:scale-105 shadow-lg">
                <UserPlus className="w-5 h-5 inline mr-2" />
                Join Our Campus Body
              </button>
              <button className="px-8 py-3 border-2 border-green-600 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-600 hover:text-white transition-all duration-300 hover:scale-105">
                <Calendar className="w-5 h-5 inline mr-2" />
                View Events
              </button>
            </motion.div>
          </motion.div>

          {/* Stats Section */}
          <motion.div 
            ref={statsRef}
            initial="hidden"
            animate={isStatsInView ? "visible" : "hidden"}
            variants={containerVariants}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {[
              { label: 'Members Strong', value: chapterData.stats.totalMembers, icon: Users, color: 'text-blue-600' },
              { label: 'Events Hosted', value: chapterData.stats.eventsHosted, icon: Calendar, color: 'text-green-600' },
              { label: 'Workshops Completed', value: chapterData.stats.workshopsCompleted, icon: BookOpen, color: 'text-purple-600' },
              { label: 'Industry Connections', value: chapterData.stats.industryConnections, icon: Globe, color: 'text-orange-600' },
              { label: 'Placement Assistance', value: chapterData.stats.placementAssistance, icon: Award, color: 'text-red-600' },
              { label: 'Mentorship Pairs', value: chapterData.stats.mentorshipPairs, icon: Heart, color: 'text-pink-600' },
              { label: 'Competition Winners', value: chapterData.stats.competitionWinners, icon: Trophy, color: 'text-yellow-600' },
              { label: 'Monthly Growth', value: chapterData.stats.monthlyGrowth, icon: Rocket, color: 'text-indigo-600', isPercentage: true }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg text-center hover:shadow-xl transition-shadow"
              >
                <stat.icon className={`w-8 h-8 ${stat.color} mx-auto mb-3`} />
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {stat.isPercentage ? stat.value : `${stat.value}+`}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Creative Floating Code Elements Section */}
      <section className="relative py-16 overflow-hidden bg-gradient-to-r from-green-100 via-blue-50 to-purple-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Code Snippets */}
          <motion.div 
            className="absolute top-8 left-16 opacity-20 dark:opacity-10"
            animate={{ 
              y: [0, -20, 0],
              rotate: [0, 5, 0]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          >
            <div className="bg-green-500 text-white p-3 rounded-lg font-mono text-xs">
              while(learning)<br />
              {"  keep_coding();"}
            </div>
          </motion.div>

          <motion.div 
            className="absolute top-20 right-20 opacity-20 dark:opacity-10"
            animate={{ 
              y: [0, 25, 0],
              rotate: [0, -3, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          >
            <div className="bg-blue-500 text-white p-3 rounded-lg font-mono text-xs">
              function grow() {"{"}
              <br />{"  return success;"}<br />
              {"}"}
            </div>
          </motion.div>

          <motion.div 
            className="absolute bottom-12 left-1/4 opacity-20 dark:opacity-10"
            animate={{ 
              y: [0, -15, 0],
              x: [0, 10, 0]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
          >
            <div className="bg-purple-500 text-white p-3 rounded-lg font-mono text-xs">
              if (practice) {"{"}
              <br />{"  achieve_goals();"}<br />
              {"}"}
            </div>
          </motion.div>

          {/* Floating Icons */}
          <motion.div 
            className="absolute top-16 left-1/3 text-green-500"
            animate={{ 
              y: [0, -30, 0],
              rotate: [0, 360]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity
            }}
          >
            <Code className="w-8 h-8 opacity-30" />
          </motion.div>

          <motion.div 
            className="absolute bottom-20 right-1/3 text-blue-500"
            animate={{ 
              y: [0, 20, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              delay: 1.5
            }}
          >
            <Rocket className="w-10 h-10 opacity-30" />
          </motion.div>

          <motion.div 
            className="absolute top-24 left-3/4 text-purple-500"
            animate={{ 
              x: [0, -20, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 5,
              repeat: Infinity,
              delay: 0.5
            }}
          >
            <Lightbulb className="w-7 h-7 opacity-30" />
          </motion.div>

          {/* Binary Rain Effect */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute text-green-400 dark:text-green-600 font-mono text-xs opacity-20"
                style={{
                  left: `${15 + i * 15}%`,
                  top: "-20px"
                }}
                animate={{
                  y: ["0vh", "100vh"]
                }}
                transition={{
                  duration: 8 + i * 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "linear"
                }}
              >
                10110101<br />01011010<br />11010101<br />01101110
              </motion.div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-4 mb-6">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center"
                animate={{ 
                  rotate: [0, 360]
                }}
                transition={{ 
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Zap className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Innovation Meets Collaboration
              </h3>
              <motion.div 
                className="w-12 h-12 bg-gradient-to-r from-purple-500 to-green-600 rounded-full flex items-center justify-center"
                animate={{ 
                  rotate: [360, 0]
                }}
                transition={{ 
                  duration: 15,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Globe className="w-6 h-6 text-white" />
              </motion.div>
            </div>
            
            <motion.p 
              className="text-lg text-gray-700 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: true }}
            >
              Where every line of code writes a new dream, and every bug teaches a new lesson.
              <br />
              <span className="font-semibold text-green-600 dark:text-green-400">
                Welcome to the future of coding excellence! 🚀
              </span>
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Epic Floating Animation Section */}
      <motion.section 
        className="relative py-16 overflow-hidden bg-gradient-to-r from-emerald-100 via-teal-50 to-cyan-100 dark:from-gray-800 dark:via-gray-850 dark:to-gray-900"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="grid grid-cols-8 gap-4 h-full">
            {Array.from({ length: 32 }).map((_, i) => (
              <motion.div
                key={i}
                className="bg-gradient-to-br from-green-400 to-blue-500 rounded-lg"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{
                  duration: 4 + (i % 3),
                  repeat: Infinity,
                  delay: i * 0.1
                }}
              />
            ))}
          </div>
        </div>

        {/* Floating Code Particles */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 15 }).map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute text-green-500 dark:text-green-400 font-mono text-xs opacity-40"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, Math.random() * 20 - 10, 0],
                rotate: [0, 360],
                opacity: [0.2, 0.6, 0.2]
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 2
              }}
            >
              {['{}', '[]', '()', '<>', '/>', '&&', '||', '==', '!=', '++'][i % 10]}
            </motion.div>
          ))}
        </div>

        {/* Central Holographic Display */}
        <div className="relative max-w-6xl mx-auto px-6 z-10">
          <motion.div 
            className="text-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            {/* Holographic Frame */}
            <motion.div
              className="relative bg-white/10 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl p-8 border border-green-200/30 dark:border-green-500/20 shadow-2xl"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(34, 197, 94, 0.2)",
                  "0 0 40px rgba(34, 197, 94, 0.4)",
                  "0 0 20px rgba(34, 197, 94, 0.2)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              {/* Corner Decorations */}
              {[
                { top: '-2', left: '-2', rotate: 0 },
                { top: '-2', right: '-2', rotate: 90 },
                { bottom: '-2', right: '-2', rotate: 180 },
                { bottom: '-2', left: '-2', rotate: 270 }
              ].map((corner, i) => (
                <motion.div
                  key={i}
                  className="absolute w-6 h-6 border-l-2 border-t-2 border-green-400"
                  style={corner}
                  animate={{ rotate: corner.rotate + 360 }}
                  transition={{ duration: 8, repeat: Infinity }}
                />
              ))}

              {/* Main Content */}
              <div className="grid md:grid-cols-3 gap-8 items-center">
                
                {/* Left: Animated Logo */}
                <motion.div 
                  className="flex justify-center"
                  animate={{ 
                    rotateY: [0, 360],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity
                  }}
                >
                  <div className="relative">
                    {/* Dual Logo Container with Sequential Rotation */}
                    <motion.div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
                      animate={{
                        boxShadow: [
                          "0 4px 20px rgba(34, 197, 94, 0.3)",
                          "0 8px 40px rgba(34, 197, 94, 0.6)",
                          "0 4px 20px rgba(34, 197, 94, 0.3)"
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {/* GfG Symbol Logo - Shows first */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-2xl"
                        animate={{
                          opacity: [1, 1, 0, 0, 0, 0, 1, 1],
                          scale: [1, 1, 0.8, 0.8, 0.8, 0.8, 1, 1]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          times: [0, 0.4, 0.45, 0.5, 0.95, 0.99, 1]
                        }}
                      >
                        <Image
                          src="/Assets/GfG Symbol.png"
                          alt="GeeksforGeeks Symbol"
                          width={48}
                          height={48}
                          className="w-12 h-12 object-contain filter drop-shadow-md"
                        />
                      </motion.div>

                      {/* GITAM Logo - Shows second */}
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-2xl"
                        animate={{
                          opacity: [0, 0, 0, 0, 1, 1, 0, 0],
                          scale: [0.8, 0.8, 0.8, 0.8, 1, 1, 0.8, 0.8]
                        }}
                        transition={{
                          duration: 4,
                          repeat: Infinity,
                          times: [0, 0.4, 0.45, 0.5, 0.55, 0.95, 0.99, 1]
                        }}
                      >
                        <Image
                          src="/Assets/gitamLogo.png"
                          alt="GITAM University Logo"
                          width={48}
                          height={48}
                          className="w-12 h-12 object-contain filter drop-shadow-md"
                        />
                      </motion.div>
                    </motion.div>
                    
                    {/* Orbiting Particles */}
                    {Array.from({ length: 3 }).map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3 bg-green-400 rounded-full"
                        style={{
                          top: '50%',
                          left: '50%',
                          transformOrigin: '0 0'
                        }}
                        animate={{
                          rotate: [0, 360],
                          x: [30, 30],
                          y: [-2, -2]
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 1
                        }}
                      />
                    ))}
                  </div>
                </motion.div>

                {/* Center: Title and Stats */}
                <div className="text-center">
                  <motion.h3 
                    className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4"
                    animate={{ 
                      scale: [1, 1.05, 1],
                      textShadow: [
                        "0 0 10px rgba(34, 197, 94, 0.5)",
                        "0 0 20px rgba(34, 197, 94, 0.8)",
                        "0 0 10px rgba(34, 197, 94, 0.5)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    GfG Campus Body
                  </motion.h3>
                  
                  <motion.p 
                    className="text-gray-600 dark:text-gray-300 mb-6"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    GITAM, Jhajjar - Empowering Future Coders
                  </motion.p>

                  {/* Live Stats Counter */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'Members', value: 500, icon: '👥' },
                      { label: 'Events', value: 50, icon: '🎯' }
                    ].map((stat, i) => (
                      <motion.div
                        key={i}
                        className="bg-white/20 dark:bg-gray-700/30 rounded-lg p-3 backdrop-blur-sm"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.5 + i * 0.2 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {stat.icon} {stat.value}+
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {stat.label}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Right: Interactive Code Terminal */}
                <motion.div 
                  className="bg-gray-900 rounded-lg p-4 font-mono text-sm border border-gray-700 shadow-xl"
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 2 }}
                >
                  {/* Terminal Header */}
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-700">
                    <div className="flex gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-400 text-xs">gfg-campus-body.sh</span>
                  </div>
                  
                  {/* Terminal Content */}
                  <div className="space-y-1">
                    <motion.div 
                      className="text-green-400"
                      initial={{ width: 0 }}
                      animate={{ width: "auto" }}
                      transition={{ delay: 2.5, duration: 2 }}
                    >
                      <span className="text-blue-400">$</span> ./start_journey.sh
                    </motion.div>
                    
                    <motion.div 
                      className="text-yellow-400 text-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3 }}
                    >
                      → Initializing coding excellence...
                    </motion.div>
                    
                    <motion.div 
                      className="text-cyan-400 text-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 3.5 }}
                    >
                      → Building future leaders...
                    </motion.div>
                    
                    <motion.div 
                      className="text-green-400 text-xs"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 4 }}
                    >
                      ✓ Campus Body loaded successfully!
                    </motion.div>
                    
                    <motion.div
                      className="text-white text-xs inline-block"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      █
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Bottom CTA */}
              <motion.div 
                className="mt-8 text-center"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 4.5 }}
              >
                <motion.button
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold shadow-lg transform transition-all duration-300"
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 30px rgba(34, 197, 94, 0.4)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    y: [0, -5, 0]
                  }}
                  transition={{
                    y: { duration: 2, repeat: Infinity }
                  }}
                >
                  🚀 Join the Innovation Hub
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Tech Icons */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { icon: '⚛️', delay: 0, x: '10%', y: '20%' },
            { icon: '🐍', delay: 1, x: '85%', y: '15%' },
            { icon: '☕', delay: 2, x: '15%', y: '80%' },
            { icon: '🔥', delay: 0.5, x: '90%', y: '70%' },
            { icon: '💻', delay: 1.5, x: '50%', y: '10%' },
            { icon: '🤖', delay: 2.5, x: '70%', y: '85%' }
          ].map((item, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl opacity-20 dark:opacity-10"
              style={{ left: item.x, top: item.y }}
              animate={{
                y: [0, -30, 0],
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                repeat: Infinity,
                delay: item.delay
              }}
            >
              {item.icon}
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Navigation Tabs */}
      <section className="sticky top-16 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex overflow-x-auto no-scrollbar">
            {[
              { id: 'about', label: 'About Us', icon: Heart },
              { id: 'team', label: 'Our Team', icon: Users },
              { id: 'events', label: 'Events', icon: Calendar },
              { id: 'achievements', label: 'Achievements', icon: Trophy },
              { id: 'resources', label: 'Resources', icon: BookOpen },
              { id: 'partnerships', label: 'Partnerships', icon: Globe },
              { id: 'testimonials', label: 'Testimonials', icon: Star },
              { id: 'contact', label: 'Join Us', icon: UserPlus }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'text-green-600 border-b-2 border-green-600'
                    : 'text-gray-600 dark:text-gray-400 hover:text-green-600'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-12"
            >
              {/* Vision & Mission */}
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <Target className="w-8 h-8 text-green-600" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Vision</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {chapterData.about.vision}
                  </p>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                  <div className="flex items-center gap-3 mb-6">
                    <Rocket className="w-8 h-8 text-blue-600" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Mission</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {chapterData.about.mission}
                  </p>
                </div>
              </div>

              {/* History */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <BookOpen className="w-8 h-8 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Story</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {chapterData.about.history}
                </p>
              </div>

              {/* What We Do */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <Zap className="w-8 h-8 text-orange-600" />
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">What We Do</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {chapterData.about.whatWeDo.map((activity, index) => (
                    <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <ChevronRight className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{activity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'team' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Meet Our Team</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  The passionate individuals driving our chapter forward
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-2 gap-6">
                {chapterData.team.map((member) => (
                  <div key={member.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-white">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="text-sm text-green-600 dark:text-green-400 font-medium mb-2">
                        {member.role}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {member.description}
                      </p>
                      
                      {/* Achievements */}
                      {member.achievements && member.achievements.length > 0 && (
                        <div className="mb-3">
                          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Key Achievements</h4>
                          <div className="flex flex-wrap gap-1">
                            {member.achievements.map((achievement, index) => (
                              <span key={index} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-xs rounded-full">
                                {achievement}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* Responsibilities */}
                      {member.responsibilities && member.responsibilities.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-2">Responsibilities</h4>
                          <div className="flex flex-wrap gap-1">
                            {member.responsibilities.map((responsibility, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                {responsibility}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-center gap-3">
                      {member.email && (
                        <a href={`mailto:${member.email}`} className="text-red-600 hover:text-red-700">
                          <Mail className="w-5 h-5" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                          <Linkedin className="w-5 h-5" />
                        </a>
                      )}
                      {member.github && (
                        <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {member.instagram && (
                        <a href={member.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-700">
                          <Instagram className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'events' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Events</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Upcoming workshops, contests, and learning opportunities
                </p>
              </div>

              {/* Upcoming Events */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <Play className="w-6 h-6 text-green-600" />
                  Upcoming Events
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {chapterData.events.filter(event => event.status === 'upcoming').map((event) => {
                    const EventIcon = getEventTypeIcon(event.type)
                    return (
                      <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border-l-4 border-green-500">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <EventIcon className="w-6 h-6 text-green-600" />
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </span>
                          </div>
                          <Calendar className="w-5 h-5 text-gray-400" />
                        </div>
                        
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          {event.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {event.description}
                        </p>
                        
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {new Date(event.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {event.venue}
                          </div>
                          {event.expectedParticipants && (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              Expected: {event.expectedParticipants} participants
                            </div>
                          )}
                          {event.prerequisites && (
                            <div className="mt-2">
                              <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Prerequisites: </span>
                              <span className="text-xs">{event.prerequisites}</span>
                            </div>
                          )}
                        </div>

                        {/* Highlights */}
                        {event.highlights && event.highlights.length > 0 && (
                          <div className="mb-4">
                            <div className="flex flex-wrap gap-2">
                              {event.highlights.map((highlight, index) => (
                                <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-xs rounded-full">
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {event.registrationLink && (
                          <a 
                            href={event.registrationLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Register Now
                          </a>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Past Events */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <Archive className="w-6 h-6 text-blue-600" />
                  Past Events
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chapterData.events.filter(event => event.status === 'completed').map((event) => {
                    const EventIcon = getEventTypeIcon(event.type)
                    return (
                      <div key={event.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <div className="flex items-center gap-3 mb-4">
                          <EventIcon className="w-6 h-6 text-blue-600" />
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                            {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                          </span>
                        </div>
                        
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          {event.title}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {event.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          {event.participants && (
                            <span className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              {event.participants} participants
                            </span>
                          )}
                        </div>
                        
                        {/* Event specific details */}
                        {event.outcome && (
                          <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <p className="text-sm text-green-700 dark:text-green-300">
                              <strong>Outcome:</strong> {event.outcome}
                            </p>
                          </div>
                        )}
                        
                        {event.highlights && event.highlights.length > 0 && (
                          <div className="mt-3">
                            <div className="flex flex-wrap gap-1">
                              {event.highlights.map((highlight, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded-full">
                                  {highlight}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {event.speaker && (
                          <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                            <p className="text-sm text-purple-700 dark:text-purple-300">
                              <strong>Speaker:</strong> {event.speaker.name} - {event.speaker.designation}
                            </p>
                          </div>
                        )}
                        
                        {event.winners && event.winners.length > 0 && (
                          <div className="mt-3">
                            <h5 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Winners:</h5>
                            {event.winners.map((winner, index) => (
                              <div key={index} className="text-xs text-gray-600 dark:text-gray-400">
                                🏆 {winner.position === 1 ? '1st' : winner.position === 2 ? '2nd' : '3rd'} Place: {winner.team} - {winner.project}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Achievements</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Celebrating our members&apos; success and chapter milestones
                </p>
              </div>

              <div className="space-y-6">
                {chapterData.achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Trophy className="w-8 h-8 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                            {achievement.title}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            achievement.type === 'hackathon' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                            achievement.type === 'contest' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                            achievement.type === 'project' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          }`}>
                            {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {achievement.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(achievement.date).toLocaleDateString()}
                          </span>
                          {achievement.members && (
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-400" />
                              <span className="text-sm text-gray-600 dark:text-gray-400">
                                {achievement.members.join(', ')}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'resources' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Learning Resources</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Curated resources to help you excel in coding and programming
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapterData.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
                  >
                    <div className="flex items-center gap-3 mb-4">
                      {resource.type === 'roadmap' && <Globe className="w-6 h-6 text-blue-600" />}
                      {resource.type === 'practice' && <Code className="w-6 h-6 text-green-600" />}
                      {resource.type === 'article' && <BookOpen className="w-6 h-6 text-purple-600" />}
                      {resource.type === 'tool' && <Zap className="w-6 h-6 text-orange-600" />}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        resource.type === 'roadmap' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        resource.type === 'practice' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        resource.type === 'article' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}>
                        {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {resource.description}
                    </p>
                    
                    {/* Additional resource details */}
                    <div className="space-y-2 mb-4">
                      {resource.difficulty && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Difficulty:</span>
                          <span className="text-gray-600 dark:text-gray-400">{resource.difficulty}</span>
                        </div>
                      )}
                      {resource.duration && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Duration:</span>
                          <span className="text-gray-600 dark:text-gray-400">{resource.duration}</span>
                        </div>
                      )}
                      {resource.problems && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Problems:</span>
                          <span className="text-gray-600 dark:text-gray-400">{resource.problems}</span>
                        </div>
                      )}
                      {resource.projects && (
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-medium text-gray-700 dark:text-gray-300">Projects:</span>
                          <span className="text-gray-600 dark:text-gray-400">{resource.projects}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center text-green-600 dark:text-green-400 group-hover:gap-3 transition-all">
                      <span className="text-sm font-medium">Explore Resource</span>
                      <ExternalLink className="w-4 h-4 ml-2 group-hover:ml-0 transition-all" />
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'partnerships' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Partnerships</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Collaborating with industry leaders and academic institutions
                </p>
              </div>

              {/* Industry Partners */}
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <Globe className="w-6 h-6 text-blue-600" />
                  Industry Partners
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chapterData.partnerships.industryPartners.map((partner, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          {partner.name}
                        </h4>
                        <p className="text-sm text-green-600 dark:text-green-400 mb-2">
                          {partner.type}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Partnership since: {new Date(partner.established).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Partners */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <BookOpen className="w-6 h-6 text-purple-600" />
                  Academic Partners
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {chapterData.partnerships.academicPartners.map((partner, index) => (
                    <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                      <div className="text-center">
                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                          {partner.name}
                        </h4>
                        <p className="text-sm text-purple-600 dark:text-purple-400 mb-2">
                          {partner.type}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Partnership since: {new Date(partner.established).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'testimonials' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Our Members Say</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Success stories and experiences from our community members
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {chapterData.testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-4 italic">
                      &quot;{testimonial.message}&quot;
                    </p>
                    
                    <div className="border-t pt-4">
                      <h4 className="font-bold text-gray-900 dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                      {testimonial.company && (
                        <p className="text-sm text-green-600 dark:text-green-400 font-medium">
                          {testimonial.company}
                        </p>
                      )}
                      {testimonial.achievement && (
                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                          {testimonial.achievement}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'contact' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Join Our Chapter</h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Become part of our coding community and accelerate your learning journey
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Join Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                  <div className="text-center mb-6">
                    <UserPlus className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Ready to Join?
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Fill out our membership form and start your coding journey with us
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <a
                      href={chapterData.contact.joinFormLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-green-600 text-white py-4 px-6 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-3 font-medium"
                    >
                      <UserPlus className="w-5 h-5" />
                      Join GfG Campus Body
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    
                    <a
                      href={chapterData.contact.mentorship.signupLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-3 font-medium"
                    >
                      <Heart className="w-5 h-5" />
                      Join Mentorship Program
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                  <div className="text-center mb-6">
                    <Mail className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                      Get In Touch
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Have questions? We&apos;re here to help!
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <a
                      href={`mailto:${chapterData.contact.email}`}
                      className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <Mail className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700 dark:text-gray-300">{chapterData.contact.email}</span>
                    </a>
                    
                    <a
                      href={chapterData.contact.whatsappGroup}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 dark:text-gray-300">WhatsApp Group</span>
                    </a>
                    
                    <a
                      href={chapterData.contact.discordServer}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors"
                    >
                      <MessageCircle className="w-5 h-5 text-indigo-600" />
                      <span className="text-gray-700 dark:text-gray-300">Discord Server</span>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Meeting Schedule */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-purple-600" />
                  Meeting Schedule
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Weekly Meetings</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{chapterData.contact.meetingSchedule.weeklyMeetings}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Location</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{chapterData.contact.meetingSchedule.location}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Online Meetings</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{chapterData.contact.meetingSchedule.onlineMeetings}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Office Hours</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{chapterData.contact.meetingSchedule.officeHours}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                  Follow Us on Social Media
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {chapterData.contact.socialMedia.instagram && (
                    <a
                      href={chapterData.contact.socialMedia.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  )}
                  
                  {chapterData.contact.socialMedia.linkedin && (
                    <a
                      href={chapterData.contact.socialMedia.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Linkedin className="w-4 h-4" />
                      LinkedIn
                    </a>
                  )}
                  
                  {chapterData.contact.socialMedia.youtube && (
                    <a
                      href={chapterData.contact.socialMedia.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <Play className="w-4 h-4" />
                      YouTube
                    </a>
                  )}
                  
                  {chapterData.contact.socialMedia.github && (
                    <a
                      href={chapterData.contact.socialMedia.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
}
