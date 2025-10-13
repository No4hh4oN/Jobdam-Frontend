import type { NextConfig } from "next";

interface ExtendedNextConfig extends NextConfig {
  experimental?: Record<string, any>;
}

const nextConfig: ExtendedNextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ["cdn.gyoseung.me"],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default nextConfig;
