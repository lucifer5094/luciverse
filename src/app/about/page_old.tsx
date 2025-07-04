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

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="max-w-4xl text-base md:text-lg text-gray-700 dark:text-gray-300 leading-relaxed space-y-6"
                >
                    <p>
                        Hey! I&apos;m <span className="font-semibold text-accent">Ankit Raj</span>, currently pursuing B.Tech in Computer Science with a specialization in Artificial Intelligence and Machine Learning. My journey started not from coaching centers or big-city schools—but from deep curiosity, a laptop, and countless nights of self-learning.
                    </p>

                    <p>
                        From building mini-bots in my early teens to developing intelligent web apps and models today, my passion lies in creating things that not only work — but feel futuristic. I believe technology should feel magical yet meaningful.
                    </p>

                    <p>
                        I&apos;ve worked on a variety of projects including:
                    </p>
                    <ul className="list-disc ml-6 space-y-2">
                        <li>🔹 <strong>Luciverse</strong> — a personalized universe of my creations and ideas.</li>
                        <li>🔹 <strong>AIDA</strong> — my custom AI chatbot project designed with empathy and utility in mind.</li>
                        <li>🔹 <strong>Smart WaterBoat</strong> — an IoT-based autonomous water pollution monitoring system.</li>
                        <li>🔹 <strong>AlgoGenesis</strong> — a Next.js-powered platform to share algorithms and coding knowledge.</li>
                    </ul>

                    <p>🎯 Personal Interests</p>
                    <ul className='list-disc ml-6 space-y-2'>
                        <li><strong> 🎬 Fantasy, Thriller & Suspense Web Series — </strong> There&apos;s nothing like a mind-bending plot or a cleverly written twist to keep me hooked. I especially enjoy stories that blur the line between reality and imagination, often with deep philosophical or psychological undertones.</li>

                        <li> <strong> 📚 Hindi Novels — </strong> I&apos;ve got a soft spot for Hindi literature, especially those filled with emotion, mystery, or social realism. Reading helps me unwind, reflect, and sometimes even inspire my creative process.</li>

                        <li><strong> ♟️ Chess — </strong> A perfect mix of logic and foresight. Chess isn&apos;t just a game for me—it&apos;s a mental workout that helps sharpen my strategic thinking and patience. </li>

                    </ul>

                    <br />
                    <h1 className='font-bold text-accentone' >🎧 Music – My Daily Companion </h1 >

                    <p> <strong> Music is my constant companion— </strong> no matter what I&apos;m doing, there&apos;s usually a song playing in the background. I don&apos;t stick to just one genre; instead, I explore every type of music based on my mood and the moment.

                        <ul className='list-disc ml-6 space-y-2'>
                            <li> Sometimes it&apos;s soft instrumental or lofi beats when I&apos;m focused and coding deep into the night. </li>

                            <li> Other times, I go for high-energy tracks to match my vibe or emotional Hindi songs that hit differently. </li>

                            <li> Be it classic oldies, modern Bollywood, English pop, or even OSTs from movies or anime, I enjoy diving into the emotion and rhythm of it all. </li>
                        </ul>

                        Music, for me, isn&apos;t just entertainment—it&apos;s therapy, motivation, and sometimes even imagination fuel. It sets the tone for my thoughts, helps me concentrate, and brings back memories that make me feel alive. </p>

                    <p>
                        Philosophically, I admire the beauty of the cosmos — hence the name <span className="text-accent font-medium">Luciverse</span>. My dream is to contribute to the future of human-AI collaboration. Whether it&apos;s AI art, language models, or drone swarms — I want to build tools that empower, not replace.
                    </p>

                    <p>
                        This website isn&apos;t just a portfolio. It&apos;s a canvas of my thoughts, my experiments, my dreams. Feel free to dive deeper into any section — whether you&apos;re here to explore my work, collaborate, or just get inspired. 😊
                    </p>

                    <p>
                        Thanks for being here. Let&apos;s connect and create something remarkable!
                    </p>
                </motion.div>
            </motion.div>
        </main>
    )
}
