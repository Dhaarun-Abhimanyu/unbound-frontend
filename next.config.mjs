/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  // Hide the bottom-right dev indicators
  devIndicators: {
    buildActivity: false,
    appIsStaticExport: false,
  },
};

export default nextConfig;
