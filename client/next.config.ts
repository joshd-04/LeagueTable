import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // keep Lightning CSS on, but allow Tailwind to handle PostCSS itself
    turbo: {
      resolveAlias: {
        postcss: 'postcss', // ensure Tailwind’s internal imports resolve properly
      },
    },
    useLightningcss: true,
  },
};

export default nextConfig;
