'use client'

import { useEffect, useState } from 'react'

interface PWAInstallPrompt {
  prompt: () => void
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [installProgress, setInstallProgress] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    // Check if already installed
    const checkInstalled = () => {
      if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true)
        return
      }
      
      if ((navigator as any).standalone) {
        setIsInstalled(true)
        return
      }
      
      if (document.referrer.includes('android-app://')) {
        setIsInstalled(true)
        return
      }
    }

    checkInstalled()

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as any)
      
      // Show prompt after user engagement (scroll or interaction)
      let hasInteracted = false
      
      const showAfterEngagement = () => {
        if (!hasInteracted && !isInstalled) {
          hasInteracted = true
          setTimeout(() => {
            setShowPrompt(true)
          }, 2000)
        }
      }

      window.addEventListener('scroll', showAfterEngagement, { once: true })
      window.addEventListener('click', showAfterEngagement, { once: true })
      
      // Fallback timeout
      setTimeout(showAfterEngagement, 10000)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
      setInstallProgress(false)
      
      // Show success notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Luciverse Installed!', {
          body: 'App has been successfully installed for offline access.',
          icon: '/favicon.ico'
        })
      }
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [isInstalled, isClient])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    setInstallProgress(true)
    
    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('PWA installed')
        // Track installation analytics
        if ('gtag' in window) {
          (window as any).gtag('event', 'pwa_install', {
            'event_category': 'engagement',
            'event_label': 'user_accepted'
          })
        }
      } else {
        console.log('PWA installation dismissed')
        setInstallProgress(false)
      }
    } catch (error) {
      console.error('Installation failed:', error)
      setInstallProgress(false)
    }
    
    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    // Don't show again for this session
    if (typeof window !== 'undefined' && window.sessionStorage) {
      sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    }
  }

  // Prevent hydration mismatch by only rendering on client
  if (!isClient) {
    return null
  }

  // Don't show if already dismissed in this session
  if (typeof window !== 'undefined' && window.sessionStorage && sessionStorage.getItem('pwa-prompt-dismissed') === 'true') {
    return null
  }

  if (!showPrompt || !deferredPrompt || isInstalled) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">L</span>
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Install Luciverse
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Get quick access to the universe of code & creativity. Install our app for a better experience.
            </p>
            
            <div className="flex space-x-2 mt-3">
              <button
                onClick={handleInstall}
                disabled={installProgress}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-medium rounded hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {installProgress ? (
                  <span className="flex items-center space-x-1">
                    <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Installing...</span>
                  </span>
                ) : (
                  'Install'
                )}
              </button>
              <button
                onClick={handleDismiss}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Not now
              </button>
            </div>
          </div>
          
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}

// Hook for PWA utilities
export function usePWA() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true) // Default to true to prevent hydration mismatch
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    
    // Check installation status
    const checkInstalled = () => {
      return window.matchMedia && window.matchMedia('(display-mode: standalone)').matches ||
             (navigator as any).standalone ||
             document.referrer.includes('android-app://')
    }

    setIsInstalled(checkInstalled())
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [isClient])

  return { isInstalled, isOnline }
}
