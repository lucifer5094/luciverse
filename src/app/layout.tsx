import type { Metadata } from 'next'
import './globals.css'
import '@/styles/auth.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import OwnerAccessBanner from '@/components/OwnerAccessBanner'
import OwnerFloatingControls from '@/components/OwnerFloatingControls'
import ErrorBoundary from '@/components/ErrorBoundary'
import PWAInstallPrompt from '@/components/PWAInstallPrompt'
import OfflineIndicator from '@/components/OfflineIndicator'
import ClientLayout from '@/components/ClientLayout'
import SafeAnalytics from '@/components/SafeAnalytics'
import ReloadHelper from '@/components/ReloadHelper'
import ReloadPrevention from '@/components/ReloadPrevention'
import ClientOnly from '@/components/ClientOnly'
import { ErrorHandler } from '@/utils/errorHandling'

// Initialize global error handling only on client
const initializeErrorHandling = () => {
  if (typeof window !== 'undefined') {
    ErrorHandler.setupGlobalErrorHandling()
  }
}

// FIX: 'viewport' ki saari settings ko 'metadata' ke andar le aao
export const metadata: Metadata = {
  title: {
    template: '%s | Luciverse',
    default: 'Luciverse - Universe of Code & Creativity'
  },
  description: 'Dive into my universe of development, design, and digital experiments',
  keywords: ['developer', 'portfolio', 'web development', 'design', 'creative', 'programming', 'projects'],
  authors: [{ name: 'Lucifer' }],
  creator: 'Lucifer',
  publisher: 'Luciverse',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://luciverse.dev'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://luciverse.dev',
    title: 'Luciverse - Universe of Code & Creativity',
    description: 'Dive into my universe of development, design, and digital experiments',
    siteName: 'Luciverse',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Luciverse - Universe of Code & Creativity',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Luciverse - Universe of Code & Creativity',
    description: 'Dive into my universe of development, design, and digital experiments',
    creator: '@lucifer5094',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon-16.svg', sizes: '16x16', type: 'image/svg+xml' },
      { url: '/favicon-32.svg', sizes: '32x32', type: 'image/svg+xml' },
      { url: '/logo-enhanced.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon-32.svg',
    apple: [
      { url: '/logo-enhanced.svg', sizes: '180x180', type: 'image/svg+xml' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Luciverse',
  },
  applicationName: 'Luciverse',
  category: 'technology',
  
  // Viewport settings yahaan add karo
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=true',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

// 'export const viewport' waala poora block yahaan se HATA DO

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* PWA meta tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Luciverse" />
        <meta name="msapplication-TileColor" content="#8b5cf6" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
      </head>
      <body className='min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text'>
        <ClientOnly fallback={
          <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">L</span>
                  </div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Luciverse
                  </h1>
                </div>
                <div className="hidden md:flex items-center space-x-1">
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Home</div>
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">About</div>
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Projects</div>
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Achievements</div>
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Interview Prep</div>
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Vault</div>
                  <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">Contact</div>
                </div>
              </div>
            </div>
          </nav>
        }>
          <ClientLayout>
            <Navbar />
            <main>
              {children}
            </main>
            <Footer />
          </ClientLayout>
        </ClientOnly>
      </body>
    </html>
  )
}
