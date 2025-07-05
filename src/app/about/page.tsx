// 📁 File: src/app/about/page.tsx
'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import InlineEdit from '@/components/InlineEdit'
import { dataAPI } from '@/utils/dataAPI'

export default function AboutPage() {
    // Editable content state - loaded from JSON
    const [pageTitle, setPageTitle] = useState('About Me')
    const [pageSubtitle, setPageSubtitle] = useState('Developer • AI Enthusiast • Creative Thinker')
    const [pageContent, setPageContent] = useState('Welcome to my digital space! I\'m a passionate developer who thrives on turning complex problems into elegant solutions. My journey in technology began with curiosity and has evolved into a deep love for creating meaningful digital experiences.\n\nFrom building responsive web applications to experimenting with AI and machine learning, I\'m constantly pushing the boundaries of what\'s possible. Each project is an opportunity to learn, grow, and contribute to the ever-evolving landscape of technology.')
    const [loading, setLoading] = useState(true)

    // Load content from JSON file
    useEffect(() => {
        loadSiteContent()
    }, [])

    const loadSiteContent = async () => {
        try {
            setLoading(true)
            const content = await dataAPI.getSiteContent()
            setPageTitle(content.aboutTitle)
            setPageSubtitle(content.aboutSubtitle)
            setPageContent(content.aboutContent)
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
        } catch (error) {
            console.error('Failed to save about content:', error)
        }
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
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6 }
        }
    }

    return (
        <main className="min-h-screen px-6 py-24 flex flex-col items-center justify-start bg-gradient-to-b from-light-background to-white dark:from-dark-surface dark:to-black transition-colors duration-300">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="max-w-5xl w-full"
            >
                <motion.h1
                    variants={itemVariants}
                    className="text-4xl md:text-6xl font-bold text-light-text dark:text-white mb-4 text-center"
                >
                    <InlineEdit
                        type="text"
                        value={pageTitle}
                        onSave={handleSaveTitle}
                        placeholder="Enter page title..."
                        inline={true}
                    >
                        {pageTitle.includes('Me') ? (
                            <>About <span className="text-accent bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">Me</span></>
                        ) : (
                            pageTitle
                        )}
                    </InlineEdit>
                </motion.h1>

                <motion.p
                    variants={itemVariants}
                    className="text-center text-gray-600 dark:text-gray-400 mb-12 text-lg"
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

                {/* About Content Section */}
                <motion.section variants={itemVariants} className="mb-12">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                        <div className="text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                            <InlineEdit
                                type="textarea"
                                value={pageContent}
                                onSave={handleSaveContent}
                                placeholder="Enter about content..."
                                maxLength={1000}
                            >
                                {pageContent}
                            </InlineEdit>
                        </div>
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
                                    Hey! I&apos;m <span className="font-semibold text-accent">Ankit Raj</span>, currently pursuing B.Tech in Computer Science with a specialization in Artificial Intelligence and Machine Learning. My journey started not from coaching centers or big-city schools—but from deep curiosity, a laptop, and countless nights of self-learning.
                                </p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                                    <span className="text-lg mr-2">💡</span>
                                    My Story
                                </h3>
                                <p>
                                    From building mini-bots in my early teens to developing intelligent web apps and models today, my passion lies in creating things that not only work — but feel futuristic. I believe technology should feel magical yet meaningful. My path has been unconventional, driven by genuine curiosity rather than traditional academic routes.
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
                                <strong>What drives me?</strong> The infinite possibilities of artificial intelligence fascinate me. It&apos;s not just about building smart systems—it&apos;s about creating technology that understands, learns, and adapts like we do.
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 mt-6">
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                                        <span className="mr-2">🧠</span>
                                        Human-AI Synergy
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        I&apos;m passionate about creating AI that amplifies human creativity rather than replacing it. The future lies in collaboration, not competition.
                                    </p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
                                        <span className="mr-2">🌍</span>
                                        Real-world Impact
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        From environmental monitoring to empathetic chatbots, I want to build AI solutions that solve actual problems and improve lives.
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
                                    &ldquo;Philosophically, I admire the beauty of the cosmos — hence the name <span className="text-accent font-semibold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">Luciverse</span>. My dream is to contribute to the future of human-AI collaboration.&rdquo;
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Skills & Tools Section */}
                <motion.section variants={itemVariants} className="mb-12">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-purple-200 dark:border-gray-700">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <span className="text-2xl mr-3">🛠️</span>
                            Skills & Tools
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-600">
                                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                                    <span className="mr-2">💻</span>
                                    Programming
                                </h3>
                                <div className="space-y-2">
                                    {['C++','Python', 'JavaScript/TypeScript', 'React/Next.js', 'Node.js', 'HTML/CSS'].map((skill, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-600">
                                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                                    <span className="mr-2">🤖</span>
                                    AI/ML
                                </h3>
                                <div className="space-y-2">
                                    {['TensorFlow/Keras', 'PyTorch', 'Scikit-learn', 'OpenCV', 'NLP & Computer Vision'].map((skill, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-600">
                                <h3 className="font-bold text-gray-800 dark:text-white mb-4 flex items-center">
                                    <span className="mr-2">🔧</span>
                                    Tools & Platforms
                                </h3>
                                <div className="space-y-2">
                                    {['Git/GitHub',  'AWS/Cloud', 'Arduino/IoT'].map((skill, index) => (
                                        <div key={index} className="flex items-center">
                                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
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

                {/* Music Section */}
                <motion.section variants={itemVariants} className="mb-12">
                    <div className="bg-gradient-to-br from-pink-50 to-rose-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-pink-200 dark:border-gray-700">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <span className="text-2xl mr-3">🎧</span>
                            Music – My Daily Companion
                        </h2>
                        <div className="space-y-4 text-gray-700 dark:text-gray-300">
                            <p className="text-lg">
                                <strong>Music is my constant companion—</strong> no matter what I&apos;m doing, there&apos;s usually a song playing in the background. I don&apos;t stick to just one genre; instead, I explore every type of music based on my mood and the moment.
                            </p>
                            <div className="grid md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">🌙 Coding Sessions</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Soft instrumental or lofi beats for deep focus during late-night coding sessions</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">⚡ High Energy</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Upbeat tracks and emotional Hindi songs that match my vibe and energy levels</p>
                                </div>
                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                                    <h4 className="font-semibold text-gray-800 dark:text-white mb-2">🎵 Diverse Genres</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Classic oldies, Bollywood, English pop, movie OSTs, and anime soundtracks</p>
                                </div>
                            </div>
                            <p className="text-base italic bg-white dark:bg-gray-800 p-4 rounded-lg border-l-4 border-accent">
                                &ldquo;Music, for me, isn&apos;t just entertainment—it&apos;s therapy, motivation, and imagination fuel. It sets the tone for my thoughts, helps me concentrate, and brings back memories that make me feel alive.&rdquo;
                            </p>
                        </div>
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
        </main>
    )
}
