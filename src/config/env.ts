import { Config } from '@/types'

export const config: Config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || (
      typeof window !== 'undefined' 
        ? window.location.origin 
        : 'http://localhost:3000'
    ),
    timeout: parseInt(process.env.NEXT_PUBLIC_API_TIMEOUT || '10000', 10),
  },
  features: {
    ownerMode: process.env.NODE_ENV === 'development' || 
               process.env.NEXT_PUBLIC_OWNER_MODE === 'true',
    analytics: !!process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
    debugging: process.env.NODE_ENV === 'development',
  },
  limits: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    maxDocuments: parseInt(process.env.NEXT_PUBLIC_MAX_DOCUMENTS || '1000', 10),
    cacheTimeout: parseInt(process.env.NEXT_PUBLIC_CACHE_TIMEOUT || '300000', 10), // 5 minutes
  }
}

// Development utilities
export const isDevelopment = () => config.features.ownerMode
export const isProduction = () => process.env.NODE_ENV === 'production'
export const isClient = () => typeof window !== 'undefined'

// Environment validation
export const validateEnvironment = () => {
  const required = []
  
  if (isProduction()) {
    if (!process.env.NEXT_PUBLIC_API_URL) {
      required.push('NEXT_PUBLIC_API_URL')
    }
  }
  
  if (required.length > 0) {
    throw new Error(`Missing required environment variables: ${required.join(', ')}`)
  }
}

// Call validation on import in production
if (isProduction()) {
  validateEnvironment()
}
