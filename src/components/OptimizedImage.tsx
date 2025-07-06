'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'
import { LoadingSpinner } from './LoadingStates'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  fallback?: string
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  priority?: boolean
  sizes?: string
  quality?: number
  onLoad?: () => void
  onError?: () => void
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  fallback = '/next.svg',
  placeholder = 'empty',
  blurDataURL,
  priority = false,
  sizes,
  quality = 75,
  onLoad,
  onError,
  ...props
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)
  const [retryCount, setRetryCount] = useState(0)
  const maxRetries = 3

  const handleLoad = () => {
    setLoading(false)
    setError(false)
    onLoad?.()
  }

  const handleError = () => {
    if (retryCount < maxRetries) {
      // Retry loading the original image
      setRetryCount(prev => prev + 1)
      setTimeout(() => {
        setImageSrc(`${src}?retry=${retryCount + 1}`)
      }, 1000 * (retryCount + 1)) // Exponential backoff
    } else {
      setError(true)
      setLoading(false)
      setImageSrc(fallback)
      onError?.()
    }
  }

  // Reset when src changes
  useEffect(() => {
    setImageSrc(src)
    setLoading(true)
    setError(false)
    setRetryCount(0)
  }, [src])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Loading spinner with enhanced styling */}
      {loading && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 backdrop-blur-sm">
          <div className="flex flex-col items-center space-y-2">
            <LoadingSpinner size="sm" />
            {retryCount > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Retrying... ({retryCount}/{maxRetries})
              </span>
            )}
          </div>
        </div>
      )}

      {/* Optimized Image with enhanced features */}
      <Image
        src={imageSrc}
        alt={alt}
        width={width}
        height={height}
        fill={fill}
        className={`transition-all duration-500 ease-out ${
          loading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'
        } ${error ? 'opacity-75 grayscale' : ''}`}
        placeholder={placeholder}
        blurDataURL={blurDataURL || generateBlurDataURL()}
        priority={priority}
        sizes={sizes || getOptimalSizes()}
        quality={quality}
        onLoad={handleLoad}
        onError={handleError}
        style={{
          objectFit: 'cover',
          willChange: loading ? 'transform, opacity' : 'auto'
        }}
        {...props}
      />

      {/* Enhanced error state */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
          <div className="text-center p-4">
            <div className="text-2xl mb-2 animate-pulse">🖼️</div>
            <div className="text-xs font-medium">Image unavailable</div>
            <div className="text-xs opacity-75 mt-1">
              {retryCount >= maxRetries ? 'Failed to load after multiple attempts' : 'Loading...'}
            </div>
          </div>
        </div>
      )}

      {/* Loading progress indicator */}
      {loading && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 overflow-hidden">
          <div className="h-full bg-purple-500 animate-pulse"></div>
        </div>
      )}
    </div>
  )
}

// Helper functions
function generateBlurDataURL(): string {
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZjNmNGY2IiAvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiNlNWU3ZWIiIC8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KPHJlY3Qgd2lkdGg9IjIwIiBoZWlnaHQ9IjIwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgLz4KPHN2Zz4K"
}

function getOptimalSizes(): string {
  return "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
}

// Specialized image components for common use cases
export const ProjectImage = ({ 
  src, 
  alt, 
  className = "object-cover" 
}: { 
  src: string; 
  alt: string; 
  className?: string 
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    fill
    className={className}
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    quality={80}
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
  />
)

export const AvatarImage = ({ 
  src, 
  alt, 
  size = 48 
}: { 
  src: string; 
  alt: string; 
  size?: number 
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    width={size}
    height={size}
    className="rounded-full object-cover"
    quality={90}
    priority
  />
)

export const HeroImage = ({ 
  src, 
  alt, 
  className = "object-cover" 
}: { 
  src: string; 
  alt: string; 
  className?: string 
}) => (
  <OptimizedImage
    src={src}
    alt={alt}
    fill
    className={className}
    sizes="100vw"
    quality={85}
    priority
    placeholder="blur"
    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
  />
)
