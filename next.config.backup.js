/** @type {import('next').NextConfig} */
const nextConfig = {
  // EMERGENCY: Development optimizations to STOP reload loops
  ...(process.env.NODE_ENV === 'development' && {
    webpack: (config, { dev, isServer }) => {
      if (dev && !isServer) {
        // VERY conservative HMR settings to prevent loops
        config.watchOptions = {
          ...config.watchOptions,
          poll: 2000, // Increased from 1000
          aggregateTimeout: 1000, // Increased from 300
          ignored: [/node_modules/, /.git/, /.next/],
        }
        
        // Disable optimizations that can cause reload loops
        config.optimization = {
          ...config.optimization,
          removeAvailableModules: false,
          removeEmptyChunks: false,
          splitChunks: false,
          sideEffects: false, // Add this
        }
        
        // Reduce chunk reloading sensitivity
        config.output = {
          ...config.output,
          hotUpdateChunkFilename: 'static/webpack/[id].[fullhash].hot-update.js',
          hotUpdateMainFilename: 'static/webpack/[fullhash].hot-update.json',
        }
        
        // Add entry to prevent reload cascades
        if (config.entry && typeof config.entry === 'function') {
          const originalEntry = config.entry
          config.entry = async () => {
            const entries = await originalEntry()
            // Ensure proper HMR initialization
            return entries
          }
        }
      }
      return config
    },
    
    // Disable fast refresh temporarily to prevent loops
    reactStrictMode: false,
  }),
  
  // Image optimization
  images: {
    domains: ['localhost', 'luciverse.dev'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Performance optimizations
  swcMinify: true,
  
  // PWA headers
  async headers() {
    return [
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
          {
            key: 'Service-Worker-Allowed',
            value: '/',
          },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ]
  },
  
  // Webpack configuration for better stability
  webpack: (config, { dev, isServer }) => {
    // Bundle analyzer (development only)
    if (process.env.ANALYZE === 'true' && !isServer) {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          openAnalyzer: false,
        })
      )
    }

    // Improve chunk loading reliability
    if (dev && !isServer) {
      // Better error handling for chunk loading
      config.output.crossOriginLoading = 'anonymous'
      
      // Optimize chunk splitting for development
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
              enforce: true,
            },
          },
        },
      }

      // Add retry logic for chunk loading
      config.output.chunkLoadTimeout = 30000 // 30 seconds instead of default 120
    }

    return config
  },
}

module.exports = nextConfig
