/** @type {import('next').NextConfig} */
const nextConfig = {
  // EMERGENCY: Ultra minimal config
  experimental: {
    // Disable all experimental features
  },
  // Disable all optimizations that might cause refresh
  swcMinify: false,
  // Basic setup only
}

module.exports = nextConfig
