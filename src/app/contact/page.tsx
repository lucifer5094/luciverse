// 📁 File: src/app/contact/page.tsx
'use client'

import { motion, useInView } from 'framer-motion'
import { useState, useRef, useEffect } from 'react'
import InlineEdit from '@/components/InlineEdit'

export default function ContactPage() {
    // Editable content state
    const [pageTitle, setPageTitle] = useState("Let's Connect")
    const [pageSubtitle, setPageSubtitle] = useState('Ready to collaborate, discuss ideas, or just say hello? I\'d love to hear from you!')
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [hoveredPlatform, setHoveredPlatform] = useState<string | null>(null)
    const [copySuccess, setCopySuccess] = useState(false)
    const [currentTime, setCurrentTime] = useState<Date | null>(null)
    const [isClient, setIsClient] = useState(false)

    const formRef = useRef(null)
    const isFormInView = useInView(formRef, { once: true, amount: 0.3 })

    // Set client-side flag and initialize time
    useEffect(() => {
        setIsClient(true)
        setCurrentTime(new Date())
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)
        return () => clearInterval(timer)
    }, [])

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text)
            setCopySuccess(true)
            setTimeout(() => setCopySuccess(false), 2000)
        } catch (err) {
            console.error('Failed to copy: ', err)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 2000))

        setIsSubmitting(false)
        setIsSubmitted(true)

        // Reset form after 3 seconds
        setTimeout(() => {
            setIsSubmitted(false)
            setFormData({ name: '', email: '', subject: '', message: '' })
        }, 3000)
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    }

    const cardVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.5 }
        },
        hover: {
            scale: 1.02,
            transition: { duration: 0.2 }
        }
    }

    return (
        <main className="min-h-screen px-6 py-24 flex flex-col items-center justify-start bg-gradient-to-b from-light-background to-white dark:from-dark-surface dark:to-black transition-colors duration-300 relative overflow-hidden">
            {/* Floating particles - only render on client */}
            {isClient && [...Array(6)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-accent/20 rounded-full"
                    animate={{
                        x: [Math.random() * 100, Math.random() * 100 + 200],
                        y: [Math.random() * 100, Math.random() * 100 + 200],
                        scale: [1, 1.5, 1],
                        opacity: [0.3, 0.7, 0.3]
                    }}
                    transition={{
                        duration: 10 + Math.random() * 10,
                        repeat: Infinity,
                        repeatType: "reverse"
                    }}
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`
                    }}
                />
            ))}

            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-6xl w-full relative z-10"
            >
                {/* Header Section */}
                <motion.div variants={itemVariants} className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-light-text dark:text-white mb-4">
                        <InlineEdit
                            type="text"
                            value={pageTitle}
                            onSave={setPageTitle}
                            placeholder="Enter page title..."
                            inline={true}
                        >
                            Get In <span className="text-accent bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">Touch</span>
                        </InlineEdit>
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        <InlineEdit
                            type="textarea"
                            value={pageSubtitle}
                            onSave={setPageSubtitle}
                            placeholder="Enter page subtitle..."
                            maxLength={200}
                            inline={true}
                        >
                            Ready to bring your ideas to life? Let&apos;s collaborate and create something amazing together.
                        </InlineEdit>
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Contact Information */}
                    <motion.div variants={itemVariants} className="space-y-8">
                        <motion.div
                            variants={cardVariants}
                            whileHover="hover"
                            className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
                        >
                            <h2 className="text-2xl font-bold text-light-text dark:text-white mb-6">
                                Let&apos;s Connect
                            </h2>

                            <div className="space-y-6">
                                <motion.div
                                    className="flex items-center space-x-4 group cursor-pointer"
                                    whileHover={{ x: 10 }}
                                    transition={{ duration: 0.2 }}
                                    onClick={() => copyToClipboard('hello@luciverse.dev')}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-accent to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-light-text dark:text-white">Email</h3>
                                        <p className="text-gray-600 dark:text-gray-400 group-hover:text-accent transition-colors duration-300">hello@luciverse.dev</p>
                                    </div>
                                    {copySuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="text-green-500 text-sm font-medium"
                                        >
                                            Copied!
                                        </motion.div>
                                    )}
                                </motion.div>

                                <motion.div
                                    className="flex items-center space-x-4 group"
                                    whileHover={{ x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-accentone to-accent rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-light-text dark:text-white">Location</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Available Worldwide</p>
                                    </div>
                                </motion.div>

                                <motion.div
                                    className="flex items-center space-x-4 group"
                                    whileHover={{ x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-light-text dark:text-white">Response Time</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Within 24 hours</p>
                                    </div>
                                </motion.div>

                                {/* Current Time */}
                                <motion.div
                                    className="flex items-center space-x-4 group"
                                    whileHover={{ x: 10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-light-text dark:text-white">Current Time</h3>
                                        <p className="text-gray-600 dark:text-gray-400 font-mono">
                                            {isClient && currentTime ?
                                                `${currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} UTC` :
                                                '--:-- UTC'
                                            }
                                        </p>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Platforms & Social Links */}
                        <motion.div
                            variants={cardVariants}
                            whileHover="hover"
                            className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
                        >
                            <h3 className="text-xl font-bold text-light-text dark:text-white mb-6">Connect & Code</h3>

                            {/* Professional & Social */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">Professional & Social</h4>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        {
                                            name: 'GitHub',
                                            icon: 'M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z',
                                            gradient: 'from-gray-700 to-gray-900',
                                            url: 'https://github.com/lucifer5094'
                                        },
                                        {
                                            name: 'LinkedIn',
                                            icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
                                            gradient: 'from-blue-600 to-blue-800',
                                            url: 'https://linkedin.com/in/lucifer5094'
                                        },
                                        {
                                            name: 'Twitter',
                                            icon: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
                                            gradient: 'from-sky-400 to-sky-600',
                                            url: 'https://x.com/AnkitRa55161882'
                                        },
                                        {
                                            name: 'Stack Overflow',
                                            icon: 'M17.36 20.2v-5.38h1.79V22H3.85v-7.18h1.79v5.38h11.72zM6.77 14.32l.37-1.76 8.79 1.85-.37 1.76-8.79-1.85zm1.16-4.21l.76-1.61 8.14 3.78-.76 1.61-8.14-3.78zm2.26-3.99l1.15-1.38 6.9 5.76-1.15 1.38-6.9-5.76zm4.45-4.25l1.44-1.11 5.56 7.23-1.44 1.11-5.56-7.23zM6.59 18.62v-1.79h8.99v1.79H6.59z',
                                            gradient: 'from-orange-500 to-orange-700',
                                            url: 'https://stackoverflow.com/users/23595116/lucifer'
                                        }
                                    ].map((platform) => (
                                        <motion.a
                                            key={platform.name}
                                            href={platform.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-10 h-10 bg-gradient-to-r ${platform.gradient} rounded-lg flex items-center justify-center text-white hover:scale-110 transition-all duration-300 group relative`}
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            whileTap={{ scale: 0.95 }}
                                            onMouseEnter={() => setHoveredPlatform(platform.name)}
                                            onMouseLeave={() => setHoveredPlatform(null)}
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d={platform.icon} />
                                            </svg>
                                            {hoveredPlatform === platform.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10"
                                                >
                                                    {platform.name}
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-black"></div>
                                                </motion.div>
                                            )}
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Competitive Programming */}
                            <div className="mb-6">
                                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">Competitive Programming</h4>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        {
                                            name: 'LeetCode',
                                            text: 'LC',
                                            gradient: 'from-yellow-400 to-orange-500',
                                            url: 'https://leetcode.com/u/lucifer5094/'
                                        },
                                        {
                                            name: 'Codeforces',
                                            text: 'CF',
                                            gradient: 'from-blue-500 to-indigo-600',
                                            url: 'https://codeforces.com/profile/Ankitraj5094'
                                        },
                                        {
                                            name: 'CodeChef',
                                            text: 'CC',
                                            gradient: 'from-amber-600 to-orange-600',
                                            url: 'https://www.codechef.com/users/lucifer5094'
                                        },
                                        {
                                            name: 'HackerRank',
                                            text: 'HR',
                                            gradient: 'from-green-500 to-emerald-600',
                                            url: 'https://www.hackerrank.com/profile/lucifer5094'
                                        },
                                        {
                                            name: 'AtCoder',
                                            text: 'AC',
                                            gradient: 'from-gray-600 to-gray-800',
                                            url: 'https://atcoder.jp/users/yourusername'
                                        },
                                        {
                                            name: 'TopCoder',
                                            text: 'TC',
                                            gradient: 'from-red-500 to-pink-600',
                                            url: 'https://www.topcoder.com/members/yourusername'
                                        }
                                    ].map((platform) => (
                                        <motion.a
                                            key={platform.name}
                                            href={platform.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-10 h-10 bg-gradient-to-r ${platform.gradient} rounded-lg flex items-center justify-center text-white font-bold text-xs hover:scale-110 transition-all duration-300 relative group`}
                                            whileHover={{ scale: 1.1, rotate: -5 }}
                                            whileTap={{ scale: 0.95 }}
                                            onMouseEnter={() => setHoveredPlatform(platform.name)}
                                            onMouseLeave={() => setHoveredPlatform(null)}
                                        >
                                            {platform.text}
                                            {hoveredPlatform === platform.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10"
                                                >
                                                    {platform.name}
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-black"></div>
                                                </motion.div>
                                            )}
                                        </motion.a>
                                    ))}
                                </div>
                            </div>

                            {/* Learning & Practice */}
                            <div>
                                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-3 uppercase tracking-wider">Learning & Practice</h4>
                                <div className="flex flex-wrap gap-3">
                                    {[
                                        {
                                            name: 'GeeksforGeeks',
                                            text: 'GfG',
                                            gradient: 'from-green-600 to-teal-600',
                                            url: 'https://auth.geeksforgeeks.org/user/lucifer5094'
                                        },
                                        {
                                            name: 'Hackerearth',
                                            text: 'HE',
                                            gradient: 'from-purple-500 to-indigo-600',
                                            url: 'https://www.hackerearth.com/@ankitraj85455'
                                        },
                                        {
                                            name: 'InterviewBit',
                                            text: 'IB',
                                            gradient: 'from-blue-600 to-cyan-600',
                                            url: 'https://www.interviewbit.com/profile/yourusername'
                                        },
                                        {
                                            name: 'CodePen',
                                            text: 'CP',
                                            gradient: 'from-gray-700 to-black',
                                            url: 'https://codepen.io/yourusername'
                                        },
                                        {
                                            name: 'Repl.it',
                                            text: 'RP',
                                            gradient: 'from-orange-500 to-red-500',
                                            url: 'https://replit.com/@lucifer5094'
                                        },
                                        {
                                            name: 'Kaggle',
                                            text: 'KG',
                                            gradient: 'from-cyan-400 to-blue-500',
                                            url: 'https://www.kaggle.com/lucifer5094'
                                        },
                                        {
                                            name: 'DEV.to',
                                            text: 'DV',
                                            gradient: 'from-black to-gray-800',
                                            url: 'https://dev.to/yourusername'
                                        },
                                        {
                                            name: 'Medium',
                                            text: 'MD',
                                            gradient: 'from-gray-800 to-black',
                                            url: 'https://medium.com/@yourusername'
                                        }
                                    ].map((platform) => (
                                        <motion.a
                                            key={platform.name}
                                            href={platform.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`w-10 h-10 bg-gradient-to-r ${platform.gradient} rounded-lg flex items-center justify-center text-white font-bold text-xs hover:scale-110 transition-all duration-300 relative group`}
                                            whileHover={{ scale: 1.1, rotate: 3 }}
                                            whileTap={{ scale: 0.95 }}
                                            onMouseEnter={() => setHoveredPlatform(platform.name)}
                                            onMouseLeave={() => setHoveredPlatform(null)}
                                        >
                                            {platform.text}
                                            {hoveredPlatform === platform.name && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded whitespace-nowrap z-10"
                                                >
                                                    {platform.name}
                                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-black"></div>
                                                </motion.div>
                                            )}
                                        </motion.a>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        ref={formRef}
                        variants={itemVariants}
                        initial="hidden"
                        animate={isFormInView ? "visible" : "hidden"}
                    >
                        <motion.div
                            variants={cardVariants}
                            whileHover="hover"
                            className="bg-white dark:bg-dark-surface p-8 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 relative overflow-hidden"
                        >
                            {/* Animated background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative z-10">
                                <h2 className="text-2xl font-bold text-light-text dark:text-white mb-6 flex items-center">
                                    <motion.span
                                        animate={{ rotate: [0, 10, -10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                        className="mr-2"
                                    >
                                        ✉️
                                    </motion.span>
                                    Send a Message
                                </h2>

                                {isSubmitted ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-8"
                                    >
                                        <motion.div
                                            className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
                                            animate={{ scale: [1, 1.1, 1] }}
                                            transition={{ duration: 1, repeat: 2 }}
                                        >
                                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <motion.path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                    initial={{ pathLength: 0 }}
                                                    animate={{ pathLength: 1 }}
                                                    transition={{ duration: 0.5 }}
                                                />
                                            </svg>
                                        </motion.div>
                                        <h3 className="text-xl font-semibold text-light-text dark:text-white mb-2">Message Sent!</h3>
                                        <p className="text-gray-600 dark:text-gray-400">Thank you for reaching out. I&apos;ll get back to you soon!</p>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <motion.div
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 }}
                                                className="group"
                                            >
                                                <label htmlFor="name" className="block text-sm font-medium text-light-text dark:text-white mb-2 group-focus-within:text-accent transition-colors">
                                                    Full Name *
                                                </label>
                                                <motion.input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-light-text dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 hover:border-accent/50"
                                                    placeholder="John Doe"
                                                    whileFocus={{ scale: 1.02 }}
                                                />
                                            </motion.div>

                                            <motion.div
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="group"
                                            >
                                                <label htmlFor="email" className="block text-sm font-medium text-light-text dark:text-white mb-2 group-focus-within:text-accent transition-colors">
                                                    Email Address *
                                                </label>
                                                <motion.input
                                                    type="email"
                                                    id="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-light-text dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 hover:border-accent/50"
                                                    placeholder="john@example.com"
                                                    whileFocus={{ scale: 1.02 }}
                                                />
                                            </motion.div>
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="group"
                                        >
                                            <label htmlFor="subject" className="block text-sm font-medium text-light-text dark:text-white mb-2 group-focus-within:text-accent transition-colors">
                                                Subject *
                                            </label>
                                            <motion.input
                                                type="text"
                                                id="subject"
                                                name="subject"
                                                value={formData.subject}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-light-text dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 hover:border-accent/50"
                                                placeholder="Project Collaboration"
                                                whileFocus={{ scale: 1.02 }}
                                            />
                                        </motion.div>

                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="group"
                                        >
                                            <label htmlFor="message" className="block text-sm font-medium text-light-text dark:text-white mb-2 group-focus-within:text-accent transition-colors">
                                                Message *
                                            </label>
                                            <motion.textarea
                                                id="message"
                                                name="message"
                                                value={formData.message}
                                                onChange={handleInputChange}
                                                required
                                                rows={6}
                                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-800 text-light-text dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all duration-300 resize-none hover:border-accent/50"
                                                placeholder="Tell me about your project..."
                                                whileFocus={{ scale: 1.02 }}
                                            />
                                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                {formData.message.length}/500 characters
                                            </p>
                                        </motion.div>

                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-gradient-to-r from-accent to-purple-500 text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed relative overflow-hidden group"
                                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-accent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            <div className="relative z-10 flex items-center justify-center space-x-2">
                                                {isSubmitting ? (
                                                    <>
                                                        <motion.div
                                                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                            animate={{ rotate: 360 }}
                                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        />
                                                        <span>Sending...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span>Send Message</span>
                                                        <motion.svg
                                                            className="w-5 h-5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                            initial={{ x: 0 }}
                                                            whileHover={{ x: 5 }}
                                                            transition={{ duration: 0.2 }}
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                                        </motion.svg>
                                                    </>
                                                )}
                                            </div>
                                        </motion.button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.div>
        </main>
    )
}