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
import { Analytics } from "@vercel/analytics/next"
import { ErrorHandler } from '@/utils/errorHandling'

// Initialize global error handling
if (typeof window !== 'undefined') {
  ErrorHandler.setupGlobalErrorHandling()
}

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
      { url: '/icons/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/safari-pinned-tab.svg', color: '#8b5cf6' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Luciverse',
  },
  applicationName: 'Luciverse',
  category: 'technology',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

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
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body className='min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text'>
        <ErrorBoundary showDetails={process.env.NODE_ENV === 'development'}>
          <OfflineIndicator />
          <OwnerAccessBanner />
          <Navbar />
          <main>
            {children}
            <Analytics/>
          </main>
          <Footer />
          <OwnerFloatingControls />
          <PWAInstallPrompt />
        </ErrorBoundary>
      </body>
    </html>
  )
}
