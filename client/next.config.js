/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: 'backend-service-url.com',
      },
      {
        protocol: 'https',
        hostname: '*.vercel.app',
      }
    ],
  },
  // Configure API URL for backend integration with Vercel-friendly environment variable
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
  },
  // Ensure output is configured properly for Vercel
  output: 'standalone',
  // Enable compression for better performance
  compress: true,
  // Increase performance by enabling SWC
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
  // Cache optimization
  serverExternalPackages: [],
  // Static generation optimization
  staticPageGenerationTimeout: 120,
  // Enable advanced page optimization
  poweredByHeader: false,
};

module.exports = nextConfig;