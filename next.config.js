/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'simplyfoodprod.s3.amazonaws.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'simplyfooddev.s3.amazonaws.com',
        port: ''
      },
    ]
  }
}

module.exports = nextConfig
