// 📁 File: src/app/about/page.tsx
'use client'

import { motion } from 'framer-motion'

export default function AboutPage() {
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
                    About <span className="text-accent bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">Me</span>
                </motion.h1>
                
                <motion.p
                    variants={itemVariants}
                    className="text-center text-gray-600 dark:text-gray-400 mb-12 text-lg"
                >
                    Developer • AI Enthusiast • Creative Thinker
                </motion.p>

                {/* Introduction Section */}
                <motion.section variants={itemVariants} className="mb-12">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <span className="text-2xl mr-3">👋</span>
                            Introduction
                        </h2>
                        <div className="space-y-4 text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            <p>
                                Hey! I&apos;m <span className="font-semibold text-accent">Ankit Raj</span>, currently pursuing B.Tech in Computer Science with a specialization in Artificial Intelligence and Machine Learning. My journey started not from coaching centers or big-city schools—but from deep curiosity, a laptop, and countless nights of self-learning.
                            </p>
                            <p>
                                From building mini-bots in my early teens to developing intelligent web apps and models today, my passion lies in creating things that not only work — but feel futuristic. I believe technology should feel magical yet meaningful.
                            </p>
                        </div>
                    </div>
                </motion.section>

                {/* Projects Section */}
                <motion.section variants={itemVariants} className="mb-12">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-blue-200 dark:border-gray-700">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <span className="text-2xl mr-3">🚀</span>
                            Featured Projects
                        </h2>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                            I&apos;ve worked on a variety of projects that showcase my passion for innovation:
                        </p>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { name: "Luciverse", desc: "A personalized universe of my creations and ideas", icon: "🌌" },
                                { name: "AIDA", desc: "Custom AI chatbot designed with empathy and utility in mind", icon: "🤖" },
                                { name: "Smart WaterBoat", desc: "IoT-based autonomous water pollution monitoring system", icon: "🚤" },
                                { name: "AlgoGenesis", desc: "Next.js-powered platform to share algorithms and coding knowledge", icon: "📚" }
                            ].map((project, index) => (
                                <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-md border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-300">
                                    <div className="flex items-start space-x-3">
                                        <span className="text-2xl">{project.icon}</span>
                                        <div>
                                            <h3 className="font-bold text-gray-800 dark:text-white">{project.name}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">{project.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Personal Interests Section */}
                <motion.section variants={itemVariants} className="mb-12">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-purple-200 dark:border-gray-700">
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
                    <div className="bg-gradient-to-br from-green-50 to-teal-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-green-200 dark:border-gray-700">
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

                {/* Philosophy & Vision Section */}
                <motion.section variants={itemVariants} className="mb-12">
                    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 shadow-lg border border-orange-200 dark:border-gray-700">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                            <span className="text-2xl mr-3">🌌</span>
                            Philosophy & Vision
                        </h2>
                        <div className="space-y-4 text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                            <p>
                                Philosophically, I admire the beauty of the cosmos — hence the name <span className="text-accent font-semibold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">Luciverse</span>. My dream is to contribute to the future of human-AI collaboration.
                            </p>
                            <p>
                                Whether it&apos;s AI art, language models, or drone swarms — I want to build tools that <strong>empower, not replace</strong>. Technology should enhance human creativity and potential, creating a future where humans and AI work together harmoniously.
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
