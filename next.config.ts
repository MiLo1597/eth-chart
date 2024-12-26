/* eslint-disable @typescript-eslint/no-explicit-any */
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config: any) => {
    // Handle Highcharts requirements
    config.externals = [...(config.externals || []), { canvas: 'canvas' }]
    return config
  }
}

module.exports = nextConfig
