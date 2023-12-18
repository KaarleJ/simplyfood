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
        hostname: 'simplyfood-prod.s3.eu-central-1.s3.amazonaws.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'simplyfood-dev.s3.eu-central-1.amazonaws.com',
        port: ''
      },
    ]
  }
}

module.exports = nextConfig
