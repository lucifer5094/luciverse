/** @type {import('next').NextConfig} */
const nextConfig = {
  // EMERGENCY: Ultra minimal config
  experimental: {
    // Disable all experimental features
  },
  // Disable all optimizations that might cause refresh
  swcMinify: false,
  // Disable minification completely
  webpack: (config, { dev, isServer }) => {
    if (!dev) {
      // Completely disable minification
      config.optimization.minimize = false
      config.optimization.minimizer = []
    }
    return config
  },
  // Basic setup only
}

module.exports = nextConfig
