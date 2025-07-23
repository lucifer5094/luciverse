// 📁 File: src/app/about/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'
import InlineEdit from '@/components/InlineEdit'
import OwnerControls from '@/components/OwnerControls'
import { dataAPI } from '@/utils/dataAPI'
import { useIntersectionObserver, useLocalStorage, useMediaQuery } from '@/hooks'
import { ChevronDown, Code, Zap, Heart, Star, Download, ExternalLink, Volume2, VolumeX } from 'lucide-react'

// Sound effects utility class
class SoundEffects {
    private audioContext: AudioContext | null = null
    private sounds: { [key: string]: AudioBuffer } = {}
    private enabled: boolean = true

    constructor() {
        if (typeof window !== 'undefined') {
            this.init()
        }
    }

    private async init() {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
            await this.loadSounds()
        } catch (error) {
            console.log('Audio not supported or user interaction required')
        }
    }

    private async loadSounds() {
        // Create synthetic sounds using Web Audio API
        const sounds = {
            hover: this.createTone(800, 0.1, 'sine'),
            click: this.createTone(1200, 0.15, 'square'),
            success: this.createChord([523, 659, 784], 0.3), // C major chord
            notification: this.createTone(1000, 0.2, 'triangle'),
            favorite: this.createChord([440, 554, 659], 0.25), // A major chord
        }

        for (const [name, audioBuffer] of Object.entries(sounds)) {
            this.sounds[name] = audioBuffer
        }
    }

    private createTone(frequency: number, duration: number, type: OscillatorType): AudioBuffer {
        if (!this.audioContext) return new AudioBuffer({ length: 1, sampleRate: 44100 })
        
        const sampleRate = this.audioContext.sampleRate
        const frameCount = sampleRate * duration
        const arrayBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate)
        const channelData = arrayBuffer.getChannelData(0)

        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate
            let sample = 0
            
            if (type === 'sine') {
                sample = Math.sin(2 * Math.PI * frequency * t)
            } else if (type === 'square') {
                sample = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1
            } else if (type === 'triangle') {
                sample = 2 * Math.abs(2 * (frequency * t - Math.floor(frequency * t + 0.5))) - 1
            }
            
            // Apply envelope (fade in/out)
            const envelope = Math.sin(Math.PI * t / duration)
            channelData[i] = sample * envelope * 0.1 // Low volume
        }

        return arrayBuffer
    }

    private createChord(frequencies: number[], duration: number): AudioBuffer {
        if (!this.audioContext) return new AudioBuffer({ length: 1, sampleRate: 44100 })
        
        const sampleRate = this.audioContext.sampleRate
        const frameCount = sampleRate * duration
        const arrayBuffer = this.audioContext.createBuffer(1, frameCount, sampleRate)
        const channelData = arrayBuffer.getChannelData(0)

        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate
            let sample = 0
            
            frequencies.forEach(freq => {
                sample += Math.sin(2 * Math.PI * freq * t) / frequencies.length
            })
            
            // Apply envelope
            const envelope = Math.sin(Math.PI * t / duration)
            channelData[i] = sample * envelope * 0.1
        }

        return arrayBuffer
    }

    public async play(soundName: string, volume: number = 0.1) {
        if (!this.enabled || !this.audioContext || !this.sounds[soundName]) return

        try {
            // Resume audio context if suspended (required by browsers)
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume()
            }

            const source = this.audioContext.createBufferSource()
            const gainNode = this.audioContext.createGain()
            
            source.buffer = this.sounds[soundName]
            gainNode.gain.value = volume
            
            source.connect(gainNode)
            gainNode.connect(this.audioContext.destination)
            
            source.start()
        } catch (error) {
            console.log('Could not play sound:', error)
        }
    }

    public toggle() {
        this.enabled = !this.enabled
        return this.enabled
    }

    public isEnabled() {
        return this.enabled
    }
}

