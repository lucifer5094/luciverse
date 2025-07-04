import type { Config } from 'tailwindcss'


const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  safelist: [
    // Dynamic color classes
    'bg-blue-100', 'bg-blue-900/30', 'text-blue-600', 'text-blue-400',
    'bg-green-100', 'bg-green-900/30', 'text-green-600', 'text-green-400',
    'bg-purple-100', 'bg-purple-900/30', 'text-purple-600', 'text-purple-400',
    'bg-emerald-100', 'bg-emerald-900/30', 'text-emerald-600', 'text-emerald-400',
    'bg-orange-100', 'bg-orange-900/30', 'text-orange-600', 'text-orange-400',
    'bg-red-100', 'bg-red-900/30', 'text-red-600', 'text-red-400',
    'bg-indigo-100', 'bg-indigo-900/30', 'text-indigo-600', 'text-indigo-400',
    'bg-pink-100', 'bg-pink-900/30', 'text-pink-600', 'text-pink-400',
    'bg-yellow-100', 'bg-yellow-900/30', 'text-yellow-600', 'text-yellow-400',
    'bg-teal-100', 'bg-teal-900/30', 'text-teal-600', 'text-teal-400',
  ],
  theme: {
    extend: {
      colors: {
        'light-background': '#f4f4f9',
        'light-text': '#1f2937',
        'dark-background': '#0f172a',
        'dark-text': '#f8fafc',
        'dark-surface': '#1e293b',
        accent: '#7dd3fc',
        'accentone' : '#4CA080',
      },
    },
  },
  plugins: [],
}
export default config
