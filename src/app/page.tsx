// 📁 File: src/app/page.tsx
'use client'

import Link from 'next/link'
import { motion, useScroll, useTransform, Variants } from 'framer-motion'
import { useRef, useState } from 'react'
import OwnerControls from '@/components/OwnerControls'
import OwnerEditPanel from '@/components/OwnerEditPanel'
import InlineEdit from '@/components/InlineEdit'

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [showEditPanel, setShowEditPanel] = useState(false)

  // Editable content state
  const [heroTitle, setHeroTitle] = useState('Welcome to Luciverse')
  const [heroSubtitle, setHeroSubtitle] = useState('Dive into my universe of development, design, and digital experiments')

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
        duration: 0.6,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.6
      }
    }
  }

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Enhanced animated background elements */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accentone/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-pulse delay-500"></div>

        {/* Additional floating elements */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute bottom-1/4 left-1/4 w-52 h-52 bg-blue-500/8 rounded-full blur-2xl animate-pulse delay-300"></div>

        {/* Geometric shapes */}
        <div className="absolute top-20 right-20 w-32 h-32 border border-accent/10 rounded-lg rotate-45 animate-spin" style={{ animationDuration: '20s' }}></div>
        <div className="absolute bottom-32 left-20 w-24 h-24 border border-accentone/10 rounded-full animate-ping" style={{ animationDuration: '4s' }}></div>
      </div>

      <main className="min-h-screen flex flex-col justify-center items-center px-4 py-16 bg-gradient-to-br from-light-background via-white to-gray-50 dark:from-dark-surface dark:via-dark-background dark:to-black transition-colors duration-300">
        <motion.div
          style={{ y, opacity }}
          className="text-center mb-16"
        >
          <motion.h1
            initial={{ opacity: 0, y: -30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-center text-light-text dark:text-white mb-6 leading-tight"
          >
            <InlineEdit
              type="text"
              value={heroTitle}
              onSave={setHeroTitle}
              placeholder="Enter hero title..."
              maxLength={50}
              inline={true}
            >
              Welcome to{' '}
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-accentone"
                initial={{ backgroundPosition: "0%" }}
                animate={{ backgroundPosition: "100%" }}
                transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
              >
                Luciverse
              </motion.span>
            </InlineEdit>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="relative"
          >
            <p className="max-w-3xl text-center text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              <InlineEdit
                type="textarea"
                value={heroSubtitle}
                onSave={setHeroSubtitle}
                placeholder="Enter hero subtitle..."
                maxLength={200}
                inline={true}
              >
                Dive into my universe of{' '}
                <motion.span
                  className="text-accent font-semibold"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  development
                </motion.span>
                ,{' '}
                <motion.span
                  className="text-accentone font-semibold"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  design
                </motion.span>
                , and digital experiments
              </InlineEdit>
            </p>

            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="h-1 w-32 bg-gradient-to-r from-accent to-accentone mx-auto rounded-full"
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-7xl px-4 mb-16"
        >
          {[
            {
              title: 'Projects',
              path: '/projects',
              icon: '🛠️',
              description: 'Explore my latest creations and innovations',
              gradient: 'from-blue-500 to-purple-600',
              accentColor: 'blue'
            },
            {
              title: 'About Me',
              path: '/about',
              icon: '👨‍🚀',
              description: 'Discover my journey and expertise',
              gradient: 'from-green-500 to-teal-600',
              accentColor: 'green'
            },
            {
              title: 'Vault',
              path: '/vault',
              icon: '🧠',
              description: 'Access my knowledge repository',
              gradient: 'from-purple-500 to-pink-600',
              accentColor: 'purple'
            },
            {
              title: 'Lab',
              path: '/lab',
              icon: '🧪',
              description: 'Witness experiments in progress',
              gradient: 'from-orange-500 to-red-600',
              accentColor: 'orange'
            },
            {
              title: 'Logs',
              path: '/logs',
              icon: '📓',
              description: 'Read my thoughts and insights',
              gradient: 'from-indigo-500 to-blue-600',
              accentColor: 'indigo'
            },
            {
              title: 'Contact',
              path: '/contact',
              icon: '📬',
              description: 'Let\'s connect and collaborate',
              gradient: 'from-pink-500 to-rose-600',
              accentColor: 'pink'
            }
          ].map(({ title, path, icon, description, gradient, accentColor }, index) => (
            <motion.div
              key={path}
              custom={index}
              variants={cardVariants}
              whileHover="hover"
              onHoverStart={() => setHoveredCard(path)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative group"
            >
              <Link href={path} className="block">
                <div className="relative overflow-hidden rounded-2xl bg-white/80 dark:bg-dark-background/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 p-8 h-full">
                  {/* Enhanced gradient overlay on hover */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500 rounded-2xl`}
                  />

                  {/* Glowing border effect */}
                  <motion.div
                    className={`absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500`}
                    style={{
                      background: `linear-gradient(135deg, transparent, transparent), linear-gradient(135deg, var(--accent), var(--accentone))`,
                      backgroundClip: 'border-box, border-box',
                      WebkitBackgroundClip: 'border-box, border-box'
                    }}
                  />

                  {/* Floating icon effect with enhanced animation */}
                  <motion.div
                    className="text-5xl mb-6 relative z-10 filter drop-shadow-lg"
                    animate={hoveredCard === path ? {
                      y: [-8, 8, -8],
                      rotate: [-8, 8, -8],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {icon}
                  </motion.div>

                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 relative z-10 group-hover:text-accent transition-colors duration-300">
                    {title}
                  </h2>

                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed relative z-10 mb-4">
                    {description}
                  </p>

                  {/* Progress bar animation */}
                  <motion.div
                    className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden relative z-10 mb-4"
                    initial={{ width: 0 }}
                  >
                    <motion.div
                      className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                      initial={{ x: '-100%' }}
                      animate={hoveredCard === path ? { x: '0%' } : { x: '-100%' }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </motion.div>

                  {/* Animated arrow with enhanced styling */}
                  <motion.div
                    className="absolute bottom-6 right-6 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300"
                    animate={hoveredCard === path ? {
                      x: [0, 8, 0],
                      scale: [1, 1.2, 1]
                    } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="relative">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-md"
                      >
                        <path
                          d="M7 17L17 7M17 7H7M17 7V17"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>

                      {/* Glow effect */}
                      <div className="absolute inset-0 bg-accent/20 rounded-full blur-md scale-150 opacity-50"></div>
                    </div>
                  </motion.div>

                  {/* Corner decorations */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-accent/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-4 left-4 w-2 h-2 bg-accentone/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Contact CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.8 }}
          className="relative mt-16 w-full max-w-6xl"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent/10 via-purple-500/10 to-accentone/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-2xl p-12">
            {/* Animated background pattern */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-accent/20 to-transparent rotate-12 transform scale-150"></div>
              <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-l from-accentone/20 to-transparent -rotate-12 transform scale-150"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.2, duration: 0.6 }}
                className="text-5xl mb-6"
              >
                📬
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.4, duration: 0.6 }}
                className="text-4xl md:text-5xl font-bold text-light-text dark:text-white mb-6"
              >
                Let's Connect
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.6, duration: 0.6 }}
                className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
              >
                Ready to collaborate on something amazing? Let's discuss your ideas and bring them to life together.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 3.8, duration: 0.6 }}
                className="flex flex-wrap justify-center gap-4"
              >
                <Link href="/contact">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-accentone text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span>Get In Touch</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      ✨
                    </motion.div>
                  </motion.button>
                </Link>

                <Link href="/projects">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/10 backdrop-blur-sm border border-white/20 text-light-text dark:text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    View My Work
                  </motion.button>
                </Link>
              </motion.div>
            </div>

            {/* Floating elements */}
            <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-gradient-to-r from-accent to-accentone rounded-full opacity-60"
                  style={{
                    left: `${15 + i * 12}%`,
                    top: `${20 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [-15, 15, -15],
                    x: [-10, 10, -10],
                    opacity: [0.3, 0.8, 0.3],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 4 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Enhanced scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center relative"
          >
            <motion.div
              animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-4 bg-gradient-to-b from-accent to-accentone rounded-full mt-2"
            />

            {/* Glow effect */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 border-2 border-accent/30 rounded-full blur-sm"
            />
          </motion.div>
        </motion.div>

        {/* About Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="w-full max-w-6xl mx-auto mb-20 px-4"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-dark-background/90 dark:to-dark-surface/90 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-xl p-8 md:p-12">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent/20 to-transparent rounded-bl-full"></div>

            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <motion.h2
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="text-3xl md:text-4xl font-bold text-light-text dark:text-white mb-4"
                >
                  Meet the Creator
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                  className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed"
                >
                  I'm a passionate developer crafting digital experiences that blend creativity with cutting-edge technology.
                  From web applications to experimental projects, I explore the boundaries of what's possible.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, duration: 0.6 }}
                >
                  <Link href="/about">
                    <motion.button
                      whileHover={{ scale: 1.05, x: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-accent to-accentone text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      Read More
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.button>
                  </Link>
                </motion.div>
              </div>

              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.6, duration: 0.8 }}
                  className="relative w-full h-64 bg-gradient-to-br from-accent/20 to-accentone/20 rounded-2xl flex items-center justify-center"
                >
                  <div className="text-6xl">👨‍💻</div>
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-accentone/10 rounded-2xl blur-xl"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Featured Projects Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="w-full max-w-7xl mx-auto mb-20 px-4"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold text-center text-light-text dark:text-white mb-4"
          >
            Featured Projects
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="text-xl text-gray-600 dark:text-gray-300 text-center mb-12 max-w-2xl mx-auto"
          >
            Discover some of my latest creations and innovations
          </motion.p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "AI-Powered Web App",
                description: "A sophisticated web application leveraging machine learning to provide intelligent user experiences.",
                tech: ["React", "Python", "TensorFlow"],
                gradient: "from-blue-500 to-purple-600",
                icon: "🤖"
              },
              {
                title: "E-Commerce Platform",
                description: "Full-stack e-commerce solution with modern design and seamless user experience.",
                tech: ["Next.js", "Node.js", "PostgreSQL"],
                gradient: "from-green-500 to-teal-600",
                icon: "🛒"
              },
              {
                title: "Data Visualization Tool",
                description: "Interactive dashboard for complex data analysis and beautiful visualizations.",
                tech: ["D3.js", "React", "MongoDB"],
                gradient: "from-orange-500 to-red-600",
                icon: "📊"
              }
            ].map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-dark-background/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl transition-all duration-500 p-6"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>

                <div className="relative z-10">
                  <div className="text-4xl mb-4">{project.icon}</div>
                  <h3 className="text-xl font-bold text-light-text dark:text-white mb-3 group-hover:text-accent transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <motion.div
                    className="flex items-center gap-2 text-accent font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ x: 5 }}
                  >
                    View Project
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.4, duration: 0.6 }}
            className="text-center mt-12"
          >
            <Link href="/projects">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-accent to-accentone text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All Projects
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Lab Teaser Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="w-full max-w-6xl mx-auto mb-20 px-4"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/50 shadow-xl p-8 md:p-12">
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-transparent rounded-br-full"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-orange-500/20 to-transparent rounded-tl-full"></div>

            <div className="relative z-10 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.6, duration: 0.6 }}
                className="text-6xl mb-6"
              >
                🧪
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.8, duration: 0.6 }}
                className="text-3xl md:text-4xl font-bold text-light-text dark:text-white mb-4"
              >
                The Experiment Lab
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2, duration: 0.6 }}
                className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto"
              >
                Step into my digital laboratory where ideas come to life. Interactive demos,
                experimental features, and playground projects await your exploration.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.2, duration: 0.6 }}
              >
                <Link href="/lab">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <span>Try Something Fun</span>
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      ⚡
                    </motion.div>
                  </motion.button>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Timeline Teaser Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="w-full max-w-6xl mx-auto mb-20 px-4"
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-center text-light-text dark:text-white mb-4"
          >
            Latest from the Timeline
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2, duration: 0.6 }}
            className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-2xl mx-auto"
          >
            Recent thoughts, development notes, and insights from my journey
          </motion.p>

          <div className="space-y-6">
            {[
              {
                date: "2 days ago",
                title: "Building Scalable React Components",
                excerpt: "Exploring advanced patterns for creating reusable and maintainable component libraries...",
                tag: "Development",
                icon: "⚛️"
              },
              {
                date: "1 week ago",
                title: "The Future of Web Development",
                excerpt: "Thoughts on emerging technologies and how they're shaping the next generation of web applications...",
                tag: "Insights",
                icon: "🚀"
              }
            ].map((log, index) => (
              <motion.div
                key={log.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 2.2 + index * 0.2, duration: 0.6 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-dark-background/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 shadow-lg hover:shadow-xl transition-all duration-500 p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{log.icon}</div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-3 py-1 text-sm bg-accent/10 text-accent rounded-full">
                        {log.tag}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {log.date}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-light-text dark:text-white mb-2 group-hover:text-accent transition-colors duration-300">
                      {log.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {log.excerpt}
                    </p>
                  </div>

                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ x: 5 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-accent">
                      <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.8, duration: 0.6 }}
            className="text-center mt-8"
          >
            <Link href="/logs">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 text-light-text dark:text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                View All Logs
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>

        {/* Owner Controls */}
        <OwnerControls onOpenEditor={() => setShowEditPanel(true)} />

        {/* Owner Edit Panel */}
        <OwnerEditPanel 
          isVisible={showEditPanel} 
          onClose={() => setShowEditPanel(false)} 
        />
      </main>
    </div>
  )
}