export default function AboutPage() {
    // Media query hook for responsive design
    const isMobile = useMediaQuery('(max-width: 768px)')
    const isTablet = useMediaQuery('(max-width: 1024px)')
    
    // Local storage for user preferences
    const [viewMode, setViewMode] = useLocalStorage('aboutPageViewMode', 'detailed')
    const [favoriteSection, setFavoriteSection] = useLocalStorage('favoriteSection', '')
    const [soundEnabled, setSoundEnabled] = useLocalStorage('soundEnabled', true)
    
    // Sound effects
    const soundEffects = useRef<SoundEffects | null>(null)
    
    // Intersection observer for animations
    const heroSection = useIntersectionObserver({ threshold: 0.3 })
    const skillsSection = useIntersectionObserver({ threshold: 0.2 })
    const journeySection = useIntersectionObserver({ threshold: 0.2 })
    const musicSection = useIntersectionObserver({ threshold: 0.2 })
    
    // Editable content state - loaded from JSON
    const [pageTitle, setPageTitle] = useState('About Me')
    const [pageSubtitle, setPageSubtitle] = useState('Developer • AI Enthusiast • Creative Thinker')
    const [pageContent, setPageContent] = useState('Welcome to my digital space! Add your personal story and background here.')
    
    // Personal info section
    const [personalName, setPersonalName] = useState('[Your Name]')
    const [personalEducation, setPersonalEducation] = useState('Add your education/background')
    const [personalStory, setPersonalStory] = useState('Add your journey and passion details here.')
    
    // Journey section
    const [journeyBeginning, setJourneyBeginning] = useState('Add your beginning story here.')
    const [journeyDeepDive, setJourneyDeepDive] = useState('Add your learning phase description.')
    const [journeyInnovation, setJourneyInnovation] = useState('Add your current phase description.')
    
    // Philosophy section
    const [coreBelief, setCoreBelief] = useState('Add your core belief here.')
    
    // Why AI section
    const [whyAIIntro, setWhyAIIntro] = useState('Add why AI/ML drives you.')
    const [humanAISynergy, setHumanAISynergy] = useState('Add your thoughts on human-AI collaboration.')
    const [realWorldImpact, setRealWorldImpact] = useState('Add your vision for real-world AI impact.')
    
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')
    const [showScrollToTop, setShowScrollToTop] = useState(false)

    // Initialize sound effects
    useEffect(() => {
        soundEffects.current = new SoundEffects()
        
        // Update sound enabled state
        if (soundEffects.current) {
            if (!soundEnabled) {
                soundEffects.current.toggle()
            }
        }
    }, [soundEnabled])

    // Handle scroll effects
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollToTop(window.scrollY > 300)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Load content from JSON file
    useEffect(() => {
        loadSiteContent()
    }, [])

    const loadSiteContent = async () => {
        try {
            setLoading(true)
            const content = await dataAPI.getSiteContent() as any
            setPageTitle(content.aboutTitle)
            setPageSubtitle(content.aboutSubtitle)
            setPageContent(content.aboutContent)
            
            // Load personal info
            if (content.aboutPersonalInfo) {
                setPersonalName(content.aboutPersonalInfo.name)
                setPersonalEducation(content.aboutPersonalInfo.education)
                setPersonalStory(content.aboutPersonalInfo.personalStory)
            }
            
            // Load journey info
            if (content.aboutJourney) {
                setJourneyBeginning(content.aboutJourney.beginning.description)
                setJourneyDeepDive(content.aboutJourney.deepDive.description)
                setJourneyInnovation(content.aboutJourney.innovation.description)
            }
            
            // Load philosophy
            if (content.aboutPhilosophy) {
                setCoreBelief(content.aboutPhilosophy.coreBelief)
            }
            
            // Load AI section
            if (content.aboutWhyAI) {
                setWhyAIIntro(content.aboutWhyAI.introduction)
                setHumanAISynergy(content.aboutWhyAI.humanAISynergy)
                setRealWorldImpact(content.aboutWhyAI.realWorldImpact)
            }
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
                aboutTitle: newTitle
            })
            setPageTitle(newTitle)
            soundEffects.current?.play('success')
        } catch (error) {
            console.error('Failed to save about title:', error)
        }
    }

    const handleSaveSubtitle = async (newSubtitle: string) => {
        try {
            const currentContent = await dataAPI.getSiteContent()
            await dataAPI.updateSiteContent({
                ...currentContent,
                aboutSubtitle: newSubtitle
            })
            setPageSubtitle(newSubtitle)
            soundEffects.current?.play('success')
        } catch (error) {
            console.error('Failed to save about subtitle:', error)
        }
    }

    const handleSaveContent = async (newContent: string) => {
        try {
            const currentContent = await dataAPI.getSiteContent()
            await dataAPI.updateSiteContent({
                ...currentContent,
                aboutContent: newContent
            })
            setPageContent(newContent)
            soundEffects.current?.play('success')
        } catch (error) {
            console.error('Failed to save about content:', error)
        }
    }

    // Personal info save handlers
    const handleSavePersonalName = async (newName: string) => {
        try {
            const currentContent = await dataAPI.getSiteContent() as any
            await dataAPI.updateSiteContent({
                ...currentContent,
                aboutPersonalInfo: {
                    ...currentContent.aboutPersonalInfo,
                    name: newName
                }
            })
            setPersonalName(newName)
            soundEffects.current?.play('success')
        } catch (error) {
            console.error('Failed to save personal name:', error)
        }
    }

    const handleSavePersonalEducation = async (newEducation: string) => {
        try {
            const currentContent = await dataAPI.getSiteContent() as any
            await dataAPI.updateSiteContent({
                ...currentContent,
                aboutPersonalInfo: {
                    ...currentContent.aboutPersonalInfo,
                    education: newEducation
                }
            })
            setPersonalEducation(newEducation)
            soundEffects.current?.play('success')
        } catch (error) {
            console.error('Failed to save personal education:', error)
        }
    }

    const handleSavePersonalStory = async (newStory: string) => {
        try {
            const currentContent = await dataAPI.getSiteContent() as any
            await dataAPI.updateSiteContent({
                ...currentContent,
                aboutPersonalInfo: {
                    ...currentContent.aboutPersonalInfo,
                    personalStory: newStory
                }
            })
            setPersonalStory(newStory)
            soundEffects.current?.play('success')
        } catch (error) {
            console.error('Failed to save personal story:', error)
        }
    }

    // Journey save handlers
    const handleSaveJourneyBeginning = async (newDescription: string) => {
        try {
            const currentContent = await dataAPI.getSiteContent() as any
            await dataAPI.updateSiteContent({
                ...currentContent,
                aboutJourney: {
                    ...currentContent.aboutJourney,
                    beginning: {
                        ...currentContent.aboutJourney.beginning,
                        description: newDescription
                    }
                }
            })
            setJourneyBeginning(newDescription)
            soundEffects.current?.play('success')
        } catch (error) {
            console.error('Failed to save journey beginning:', error)
        }
    }

    const handleSaveJourneyDeepDive = async (newDescription: string) => {
        try {
            const currentContent = await dataAPI.getSiteContent() as any
            await dataAPI.updateSiteContent({
                ...currentContent,
                aboutJourney: {
                    ...currentContent.aboutJourney,
                    deepDive: {
                        ...currentContent.aboutJourney.deepDive,
                        description: newDescription
                    }
                }
            })
            setJourneyDeepDive(newDescription)
            soundEffects.current?.play('success')
        } catch (error) {
            console.error('Failed to save journey deep dive:', error)
        }
    }

    const handleSaveJourneyInnovation = async (newDescription: string) => {
        try {
            const currentContent = await dataAPI.getSiteContent() as any
            await dataAPI.updateSiteContent({
                ...currentContent,
                aboutJourney: {
                    ...currentContent.aboutJourney,
                    innovation: {
                        ...currentContent.aboutJourney.innovation,
                        description: newDescription
                    }
                }
            })
            setJourneyInnovation(newDescription)
            soundEffects.current?.play('success')
        } catch (error) {
            console.error('Failed to save journey innovation:', error)
        }
    }

    // Philosophy save handlers
    const handleSaveCoreBelief = async (newBelief: string) => {
        try {
            const currentContent = await dataAPI.getSiteContent() as any
            await dataAPI.updateSiteContent({
                ...currentContent,
                aboutPhilosophy: {
                    ...currentContent.aboutPhilosophy,
                    coreBelief: newBelief
                }
            })
            setCoreBelief(newBelief)
            soundEffects.current?.play('success')
        } catch (error) {
            console.error('Failed to save core belief:', error)
        }
    }

    // Why AI save handlers
    const handleSaveWhyAIIntro = async (newIntro: string) => {
        try {
            const currentContent = await dataAPI.getSiteContent() as any
            await dataAPI.updateSiteContent({
                ...currentContent,
                aboutWhyAI: {
                    ...currentContent.aboutWhyAI,
                    introduction: newIntro
                }
            })
            setWhyAIIntro(newIntro)
            soundEffects.current?.play('success')
        } catch (error) {
            console.error('Failed to save why AI intro:', error)
        }
    }

    const handleSaveHumanAISynergy = async (newSynergy: string) => {
        try {
            const currentContent = await dataAPI.getSiteContent() as any
            await dataAPI.updateSiteContent({
                ...currentContent,
                aboutWhyAI: {
                    ...currentContent.aboutWhyAI,
                    humanAISynergy: newSynergy
                }
            })
            setHumanAISynergy(newSynergy)
            soundEffects.current?.play('success')
        } catch (error) {
            console.error('Failed to save human AI synergy:', error)
        }
    }

    const handleSaveRealWorldImpact = async (newImpact: string) => {
        try {
            const currentContent = await dataAPI.getSiteContent() as any
            await dataAPI.updateSiteContent({
                ...currentContent,
                aboutWhyAI: {
                    ...currentContent.aboutWhyAI,
                    realWorldImpact: newImpact
                }
            })
            setRealWorldImpact(newImpact)
            soundEffects.current?.play('success')
        } catch (error) {
            console.error('Failed to save real world impact:', error)
        }
    }

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        soundEffects.current?.play('notification')
    }

    const markAsFavorite = (sectionName: string) => {
        setFavoriteSection(prev => prev === sectionName ? '' : sectionName)
        soundEffects.current?.play('favorite')
    }

    const toggleSound = () => {
        if (soundEffects.current) {
            const enabled = soundEffects.current.toggle()
            setSoundEnabled(enabled)
            soundEffects.current.play('click')
        }
    }

    const playHoverSound = () => {
        soundEffects.current?.play('hover', 0.05)
    }

    const playClickSound = () => {
        soundEffects.current?.play('click', 0.08)
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8 }
        }
    }

    const floatingVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6 }
        }
    }

    // Enhanced skill categories with progress indicators
    const skillCategories = [
        {
            name: 'Programming Languages',
            icon: Code,
            skills: [
                { name: 'Python', level: 90, color: 'bg-yellow-500' },
                { name: 'JavaScript/TypeScript', level: 85, color: 'bg-blue-500' },
                { name: 'C++', level: 80, color: 'bg-green-500' },
                { name: 'HTML/CSS', level: 88, color: 'bg-orange-500' }
            ]
        },
        {
            name: 'AI/ML Frameworks',
            icon: Zap,
            skills: [
                { name: 'TensorFlow/Keras', level: 85, color: 'bg-orange-600' },
                { name: 'PyTorch', level: 80, color: 'bg-red-500' },
                { name: 'Scikit-learn', level: 88, color: 'bg-blue-600' },
                { name: 'OpenCV', level: 75, color: 'bg-green-600' }
            ]
        },
        {
            name: 'Web Technologies',
            icon: Heart,
            skills: [
                { name: 'React/Next.js', level: 90, color: 'bg-cyan-500' },
                { name: 'Node.js', level: 82, color: 'bg-green-400' },
                { name: 'Tailwind CSS', level: 95, color: 'bg-teal-500' },
                { name: 'AWS/Cloud', level: 70, color: 'bg-yellow-600' }
            ]
        }
    ]

    return (
        <main className="min-h-screen px-4 md:px-6 py-16 md:py-24 flex flex-col items-center justify-start bg-gradient-to-br from-light-background via-white to-gray-50 dark:from-dark-surface dark:via-black dark:to-gray-900 transition-colors duration-500">
            {/* Sound Toggle Button */}
            <motion.button
                onClick={toggleSound}
                onMouseEnter={playHoverSound}
                className="fixed top-4 right-4 z-50 bg-white dark:bg-gray-800 p-3 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
                {soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-accent" />
                ) : (
                    <VolumeX className="w-5 h-5 text-gray-400" />
                )}
            </motion.button>

            {/* Floating Scroll to Top Button */}
            {showScrollToTop && (
                <motion.button
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    onClick={scrollToTop}
                    onMouseEnter={playHoverSound}
                    className="fixed bottom-8 right-8 z-50 bg-accent hover:bg-accent/90 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <ChevronDown className="w-5 h-5 rotate-180" />
                </motion.button>
            )}

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-6xl w-full"
            >
                {/* Enhanced Hero Section */}
                <motion.div
                    variants={itemVariants}
                    className="text-center mb-16"
                >
                    <div ref={heroSection.elementRef as any}></div>
                    <motion.div
                        className="relative inline-block"
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                    >
                        <h1 className="text-5xl md:text-7xl font-bold text-light-text dark:text-white mb-6 relative">
                            <InlineEdit
                                type="text"
                                value={pageTitle}
                                onSave={handleSaveTitle}
                                placeholder="Enter page title..."
                                inline={true}
                            >
                                <span className="relative">
                                    About{' '}
                                    <span className="text-accent bg-gradient-to-r from-accent via-purple-500 to-pink-500 bg-clip-text text-transparent animate-gradient">
                                        Me
                                    </span>
                                    {heroSection.isVisible && (
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '100%' }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-accent to-purple-500 rounded-full"
                                        />
                                    )}
                                </span>
                            </InlineEdit>
                        </h1>
                        
                        {/* Floating particles effect */}
                        {heroSection.isVisible && (
                            <div className="absolute inset-0 -z-10">
                                {[...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, scale: 0 }}
                                        animate={{ 
                                            opacity: [0, 1, 0],
                                            scale: [0, 1, 0],
                                            y: [-20, -60],
                                            x: [0, Math.random() * 100 - 50]
                                        }}
                                        transition={{
                                            duration: 3,
                                            delay: i * 0.3,
                                            repeat: Infinity,
                                            repeatDelay: 2
                                        }}
                                        className="absolute w-2 h-2 bg-accent rounded-full"
                                        style={{
                                            left: `${20 + i * 12}%`,
                                            top: '50%'
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                    </motion.div>

                    <motion.p
                        variants={itemVariants}
                        className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-8 font-light"
                    >
                        <InlineEdit
                            type="text"
                            value={pageSubtitle}
                            onSave={handleSaveSubtitle}
                            placeholder="Enter page subtitle..."
                            inline={true}
                        >
                            {pageSubtitle}
                        </InlineEdit>
                    </motion.p>

                    {/* Quick stats */}
                    <motion.div
                        variants={itemVariants}
                        className="flex flex-wrap justify-center gap-6 md:gap-8 mb-12"
                    >
                        {[
                            { label: 'Projects Built', value: '0', icon: '🚀' },
                            { label: 'Technologies', value: '0', icon: '⚡' },
                            { label: 'Coffee Consumed', value: '0☕', icon: '🎵' },
                            { label: 'Years Coding', value: '0', icon: '💻' }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center p-4 bg-white/50 dark:bg-gray-800/50 rounded-2xl backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 cursor-pointer"
                                whileHover={{ scale: 1.05, y: -2 }}
                                transition={{ duration: 0.2 }}
                                onMouseEnter={playHoverSound}
                                onClick={playClickSound}
                            >
                                <div className="text-2xl mb-1">{stat.icon}</div>
                                <div className="text-2xl md:text-3xl font-bold text-accent">{stat.value}</div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>

                {/* Enhanced About Content Section with Tabs */}
                <motion.section 
                    variants={itemVariants} 
                    className="mb-16"
                >
                    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 md:p-10 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                        {/* Tab Navigation */}
                        <div className="flex flex-wrap justify-center mb-8 bg-gray-100 dark:bg-gray-800 rounded-2xl p-2">
                            {[
                                { id: 'overview', label: 'Overview', icon: '👋' },
                                { id: 'journey', label: 'My Journey', icon: '🚀' },
                                { id: 'philosophy', label: 'Philosophy', icon: '🌌' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => {
                                        setActiveTab(tab.id)
                                        playClickSound()
                                    }}
                                    onMouseEnter={playHoverSound}
                                    className={`flex items-center space-x-2 px-4 md:px-6 py-3 rounded-xl transition-all duration-300 ${
                                        activeTab === tab.id
                                            ? 'bg-white dark:bg-gray-700 text-accent shadow-lg transform scale-105'
                                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                    }`}
                                >
                                    <span className="text-lg">{tab.icon}</span>
                                    <span className="font-medium">{tab.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4 }}
                            className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed"
                        >
                            {activeTab === 'overview' && (
                                <div className="space-y-6">
                                    <InlineEdit
                                        type="textarea"
                                        value={pageContent}
                                        onSave={handleSaveContent}
                                        placeholder="Enter about content..."
                                        maxLength={1000}
                                    >
                                        <div className="whitespace-pre-line">{pageContent}</div>
                                    </InlineEdit>
                                    
                                    <div className="grid md:grid-cols-2 gap-6 mt-8">
                                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-2xl">
                                            <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                                                <span className="mr-2">🎯</span>
                                                Current Focus
                                            </h4>
                                            <p className="text-sm">Building intelligent web applications that seamlessly blend AI capabilities with intuitive user experiences.</p>
                                        </div>
                                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl">
                                            <h4 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                                                <span className="mr-2">🌟</span>
                                                Next Goal
                                            </h4>
                                            <p className="text-sm">Contributing to open-source AI projects and building solutions that make technology more accessible.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'journey' && (
                                <div className="space-y-6">
                                    <div className="relative pl-8 border-l-4 border-accent">
                                        <div className="absolute -left-3 top-0 w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 dark:text-white mb-2">The Beginning (2020)</h4>
                                        <p>
                                            <InlineEdit
                                                type="textarea"
                                                value={journeyBeginning}
                                                onSave={handleSaveJourneyBeginning}
                                                placeholder="Enter your beginning story..."
                                                maxLength={200}
                                            >
                                                {journeyBeginning}
                                            </InlineEdit>
                                        </p>
                                    </div>
                                    <div className="relative pl-8 border-l-4 border-purple-500">
                                        <div className="absolute -left-3 top-0 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 dark:text-white mb-2">Deep Dive (2021-2022)</h4>
                                        <p>
                                            <InlineEdit
                                                type="textarea"
                                                value={journeyDeepDive}
                                                onSave={handleSaveJourneyDeepDive}
                                                placeholder="Enter your learning phase description..."
                                                maxLength={200}
                                            >
                                                {journeyDeepDive}
                                            </InlineEdit>
                                        </p>
                                    </div>
                                    <div className="relative pl-8 border-l-4 border-green-500">
                                        <div className="absolute -left-3 top-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        </div>
                                        <h4 className="font-bold text-gray-800 dark:text-white mb-2">Innovation (2023-Present)</h4>
                                        <p>
                                            <InlineEdit
                                                type="textarea"
                                                value={journeyInnovation}
                                                onSave={handleSaveJourneyInnovation}
                                                placeholder="Enter your current phase description..."
                                                maxLength={200}
                                            >
                                                {journeyInnovation}
                                            </InlineEdit>
                                        </p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'philosophy' && (
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-r from-accent/10 to-purple-500/10 p-6 rounded-2xl border-l-4 border-accent">
                                        <h4 className="font-bold text-gray-800 dark:text-white mb-3">Core Belief</h4>
                                        <p className="italic">&ldquo;Technology should enhance human creativity and potential, not replace it. The future lies in collaboration between humans and AI.&rdquo;</p>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">
                                        <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
                                            <div className="text-2xl mb-2">⚡</div>
                                            <h5 className="font-semibold mb-1">Magical Technology</h5>
                                            <p className="text-sm">Technology should feel seamless and intuitive</p>
                                        </div>
                                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                            <div className="text-2xl mb-2">🤝</div>
                                            <h5 className="font-semibold mb-1">Human-Centered AI</h5>
                                            <p className="text-sm">AI should amplify human capabilities</p>
                                        </div>
                                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                                            <div className="text-2xl mb-2">🌍</div>
                                            <h5 className="font-semibold mb-1">Global Impact</h5>
                                            <p className="text-sm">Solutions should solve real-world problems</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </motion.section>

                {/* Your Journey Section */}
                <motion.section variants={itemVariants} className="mb-12">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <span className="text-2xl mr-3">�</span>
                            Your Journey
                        </h2>
                        <div className="space-y-6 text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                                    <span className="text-lg mr-2">📚</span>
                                    Background & Education
                                </h3>
                                <p>
                                    Hey! I&apos;m <InlineEdit
                                        type="text"
                                        value={personalName}
                                        onSave={handleSavePersonalName}
                                        placeholder="Enter your name..."
                                        inline={true}
                                    >
                                        <span className="font-semibold text-accent">{personalName}</span>
                                    </InlineEdit>, <InlineEdit
                                        type="text"
                                        value={personalEducation}
                                        onSave={handleSavePersonalEducation}
                                        placeholder="Enter your education/background..."
                                        inline={true}
                                    >
                                        {personalEducation}
                                    </InlineEdit>
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                                    <span className="text-lg mr-2">💡</span>
                                    My Story
                                </h3>
                                <p>
                                    <InlineEdit
                                        type="textarea"
                                        value={personalStory}
                                        onSave={handleSavePersonalStory}
                                        placeholder="Enter your personal story..."
                                        maxLength={500}
                                    >
                                        {personalStory}
                                    </InlineEdit>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Why AI/ML Section */}
                <motion.section variants={itemVariants} className="mb-12">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-blue-200 dark:border-gray-700">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <span className="text-2xl mr-3">🤖</span>
                            Why AI/ML?
                        </h2>
                        <div className="space-y-4 text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            <p>
                                <InlineEdit
                                    type="textarea"
                                    value={whyAIIntro}
                                    onSave={handleSaveWhyAIIntro}
                                    placeholder="Enter why AI/ML drives you..."
                                    maxLength={300}
                                >
                                    <strong>What drives me?</strong> {whyAIIntro}
                                </InlineEdit>
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                                        <span className="mr-2">🧠</span>
                                        Human-AI Synergy
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <InlineEdit
                                            type="textarea"
                                            value={humanAISynergy}
                                            onSave={handleSaveHumanAISynergy}
                                            placeholder="Enter your thoughts on human-AI collaboration..."
                                            maxLength={200}
                                        >
                                            {humanAISynergy}
                                        </InlineEdit>
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                                        <span className="mr-2">🌍</span>
                                        Real-world Impact
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        <InlineEdit
                                            type="textarea"
                                            value={realWorldImpact}
                                            onSave={handleSaveRealWorldImpact}
                                            placeholder="Enter your vision for real-world AI impact..."
                                            maxLength={200}
                                        >
                                            {realWorldImpact}
                                        </InlineEdit>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Core Beliefs Section */}
                <motion.section variants={itemVariants} className="mb-12">
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-orange-200 dark:border-gray-700">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <span className="text-2xl mr-3">🌌</span>
                            Core Beliefs & Philosophy
                        </h2>
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-600">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                                        <span className="mr-2">⚡</span>
                                        Technology as Magic
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        I believe technology should feel magical yet meaningful. The best innovations are those that seamlessly blend into our lives while solving real problems.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-600">
                                    <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center">
                                        <span className="mr-2">🤝</span>
                                        Empower, Don&apos;t Replace
                                    </h3>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        AI should enhance human creativity and potential, creating a future where humans and AI work together harmoniously.
                                    </p>
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border-l-4 border-accent">
                                <p className="text-base italic text-gray-700 dark:text-gray-300">
                                    <InlineEdit
                                        type="textarea"
                                        value={coreBelief}
                                        onSave={handleSaveCoreBelief}
                                        placeholder="Enter your core belief or philosophy..."
                                        maxLength={300}
                                    >
                                        &ldquo;{coreBelief}&rdquo;
                                    </InlineEdit>
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Enhanced Skills Section with Progress Bars */}
                <motion.section 
                    variants={itemVariants} 
                    className="mb-16"
                >
                    <div ref={skillsSection.elementRef as any}></div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl border border-purple-200/50 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white flex items-center">
                                <span className="text-3xl mr-4">🛠️</span>
                                Skills & Expertise
                            </h2>
                            <button
                                onClick={() => markAsFavorite('skills')}
                                onMouseEnter={playHoverSound}
                                className={`p-2 rounded-full transition-colors duration-300 hover:scale-110 transform ${
                                    favoriteSection === 'skills' 
                                        ? 'bg-yellow-500 text-white' 
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                }`}
                            >
                                <Star className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="grid lg:grid-cols-3 gap-8">
                            {skillCategories.map((category, categoryIndex) => (
                                <motion.div
                                    key={categoryIndex}
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={skillsSection.isVisible ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-600"
                                >
                                    <div className="flex items-center mb-6">
                                        <category.icon className="w-6 h-6 text-accent mr-3" />
                                        <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                                            {category.name}
                                        </h3>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {category.skills.map((skill, skillIndex) => (
                                            <div key={skillIndex} className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {skill.name}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {skill.level}%
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={skillsSection.isVisible ? { width: `${skill.level}%` } : {}}
                                                        transition={{ 
                                                            duration: 1.2, 
                                                            delay: categoryIndex * 0.2 + skillIndex * 0.1,
                                                            ease: "easeOut"
                                                        }}
                                                        className={`h-2 rounded-full ${skill.color}`}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        
                        {/* Quick Links */}
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <motion.a
                                href="https://github.com/lucifer5094"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-full transition-colors duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onMouseEnter={playHoverSound}
                                onClick={playClickSound}
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span>GitHub</span>
                            </motion.a>
                            <motion.a
                                href="/resume/Ankit_Raj_Resume.pdf"
                                download="Ankit_Raj_Resume.pdf"
                                className="flex items-center space-x-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-full transition-colors duration-300"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onMouseEnter={playHoverSound}
                                onClick={playClickSound}
                            >
                                <Download className="w-4 h-4" />
                                <span>Resume</span>
                            </motion.a>
                        </div>
                    </div>
                </motion.section>

                {/* Fun Facts & Resume Section */}
                <motion.section variants={itemVariants} className="mb-12">
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-green-200 dark:border-gray-700">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <span className="text-2xl mr-3">⚡</span>
                            Fun Facts & Quick Links
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">🎯 Quick Facts</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">🌙</span>
                                        <span className="text-gray-700 dark:text-gray-300">Night owl who codes best after midnight</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">☕</span>
                                        <span className="text-gray-700 dark:text-gray-300">Fueled by music, not coffee</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">🎮</span>
                                        <span className="text-gray-700 dark:text-gray-300">Chess strategy applies to code architecture</span>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-lg mr-3">📖</span>
                                        <span className="text-gray-700 dark:text-gray-300">Hindi literature inspires my creative process</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col justify-center">
                                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-600 text-center">
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">📄 Get My Resume</h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
                                        Download my detailed resume to learn more about my experience, projects, and achievements.
                                    </p>
                                    <a 
                                        href="/resume/Ankit_Raj_Resume.pdf" 
                                        download="Ankit_Raj_Resume.pdf"
                                        className="bg-accent hover:bg-accent/90 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300 flex items-center mx-auto w-fit hover:scale-105 transform transition-transform duration-200"
                                    >
                                        <span className="mr-2">📥</span>
                                        Download Resume (PDF)
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Personal Interests Section */}
                <motion.section variants={itemVariants} className="mb-12">
                    <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-indigo-200 dark:border-gray-700">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <span className="text-2xl mr-3">🎯</span>
                            Personal Interests
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-600">
                                <div className="text-3xl mb-4">🎬</div>
                                <h3 className="font-bold text-gray-800 dark:text-white mb-2">Fantasy & Thriller</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Mind-bending plots and cleverly written twists that blur the line between reality and imagination, with deep philosophical undertones.
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-600">
                                <div className="text-3xl mb-4">📚</div>
                                <h3 className="font-bold text-gray-800 dark:text-white mb-2">Hindi Literature</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Passionate about Hindi novels filled with emotion, mystery, and social realism that inspire my creative process.
                                </p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-600">
                                <div className="text-3xl mb-4">♟️</div>
                                <h3 className="font-bold text-gray-800 dark:text-white mb-2">Chess Strategy</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    A perfect mix of logic and foresight that sharpens strategic thinking and patience through mental workouts.
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Enhanced Music Section */}
                <motion.section 
                    variants={itemVariants} 
                    className="mb-16"
                >
                    <div ref={musicSection.elementRef as any}></div>
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-900 dark:to-gray-800 rounded-3xl p-8 md:p-10 shadow-2xl border border-pink-200/50 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white flex items-center">
                                <span className="text-3xl mr-4">🎧</span>
                                Music – My Daily Companion
                            </h2>
                            <button
                                onClick={() => markAsFavorite('music')}
                                onMouseEnter={playHoverSound}
                                className={`p-2 rounded-full transition-colors duration-300 hover:scale-110 transform ${
                                    favoriteSection === 'music' 
                                        ? 'bg-yellow-500 text-white' 
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                }`}
                            >
                                <Heart className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={musicSection.isVisible ? { opacity: 1 } : {}}
                            transition={{ duration: 0.8 }}
                            className="space-y-6 text-gray-700 dark:text-gray-300"
                        >
                            <p className="text-lg leading-relaxed">
                                <strong>Music is my constant companion—</strong> no matter what I&apos;m doing, there&apos;s usually a song playing in the background. I don&apos;t stick to just one genre; instead, I explore every type of music based on my mood and the moment.
                            </p>
                            
                            <div className="grid md:grid-cols-3 gap-6 mt-8">
                                {[
                                    {
                                        title: "🌙 Coding Sessions",
                                        description: "Soft instrumental or lofi beats for deep focus during late-night coding sessions",
                                        gradient: "from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30"
                                    },
                                    {
                                        title: "⚡ High Energy",
                                        description: "Upbeat tracks and emotional Hindi songs that match my vibe and energy levels",
                                        gradient: "from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30"
                                    },
                                    {
                                        title: "🎵 Diverse Genres",
                                        description: "Classic oldies, Bollywood, English pop, movie OSTs, and anime soundtracks",
                                        gradient: "from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30"
                                    }
                                ].map((mood, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 30 }}
                                        animate={musicSection.isVisible ? { opacity: 1, y: 0 } : {}}
                                        transition={{ duration: 0.6, delay: index * 0.2 }}
                                        className={`bg-gradient-to-br ${mood.gradient} rounded-2xl p-6 border border-gray-200 dark:border-gray-600 cursor-pointer`}
                                        whileHover={{ scale: 1.02, y: -5 }}
                                        onMouseEnter={playHoverSound}
                                        onClick={playClickSound}
                                    >
                                        <h4 className="font-semibold text-gray-800 dark:text-white mb-3 text-lg">
                                            {mood.title}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {mood.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                            
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={musicSection.isVisible ? { opacity: 1, scale: 1 } : {}}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className="bg-white dark:bg-gray-800 p-6 rounded-2xl border-l-4 border-accent shadow-lg"
                            >
                                <p className="text-base italic text-gray-700 dark:text-gray-300 leading-relaxed">
                                    &ldquo;Music, for me, isn&apos;t just entertainment—it&apos;s therapy, motivation, and imagination fuel. It sets the tone for my thoughts, helps me concentrate, and brings back memories that make me feel alive.&rdquo;
                                </p>
                            </motion.div>
                            
                            {/* Music streaming platforms */}
                            <div className="flex flex-wrap justify-center gap-4 mt-8">
                                <span className="text-sm text-gray-500 dark:text-gray-400">Currently vibing on:</span>
                                {['Spotify', 'YouTube Music', 'Apple Music'].map((platform, index) => (
                                    <span 
                                        key={index}
                                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-400"
                                    >
                                        {platform}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Closing Section */}
                <motion.section variants={itemVariants}>
                    <div className="bg-gradient-to-r from-accent/10 to-purple-500/10 dark:from-accent/20 dark:to-purple-500/20 rounded-2xl p-8 text-center shadow-lg border border-accent/20">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                            Let&apos;s Create Something Remarkable
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                            This website isn&apos;t just a portfolio. It&apos;s a canvas of my thoughts, my experiments, my dreams. Feel free to dive deeper into any section — whether you&apos;re here to explore my work, collaborate, or just get inspired.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <span className="text-lg">Thanks for being here! 😊</span>
                            <div className="flex space-x-2">
                                <span className="animate-pulse">✨</span>
                                <span className="animate-pulse delay-100">🚀</span>
                                <span className="animate-pulse delay-200">💫</span>
                            </div>
                        </div>
                    </div>
                </motion.section>
            </motion.div>

            {/* Owner Controls */}
            <OwnerControls onOpenEditor={() => {/* Additional editing features can be added here */}} />
        </main>
    )
}
